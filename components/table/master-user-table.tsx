"use client";
import { CreateIconIon, DeleteIcon, DotsYIcon } from "@/components/icons";
import { close, error } from "@/config/swal";
import { deleteMasterUser, listMasterUsers } from "@/service/master-user";
import { MasterUser } from "@/types/globals";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import CustomPagination from "../layout/custom-pagination";

const columns = [
  { name: "No", uid: "no" },
  { name: "Username", uid: "username" },
  { name: "Fullname", uid: "fullname" },
  { name: "Email", uid: "email" },
  { name: "Identity Type", uid: "identityType" },
  { name: "Identity Number", uid: "identityNumber" },
  // { name: "Users", uid: "users" },
  // { name: "Status", uid: "status" },
  { name: "Aksi", uid: "actions" },
];

export default function MasterUserTable() {
  const MySwal = withReactContent(Swal);
  const [user, setUser] = useState<MasterUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    initState();
  }, [page]);

  async function initState() {
    const res = await listMasterUsers({ page: page, limit: 10 });
    getTableNumber(10, res?.data?.data);
    setTotalPage(res?.data?.meta?.totalPage);
  }
  const getTableNumber = (limit: number, data?: any) => {
    if (data) {
      const startIndex = limit * (page - 1);
      let iterate = 0;
      const newData = data.map((value: any) => {
        iterate++;
        value.no = startIndex + iterate;
        return value;
      });
      setUser(newData);
    }
  };

  async function doDelete(id: string) {
    // loading();
    const resDelete = await deleteMasterUser(id);

    if (resDelete?.error) {
      error(resDelete.message);
      return false;
    }
    close();
    successSubmit();
  }

  const handleDelete = (id: any) => {
    MySwal.fire({
      title: "Hapus Data",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        doDelete(id);
      }
    });
  };

  function successSubmit() {
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        initState();
      }
    });
  }

  const renderCell = useCallback((user: MasterUser, columnKey: Key) => {
    const cellValue = user[columnKey as keyof MasterUser];
    // const statusColorMap: Record<string, ChipProps["color"]> = {
    //   active: "primary",
    //   cancel: "danger",
    //   pending: "success",
    // };

    switch (columnKey) {
      case "id":
        return <div>{user.id}</div>;

      case "status":
        return (
          <div></div>
          // <Chip
          //   className="capitalize "
          //   // color={statusColorMap[user.status]}
          //   size="lg"
          //   variant="flat"
          // >
          //   <div className="flex flex-row items-center gap-2 justify-center">{cellValue}</div>
          // </Chip>
        );

      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <DotsYIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/master-user/edit/${user.id}`}
                    className="flex items-center"
                  >
                    <CreateIconIon className="inline mr-2 mb-1" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600"
                >
                  <DeleteIcon
                    width={20}
                    height={16}
                    className="inline mr-2 mb-1"
                  />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <div className="mx-3 my-5">
        <div className="flex flex-col items-center rounded-2xl">
          <Table className="rounded-2xl text-black dark:text-white bg-white dark:bg-black min-h-[50px]">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.uid}
                    className="bg-white dark:bg-black text-black dark:text-white border-b text-md"
                  >
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No data to display.
                  </TableCell>
                </TableRow>
              ) : (
                user.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.uid}>
                        {renderCell(item, column.uid)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="my-2 w-full flex justify-center">
            {/* <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              classNames={{
                base: "bg-transparent",
                wrapper: "bg-transparent",
              }}
              page={page}
              total={totalPage}
              onChange={(page) => setPage(page)}
            /> */}
            <CustomPagination
              totalPage={totalPage}
              onPageChange={(data) => setPage(data)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
