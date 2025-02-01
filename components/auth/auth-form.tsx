'use client';

// Add this import
import { toast } from '@/hooks/use-toast';

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
import { Turnstile } from '@marsidev/react-turnstile'

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

const PulsarIcon = () => (
  <svg 
    viewBox="0 0 200 200" 
    className="w-16 h-16 mx-auto mb-3" // Add styling for size and positioning
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="90" className="fill-muted-foreground/10"/>
    <path d="M40 100 Q100 100 160 100" className="stroke-primary" strokeWidth="3" fill="none" opacity="0.3">
      <animate 
        attributeName="d" 
        dur="2s"
        repeatCount="indefinite"
        values="
          M40 100 Q100 100 160 100;
          M40 100 Q100 80 160 100;
          M40 100 Q100 100 160 100;
          M40 100 Q100 120 160 100;
          M40 100 Q100 100 160 100"
      />
    </path>
    <path d="M40 100 Q100 100 160 100" className="stroke-primary" strokeWidth="3" fill="none" opacity="0.5">
      <animate 
        attributeName="d" 
        dur="2s"
        repeatCount="indefinite"
        begin="0.5s"
        values="
          M40 100 Q100 100 160 100;
          M40 100 Q100 70 160 100;
          M40 100 Q100 100 160 100;
          M40 100 Q100 130 160 100;
          M40 100 Q100 100 160 100"
      />
    </path>
    <circle cx="100" cy="100" r="15" className="fill-primary">
      <animate
        attributeName="r"
        values="15;17;15"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="100" cy="100" r="85" className="stroke-primary" strokeWidth="2" fill="none"/>
  </svg>
);

export function AuthForm({ type }: AuthFormProps) {
  const [userType, setUserType] = useState<'user' | 'organizer'>('user');
  const [captchaToken, setCaptchaToken] = useState<string>();
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
    if (!captchaToken) {
      toast({
        title: "Error",
        description: "Please complete the captcha",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLogin) {
        await login(values.email, values.password, userType, captchaToken);
      } else {
        if ('name' in values) { // Ensure 'name' exists
          await register(values.name, values.email, values.password, userType, captchaToken);
        } else {
          toast({
            title: "Error",
            description: "Registration error: 'name' is missing",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-400">
          {isLogin ? 'Welcome back, astronaut' : 'Create your account'}
        </h2>

        {/* Info Card */}
        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/50">
          <PulsarIcon />
          <p className="text-sm text-muted-foreground">
            We use a centralized login service for all Bodhi Industries products, named{' '}
            <span className="font-semibold">Bodhi Pulsar</span>. <br />
            <br />
            Please login with your Pulsar account, or register to create one!
          </p>
        </div>
        
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
            onClick={() => window.location.href = 'https://cedarfallsdata.com/login'}
          >
            Organizer
          </Button>
        </div>
        

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

          {/* Add Turnstile before submit button */}
          <div className="flex justify-center">
            <Turnstile
              siteKey="0x4AAAAAAA7G4w6fOCxGxxrN"
              onSuccess={(token) => setCaptchaToken(token)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!captchaToken}>
            {isLogin ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
      </Form>



<p className="mt-2 text-sm text-gray-600 text-center">
          {isLogin ? (
            <>
              Don't have an account? <br />{' '}
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
