"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { CloudUploadIcon, TimesIcon } from "@/components/icons";
import Image from "next/image";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import GenerateSingleArticleForm from "./generate-ai-single-form";
import { htmlToString } from "@/utils/global";
import { close, error, loading } from "@/config/swal";
import { useParams, useRouter } from "next/navigation";
import GetSeoScore from "./get-seo-score-form";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  deleteArticleFiles,
  getArticleByCategory,
  getArticleById,
  submitApproval,
  updateArticle,
  uploadArticleFile,
  uploadArticleThumbnail,
} from "@/service/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const ViewEditor = dynamic(
  () => {
    return import("@/components/editor/view-editor");
  },
  { ssr: false }
);
const CustomEditor = dynamic(
  () => {
    return import("@/components/editor/custom-editor");
  },
  { ssr: false }
);

interface FileWithPreview extends File {
  preview: string;
}

interface CategoryType {
  id: number;
  label: string;
  value: number;
}
const categorySchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.number(),
});

const createArticleSchema = z.object({
  title: z.string().min(2, {
    message: "Judul harus diisi",
  }),
  slug: z.string().min(2, {
    message: "Slug harus diisi",
  }),
  description: z.string().min(2, {
    message: "Deskripsi harus diisi",
  }),
  category: z.array(categorySchema).nonempty({
    message: "Kategori harus memiliki setidaknya satu item",
  }),
  tags: z.array(z.string()).nonempty({
    message: "Minimal 1 tag",
  }), // Array berisi string
});

interface DiseData {
  id: number;
  articleBody: string;
  title: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  mainKeyword: string;
  additionalKeywords: string;
}

