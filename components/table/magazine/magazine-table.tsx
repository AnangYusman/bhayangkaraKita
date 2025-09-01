"use client";
import {
  CreateIconIon,
  DeleteIcon,
  DotsYIcon,
  EyeIconMdi,
  SearchIcon,
} from "@/components/icons";
import { close, error, loading, success } from "@/config/swal";
import { getArticleByCategory } from "@/service/article";
import { deleteMagazine, getListMagazine } from "@/service/magazine";
import { Article } from "@/types/globals";
import { convertDateFormat } from "@/utils/global";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import CustomPagination from "@/components/layout/custom-pagination";
import { Chip, ChipProps } from "@/components/ui/chip";

const columns = [
  { name: "No", uid: "no" },
  { name: "Judul", uid: "title" },
  // { name: "Kategori", uid: "categoryName" },
  { name: "Tanggal Unggah", uid: "createdAt" },
  { name: "Kreator", uid: "createdByName" },
  { name: "Aksi", uid: "actions" },
];

type ArticleData = Article & {
  no: number;
  createdAt: string;
};

export default function MagazineTable() {
  const MySwal = withReactContent(Swal);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [article, setArticle] = useState<ArticleData[]>([]);
  const [showData, setShowData] = useState("10");
  const [search, setSearch] = useState("");
  const [, setCategoies] = useState<any>([]);
  const [startDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    initState();
  }, [page, showData, startDateValue]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const res = await getArticleByCategory();
    const data = res?.data?.data;
    console.log("datass", res?.data?.data);
    setCategoies(data);
  }

  async function initState() {
    const req = {
      limit: showData,
      page: page,
      search: search,
      startDate:
        startDateValue.startDate === null ? "" : startDateValue.startDate,
      endDate: startDateValue.endDate === null ? "" : startDateValue.endDate,
    };
    const res = await getListMagazine(req);
    getTableNumber(parseInt(showData), res.data?.data);
    console.log("res.data?.data magz", res.data);
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
    } else {
      setArticle([]);
    }
  };

  async function doDelete(id: any) {
    loading();
    const resDelete = await deleteMagazine(id);

    if (resDelete?.error) {
      error(resDelete.message);
      return false;
    }
    close();
    success("Berhasil Hapus");
    initState();
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

  const renderCell = useCallback((article: ArticleData, columnKey: Key) => {
    const cellValue = article[columnKey as keyof ArticleData];
    const statusColorMap: Record<string, ChipProps["color"]> = {
      active: "primary",
      cancel: "danger",
      pending: "success",
    };

    switch (columnKey) {
      case "status":
        return (
          <Chip
            className="capitalize "
            color={statusColorMap[article.status]}
            size="lg"
            variant="flat"
          >
            <div className="flex flex-row items-center gap-2 justify-center">
              {cellValue}
            </div>
          </Chip>
        );
      case "createdAt":
        return <p>{convertDateFormat(article.createdAt)}</p>;

      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <DotsYIcon className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-black text-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/magazine/detail/${article.id}`}
                    className="flex items-center"
                  >
                    <EyeIconMdi className="inline mr-2 mb-1" />
                    Detail
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/magazine/edit/${article.id}`}
                    className="flex items-center"
                  >
                    <CreateIconIon className="inline mr-2 mb-1" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDelete(article.id)}
                  className="text-red-500"
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
      <div className="py-3 w-full">
        <div className="flex flex-col items-start rounded-2xl gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-1 w-full lg:w-1/3">
              <p className="font-semibold text-sm">Pencarian</p>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 text-sm bg-muted"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full lg:w-[72px]">
              <p className="font-semibold text-sm">Data</p>
              <Select
                onValueChange={(value) => setShowData(value)}
                value={showData}
              >
                <SelectTrigger className="w-full border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="flex flex-col gap-1 w-[230px]">
              <p className="font-semibold text-sm">Kategori</p>
              <Select
                label=""
                variant="bordered"
                labelPlacement="outside"
                placeholder="Select"
                selectionMode="multiple"
                selectedKeys={[selectedCategories]}
                className="w-full"
                classNames={{ trigger: "border-1" }}
                onChange={(e) => {
                  e.target.value === ""
                    ? ""
                    : setSelectedCategories(e.target.value);
                }}
              >
                {categories?.map((category: any) => (
                  <SelectItem key={category?.id} value={category?.id}>
                    {category?.title}
                  </SelectItem>
                ))}
              </Select>
            </div> */}
            {/* <div className="flex flex-col gap-1 w-full lg:w-[240px]">
              <p className="font-semibold text-sm">Tanggal</p>
              <Datepicker
                value={startDateValue}
                displayFormat="DD/MM/YYYY"
                onChange={(e: any) => setStartDateValue(e)}
                inputClassName="z-50 w-full text-sm bg-transparent border-1 border-gray-200 px-2 py-[6px] rounded-xl h-[40px] text-gray-600 dark:text-gray-300"
              />
            </div> */}
          </div>
          <div className="rounded-3xl border overflow-hidden w-full">
            <Table>
              <thead className="bg-white dark:bg-black text-black dark:text-white border-b">
                <tr>
                  {columns.map((column) => (
                    <TableHead key={column.uid} className="text-md">
                      {column.name}
                    </TableHead>
                  ))}
                </tr>
              </thead>
              <TableBody>
                {article.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-4"
                    >
                      No data to display.
                    </TableCell>
                  </TableRow>
                ) : (
                  article.map((item) => (
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
          </div>
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
