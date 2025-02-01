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
    import { api } from '@/lib/axios';
    import { zodResolver } from '@hookform/resolvers/zod';
    import Link from 'next/link';
    import { useForm } from 'react-hook-form';
    import { toast } from 'sonner';
    import * as z from 'zod';

    const schema = z.object({
      email: z.string().email('Invalid email address'),
    });

    export default function ForgotPasswordPage() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
          email: '',
        },
      });

      const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
          // await api.post('/auth/forgot-password', values);
          toast.success('Password reset instructions sent to your email');
        } catch (error) {
          toast.error('Failed to send reset instructions');
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-400">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email address and we'll send you instructions to reset your
                password.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <Button type="submit" className="w-full">
                  Send reset instructions
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link href="/auth/login" className="text-sm text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      );
    }
