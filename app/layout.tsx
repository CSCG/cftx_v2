import './globals.css';
    import type { Metadata } from 'next';
    import { Inter } from 'next/font/google';
    import { Navbar } from '@/components/layout/navbar';
    import { Toaster } from '@/components/ui/sonner';
    import { ThemeProvider } from '@/components/theme-provider';
    import Link from 'next/link';

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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-background">{children}</main>
                <footer className="border-t border-border">
                  <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                      <p className="text-sm text-muted-foreground">
                        a Bodhi Industries Product
                      </p>
                      <div className="flex space-x-6">
                        <Link
                          href="https://bodhi.industries/privacy-policy"
                          className="text-sm text-muted-foreground hover:text-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </Link>
                        <Link
                          href="https://bodhi.industries/terms-of-service"
                          className="text-sm text-muted-foreground hover:text-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </Link>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      );
    }
