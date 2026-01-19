'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Navigation } from './Navigation';
import { MobileNavigation } from './MobileNavigation';
import { SearchInput } from '@/components/search/SearchInput';
import { Menu } from 'lucide-react';

function SearchFallback() {
  return (
    <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">Cleanup Mogadishu</span>
              <span className="sm:hidden">CM</span>
            </span>
          </Link>

          {/* Search Bar - Desktop Only */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <Suspense fallback={<SearchFallback />}>
              <SearchInput placeholder="Search cleanup posts..." />
            </Suspense>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <Navigation />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 sm:px-6 pb-3">
          <Suspense fallback={<SearchFallback />}>
            <SearchInput placeholder="Search cleanup posts..." />
          </Suspense>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
