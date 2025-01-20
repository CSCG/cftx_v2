'use client';

    import { Button } from '@/components/ui/button';
    import { Menu, X, Ticket } from 'lucide-react';
    import Link from 'next/link';
    import { useState } from 'react';

    export function Navbar() {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

      const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

      return (
        <nav className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <Ticket className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-bold text-primary">CFTX</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link href="/events" className="text-foreground hover:text-primary">
                  Browse Events
                </Link>
                <Link href="/dashboard" className="text-foreground hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Button variant="ghost" onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/events"
                  className="block px-3 py-2 text-foreground hover:text-primary"
                  onClick={toggleMenu}
                >
                  Browse Events
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-foreground hover:text-primary"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2"
                  onClick={toggleMenu}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2"
                  onClick={toggleMenu}
                >
                  <Button className="w-full justify-start">Sign Up</Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      );
    }