export default function EditArticleForm(props: { isDetail: boolean }) {
  const { isDetail } = props;
  const params = useParams();
  const id = params?.id;
  const username = Cookies.get("username");
  const userId = Cookies.get("uie");
  const animatedComponents = makeAnimated();
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const editor = useRef(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [useAi, setUseAI] = useState(false);
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [tag, setTag] = useState("");
  const [detailfiles, setDetailFiles] = useState<any>([]);
  const [mainImage, setMainImage] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [diseId, setDiseId] = useState(0);
  const [thumbnailImg, setThumbnailImg] = useState<File[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<number | null>(
    null
  );
  const [thumbnailValidation, setThumbnailValidation] = useState("");
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onOpenChange = () => setIsOpen((prev) => !prev);
  const [approvalStatus, setApprovalStatus] = useState<number>(2);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [detailData, setDetailData] = useState<any>();
  const [startDateValue, setStartDateValue] = useState<any>(null);
  const [timeValue, setTimeValue] = useState("00:00");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => Object.assign(file)),
      ]);
    },
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  const formOptions = {
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", description: "", category: [], tags: [] },
  };
  type UserSettingSchema = z.infer<typeof createArticleSchema>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
  } = useForm<UserSettingSchema>(formOptions);

  useEffect(() => {
    initState();
  }, [listCategory]);

  async function initState() {
    loading();
    const res = await getArticleById(id);
    const data = res.data?.data;
    setDetailData(data);
    setValue("title", data?.title);
    setValue("slug", data?.slug);
    setValue("description", data?.htmlDescription);
    setValue("tags", data?.tags ? data.tags.split(",") : []);
    setThumbnail(data?.thumbnailUrl);
    setDiseId(data?.aiArticleId);
    setDetailFiles(data?.files);

    setupInitCategory(data?.categories);
    close();
  }

  const setupInitCategory = (data: any) => {
    const temp: CategoryType[] = [];
    for (let i = 0; i < data?.length; i++) {
      const datas = listCategory.filter((a) => a.id == data[i].id);
      if (datas[0]) {
        temp.push(datas[0]);
      }
    }
    setValue("category", temp as [CategoryType, ...CategoryType[]]);
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

  const onSubmit = async (values: z.infer<typeof createArticleSchema>) => {
    MySwal.fire({
      title: "Simpan Data",
      text: "",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Simpan",
    }).then((result) => {
      if (result.isConfirmed) {
        save(values);
      }
    });
  };

  const doPublish = async () => {
    MySwal.fire({
      title: "Publish Artikel?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        publish();
      }
    });
  };

  const publish = async () => {
    const response = await updateArticle(String(id), {
      id: Number(id),
      isPublish: true,
      title: detailData?.title,
      typeId: 1,
      slug: detailData?.slug,
      categoryIds: getValues("category")
        .map((val) => val.id)
        .join(","),
      tags: getValues("tags").join(","),
      description: htmlToString(getValues("description")),
      htmlDescription: getValues("description"),
    });

    if (response?.error) {
      error(response.message);
      return false;
    }
    successSubmit("/admin/article");
  };

  const save = async (values: z.infer<typeof createArticleSchema>) => {
    loading();
    const formData: any = {
      id: Number(id),
      title: values.title,
      typeId: 1,
      slug: values.slug,
      categoryIds: values.category.map((val) => val.id).join(","),
      tags: values.tags.join(","),
      description: htmlToString(values.description),
      htmlDescription: values.description,
      // createdAt: `${startDateValue} ${timeValue}:00`,
    };

    if (startDateValue && timeValue) {
      formData.createdAt = `${startDateValue} ${timeValue}:00`;
    }
    const response = await updateArticle(String(id), formData);

    if (response?.error) {
      error(response.message);
      return false;
    }

    const formFiles = new FormData();

    if (files?.length > 0) {
      for (const element of files) {
        formFiles.append("file", element);
        const resFile = await uploadArticleFile(String(id), formFiles);
      }
    }

    if (thumbnailImg?.length > 0) {
      const formFiles = new FormData();

      formFiles.append("files", thumbnailImg[0]);
      const resFile = await uploadArticleThumbnail(String(id), formFiles);
    }

    close();
    successSubmit("/admin/article");
  };

  function successSubmit(redirect: string) {
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(redirect);
      }
    });
  }

  const watchTitle = watch("title");
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    setValue("slug", generateSlug(watchTitle));
  }, [watchTitle]);

  const renderFilePreview = (file: FileWithPreview) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          alt={file.name}
          src={URL.createObjectURL(file)}
          className="h-[50px]"
        />
      );
    } else {
      return "Not Found";
    }
  };

  const handleRemoveFile = (file: FileWithPreview) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map((file) => (
    <div
      key={file.name}
      className=" flex justify-between border px-3.5 py-3 rounded-md"
    >
      <div className="flex gap-3 items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <div className=" text-sm  text-card-foreground">{file.name}</div>
          <div className=" text-xs font-light text-muted-foreground">
            {Math.round(file.size / 100) / 10 > 1000 ? (
              <>{(Math.round(file.size / 100) / 10000).toFixed(1)}</>
            ) : (
              <>{(Math.round(file.size / 100) / 10).toFixed(1)}</>
            )}
            {" kb"}
          </div>
        </div>
      </div>

      <Button
        className=" border-none rounded-full"
        variant="outline"
        onClick={() => handleRemoveFile(file)}
      >
        <TimesIcon />
      </Button>
    </div>
  ));

  const handleDeleteFile = (id: number) => {
    MySwal.fire({
      title: "Hapus File",
      text: "",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile(id);
      }
    });
  };

  const deleteFile = async (id: number) => {
    loading();
    const res = await deleteArticleFiles(id);

    if (res?.error) {
      error(res.message);
      return false;
    }
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setThumbnailImg(Array.from(selectedFiles));
    }
  };

  const approval = async () => {
    loading();
    const req = {
      articleId: Number(id),
      message: approvalMessage,
      statusId: approvalStatus,
    };
    const res = await submitApproval(req);

    if (res?.error) {
      error(res.message);
      return false;
    }
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

  const doApproval = () => {
    MySwal.fire({
      title: "Submit Data?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        approval();
      }
    });
  };

  return (
    <form
      className="flex flex-col lg:flex-row gap-8 text-black"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full lg:w-[65%] bg-white rounded-lg p-8 flex flex-col gap-1">
        {isDetail && <GetSeoScore id={String(diseId)} />}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Judul
              </label>
              <Input
                type="text"
                id="title"
                placeholder="Masukkan judul"
                value={value ?? ""}
                readOnly={isDetail}
                onChange={onChange}
                className="w-full border rounded-lg"
              />
            </div>
          )}
        />
        {errors?.title && (
          <p className="text-red-400 text-sm mb-3">{errors.title?.message}</p>
        )}
        <Controller
          control={control}
          name="slug"
          render={({ field: { onChange, value } }) => (
            <div className="w-full">
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug
              </label>
              <Input
                type="text"
                id="slug"
                placeholder="Masukkan slug"
                value={value ?? ""}
                onChange={onChange}
                className="w-full border rounded-lg dark:border-gray-400"
              />
            </div>
          )}
        />
        {errors?.slug && (
          <p className="text-red-400 text-sm mb-3">{errors.slug?.message}</p>
        )}

        {/* <Switch isSelected={useAi} onValueChange={setUseAI} className="mt-3">
          <p className="text-sm text-black">Bantuan AI</p>
        </Switch> */}

        {useAi && (
          <GenerateSingleArticleForm
            content={(data) => setValue("description", data?.articleBody)}
          />
        )}

        <p className="text-sm mt-3">Deskripsi</p>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) =>
            // <CustomEditor onChange={onChange} initialData={value} />
            // <JoditEditor
            //   ref={editor}
            //   value={value}
            //   onChange={onChange}
            //   config={{ readonly: isDetail }}
            //   className="dark:text-black"
            // />
            isDetail ? (
              <ViewEditor initialData={value} />
            ) : (
              <CustomEditor onChange={onChange} initialData={value} />
            )
          }
        />
        {errors?.description && (
          <p className="text-red-400 text-sm mb-3">
            {errors.description?.message}
          </p>
        )}

        <p className="text-sm mt-3">File Media</p>
        {!isDetail && (
          <Fragment>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <div className=" w-full text-center border-dashed border border-default-200 dark:border-default-300  rounded-md py-[52px] flex  items-center flex-col">
                <CloudUploadIcon size={50} className="text-gray-300" />
                <h4 className=" text-2xl font-medium mb-1 mt-3 text-card-foreground/80">
                  Tarik file disini atau klik untuk upload.
                </h4>
                <div className=" text-xs text-muted-foreground">
                  ( Upload file dengan format .jpg, .jpeg, atau .png. Ukuran
                  maksimal 100mb.)
                </div>
              </div>
            </div>
            {files.length ? (
              <Fragment>
                <div className="flex flex-col">{fileList}</div>
                <div className=" flex justify-between gap-2">
                  {/* <div className="flex flex-row items-center gap-3 py-3">
                  <Label>Gunakan Watermark</Label>
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked color="primary" id="c2" />
                  </div>
                </div> */}
                </div>
              </Fragment>
            ) : null}
          </Fragment>
        )}

        {isDetail ? (
          detailfiles ? (
            <>
              <div>
                <Image
                  alt="main"
                  width={720}
                  height={480}
                  src={
                    detailfiles[mainImage]?.file_url || "/default-avatar.png"
                  }
                  className="w-[75%] mx-auto"
                />
              </div>
              <div className="flex flex-row gap-2">
                {detailfiles?.map((file: any, index: number) => (
                  <a
                    key={index}
                    onClick={() => setMainImage(index)}
                    className="cursor-pointer"
                  >
                    <Image
                      width={480}
                      height={360}
                      alt={`image-${index}`}
                      src={file.file_url || "/default-avatar.png"}
                      className="h-[100px] object-cover w-[150px]"
                    />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <p>Belum Ada File</p>
          )
        ) : (
          <div className="flex flex-col">
            {detailfiles?.map((file: any, index: number) => (
              <div
                key={file?.file_name + index}
                className=" flex justify-between border px-3.5 py-3 rounded-md"
              >
                <div className="flex gap-3 items-center">
                  <div className="file-preview">
                    <Image
                      width={480}
                      height={360}
                      alt={`image-${index}`}
                      src={file?.file_url || "/default-avatar.png"}
                      className="h-[100px] object-cover w-[150px]"
                    />
                  </div>
                  <div>
                    <div className=" text-sm  text-card-foreground">
                      {file?.file_name}
                    </div>
                    <div className=" text-xs font-light text-muted-foreground">
                      {Math.round(file?.size / 100) / 10 > 1000 ? (
                        <>{(Math.round(file?.size / 100) / 10000).toFixed(1)}</>
                      ) : (
                        <>{(Math.round(file?.size / 100) / 10).toFixed(1)}</>
                      )}
                      {" kb"}
                    </div>
                  </div>
                </div>

                <Button
                  className=" border-none rounded-full"
                  variant="outline"
                  color="danger"
                  onClick={() => handleDeleteFile(file?.id)}
                >
                  <TimesIcon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full lg:w-[35%]  flex flex-col gap-8">
        <div className="h-fit bg-white rounded-lg p-8 flex flex-col gap-1">
          <p className="text-sm">Thubmnail</p>
          {isDetail ? (
            <Image
              width={480}
              height={360}
              src={thumbnail || "/default-avatar.png"}
              className="w-[30%]"
              alt="thumbnail"
            />
          ) : selectedMainImage && files.length >= selectedMainImage ? (
            <div className="flex flex-row">
              <Image
                width={480}
                height={360}
                src={
                  URL.createObjectURL(files[selectedMainImage - 1]) ||
                  "/default-avatar.png"
                }
                className="w-[30%]"
                alt="thumbnail"
              />
              <Button
                className=" border-none rounded-full"
                variant="outline"
                size="sm"
                color="danger"
                onClick={() => setSelectedMainImage(null)}
              >
                <TimesIcon />
              </Button>
            </div>
          ) : thumbnail !== "" ? (
            <div className="flex flex-row">
              <Image
                width={480}
                height={360}
                src={thumbnail || "/default-avatar.png"}
                className="w-[30%]"
                alt="thumbnail"
              />

              <Button
                className=" border-none rounded-full"
                variant="outline"
                size="sm"
                color="danger"
                onClick={() => setThumbnail("")}
              >
                <TimesIcon />
              </Button>
            </div>
          ) : thumbnailImg.length > 0 ? (
            <div className="flex flex-row">
              <Image
                width={480}
                height={360}
                src={
                  URL.createObjectURL(thumbnailImg[0]) || "/default-avatar.png"
                }
                className="w-[30%]"
                alt="thumbnail"
              />
              <Button
                className=" border-none rounded-full"
                variant="outline"
                size="sm"
                color="danger"
                onClick={() => setThumbnailImg([])}
              >
                <TimesIcon />
              </Button>
            </div>
          ) : (
            <>
              <input
                id="file-upload"
                type="file"
                multiple
                className="w-fit h-fit"
                accept="image/*"
                onChange={handleFileChange}
              />
              {thumbnailValidation !== "" && (
                <p className="text-red-400 text-sm mb-3">Thumbnail harus ada</p>
              )}
            </>
          )}
          <p className="text-sm mt-3">Kategori</p>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <ReactSelect
                className="basic-single text-black z-50"
                classNames={{
                  control: (state: any) =>
                    "!rounded-lg bg-white !border-1 !border-gray-200 dark:!border-stone-500",
                }}
                classNamePrefix="select"
                value={value}
                onChange={onChange}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isClearable={true}
                isSearchable={true}
                isDisabled={isDetail}
                isMulti={true}
                placeholder="Kategori..."
                name="sub-module"
                options={listCategory}
              />
            )}
          />
          {errors?.category && (
            <p className="text-red-400 text-sm mb-3">
              {errors.category?.message}
            </p>
          )}

          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, value } }) => (
              <div className="w-full">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium mb-1"
                >
                  Tags
                </label>

                {/* Tag Chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {value.map((item: string, index: number) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-full"
                    >
                      {item}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => {
                          const filteredTags = value.filter(
                            (tag: string) => tag !== item
                          );
                          if (filteredTags.length === 0) {
                            setError("tags", {
                              type: "manual",
                              message: "Tags tidak boleh kosong",
                            });
                          } else {
                            clearErrors("tags");
                            setValue(
                              "tags",
                              filteredTags as [string, ...string[]]
                            );
                          }
                        }}
                      />
                    </Badge>
                  ))}
                </div>

                {/* Input untuk menambah tag */}
                <Textarea
                  id="tags"
                  value={tag}
                  readOnly={isDetail}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (tag.trim() !== "") {
                        setValue("tags", [...value, tag.trim()]);
                        setTag("");
                        clearErrors("tags");
                      }
                    }
                  }}
                  placeholder="Tekan Enter untuk menambahkan tag"
                  className="w-full border rounded-lg dark:border-gray-400"
                />
              </div>
            )}
          />
          {errors?.tags && (
            <p className="text-red-400 text-sm  mb-3">{errors.tags?.message}</p>
          )}
          {!isDetail && username === "admin-mabes" && (
            <>
              <p className="text-sm">Ubah Waktu Pembuatan</p>
              <div className="flex flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-1/3 h-[30px] lg:h-[40px] border rounded-lg text-black"
                    >
                      {startDateValue
                        ? format(startDateValue, "dd-MM-yyyy")
                        : "-"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 bg-transparent border-none w-auto">
                    <Calendar
                      mode="single"
                      selected={startDateValue}
                      onSelect={setStartDateValue}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={timeValue ?? ""}
                  onChange={(e) => setTimeValue(e.target.value)}
                  className="w-fit border rounded-lg h-[30px] lg:h-[40px] dark:border-gray-400"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-row justify-end gap-3">
          {isDetail &&
            username === "admin-mabes" &&
            (detailData?.statusId === 1 || detailData?.statusId === null) && (
              <Button
                color="primary"
                type="button"
                onClick={() => {
                  setApprovalStatus(2);
                  onOpen();
                }}
              >
                Setujui
              </Button>
            )}
          {isDetail &&
            username === "admin-mabes" &&
            (detailData?.statusId === 1 || detailData?.statusId === null) && (
              <Button
                color="danger"
                type="button"
                onClick={() => {
                  setApprovalStatus(3);
                  onOpen();
                }}
              >
                Tolak
              </Button>
            )}
          {!isDetail && (
            <Button color="primary" type="submit">
              Simpan
            </Button>
          )}
          {isDetail &&
            detailData?.isPublish === false &&
            detailData?.statusId !== 1 &&
            Number(userId) === detailData?.createdById && (
              <Button type="button" color="primary" onClick={doPublish}>
                Publish
              </Button>
            )}
          {/* {!isDetail && (
            <Button color="success" type="button">
              <p className="text-white">Draft</p>
            </Button>
          )} */}

          <Link href="/admin/article">
            <Button color="danger" variant="outline" type="button">
              Kembali
            </Button>
          </Link>
        </div>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Approval</DialogTitle>
              </DialogHeader>

              <div className="py-2">
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      approvalStatus === 2 ? "text-primary" : "text-destructive"
                    }
                  >
                    {approvalStatus === 2 ? "Disetujui" : "Ditolak"}
                  </span>
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="approvalMessage"
                    className="block text-sm font-medium mb-1"
                  >
                    Pesan
                  </label>
                  <Textarea
                    id="approvalMessage"
                    placeholder="Masukkan pesan"
                    value={approvalMessage}
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    className="border rounded-lg dark:border-gray-400"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button onClick={doApproval}>Submit</Button>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => setApprovalMessage("")}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </form>
  );
}
