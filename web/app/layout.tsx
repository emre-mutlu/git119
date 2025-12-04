import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GİT 119 | Dijital Tasarıma Giriş",
  description: "TOBB ETÜ Görsel İletişim Tasarımı Bölümü - Dijital Tasarıma Giriş Dersi Web Sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
