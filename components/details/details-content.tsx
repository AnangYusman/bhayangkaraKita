"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getArticleById, getListArticle } from "@/service/article";
import { close, loading } from "@/config/swal";
import { useParams } from "next/navigation";
import { CommentIcon } from "../icons/sidebar-icon";

type TabKey = "trending" | "comments" | "latest";

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

interface CategoryType {
  id: number;
  label: string;
  value: number;
}

export default function DetailContent() {
  const params = useParams();
  const id = params?.id;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleDetail, setArticleDetail] = useState<any>(null);
  const [showData, setShowData] = useState("5");
  const [search, setSearch] = useState("");
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>("");
  const [startDateValue, setStartDateValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [detailfiles, setDetailFiles] = useState<any>([]);
  const [mainImage, setMainImage] = useState(0);
  const [thumbnail, setThumbnail] = useState("-");
  const [diseId, setDiseId] = useState(0);
  const [thumbnailImg, setThumbnailImg] = useState<File[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<number | null>(
    null
  );

  const [tabArticles, setTabArticles] = useState<Article[]>([]);

  const [activeTab, setActiveTab] = useState<TabKey>("trending");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "trending", label: "Trending" },
    { id: "comments", label: "Comments" },
    { id: "latest", label: "Latest" },
  ];

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
  const content: Record<
    TabKey,
    { image: string; title: string; date: string }[]
  > = {
    trending: [
      {
        image: "/thumb1.png",
        title:
          "#StopBullyDiSekolah: Peran Positif Media Sosial dalam Mengatasi Bullying",
        date: "22 FEBRUARI 2024",
      },
      {
        image: "/thumb2.png",
        title:
          "Polri Gelar Lomba Orasi Unjuk Rasa dalam Rangka Hari HAM Sedunia Berhadiah Total Lebih dari Rp 150 juta!",
        date: "29 NOVEMBER 2021",
      },
      {
        image: "/thumb3.png",
        title: "Tingkatkan Ibadah Sambut #RamadhanPenuhDamai",
        date: "7 MARET 2024",
      },
      {
        image: "/thumb4.png",
        title:
          "Exploring the Charm of Papua’s Traditional Clothing: A Captivating and Meaningful Cultural Heritage",
        date: "1 AGUSTUS 2024",
      },
    ],
    comments: [
      {
        image: "/thumb-comment.png",
        title: "Pengunjung Komentar Positif tentang Fitur Baru",
        date: "3 JUNI 2024",
      },
    ],
    latest: [
      {
        image: "/thumb-latest.png",
        title: "Update Terbaru dari Redaksi Hari Ini",
        date: "2 JULI 2025",
      },
    ],
  };

  useEffect(() => {
    initStateData();
  }, [listCategory]);

  async function initStateData() {
    loading();
    const res = await getArticleById(id);
    const data = res.data?.data;

    setThumbnail(data?.thumbnailUrl);
    setDiseId(data?.aiArticleId);
    setDetailFiles(data?.files);
    setArticleDetail(data); // <-- Add this
    close();
  }

  return (
    <>
      <div className="bg-white grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-8">
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500 mb-2">Home {">"}Detail</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-4">
            {articleDetail?.title}
          </h1>
          <div className="flex flex-row justify-between  items-center space-x-2 text-sm text-black mb-4">
            <div className="flex flex-row gap-3">
              <div className="text-[#31942E]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    // fill-rule="evenodd"
                  >
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984"
                    />
                  </g>
                </svg>
              </div>

              <span className="text-[#31942E] font-medium">
                {articleDetail?.createdByName}
              </span>
              <span>-</span>
              <span>
                <span>
                  {new Date(articleDetail?.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </span>
              <span className="text-gray-500">in</span>
              <span>{articleDetail?.categories?.[0]?.title}</span>
            </div>
            <div className="flex items-center">
              <CommentIcon />0
            </div>
          </div>

          <div className="w-full h-auto mb-6">
            {articleDetail?.files?.[0]?.file_url ? (
              <Image
                src={articleDetail.files[0].file_url}
                alt="Berita"
                width={800}
                height={400}
                className="rounded-lg w-full object-cover"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
                <p className="text-gray-400 text-sm">Gambar tidak tersedia</p>
              </div>
            )}

            <div className=" flex flex-row w-fit rounded overflow-hidden  mr-5 gap-3">
              <div className="flex flex-col items-center gap-2">
                <p className="text-red-500 font-semibold">0</p>
                <p className="text-red-500 font-semibold">SHARES</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-black font-semibold">3</p>
                <p className="text-black font-semibold">VIEWS</p>
              </div>
              <Link
                href="#"
                aria-label="Facebook"
                className="bg-[#3b5998] p-4 flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="bg-[#55acee] p-4 flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.91 20.889c8.302 0 12.845-6.885 12.845-12.845c0-.193 0-.387-.009-.58A9.2 9.2 0 0 0 23 5.121a9.2 9.2 0 0 1-2.597.713a4.54 4.54 0 0 0 1.99-2.5a9 9 0 0 1-2.87 1.091A4.5 4.5 0 0 0 16.23 3a4.52 4.52 0 0 0-4.516 4.516c0 .352.044.696.114 1.03a12.82 12.82 0 0 1-9.305-4.718a4.526 4.526 0 0 0 1.4 6.03a4.6 4.6 0 0 1-2.043-.563v.061a4.524 4.524 0 0 0 3.62 4.428a4.4 4.4 0 0 1-1.189.159q-.435 0-.845-.08a4.51 4.51 0 0 0 4.217 3.135a9.05 9.05 0 0 1-5.608 1.936A9 9 0 0 1 1 18.873a12.84 12.84 0 0 0 6.91 2.016" />
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="WhatsApp"
                className="bg-green-700 p-4 flex justify-center items-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <g
                    // clip-path="url(#SVGXv8lpc2Y)"
                    >
                      <path
                        fill="currentColor"
                        // fill-rule="evenodd"
                        d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413s-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.8 9.8 0 0 1 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.86 11.86 0 0 0 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413"
                        // clip-rule="evenodd"
                      />
                    </g>
                    <defs>
                      <clipPath id="SVGXv8lpc2Y">
                        <path fill="#fff" d="M0 0h24v24H0z" />
                      </clipPath>
                    </defs>
                  </g>
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="Telegram"
                className="bg-blue-400 p-4 flex justify-center items-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 256 256"
                >
                  <defs>
                    <linearGradient
                      id="SVGuySfwdaH"
                      x1="50%"
                      x2="50%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        // stop-color="#2aabee"
                      />
                      <stop
                        offset="100%"
                        // stop-color="#229ed9"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#SVGuySfwdaH)"
                    d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"
                  />
                  <path
                    fill="#fff"
                    d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"
                  />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-start">
              {articleDetail?.slug}
            </p>
          </div>
          <div className="flex relative">
            <div className="flex-1 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed text-justify">
                {/* <span className="text-black font-bold text-md">
                  Mikulnews.com -
                </span> */}

                {articleDetail?.description}
              </p>

              <div className="flex flex-row gap-2 items-center">
                <span className="font-semibold text-sm text-gray-700">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {articleDetail?.tags ? (
                    <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                      {articleDetail.tags}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Tidak ada tag</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative  mb-2 h-[120px] overflow-hidden flex items-center border my-8">
            <Image
              src={"/image-kolom.png"}
              alt="Berita Utama"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-2">Tinggalkan Balasan</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Alamat email Anda tidak akan dipublikasikan. Ruas yang wajib
              ditandai <span className="text-red-500">*</span>
            </p>

            <form className="space-y-6 mt-6">
              <div>
                <label
                  htmlFor="komentar"
                  className="block text-sm font-medium mb-1"
                >
                  Komentar <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="komentar"
                  className="w-full border border-gray-300 rounded-md p-3 h-40 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium mb-1"
                >
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium mb-1"
                  >
                    Situs Web
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 mt-2">
                <input type="checkbox" id="saveInfo" className="mt-1" />
                <label htmlFor="saveInfo" className="text-sm text-gray-700">
                  Simpan nama, email, dan situs web saya pada peramban ini untuk
                  komentar saya berikutnya.
                </label>
              </div>

              <p className="text-red-600 text-sm">
                The reCAPTCHA verification period has expired. Please reload the
                page.
              </p>

              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition mt-2"
              >
                KIRIM KOMENTAR
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="sticky top-0 space-y-6">
            <div className="space-y-6">
              {articles?.map((article) => (
                <div key={article.id}>
                  <div>
                    <Link
                      className="flex space-x-3 mb-2"
                      href={`/detail/${article.id}`}
                    >
                      <Image
                        src={article.thumbnailUrl || "/default-thumb.png"}
                        alt={article.title}
                        width={120}
                        height={80}
                        className="rounded object-cover w-[120px] h-[80px]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-snug hover:text-red-700">
                          {article.title}
                        </p>

                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                          <span>
                            📅{" "}
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span>💬 0</span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {article.description.slice(0, 120)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
