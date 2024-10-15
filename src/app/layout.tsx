// RootLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "../components/footer";
import { Obi } from "../components/Obi";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Footerを非表示にしたいパスのリスト
  const hideFooterPaths = ["/evacuation", "/danger"];

  // Obiを非表示にしたいパスのリスト
  const hideObiPaths = ["/danger"];

  // 避難するページかどうか
  const isEvacuationPage = pathname === "/evacuation";

  const shouldHideFooter = hideFooterPaths.includes(pathname);
  const shouldHideObi =
    hideObiPaths.includes(pathname) && pathname !== "/danger/preview";

  // 帯の位置を決定（常に上部と下部を表示）
  const obiPositions: ("top" | "bottom")[] = ["top", "bottom"];

  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        {/* Obi を非表示にしたいパスでない場合に表示 */}
        {!shouldHideObi && (
          <Obi positions={obiPositions} isEvacuationPage={isEvacuationPage} />
        )}
        {/* Footer を非表示にしたいパスでない場合に表示 */}
        {!shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
