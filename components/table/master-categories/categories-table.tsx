"use client";
import {
  CloudUploadIcon,
  CreateIconIon,
  DeleteIcon,
  DotsYIcon,
  EyeIconMdi,
  SearchIcon,
} from "@/components/icons";
import { Article } from "@/types/globals";
import { convertDateFormat } from "@/utils/global";
import { Key, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { useDropzone } from "react-dropzone";
import { close, error, loading, success } from "@/config/swal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import useDisclosure from "@/components/useDisclosure";
import { getArticleByCategory, getCategoryPagination } from "@/service/article";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
  uploadCategoryThumbnail,
} from "@/service/master-categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import CustomPagination from "@/components/layout/custom-pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const columns = [
  { name: "No", uid: "no" },
  { name: "Kategori", uid: "title" },
  { name: "Deskripsi", uid: "description" },
  { name: "Tag Terkait", uid: "tags" },
  { name: "Dibuat ", uid: "createdAt" },

  { name: "Aksi", uid: "actions" },
];

interface CategoryType {
  id: number;
  label: string;
  value: number;
}
type ArticleData = Article & {
  no: number;
  createdAt: string;
  tags: string[];
};

// const categorySchema = z.object({
//   id: z.number(),
//   label: z.string(),
//   value: z.number(),
// });

const createArticleSchema = z.object({
  id: z.string().min(1, {
    message: "Id harus valid",
  }),
  title: z.string().min(2, {
    message: "Judul harus diisi",
  }),
  description: z.string().min(2, {
    message: "Deskripsi harus diisi",
  }),
  tags: z.array(z.string()),

  file: z.string(),
});

