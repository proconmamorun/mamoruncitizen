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

  // Footerを非表示にしたいパスのリスト
  const hideFooterPaths = ['/evacuation', '/danger'];

  // Obiを非表示にしたいパスのリスト
  const hideObiPaths = ['/danger'];

  // 避難するページでは帯を画面の一番下に固定する
  const isEvacuationPage = pathname === '/evacuation';

  const shouldHideFooter = hideFooterPaths.includes(pathname);
  const shouldHideObi = hideObiPaths.includes(pathname) && pathname !== '/danger/preview';

  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        {/* Obi を非表示にしたいパスでない場合に表示し、避難するページでは帯を下に固定 */}
        {!shouldHideObi && <Obi className={isEvacuationPage ? 'fixed-bottom' : ''} />}
        {/* Footer を非表示にしたいパスでない場合に表示 */}
        {!shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
