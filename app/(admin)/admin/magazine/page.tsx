"use client";

import MagazineTable from "@/components/table/magazine/magazine-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MagazineTablePage() {
  return (
    <div className="overflow-x-hidden overflow-y-scroll">
      <div className="px-2 md:px-4 md:py-4 w-full">
        <div className="bg-white shadow-lg dark:bg-[#18181b] rounded-xl p-3 w-full">
          <Link href="/admin/magazine/create">
            <Button className="bg-[#F07C00] text-white hover:bg-[#d96e00] w-full lg:w-auto">
              <Plus className="ml-2 h-4 w-4" />
              Tambah Majalah
            </Button>
          </Link>
          <MagazineTable />
        </div>
      </div>
    </div>
  );
}
