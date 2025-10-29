"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";
import { getCategories, slugifyCategory } from "@/lib/news-utils";
import { useState } from "react";
import { Menu, X, Coffee } from "lucide-react";

export default function Navbar() {
  const { data, isLoading } = useSWR("/api/news", fetcher);
  const categories = getCategories(data || []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Limit main navigation to 5 main categories
  const mainCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg sticky top-0 z-50 border-b-2 border-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and main navigation */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Coffee className="h-8 w-8 text-amber-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-cream">
                  CoffeeDigest
                </span>
                <span className="text-xs text-amber-200 tracking-wide">
                  Freshly Brewed News
                </span>
              </div>
            </Link>
          </div>

          {/* Main navigation - desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-cream hover:text-amber-200 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="text-cream hover:text-amber-200 font-medium transition-colors duration-200"
            >
              Gallery
            </Link>
            <Link
              href="/video"
              className="text-cream hover:text-amber-200 font-medium transition-colors duration-200"
            >
              Videos
            </Link>
            <Link
              href="/blog"
              className="text-cream hover:text-amber-200 font-medium transition-colors duration-200"
            >
              Blog
            </Link>
            {mainCategories.map((category) => (
              <Link
                key={category}
                href={`/category/${slugifyCategory(category)}`}
                className="text-cream hover:text-amber-200 font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
            {moreCategories.length > 0 && (
              <div className="relative group">
                <button className="text-cream hover:text-amber-200 font-medium transition-colors duration-200 flex items-center">
                  More
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-amber-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {moreCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/category/${slugifyCategory(category)}`}
                        className="block px-4 py-2 text-cream hover:bg-amber-700 hover:text-amber-200 transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-cream hover:text-amber-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-700">
            <div className="py-4 space-y-3">
              <Link
                href="/"
                className="block text-cream hover:text-amber-200 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/gallery"
                className="block text-cream hover:text-amber-200 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/video"
                className="block text-cream hover:text-amber-200 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link
                href="/blog"
                className="block text-cream hover:text-amber-200 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${slugifyCategory(category)}`}
                  className="block text-cream hover:text-amber-200 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
