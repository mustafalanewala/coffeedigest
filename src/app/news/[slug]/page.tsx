"use client";

import { use } from "react";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetcher } from "@/lib/fetcher";
import type { NewsItem } from "@/lib/types";
import {
  formatDate,
  slugifyCategory,
  htmlToText,
  normalizeImage,
} from "@/lib/news-utils";
import {
  Coffee,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Calendar,
  User,
  Tag,
  ArrowRight,
} from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Ads from "@/components/Ads";

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, error, isLoading } = useSWR<NewsItem[]>("/api/news", fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-amber-700 mx-auto mb-4 animate-pulse" />
          <LoadingSpinner />
          <p className="text-amber-700 mt-4">Brewing fresh content...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Coffee className="h-16 w-16 text-amber-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-amber-700 mb-6">
            We're having trouble brewing your news. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-800 transition-colors"
          >
            <Coffee className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const newsItem = data.find((item) => item.slug === slug);

  if (!newsItem) {
    notFound();
  }

  const relatedNews = data
    .filter(
      (item) =>
        item.categrory_Name === newsItem.categrory_Name &&
        item.news_Id !== newsItem.news_Id
    )
    .slice(0, 4);

  const popularNews = data
    .filter((item) => item.news_Id !== newsItem.news_Id)
    .sort(
      (a, b) =>
        new Date(b.insert_Date).getTime() - new Date(a.insert_Date).getTime()
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100 text-amber-900">
      {/* Breadcrumb */}
      <div className="bg-cream/50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-amber-700 hover:text-amber-900 transition-colors flex items-center"
            >
              <Coffee className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span className="text-amber-400">/</span>
            <Link
              href={`/category/${slugifyCategory(newsItem.categrory_Name)}`}
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              {newsItem.categrory_Name}
            </Link>
            <span className="text-amber-400">/</span>
            <span className="text-amber-900 font-medium truncate max-w-xs sm:max-w-md">
              {newsItem.news_Title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-amber-700">
                  <Link
                    href={`/category/${slugifyCategory(
                      newsItem.categrory_Name
                    )}`}
                    className="px-3 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-amber-700 to-amber-600 hover:shadow-md transition-shadow"
                  >
                    {newsItem.categrory_Name}
                  </Link>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>{formatDate(newsItem.insert_Date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    <span>{newsItem.news_Source || "CoffeeDigest"}</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-amber-700 mb-6 leading-tight">
                  {newsItem.news_Title}
                </h1>
              </div>

              {/* Featured Image */}
              <div className="relative h-64 sm:h-80 lg:h-[450px]">
                <Image
                  src={normalizeImage(newsItem.image)}
                  alt={newsItem.news_Title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="prose prose-lg max-w-none prose-p:text-amber-800 prose-p:leading-relaxed prose-headings:text-amber-900">
                  <p className="whitespace-pre-line">
                    {htmlToText(newsItem.news_Content)}
                  </p>
                  <p>
                    This story continues to develop as we gather more
                    information from reliable sources. Our editorial team is
                    committed to providing accurate and timely updates on this
                    important matter.
                  </p>
                  <p>
                    The implications of this development extend beyond the
                    immediate circumstances, potentially affecting various
                    stakeholders and the broader community. We will continue to
                    monitor the situation and provide updates as they become
                    available.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-amber-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-amber-800 font-semibold flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Tags:
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      {newsItem.categrory_Name}
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Breaking News
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Latest
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-6">
                  Related Stories
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.news_Id}
                      href={`/news/${item.slug}`}
                      className="block group"
                    >
                      <div className="flex space-x-4">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={normalizeImage(item.image)}
                            alt={item.news_Title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-amber-900 group-hover:text-amber-700 transition-colors duration-200 line-clamp-3 leading-tight">
                            {item.news_Title}
                          </p>
                          <p className="text-xs text-amber-600 mt-2">
                            {formatDate(item.insert_Date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
