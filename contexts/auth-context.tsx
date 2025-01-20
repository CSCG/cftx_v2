'use client';

    import React, { createContext, useContext, useEffect, useState } from 'react';
    import { User } from '@/types/auth';
    import { api } from '@/lib/axios';
    import { useRouter } from 'next/navigation';
    import { toast } from 'sonner';

    interface AuthContextType {
      user: User | null;
      loading: boolean;
      login: (email: string, password: string) => Promise<void>;
      register: (name: string, email: string, password: string) => Promise<void>;
      logout: () => Promise<void>;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);
      const router = useRouter();

      useEffect(() => {
        checkAuth();
      }, []);

      const checkAuth = async () => {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      const login = async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          setUser(response.data.user);
          toast.success('Successfully logged in');
          router.push('/');
        } catch (error) {
          toast.error('Invalid credentials');
          throw error;
        }
      };

      const register = async (name: string, email: string, password: string) => {
        try {
          const response = await api.post('/auth/register', { name, email, password });
          setUser(response.data.user);
          toast.success('Registration successful');
          router.push('/');
        } catch (error) {
          toast.error('Registration failed');
          throw error;
        }
      };

      const logout = async () => {
        try {
          await api.post('/auth/logout');
          setUser(null);
          toast.success('Successfully logged out');
          router.push('/');
        } catch (error) {
          toast.error('Logout failed');
          throw error;
        }
      };

      return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
          {children}
        </AuthContext.Provider>
      );
    }

    export function useAuth() {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    }
