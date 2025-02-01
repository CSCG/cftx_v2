'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/auth';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: any; // Supabase Session type
  loading: boolean;
  login: (email: string, password: string, userType: 'user' | 'organizer') => Promise<void>;
  register: (name: string, email: string, password: string, userType: 'user' | 'organizer') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        
        if (mounted && session?.user) {
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || '',
            role: 'user',
            createdAt: session.user.created_at
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || '',
            role: 'user',
            createdAt: session.user.created_at
          });
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'organizer') => {
    try {
      if (userType === 'organizer') {
        const response = await api.post('/auth/login', { email, password });
        setUser({
          ...response.data.user,
          role: 'organizer'
        });
        toast.success('Successfully logged in as organizer');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.session) {
          setSession(data.session);
          setUser({
            id: data.user!.id,
            email: data.user!.email!,
            name: data.user!.user_metadata.name || '',
            role: 'user',
            createdAt: data.user!.created_at
          });
          toast.success('Successfully logged in');
        }
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, userType: 'user' | 'organizer') => {
    try {
      if (userType === 'organizer') {
        const response = await api.post('/auth/register', { name, email, password });
        setUser({
          ...response.data.user,
          role: 'organizer'
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast.success('Please check your email to confirm your account');
          return;
        }
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.role === 'organizer') {
        await api.post('/auth/logout');
      } else {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
