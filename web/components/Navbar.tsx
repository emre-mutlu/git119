'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, CalendarDays, FolderOpen, Files, ClipboardList } from 'lucide-react';

const navigationItems = [
  { name: 'Ana Sayfa', href: '/', icon: Home },
  { name: 'Müfredat', href: '/mufredat/syllabus', icon: Book },
  { name: 'Haftalık Akış', href: '/haftalar', icon: CalendarDays },
  { name: 'Raporlar', href: '/raporlar-ve-analizler/ders-icerigi-gozden-gecirme-raporu', icon: ClipboardList },
  { name: 'Kaynaklar', href: '/kaynaklar/kaynakca', icon: FolderOpen },
  { name: 'Şablonlar', href: '/sablonlar/odev-brief', icon: Files },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 text-slate-200 shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors">
              <span className="text-white font-bold text-sm">GİT</span>
            </div>
            <span className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors">
              119
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button (Placeholder for now) */}
          <div className="md:hidden">
            <button className="text-slate-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
