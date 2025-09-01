"use client";
import ArticleTable from "@/components/table/article-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function BasicPage() {
  return (
    <div>
      {/* <div className="flex flex-row justify-between border-b-2 mb-4 px-4 ">
        <div className="flex flex-col gap-1 py-2">
          <h1 className="font-bold text-[25px]">Article</h1>
          <p className="text-[14px]">Article</p>
        </div>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 20 20">
            <path fill="currentColor" d="M5 1a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 3h5v1H5zm0 2h5v1H5zm0 2h5v1H5zm10 7H5v-1h10zm0-2H5v-1h10zm0-2H5v-1h10zm0-2h-4V4h4z" />
          </svg>
        </span>
      </div> */}
      <div className="overflow-x-hidden overflow-y-scroll w-full">
        <div className="px-2 md:px-4 md:py-4 w-full">
          <div className="bg-white shadow-lg dark:bg-[#18181b] rounded-xl p-3">
            <Link href="/admin/article/create">
              <Button className="bg-[#F07C00] text-white w-full lg:w-fit hover:bg-[#d96e00]">
                Tambah Artikel
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <ArticleTable />
          </div>
        </div>
      </div>
    </div>
  );
}
