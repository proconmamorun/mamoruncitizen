"use client";

import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '../components/footer'; // フッターのインポート確認
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
  const hideObiPaths = ['/evacuation', '/danger'];

  // 現在のパスが非表示リストに含まれているかを確認する関数
  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));
  const shouldHideObi = hideObiPaths.some(path => pathname.startsWith(path));

  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        {/* Obi を非表示にしたいパスでない場合に表示 */}
        {!shouldHideObi && <Obi />}
        {/* Footer を非表示にしたいパスでない場合に表示 */}
        {!shouldHideFooter && <Footer />} 
      </body>
    </html>
  );
}
