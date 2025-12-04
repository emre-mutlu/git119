import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

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
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans bg-slate-950 text-slate-200 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
