"use client";
import { AddIcon } from "@/components/icons";
import MasterUserTable from "@/components/table/master-user-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MasterUserPage() {
  return (
    <div className="overflow-x-hidden overflow-y-scroll">
      <div className="px-2 md:px-4 md:py-4 w-full">
        <div className="bg-white shadow-lg dark:bg-[#18181b] rounded-xl py-3">
          <Link href="/admin/master-user/create" className="mx-3">
            <Button
              size="default"
              color="primary"
              className="bg-[#F07C00] text-white"
            >
              Pengguna Baru
              <AddIcon />
            </Button>
          </Link>
          <MasterUserTable />
        </div>
      </div>
    </div>
  );
}
