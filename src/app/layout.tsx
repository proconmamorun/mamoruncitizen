// src/app/layout.tsx
"use client";

import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '../components/footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageClass = pathname === '/evacuation' ? 'evacuationPage' : '';

  return (
    <html lang="en" className={pageClass}>
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
