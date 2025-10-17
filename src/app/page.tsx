import TopStories from "@/components/TopStories";
import Trending from "@/components/Trending";
import Ads from "@/components/Ads";
import NewsGrid from "@/components/NewsGrid";
import { Coffee, Clock, TrendingUp } from "lucide-react";
import CategorySection from "@/components/CategorySection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Featured Stories Section */}
      <section className="py-20 bg-gradient-to-b from-cream to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TopStories />
        </div>
      </section>

      {/* Main Content Grid with Coffee Theme */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main News Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-10">
                <Clock className="h-7 w-7 text-amber-700" />
                <h2 className="text-4xl font-bold text-amber-900">
                  Latest Brew
                </h2>
              </div>
              <NewsGrid limit={12} />
            </div>

            {/* Trending Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div>
                  <div className="overflow-visible">
                    <Trending />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Ads className="w-full max-w-5xl" />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection slug="business" title="Business News" />
    </div>
  );
}
