'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [userType, setUserType] = useState<'user' | 'organizer'>('user');
  const isLogin = type === 'login';
  const schema = isLogin ? loginSchema : registerSchema;
  const { login, register } = useAuth();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(isLogin ? {} : { name: '', confirmPassword: '' }),
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (isLogin) {
        await login(values.email, values.password, userType);
      } else {
        if ('name' in values) { // Ensure 'name' exists
          await register(values.name, values.email, values.password, userType);
        } else {
          console.error("Registration error: 'name' is missing");
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-400">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        
        {/* Add user type toggle */}
        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant={userType === 'user' ? 'default' : 'outline'}
            onClick={() => setUserType('user')}
          >
            User
          </Button>
          <Button
            variant={userType === 'organizer' ? 'default' : 'outline'}
            onClick={() => setUserType('organizer')}
          >
            Organizer
          </Button>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isLogin && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full">
            {isLogin ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </Form>

      {isLogin && (
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      )}
    </div>
  );
}
