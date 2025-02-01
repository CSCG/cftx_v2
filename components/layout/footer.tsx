'use client';

import Link from 'next/link';

export default function Footer() {
  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.FreshworksWidget) {
      window.FreshworksWidget('open');
    }
  };

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} by <a href="https://bodhi.industries">Bodhi Industries</a>. All rights reserved. (Build: {process.env.NEXT_PUBLIC_GIT_COMMIT})
          </p>
          <div className="flex items-center space-x-6">
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
            <Link
              href="https://bodhi.freshdesk.com"
              className="text-sm text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
