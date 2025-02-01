import { User } from '@/types/auth';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Import shared instance
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, userType: 'user' | 'organizer', captchaToken: string) => {
    try {
      if (userType === 'organizer') {
        // Flask login
        const response = await api.post('/auth/login', { email, password, captchaToken });
        setUser({
          ...response.data.user,
          role: 'organizer'
        });
        toast.success('Successfully logged in as organizer');
      } else {
        // Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            captchaToken // Add captcha token to auth options
          }
        });
        
        if (error) {
          switch (error.message) {
            case 'Email not confirmed':
              toast.error('Please check your email to confirm your account before logging in');
              break;
            case 'Invalid login credentials':
              toast.error('Invalid email or password');
              break;
            case 'Rate limit exceeded':
              toast.error('Too many login attempts. Please try again later');
              break;
            default:
              toast.error(`Login failed: ${error.message}`);
          }
          throw error;
        }
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata.name || '',
            role: 'user',
            createdAt: data.user.created_at
          });
          if (data.session?.access_token) {
            // Persist the token as a cookie for middleware usage.
            Cookies.set('supabase-auth-token', JSON.stringify({ access_token: data.session.access_token }), { expires: 1 });
          }
          toast.success('Successfully logged in');
        }
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, userType: 'user' | 'organizer', captchaToken: string) => {
    try {
      if (userType === 'organizer') {
        // Flask registration
        const response = await api.post('/auth/register', { name, email, password, captchaToken });
        setUser({
          ...response.data.user,
          role: 'organizer'
        });
      } else {
        // Supabase registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            captchaToken // Add captcha token to auth options
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata.name,
            role: 'user',
            createdAt: data.user.created_at
          });
        }
      }
      toast.success('Registration successful');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Registration failed');
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
      // Remove the cookie used by middleware
      Cookies.remove('supabase-auth-token');
      setUser(null);
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  return { user, login, register, logout };
}
