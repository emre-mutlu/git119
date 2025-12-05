'use client';

import { useState, useEffect } from "react";

import { Outfit, Josefin_Slab, Roboto_Condensed, Rokkitt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeCustomizer from "@/components/ThemeCustomizer";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const josefinSlab = Josefin_Slab({ subsets: ['latin'], variable: '--font-josefin' });
const robotoCondensed = Roboto_Condensed({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-roboto-condensed' });
const rokkitt = Rokkitt({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-rokkitt' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  useEffect(() => {
    // Fix viewport on iOS
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
  }, []);

  return (
    <html lang="tr" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <title>GİT 119 | Dijital Tasarıma Giriş</title>
        <meta name="description" content="TOBB ETÜ Görsel İletişim Tasarımı Bölümü - Dijital Tasarıma Giriş Dersi Web Sitesi" />
      </head>
      <body className={`${outfit.variable} ${josefinSlab.variable} ${robotoCondensed.variable} ${rokkitt.variable} font-sans bg-slate-950 text-slate-200 antialiased overflow-x-hidden`}>
        <div className="min-h-screen w-full overflow-x-hidden">
          <Navbar onThemeToggle={() => setIsThemeOpen(!isThemeOpen)} />
          {children}
          <ThemeCustomizer isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
        </div>
      </body>
    </html>
  );
}
