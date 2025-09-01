"use client";
import {
  CloudUploadIcon,
  CreateIconIon,
  DeleteIcon,
  DotsYIcon,
  SearchIcon,
  TimesIcon,
} from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { close, error, loading, success } from "@/config/swal";
import { Article } from "@/types/globals";
import Link from "next/link";
import { Fragment, Key, useCallback, useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import useDisclosure from "@/components/useDisclosure";
import {
  createMediaFileAdvertise,
  deleteAdvertise,
  editAdvertise,
  editAdvertiseIsActive,
  getAdvertise,
  getAdvertiseById,
} from "@/service/advertisement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import CustomPagination from "@/components/layout/custom-pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const columns = [
  { name: "No", uid: "no" },
  { name: "Judul", uid: "title" },
  { name: "Deskripsi", uid: "description" },
  { name: "Penempatan", uid: "placement" },
  { name: "Link", uid: "redirectLink" },
  { name: "Aktif", uid: "isActive" },
  { name: "Aksi", uid: "actions" },
];

const createArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "Judul harus diisi",
  }),
  url: z.string().min(1, {
    message: "Url harus diisi",
  }),
  description: z.string().min(2, {
    message: "Deskripsi harus diisi",
  }),
  file: z.string().optional(),
});

export default function AdvertiseTable(props: { triggerRefresh: boolean }) {
  const MySwal = withReactContent(Swal);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [article, setArticle] = useState<any[]>([]);
  const [showData, setShowData] = useState("10");
  const [search, setSearch] = useState("");

  const [placement, setPlacement] = useState("banner");
  const [refresh, setRefresh] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const formOptions = {
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", description: "", url: "", file: "" },
  };

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
    setValue,
    formState: { errors },
  } = useForm<UserSettingSchema>(formOptions);

  useEffect(() => {
    initState();
  }, [page, showData, props.triggerRefresh, refresh]);

  const handleRemoveFile = (file: File) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  async function initState() {
    const req = {
      limit: showData,
      page: page,
      search: search,

      sort: "desc",
      sortBy: "created_at",
    };
    const res = await getAdvertise(req);
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
      setArticle(newData);
    }
  };

  async function doDelete(id: any) {
    loading();
    const resDelete = await deleteAdvertise(id);

    if (resDelete?.error) {
      error(resDelete.message);
      return false;
    }
    close();
    success("Berhasil Hapus");
    setRefresh(!refresh);
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

  const onSubmit = async (values: z.infer<typeof createArticleSchema>) => {
    loading();
    const formData = {
      id: Number(values.id),
      title: values.title,
      description: values.description,
      placement: placement,
      redirectLink: values.url,
    };
    const res = await editAdvertise(formData);
    if (res?.error) {
      error(res?.message);
      return false;
    }

    if (files.length > 0) {
      const formFiles = new FormData();
      formFiles.append("file", files[0]);
      const resFile = await createMediaFileAdvertise(
        Number(values.id),
        formFiles
      );
    }

    close();
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        setRefresh(!refresh);
      }
    });
  };

  const openModal = async (id: number) => {
    const res = await getAdvertiseById(Number(id));
    const data = res?.data?.data;
    setValue("id", String(data?.id));
    setValue("title", data?.title);
    setValue("description", data?.description);
    setValue("url", data?.redirectLink);
    setPlacement(data?.placement);
    // setValue("file", data?.thumbnailUrl);

    onOpen();
  };

  const handleAdvertise = async (e: boolean, id: number) => {
    const res = await editAdvertiseIsActive({ id, isActive: e });
    if (res?.error) {
      error(res?.message);
      return false;
    }
    setRefresh(!refresh);
  };

  const renderCell = useCallback(
    (advertise: any, columnKey: Key) => {
      const cellValue = advertise[columnKey as keyof any];

      switch (columnKey) {
        case "redirectLink":
          return cellValue.includes("https") ? (
            <Link
              href={cellValue}
              target="_blank"
              className="text-primary hover:underline cursor-pointer"
            >
              {cellValue}
            </Link>
          ) : (
            <p> {cellValue}</p>
          );
        case "placement":
          return <p className="capitalize">{cellValue}</p>;
        case "isActive":
          return (
            <div className="flex flex-row gap-2 items-center">
              <Switch
                checked={advertise?.isPublish}
                onCheckedChange={(e) => handleAdvertise(e, advertise?.id)}
              />
              {advertise?.isPublish ? "Ya" : "Tidak"}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-start items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    <DotsYIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="lg:min-w-[150px] bg-black text-white shadow border">
                  {/* 
      <DropdownMenuItem asChild>
        <Link href={`/admin/advertise/detail/${article.id}`}>
          <EyeIconMdi className="inline mr-2 mb-1" />
          Detail
        </Link>
      </DropdownMenuItem> 
      */}

                  <DropdownMenuItem onClick={() => openModal(advertise.id)}>
                    <CreateIconIon className="inline mr-2 mb-1" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleDelete(advertise.id)}>
                    <DeleteIcon
                      color="red"
                      size={18}
                      className="inline ml-1 mr-2 mb-1"
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
    [article, props.triggerRefresh, refresh]
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

  return (
    <>
      <div className="py-3">
        <div className="flex flex-col items-start rounded-2xl gap-3">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-1 w-full lg:w-1/3">
              <p className="font-semibold text-sm">Pencarian</p>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground pointer-events-none" />
                <Input
                  aria-label="Search"
                  type="text"
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table className="rounded-3xl min-h-[50px] bg-white dark:bg-black border text-black dark:text-white">
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
                article.map((item: any) => (
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Advertise</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm">Judul</p>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="text"
                    id="title"
                    value={value}
                    onChange={onChange}
                    className="w-full border border-gray-300 dark:border-gray-400 rounded-lg"
                  />
                )}
              />
              {errors?.title && (
                <p className="text-red-400 text-sm">{errors.title?.message}</p>
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
                    className="w-full border border-gray-300 dark:border-gray-400 rounded-lg"
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
              <p className="text-sm">Link</p>
              <Controller
                control={control}
                name="url"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="text"
                    id="url"
                    value={value}
                    onChange={onChange}
                    className="w-full border border-gray-300 dark:border-gray-400 rounded-lg"
                  />
                )}
              />
              {errors?.url && (
                <p className="text-red-400 text-sm">{errors.url?.message}</p>
              )}
            </div>

            <p className="text-sm mt-3">Penempatan</p>
            <RadioGroup
              value={placement}
              onValueChange={setPlacement}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="banner" id="banner" />
                <label htmlFor="banner" className="text-sm">
                  Banner
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jumbotron" id="jumbotron" />
                <label htmlFor="jumbotron" className="text-sm">
                  Jumbotron
                </label>
              </div>
            </RadioGroup>

            <Controller
              control={control}
              name="file"
              render={({ field: { value } }) => (
                <div className="flex flex-col gap-1">
                  <p className="text-sm mt-3">Thumbnail</p>

                  {files.length < 1 && value === "" && (
                    <Fragment>
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <div className="w-full text-center border-dashed border border-gray-300 rounded-md py-[52px] flex items-center flex-col">
                          <CloudUploadIcon />
                          <h4 className="text-2xl font-medium mb-1 mt-3 text-gray-700">
                            Tarik file disini atau klik untuk upload.
                          </h4>
                          <div className="text-xs text-gray-500">
                            ( Upload file dengan format .jpg, .jpeg, atau .png.
                            Ukuran maksimal 100mb.)
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )}

                  {value !== "" && (
                    <div className="flex flex-row gap-2">
                      <Image
                        src={String(value)}
                        className="w-[30%]"
                        alt="thumbnail"
                        width={480}
                        height={480}
                      />
                      <Button
                        type="button"
                        onClick={() => setValue("file", "")}
                        variant="outline"
                        size="sm"
                      >
                        <TimesIcon />
                      </Button>
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="flex flex-row gap-2">
                      <img
                        src={URL.createObjectURL(files[0])}
                        className="w-[30%]"
                        alt="thumbnail"
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveFile(files[0])}
                        variant="outline"
                        size="sm"
                      >
                        <TimesIcon />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Tutup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
