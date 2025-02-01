// components/protected-route.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('ProtectedRoute check:', { user, session, loading, pathname });
    if (!loading && !session && !user && pathname !== '/auth/login') {
      router.replace('/auth/login');
    }
  }, [user, session, loading, pathname, router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}