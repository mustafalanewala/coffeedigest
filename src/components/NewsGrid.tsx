"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { formatDate, htmlToText, normalizeImage } from "@/lib/news-utils";

export default function NewsGrid({ limit = 12 }: { limit?: number }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const all = (await fetcher()) as NewsItem[];
        const latest = all
          .slice()
          .sort(
            (a, b) =>
              new Date(b.insert_Date).getTime() -
              new Date(a.insert_Date).getTime()
          )
          .slice(0, limit);
        setItems(latest);
      } catch (e) {
        console.error("Failed to load news grid", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((n) => (
        <article
          key={n.news_Id}
          className="group relative bg-gradient-to-br from-cream to-amber-50 rounded-2xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
        >
          <Link href={`/news/${n.slug}`} className="block">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={normalizeImage(n.image)}
                alt={n.news_Title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-700 to-amber-600 backdrop-blur-sm">
                {n.categrory_Name}
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
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
            <div className="p-5">
              <h3 className="font-bold text-xl text-amber-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-700 group-hover:to-amber-600 transition-all duration-300 leading-tight">
                {n.news_Title}
              </h3>
              <p className="text-sm text-amber-700 line-clamp-3 mb-4 leading-relaxed">
                {htmlToText(n.news_Content)}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <span className="text-xs font-medium text-amber-600">
                  {formatDate(n.insert_Date)}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  {n.news_Source || "Source"}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
