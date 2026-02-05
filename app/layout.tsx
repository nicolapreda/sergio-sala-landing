import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a clean, modern look similar to references
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSA Agency - Riempi il tuo locale",
  description: "Riempi il tuo locale senza fare balletti su Tiktok.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
