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

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = await fetchApi();
  const blogs = api?.data?.blogs || [];
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Blog not found</h1>
        <Link
          href="/blog"
          className="text-amber-600 hover:text-amber-800 font-medium"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="text-amber-600 hover:text-amber-800 font-medium mb-6 inline-block"
      >
        ← Back to Blogs
      </Link>

      <article className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            {blog.blog_Title}
          </h1>

          {blog.image && (
            <div className="mb-6">
              <Image
                src={normalizeImage(blog.image)}
                alt={blog.blog_Title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div
            className="prose prose-amber max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: blog.blog_Content }}
          />
        </div>
      </article>
    </div>
  );
}