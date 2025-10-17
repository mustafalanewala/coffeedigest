"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { htmlToText, normalizeImage, filterByCategory } from "@/lib/news-utils";

export default function CategorySection({
  slug,
  title,
}: {
  slug: string;
  title?: string;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = (await fetcher()) as NewsItem[];
      const filtered = filterByCategory(all, slug).slice(0, 3);
      setItems(filtered);
    };
    load();
  }, [slug]);

  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-amber-900">{title || slug}</h2>
          <Link
            href={`/category/${slug}`}
            className="text-amber-700 hover:underline text-sm font-semibold"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((n) => (
            <Link
              key={n.news_Id}
              href={`/news/${n.slug}`}
              className="group bg-white rounded-2xl shadow border border-amber-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={normalizeImage(n.image)}
                  alt={n.news_Title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-black mb-2 line-clamp-2 group-hover:text-amber-700">
                  {n.news_Title}
                </h3>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {htmlToText(n.news_Content)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
