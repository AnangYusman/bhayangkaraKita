"use client";
import {
  BannerIcon,
  CopyIcon,
  CreateIconIon,
  DeleteIcon,
  DotsYIcon,
  EyeIconMdi,
  SearchIcon,
} from "@/components/icons";
import { close, error, loading, success, successToast } from "@/config/swal";
import { Article } from "@/types/globals";
import { convertDateFormat } from "@/utils/global";
import Link from "next/link";
import { Key, useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";
import {
  deleteArticle,
  getArticleByCategory,
  getArticlePagination,
  updateIsBannerArticle,
} from "@/service/article";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  { name: "Banner", uid: "isBanner" },
  { name: "Kategori", uid: "category" },
  { name: "Tanggal Unggah", uid: "createdAt" },
  { name: "Kreator", uid: "createdByName" },
  { name: "Status", uid: "isPublish" },
  { name: "Aksi", uid: "actions" },
];
const columnsOtherRole = [
  { name: "No", uid: "no" },
  { name: "Judul", uid: "title" },
  { name: "Kategori", uid: "category" },
  { name: "Tanggal Unggah", uid: "createdAt" },
  { name: "Kreator", uid: "createdByName" },
  { name: "Status", uid: "isPublish" },
  { name: "Aksi", uid: "actions" },
];

// interface Category {
//   id: number;
//   title: string;
// }

export default function ArticleTable() {
  const MySwal = withReactContent(Swal);
  const username = Cookies.get("username");
  const userId = Cookies.get("uie");

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [article, setArticle] = useState<any[]>([]);
  const [showData, setShowData] = useState("10");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>("");
  const [startDateValue, setStartDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    initState();
    getCategories();
  }, []);

  async function getCategories() {
    const res = await getArticleByCategory();
    const data = res?.data?.data;
    setCategories(data);
  }

  async function initState() {
    loading();
    const req = {
      limit: showData,
      page: page,
      search: search,
      categorySlug: Array.from(selectedCategories).join(","),
      sort: "desc",
      sortBy: "created_at",
    };
    const res = await getArticlePagination(req);
    await getTableNumber(parseInt(showData), res.data?.data);
    setTotalPage(res?.data?.meta?.totalPage);
    close();
  }

  // panggil ulang setiap state berubah
  useEffect(() => {
    initState();
  }, [page, showData, search, selectedCategories]);

  const getTableNumber = async (limit: number, data: Article[]) => {
    if (data) {
      const startIndex = limit * (page - 1);
      let iterate = 0;
      const newData = data.map((value: any) => {
        iterate++;
        value.no = startIndex + iterate;
        return value;
      });
      setArticle(newData);
    } else {
      setArticle([]);
    }
  };

  async function doDelete(id: any) {
    // loading();
    const resDelete = await deleteArticle(id);

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

  const handleBanner = async (id: number, status: boolean) => {
    const res = await updateIsBannerArticle(id, status);
    if (res?.error) {
      error(res?.message);
      return false;
    }
    initState();
  };

  const copyUrlArticle = async (id: number, slug: string) => {
    const url =
      `${window.location.protocol}//${window.location.host}` +
      "/news/detail/" +
      `${id}-${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      successToast("Success", "Article Copy to Clipboard");
      setTimeout(() => {}, 1500);
    } catch (err) {
      ("Failed to copy!");
    }
  };

  const renderCell = useCallback(
    (article: any, columnKey: Key) => {
      const cellValue = article[columnKey as keyof any];

      switch (columnKey) {
        case "isPublish":
          return (
            // <Chip
            //   className="capitalize "
            //   color={statusColorMap[article.status]}
            //   size="lg"
            //   variant="flat"
            // >
            //   <div className="flex flex-row items-center gap-2 justify-center">
            //     {article.status}
            //   </div>
            // </Chip>
            <p>{article.isPublish ? "Publish" : "Draft"}</p>
          );
        case "isBanner":
          return <p>{article.isBanner ? "Ya" : "Tidak"}</p>;
        case "createdAt":
          return <p>{convertDateFormat(article.createdAt)}</p>;
        case "category":
          return (
            <p>
              {article?.categories?.map((list: any) => list.title).join(", ") +
                " "}
            </p>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsYIcon className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    onClick={() => copyUrlArticle(article.id, article.slug)}
                  >
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy Url Article
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/admin/article/detail/${article.id}`}
                      className="flex items-center"
                    >
                      <EyeIconMdi className="mr-2 h-4 w-4" />
                      Detail
                    </Link>
                  </DropdownMenuItem>

                  {(username === "admin-mabes" ||
                    Number(userId) === article.createdById) && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/article/edit/${article.id}`}
                        className="flex items-center"
                      >
                        <CreateIconIon className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {username === "admin-mabes" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleBanner(article.id, !article.isBanner)
                      }
                    >
                      <BannerIcon className="mr-2 h-4 w-4" />
                      {article.isBanner
                        ? "Hapus dari Banner"
                        : "Jadikan Banner"}
                    </DropdownMenuItem>
                  )}

                  {(username === "admin-mabes" ||
                    Number(userId) === article.createdById) && (
                    <DropdownMenuItem onClick={() => handleDelete(article.id)}>
                      <DeleteIcon className="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [article, page]
  );

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
    setPage(1);
    initState();
  }

  return (
    <>
      <div className="py-3">
        <div className="flex flex-col items-start rounded-2xl gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-1 w-full lg:w-1/3">
              <p className="font-semibold text-sm">Pencarian</p>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Cari..."
                  className="pl-9 text-sm bg-muted"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full lg:w-[72px]">
              <p className="font-semibold text-sm">Data</p>
              <Select
                value={showData}
                onValueChange={(value) => setShowData(value)}
              >
                <SelectTrigger className="w-full text-sm border">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 w-full lg:w-[230px]">
              <p className="font-semibold text-sm">Kategori</p>
              <Select
                value={selectedCategories}
                onValueChange={(value) => setSelectedCategories(value)}
              >
                <SelectTrigger className="w-full text-sm border">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((category: any) => category.slug != null)
                    .map((category: any) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
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
          <div className="w-full overflow-x-hidden">
            <div className="w-full mx-auto overflow-x-hidden">
              <Table className="w-full table-fixed border text-sm">
                <TableHeader>
                  <TableRow>
                    {(username === "admin-mabes"
                      ? columns
                      : columnsOtherRole
                    ).map((column) => (
                      <TableHead
                        key={column.uid}
                        className="truncate bg-white dark:bg-black text-black dark:text-white border-b text-md"
                      >
                        {column.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {article.length > 0 ? (
                    article.map((item: any) => (
                      <TableRow key={item.id}>
                        {(username === "admin-mabes"
                          ? columns
                          : columnsOtherRole
                        ).map((column) => (
                          <TableCell
                            key={column.uid}
                            className="truncate text-black dark:text-white max-w-[200px]"
                          >
                            {renderCell(item, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-4"
                      >
                        No data to display.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
