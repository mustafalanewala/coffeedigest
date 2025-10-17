"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";
import { formatDate } from "@/lib/news-utils";

export default function Trending() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const all = (await fetcher()) as NewsItem[];
      const sorted = all
        .slice()
        .sort(
          (a, b) =>
            new Date(b.insert_Date).getTime() -
            new Date(a.insert_Date).getTime()
        )
        .slice(0, 9);
      setItems(sorted);
    };
    load();
  }, []);

  if (items.length === 0) return null;

  return (
    <aside className="bg-amber-50 rounded-xl shadow p-6 border border-amber-200 text-black">
      <ol className="space-y-4">
        {items.map((n, idx) => (
          <li key={n.news_Id} className="flex items-start gap-3">
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-200 text-black text-xs font-bold flex-shrink-0">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <Link
                href={`/news/${n.slug}`}
                className="block text-sm font-semibold text-black hover:text-amber-700 line-clamp-2"
              >
                {n.news_Title}
              </Link>
              <div className="text-xs text-gray-700">
                {formatDate(n.insert_Date)} •{" "}
                {n.news_Source || n.categrory_Name}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
