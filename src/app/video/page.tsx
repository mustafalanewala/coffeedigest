import React from "react";

async function fetchApi() {
  const res = await fetch(
    "https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=11&language=English",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function VideoPage() {
  const api = await fetchApi();
  const videos = api?.data?.videos || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Videos</h1>

      {videos.length === 0 ? (
        <p className="text-gray-600">No videos available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v: any) => (
            <div
              key={v.videoDetail_id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                {/* embed if possible */}
                <iframe
                  src={v.fileName}
                  title={v.videoTitle}
                  allowFullScreen
                  className="w-full h-64"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-amber-800">{v.videoTitle}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(v.insert_Date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
