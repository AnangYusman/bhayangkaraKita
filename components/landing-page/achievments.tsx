"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getListArticle } from "@/service/article";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  description: string;
  categoryName: string;
  createdAt: string;
  createdByName: string;
  thumbnailUrl: string;
  categories: {
    title: string;
  }[];
};

export default function HeadersAchievment() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const req = {
      limit: "7", // 1 featured + 6 grid
      page: 1,
      search: "",
      sort: "desc",
      isPublish: true,
      sortBy: "created_at",
    };

    try {
      const res = await getListArticle(req);
      setArticles(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    }
  }

  if (!articles.length) return null;

  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <div className="px-4 py-6">
      {/* Featured Article */}
      <div className="relative w-full h-[400px] mb-4 rounded-lg overflow-hidden">
        <Link href={`/detail/${featured?.id}`}>
          <Image
            src={featured?.thumbnailUrl || "/default-thumbnail.jpg"}
            alt={featured?.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-end p-6">
            <span className="text-xs text-white bg-red-600 px-2 py-1 rounded w-fit mb-2">
              {featured?.categories[0]?.title || "Kategori"}
            </span>
            <h2 className="text-white text-2xl font-bold max-w-2xl leading-snug">
              {featured?.title}
            </h2>
          </div>
        </Link>
      </div>

      {/* Grid of Other Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {others.map((item) => (
          <div key={item.id} className="relative rounded overflow-hidden">
            <Link href={`/detail/${item?.id}`}>
              <div className="w-full h-[180px] relative">
                <Image
                  src={item?.thumbnailUrl || "/default-thumbnail.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0  bg-opacity-30"></div>
                <div className="absolute bottom-0 p-3 text-white">
                  <span className="text-xs bg-red-600 px-2 py-1 rounded">
                    {item.categories[0]?.title || "Kategori"}
                  </span>
                  <h3 className="text-sm font-semibold mt-1">{item.title}</h3>
                  <p className="text-xs mt-1 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                        />
                      </g>
                    </svg>{" "}
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-start items-center mt-4">
        <button className="px-3 py-1 text-xs border rounded bg-white text-gray-600 hover:bg-gray-200">
          &lt; PREV
        </button>
        <button className="px-3 py-1 text-xs border rounded bg-white text-gray-600 hover:bg-gray-200">
          NEXT &gt;
        </button>
      </div>
    </div>
  );
}
