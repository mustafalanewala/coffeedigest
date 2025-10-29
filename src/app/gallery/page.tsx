import React from "react";

async function fetchApi() {
  const res = await fetch(
    "https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=11&language=English",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function GalleryPage() {
  const api = await fetchApi();
  const galleries = api?.data?.galleries || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Galleries</h1>
      {galleries.length === 0 ? (
        <p className="text-gray-600">No galleries available.</p>
      ) : (
        <div className="space-y-8">
          {galleries.map((g: any) => (
            <div
              key={g.galleryMaster_id}
              className="bg-white shadow rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold text-amber-800 mb-3">
                {g.galleryMaster_Title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.isArray(g.galleryDetailList) &&
                  g.galleryDetailList.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.fileName}
                      alt={g.galleryMaster_Title}
                      className="w-full h-40 object-cover rounded"
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
