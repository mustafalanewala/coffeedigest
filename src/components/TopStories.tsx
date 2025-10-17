"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { formatDate, htmlToText, normalizeImage } from "@/lib/news-utils";

export default function TopStories() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await fetcher();
        const top = (all as NewsItem[])
          .sort(
            (a, b) =>
              new Date(b.insert_Date).getTime() -
              new Date(a.insert_Date).getTime()
          )
          .slice(0, 4);
        setItems(top);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="space-y-12">
      {/* Hero Featured Story */}
      <div className="relative">
        <Link
          href={`/news/${items[0].slug}`}
          className="group relative block overflow-hidden rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
        >
          <div className="relative h-[500px] lg:h-[600px]">
            <Image
              src={normalizeImage(items[0].image)}
              alt={items[0].news_Title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="max-w-4xl">
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-amber-600 text-white shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    {items[0].categrory_Name}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight line-clamp-3">
                  {items[0].news_Title}
                </h1>
                <p className="text-xl text-gray-200 line-clamp-2 leading-relaxed max-w-2xl">
                  {htmlToText(items[0].news_Content)}
                </p>
                <div className="mt-6 flex items-center text-white/80">
                  <span className="text-sm font-medium">
                    {formatDate(items[0].insert_Date)}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">
                    {items[0].news_Source || "CoffeeDigest"}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Read More */}
            <div className="absolute top-8 right-8 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.slice(1).map((item, index) => (
          <Link
            key={item.news_Id}
            href={`/news/${item.slug}`}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 border border-gray-100"
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={normalizeImage(item.image)}
                alt={item.news_Title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white shadow-md">
                  {item.categrory_Name}
                </span>
              </div>

              {/* Read Indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 leading-tight">
                {item.news_Title}
              </h3>
              <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                {htmlToText(item.news_Content)}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">
                  {formatDate(item.insert_Date)}
                </span>
                <span className="text-sm font-semibold text-amber-600">
                  {item.news_Source || "CoffeeDigest"}
                </span>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        ))}
      </div>
    </div>
  );
}
