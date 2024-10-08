"use client";

import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '../components/footer';
import { Obi } from '../components/Obi';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageClass = pathname === '/evacuation' ? 'evacuationPage' : '';

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Obi />
        <Footer />
      </body>
    </html>
  );
}
