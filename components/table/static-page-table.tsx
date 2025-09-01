"use client";
import {
  CreateIconIon,
  DeleteIcon,
  DotsYIcon,
  SearchIcon,
} from "@/components/icons";
import { close, error, success } from "@/config/swal";
import { deleteArticle } from "@/service/article";
import { getCustomStaticPage } from "@/service/static-page-service";
import { Article } from "@/types/globals";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import CustomPagination from "../layout/custom-pagination";

const columns = [
  { name: "No", uid: "no" },
  { name: "Judul", uid: "title" },
  { name: "Slug", uid: "slug" },
  { name: "Deskripsi", uid: "description" },
  { name: "Aksi", uid: "actions" },
];

type ArticleData = Article & {
  no: number;
  createdAt: string;
};

export default function StaticPageTable() {
  const MySwal = withReactContent(Swal);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [article, setArticle] = useState<ArticleData[]>([]);
  const [showData, setShowData] = useState("10");
  const [search, setSearch] = useState("");
  const [startDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    initState();
  }, [page, showData, startDateValue]);

  async function initState() {
    const req = {
      limit: showData,
      page: page,
      search: search,
    };
    const res = await getCustomStaticPage(req);
    getTableNumber(parseInt(showData), res.data?.data);
    console.log("res.data?.data", res.data);
    setTotalPage(res?.data?.meta?.totalPage);
  }

  const getTableNumber = (limit: number, data: Article[]) => {
    if (data) {
      const startIndex = limit * (page - 1);
      let iterate = 0;
      const newData = data.map((value: any) => {
        iterate++;
        value.no = startIndex + iterate;
        return value;
      });
      console.log("daata", data);
      setArticle(newData);
    }
  };

  async function doDelete(id: string) {
    // loading();
    const resDelete = await deleteArticle(id);

    if (resDelete?.error) {
      error(resDelete.message);
      return false;
    }
    close();
    success("Success Deleted");
  }

  const handleDelete = (id: string) => {
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

  // function successSubmit() {
  //   MySwal.fire({
  //     title: "Sukses",
  //     icon: "success",
  //     confirmButtonColor: "#3085d6",
  //     confirmButtonText: "OK",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // initStete();
  //     }
  //   });
  // }

  const renderCell = useCallback((article: ArticleData, columnKey: Key) => {
    const cellValue = article[columnKey as keyof ArticleData];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-0 h-auto w-auto"
                >
                  <DotsYIcon className="text-black dark:text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black text-white border">
                {/* <DropdownMenuItem>
                <Link href={`/admin/static-page/detail/${article.id}`} className="flex items-center">
                  <EyeIconMdi className="inline mr-2 mb-1" />
                  Detail
                </Link>
              </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/static-page/edit/${article.id}`}
                    className="flex items-center"
                  >
                    <CreateIconIon className="inline mr-2 mb-1" size={20} />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(article.id)}
                  className="flex items-center text-red-500"
                >
                  <DeleteIcon
                    color="red"
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

  let typingTimer: NodeJS.Timeout;
  const doneTypingInterval = 1500;

  const handleKeyUp = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  };

  const handleKeyDown = () => {
    clearTimeout(typingTimer);
  };

  async function doneTyping() {
    initState();
  }

  return (
    <>
      <div className="py-3">
        <div className="flex flex-col items-start rounded-2xl gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-1 w-full lg:w-1/3">
              <Label className="font-semibold text-sm">Pencarian</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="text-base text-muted-foreground" />
                </span>
                <Input
                  type="text"
                  aria-label="Pencarian..."
                  placeholder="Pencarian..."
                  className="pl-10 text-sm bg-muted"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full lg:w-[72px]">
              <Label className="font-semibold text-sm">Data</Label>
              <Select
                value={showData}
                onValueChange={(value) =>
                  value === "" ? "" : setShowData(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="flex flex-col gap-1 w-full lg:w-[340px]">
              <p className="font-semibold text-sm">Tanggal</p>
              <Datepicker
                value={startDateValue}
                displayFormat="DD/MM/YYYY"
                onChange={(e: any) => setStartDateValue(e)}
                inputClassName="z-50 w-full text-sm bg-transparent border-1 border-gray-200 px-2 py-[6px] rounded-xl h-[40px] text-gray-600 dark:text-gray-300"
              />
            </div> */}
          </div>
          <Table className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-black text-black dark:text-white min-h-[50px]">
            <TableHeader>
              <TableRow className="bg-white dark:bg-black border-b dark:border-gray-800">
                {columns.map((column) => (
                  <TableHead
                    key={column.uid}
                    className="text-left font-semibold text-sm text-black dark:text-white px-4 py-3"
                  >
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {article.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4 text-sm"
                  >
                    No data to display.
                  </TableCell>
                </TableRow>
              ) : (
                article.map((item) => (
                  <TableRow key={item.id} className="transition-colors">
                    {columns.map((column) => (
                      <TableCell
                        key={column.uid}
                        className="px-4 py-3 text-sm border-none"
                      >
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
