import { AddIcon } from "@/components/icons";
import StaticPageTable from "@/components/table/static-page-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StaticPageGeneratorList() {
  return (
    <div className="overflow-x-hidden overflow-y-scroll rounded-lg">
      <div className="px-2 md:px-4 md:py-4 w-full">
        <div className="bg-white shadow-lg dark:bg-[#18181b] rounded-xl p-3">
          <Link href="/admin/static-page/create">
            <Button size="default" color="primary" className="bg-[#F07C00] text-white w-full lg:w-fit">
              Tambah Halaman
              <AddIcon />
            </Button>
          </Link>
          <StaticPageTable />
        </div>
      </div>
    </div>
  );
}
