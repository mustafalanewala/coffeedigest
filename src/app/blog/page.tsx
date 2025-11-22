import React from "react";
import { normalizeImage } from "@/lib/news-utils";
import Image from "next/image";
import Link from "next/link";

async function fetchApi() {
  const res = await fetch(
    "https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=11&language=English",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPage() {
  const api = await fetchApi();
  const blogs = api?.data?.blogs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs available.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((b: any) => (
            <article key={b.blog_id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={normalizeImage(b.image)}
                  alt={b.blog_Title}
                  width={112}
                  height={80}
                  className="w-28 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold text-amber-800">
                    {b.blog_Title}
                  </h2>
                  <div
                    className="text-sm text-gray-600 mt-2"
                    dangerouslySetInnerHTML={{ __html: b.blog_Summary }}
                  />
                  <Link
                    href={`/blog/${b.slug}`}
                    className="text-amber-600 hover:text-amber-800 font-medium mt-2 inline-block"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
