"use client";

import { getListArticle } from "@/service/article";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function News() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [showData, setShowData] = useState("5"); // ✅ Pastikan ini number
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [startDateValue, setStartDateValue] = useState({
    startDate: null,
    endDate: null,
  });

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
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
    }
  }

  return (
    <section className="bg-white py-10 px-4 md:px-10 w-full">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-5">
        {/* Left: News Section */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-row items-center pb-2 mb-3 gap-4">
            <h2 className="text-lg font-bold">BERITA TERBARU</h2>
            <div className="flex-grow border-t-3 border-gray-300 rounded-md"></div>
          </div>

          <div className="space-y-10">
            {articles.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 pb-6">
                <div className="w-full md:w-[250px]">
                  <Image
                    src={item.thumbnailUrl || "/default-thumb.png"}
                    alt={item.title}
                    width={250}
                    height={180}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link href={`/artikel/${item.id}`}>
                    <h3 className="font-semibold text-xl font-serif mb-2 cursor-pointer hover:text-green-700">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#999999] mb-2 flex items-center gap-2">
                    by <span className="text-black">Dian Purwanto</span>{" "}
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
                    })}{" "}
                    💬 0
                  </p>
                  <p className="text-black text-sm font-serif">
                    {item.description?.slice(0, 120)}...
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="mt-8 flex flex-wrap gap-2 justify-start">
            <button
              className="border px-3 py-1 text-xs hover:bg-gray-100 rounded-sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              ‹ PREV
            </button>
            <button
              className="border px-3 py-1 text-xs hover:bg-gray-100 rounded-sm"
              disabled={page >= totalPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              NEXT ›
            </button>
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

        {/* Right: Sidebar */}
        <aside className="w-full lg:w-[340px]">
          <div className="relative w-[1111px] max-w-full h-[400px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/xtweet.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
          <div className="relative w-[1111px] max-w-full h-[400px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/xtweet.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
          <div className="relative w-[1111px] max-w-full h-[300px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/kolom.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
