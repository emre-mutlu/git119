'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, CalendarDays, FolderOpen, Home } from 'lucide-react';

const navigationItems = [
  { name: 'Ana Sayfa', href: '/', icon: Home },
  { name: 'Müfredat', href: '/Mufredat/Syllabus', icon: Book },
  { name: 'Haftalık Akış', href: '/haftalar', icon: CalendarDays },
  { name: 'Kaynaklar', href: '/Kaynaklar/Kaynakca', icon: FolderOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
    <nav className="bg-dark text-slate-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center group select-none relative">
            <span 
              data-text="git.119"
              className="font-mono text-4xl tracking-tight font-bold text-white glitch-pixel"
            >
              git.119
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
                      ? 'bg-primary/20 text-accent'
                      : 'text-slate-400 hover:text-white hover:bg-primary/10'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-accent' : 'text-slate-500 group-hover:text-slate-300'} />
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
    <div className="h-[1px] bg-yellow sticky top-20 z-50" />
    </>
  );
}
