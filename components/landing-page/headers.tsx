"use client";
import { getListArticle } from "@/service/article";
import { Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  files: {
    file_url: string;
    file_alt: string;
  }[];
};

export default function Beranda() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showData, setShowData] = useState("5");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any>("");
  const [startDateValue, setStartDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    initState();
  }, [page, showData, startDateValue, selectedCategories]);

  async function initState() {
    // loading();
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
    } finally {
      // close();
    }
  }
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-1 px-4 py-4 bg-white ">
        <button
          onClick={scrollLeft}
          className="flex items-center justify-center w-8 h-24 border rounded hover:bg-gray-100"
        >
          <span className="text-xl font-bold text-gray-700">&lt;</span>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-hidden max-w-7xl mx-auto"
        >
          {articles.map((article) => (
            <div key={article.id}>
              <Link
                className="flex-shrink-0 flex items-start gap-3 w-[350px]"
                href={`/detail/${article?.id}`}
              >
                <Image
                  src={article.thumbnailUrl || "/default-thumbnail.jpg"}
                  alt={article.title}
                  width={56}
                  height={56}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-xs font-medium w-[250px] line-clamp-2">
                    {article.title}
                  </p>
                  <p className="flex items-center text-[12px] text-gray-500">
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
                    {new Date(article.createdAt).toLocaleDateString("id-ID", {
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

        <button
          onClick={scrollRight}
          className="flex items-center justify-center w-8 h-24 border rounded hover:bg-gray-100"
        >
          <span className="text-xl font-bold text-gray-700">&gt;</span>
        </button>
      </div>
    </div>
  );
}
