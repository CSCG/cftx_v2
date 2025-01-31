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
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().min(10, 'Please provide more details about your events'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

export default function OrganizerInterestPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
      description: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await api.post('/organizers/interest', values);
      toast.success('Thank you for your interest! We will contact you soon.');
      form.reset();
    } catch (error) {
      toast.error('Failed to submit your information');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">
            Partner with EventHub
          </h1>
          <p className="text-lg text-gray-600">
            Join our platform and reach thousands of event-goers. We provide the tools
            you need to manage and promote your events effectively.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us about your events</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="What types of events do you organize? How often do you host events? What's your typical audience size?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Application
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Powerful Tools</h3>
            <p className="text-gray-600">
              Comprehensive event management dashboard with real-time analytics
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Wide Reach</h3>
            <p className="text-gray-600">
              Access to our growing community of event enthusiasts
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Reliable payment processing with instant transfers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
