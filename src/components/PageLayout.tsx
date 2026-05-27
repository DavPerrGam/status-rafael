import type { ReactNode } from 'react';

import { useHashScroll } from '../hooks/useHashScroll';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
  showFooter?: boolean;
  mainClassName?: string;
}

export function PageLayout({
  children,
  isAdmin = false,
  showFooter = true,
  mainClassName = '',
}: PageLayoutProps) {
  useHashScroll();

  return (
    <div className="flex min-h-screen flex-col">
      <Header isAdmin={isAdmin} />
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8 ${mainClassName}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
