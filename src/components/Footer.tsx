"use client";

import { Coffee } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-cream py-8 border-t-2 border-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Coffee className="h-6 w-6 text-amber-200" />
            <span className="text-lg font-semibold">CoffeeDigest</span>
          </div>
          <p className="text-amber-200 text-sm text-center md:text-right">
            © {currentYear} CoffeeDigest. Freshly brewed news daily.
          </p>
        </div>
      </div>
    </footer>
  );
}
