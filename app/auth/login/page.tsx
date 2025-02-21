import { AuthForm } from '@/components/auth/auth-form';

    export default function LoginPage() {
      return (
        <div className="min-h-screen flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8">
          <AuthForm type="login" />
        </div>
      );
    }
