import type { Metadata } from "next";
import { Outfit, Josefin_Slab, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const josefinSlab = Josefin_Slab({ subsets: ['latin'], variable: '--font-josefin' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-plex-mono' });

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
      <body className={`${outfit.variable} ${josefinSlab.variable} ${ibmPlexMono.variable} font-sans bg-slate-950 text-slate-200 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
