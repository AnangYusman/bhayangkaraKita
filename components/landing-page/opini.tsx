"use client";

import { getListArticle } from "@/service/article";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  title: string;
};

type Article = {
  id: number;
  title: string;
  createdAt: string;
  thumbnailUrl?: string;
  categories: Category[];
};

type NewsColumnProps = {
  title: string;
  color: string;
  items: Article[];
};

function NewsColumn({ title, color, items }: NewsColumnProps) {
  return (
    <div className="bg-transparent p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className={`${color} text-white px-3 py-1 font-semibold rounded`}>
          {title}
        </div>
        <div className="flex-1 border-t border-gray-300 ml-2" />
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id}>
            <Link
              className={`flex flex-col ${
                index === 0 ? "md:flex-row" : ""
              } border-b border-gray-200 pb-3`}
              href={`/detail/${item?.id}`}
            >
              {index === 0 && item?.thumbnailUrl && (
                <div className="w-full md:w-40 h-24 relative mr-3">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-sm font-medium hover:text-red-600 cursor-pointer">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">🕒</span>{" "}
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
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

export default function Opini() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [showData, setShowData] = useState("5");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any>("");
  const groupedArticles = groupArticlesByCategory(articles);
  const [startDateValue, setStartDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  function groupArticlesByCategory(articles: Article[]) {
    const categoryMap: { [title: string]: Article[] } = {};

    articles.forEach((article) => {
      article.categories?.forEach((category) => {
        const title = category.title;
        if (!categoryMap[title]) {
          categoryMap[title] = [];
        }
        categoryMap[title].push(article);
      });
    });

    return categoryMap;
  }

  useEffect(() => {
    initState();
  }, [page, showData, startDateValue, selectedCategories]);

  async function initState() {
    const req = {
      limit: showData,
      page,
      search,
      categorySlug: Array.from(selectedCategories).join(","),
      sort: "desc",
      isPublish: true,
      sortBy: "created_at",
    };

    try {
      const res = await getListArticle(req);
      setArticles(res?.data?.data || []);
      setTotalPage(res?.data?.meta?.totalPage || 1);
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(groupedArticles).map(([categoryTitle, items]) => (
            <NewsColumn
              key={categoryTitle}
              title={categoryTitle}
              color="bg-red-600"
              items={items}
            />
          ))}
        </div>
      </div>

      <div className="relative my-5 max-w-full h-[125px] overflow-hidden flex items-center mx-auto border">
        <Image
          src="/image-kolom.png"
          alt="Berita Utama"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
