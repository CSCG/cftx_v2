import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from '@/contexts/auth-context';
import FreshdeskWidget from "@/components/FreshdeskWidget";
import Footer from '@/components/layout/footer'; // Import the Footer component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CFTX - Your Premier Event Ticketing Platform',
  description: 'Book and manage tickets for the best events in your area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow bg-background">{children}</main>
              <Footer /> {/* Use the new Footer client component */}
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <SpeedInsights />
        
      </body>
      
    </html>
  );
}
