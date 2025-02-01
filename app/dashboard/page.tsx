// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { user, session, loading } = useAuth();
  console.log('Dashboard mounted:', { user, session, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  // We can assume we have auth here because redirect happens in provider
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div>Protected Dashboard Content</div>
    </div>
  );
}