export default function CategoriesTable(props: { triggerRefresh: boolean }) {
  const MySwal = withReactContent(Swal);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const animatedComponents = makeAnimated();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [categories, setCategories] = useState<ArticleData[]>([]);
  const [showData, setShowData] = useState("10");
  const [search, setSearch] = useState("");
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDetail, setIsDetail] = useState(false);
  const [tag, setTag] = useState("");
  const formOptions = {
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", description: "", category: [], tags: [] },
  };
  const [selectedParent, setSelectedParent] = useState<any>();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
  });
  type UserSettingSchema = z.infer<typeof createArticleSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<UserSettingSchema>(formOptions);

  useEffect(() => {
    initState();
  }, [page, showData, props.triggerRefresh]);

  async function initState() {
    const req = {
      limit: showData,
      page: page,
      search: search,
    };
    const res = await getCategoryPagination(req);
    getTableNumber(parseInt(showData), res.data?.data);
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
      setCategories(newData);
    } else {
      setCategories([]);
    }
  };

  async function doDelete(id: number) {
    // loading();
    const resDelete = await deleteCategory(id);

    if (resDelete?.error) {
      error(resDelete.message);
      return false;
    }
    close();
    success("Berhasil Hapus");
    initState();
  }

  const handleDelete = (id: number) => {
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

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const res = await getArticleByCategory();
    if (res?.data?.data) {
      setupCategory(res?.data?.data);
    }
  };

  const setupCategory = (data: any) => {
    const temp = [];
    for (const element of data) {
      temp.push({
        id: element.id,
        label: element.title,
        value: element.id,
      });
    }
    setListCategory(temp);
  };

  const openModal = async (id: number | string, detail: boolean) => {
    setIsDetail(detail);
    const res = await getCategoryById(Number(id));
    const data = res?.data?.data;
    setValue("id", String(data?.id));
    setValue("title", data?.title);
    setValue("description", data?.description);
    setValue("tags", data?.tags);
    setValue("file", data?.thumbnailUrl);
    findParent(data?.parentId);

    onOpen();
  };

  const findParent = (parent: number | undefined) => {
    const finded = listCategory?.find((a: any) => a.id === parent);
    if (finded) {
      setSelectedParent(finded);
    }
  };

  const renderCell = useCallback(
    (category: ArticleData, columnKey: Key) => {
      const cellValue = category[columnKey as keyof ArticleData];
      // const statusColorMap: Record<string, ChipProps["color"]> = {
      //   active: "primary",
      //   cancel: "danger",
      //   pending: "success",
      // };

      // const findRelated = (parent: number | string) => {
      //   const filter = listCategory?.filter((a) => a.id == parent);
      //   return filter[0]?.label;
      // };

      switch (columnKey) {
        case "tags":
          return (
            <div className="flex flex-row gap-1">
              {category.tags
                ? category.tags.map((value) => value).join(", ")
                : "-"}
            </div>
          );
        case "createdAt":
          return <p>{convertDateFormat(category.createdAt)}</p>;

        case "actions":
          return (
            <div className="relative flex justify-star items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <DotsYIcon className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="lg:min-w-[150px] bg-black text-white shadow border">
                  <DropdownMenuItem
                    onClick={() => openModal(category.id, true)}
                  >
                    <EyeIconMdi className="inline mr-2 mb-1" />
                    Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openModal(category.id, false)}
                  >
                    <CreateIconIon className="inline mr-2 mb-1" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(category.id)}>
                    <DeleteIcon
                      color="red"
                      size={20}
                      className="inline mr-3 mb-1"
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
    },
    [listCategory]
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
    initState();
  }

  const onSubmit = async (values: z.infer<typeof createArticleSchema>) => {
    loading();
    const formData = {
      id: Number(values.id),
      title: values.title,
      statusId: 1,
      parentId: selectedParent ? selectedParent.id : 0,
      tags: values.tags.join(","),
      description: values.description,
    };

    const response = await updateCategory(values.id, formData);

    if (response?.error) {
      error(response.message);
      return false;
    }
    if (files?.length > 0) {
      const formFiles = new FormData();

      formFiles.append("files", files[0]);
      const resFile = await uploadCategoryThumbnail(values.id, formFiles);
      if (resFile?.error) {
        error(resFile.message);
        return false;
      }
    }
    setFiles([]);
    close();
    initState();
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  };

  const handleRemoveFile = (file: File) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  return (
    <>
      <div className="py-3 w-full">
        <div className="flex flex-col items-start rounded-2xl gap-3 w-full">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-1 w-full lg:w-1/3">
              <p className="font-semibold text-sm">Pencarian</p>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Cari..."
                  aria-label="Search"
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
                value={showData}
                onValueChange={(value) =>
                  value === "" ? "" : setShowData(value)
                }
              >
                <SelectTrigger className="w-full border">
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
          </div>
          {/* <Table
            aria-label="micro issue table"
            className="rounded-3xl"
            classNames={{
              th: "bg-white dark:bg-black text-black dark:text-white border-b-1 text-md",
              base: "bg-white dark:bg-black border",
              wrapper: "min-h-[50px] bg-transpararent text-black dark:text-white ",
            }}
          >
            <TableHeader columns={columns}>{(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}</TableHeader>
            <TableBody items={categories} emptyContent={"No data to display."} loadingContent={<Spinner label="Loading..." />}>
              {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
            </TableBody>
          </Table> */}
          <div className="rounded-3xl border bg-white dark:bg-black text-black dark:text-white w-full">
            <Table className="min-h-[50px] w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.uid}
                      className="text-md border-b bg-white dark:bg-black text-black dark:text-white"
                    >
                      {column.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-4"
                    >
                      No data to display.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((item) => (
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kategori Baru</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm">Nama Kategori</p>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      id="title"
                      type="text"
                      value={value}
                      onChange={onChange}
                      readOnly={isDetail}
                      className="rounded-lg border dark:border-gray-400"
                    />
                  )}
                />
                {errors?.title && (
                  <p className="text-red-400 text-sm">
                    {errors.title?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm">Deskripsi</p>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <Textarea
                      id="description"
                      value={value}
                      onChange={onChange}
                      readOnly={isDetail}
                      className="rounded-lg border dark:border-gray-400"
                    />
                  )}
                />
                {errors?.description && (
                  <p className="text-red-400 text-sm">
                    {errors.description?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm mt-3">Parent</p>
                <ReactSelect
                  className="text-black z-50"
                  classNames={{
                    control: () =>
                      "rounded-lg bg-white border border-gray-200 dark:border-stone-500",
                  }}
                  classNamePrefix="select"
                  value={selectedParent}
                  isDisabled={isDetail}
                  onChange={setSelectedParent}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isClearable
                  isSearchable
                  isMulti={false}
                  placeholder="Kategori..."
                  name="sub-module"
                  options={listCategory}
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm mt-3">Tag Terkait</p>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field: { value } }) => (
                    <div className="relative">
                      <Input
                        id="tags"
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (tag.trim() !== "") {
                              setValue("tags", [...value, tag.trim()]);
                              setTag("");
                              e.preventDefault();
                            }
                          }
                        }}
                        readOnly={isDetail}
                        className="rounded-lg border dark:border-gray-400 h-[45px]"
                      />
                      <div className="absolute top-2 left-3 flex gap-1">
                        {value?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded flex items-center gap-1"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = value.filter(
                                  (tag) => tag !== item
                                );
                                if (filtered.length === 0) {
                                  setError("tags", {
                                    type: "manual",
                                    message: "Tags tidak boleh kosong",
                                  });
                                } else {
                                  clearErrors("tags");
                                  setValue(
                                    "tags",
                                    filtered as [string, ...string[]]
                                  );
                                }
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
              </div>

              {isDetail ? (
                <img
                  src={getValues("file")}
                  className="w-[30%]"
                  alt="thumbnail"
                  width={480}
                  height={480}
                />
              ) : (
                <Controller
                  control={control}
                  name="file"
                  render={({ field: { value } }) => (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm mt-3">Thumbnail</p>
                      {files.length < 1 && value === "" && (
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
                            <CloudUploadIcon />
                            <h4 className="text-2xl font-medium mb-1 mt-3">
                              Tarik file disini atau klik untuk upload.
                            </h4>
                            <div className="text-xs text-muted-foreground">
                              ( Upload file .jpg, .jpeg, .png. Maks 100mb )
                            </div>
                          </div>
                        </div>
                      )}
                      {value !== "" && (
                        <div className="flex gap-2">
                          <img
                            src={value}
                            className="w-[30%]"
                            alt="thumbnail"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("file", "")}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                      {files.length > 0 && (
                        <div className="flex gap-2">
                          <Image
                            src={URL.createObjectURL(files[0])}
                            className="w-[30%]"
                            alt="thumbnail"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFile(files[0])}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                />
              )}

              <DialogFooter className="gap-2 mt-4">
                {!isDetail && <Button type="submit">Simpan</Button>}
                <Button type="button" variant="outline" onClick={onClose}>
                  Tutup
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
