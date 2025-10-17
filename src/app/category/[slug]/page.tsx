"use client";

import { use, useState, useMemo } from "react";
import useSWR from "swr";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetcher } from "@/lib/fetcher";
import type { NewsItem } from "@/lib/types";
import {
  formatDate,
  getCategoryFromSlug,
  filterByCategory,
  htmlToText,
  normalizeImage,
} from "@/lib/news-utils";
import Image from "next/image";
import Link from "next/link";
import Ads from "@/components/Ads";
import {
  Coffee,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useSWR<NewsItem[]>("/api/news", fetcher);

  const { categoryNews, categoryName, totalPages, currentItems } =
    useMemo(() => {
      if (!data)
        return {
          categoryNews: [],
          categoryName: "",
          totalPages: 0,
          currentItems: [],
        };

      const categoryName = getCategoryFromSlug(data, slug);
      const categoryNews = filterByCategory(data, slug);
      const totalPages = Math.ceil(categoryNews.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const currentItems = categoryNews.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      return { categoryNews, categoryName, totalPages, currentItems };
    }, [data, slug, currentPage]);

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

  if (categoryNews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <Coffee className="h-16 w-16 text-amber-200 mx-auto mb-6" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                No {slug} News Available
              </h1>
              <p className="text-xl text-amber-200">
                We're brewing up some fresh content for this category. Check
                back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center mt-8 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Coffee className="h-4 w-4 mr-2" />
                Explore Other Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm py-4">
            <Link
              href="/"
              className="text-amber-200 hover:text-white transition-colors flex items-center"
            >
              <Coffee className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span className="text-amber-300">/</span>
            <span className="text-white font-medium">{categoryName}</span>
          </nav>

          {/* Category Header */}
          <div className="py-12">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                {categoryName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentItems.map((article) => (
            <article
              key={article.news_Id}
              className="group bg-gradient-to-br from-cream to-amber-50 rounded-2xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link href={`/news/${article.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={normalizeImage(article.image)}
                    alt={article.news_Title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-700 to-amber-600 backdrop-blur-sm">
                    {article.categrory_Name}
                  </div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-xl text-amber-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-700 group-hover:to-amber-600 transition-all duration-300 leading-tight">
                    {article.news_Title}
                  </h3>
                  <p className="text-sm text-amber-700 line-clamp-3 mb-4 leading-relaxed">
                    {htmlToText(article.news_Content)}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                    <span className="text-xs font-medium text-amber-600">
                      {formatDate(article.insert_Date)}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">
                      {article.news_Source || "CoffeeDigest"}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-amber-700 text-white"
                        : "bg-cream text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-amber-600">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-amber-700 text-white"
                        : "bg-cream text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-6 text-amber-700">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, categoryNews.length)} of{" "}
            {categoryNews.length} articles
          </p>
        </div>
      </div>
    </div>
  );
}
