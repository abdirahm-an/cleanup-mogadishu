import Link from 'next/link';
import { Suspense } from 'react';
import { Navigation } from './Navigation';
import { SearchInput } from '@/components/search/SearchInput';

function SearchFallback() {
  return (
    <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">Cleanup Mogadishu</span>
          <span className="text-lg font-bold text-gray-900 sm:hidden">CM</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <Suspense fallback={<SearchFallback />}>
            <SearchInput placeholder="Search cleanup posts..." />
          </Suspense>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <Navigation />
        </div>

        {/* Mobile menu button - placeholder for future implementation */}
        <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <Suspense fallback={<SearchFallback />}>
          <SearchInput placeholder="Search cleanup posts..." />
        </Suspense>
      </div>
    </header>
  );
}