import type { Metadata } from "next";
import { Outfit, Josefin_Slab, Roboto_Condensed, Inter_Tight } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeCustomizer from "@/components/ThemeCustomizer";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const josefinSlab = Josefin_Slab({ subsets: ['latin'], variable: '--font-josefin' });
const robotoCondensed = Roboto_Condensed({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-roboto-condensed' });
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['700'], style: ['italic'], variable: '--font-inter-tight' });

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
      <body className={`${outfit.variable} ${josefinSlab.variable} ${robotoCondensed.variable} ${interTight.variable} font-sans bg-slate-950 text-slate-200 antialiased`}>
        <Navbar />
        {children}
        <ThemeCustomizer />
      </body>
    </html>
  );
}
