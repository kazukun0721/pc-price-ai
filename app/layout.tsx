import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PC最安値AI",
  description: "PCパーツの価格比較と最安値を表示するサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}