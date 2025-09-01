"use client";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { CloudUploadIcon, TimesIcon } from "@/components/icons";
import Image from "next/image";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { htmlToString } from "@/utils/global";
import { close, error, loading, successToast } from "@/config/swal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createArticle,
  createArticleSchedule,
  getArticleByCategory,
  uploadArticleFile,
  uploadArticleThumbnail,
} from "@/service/article";
import {
  saveManualContext,
  updateManualArticle,
} from "@/service/generate-article";
import { getUserLevels } from "@/service/user-levels-service";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getCategoryById } from "@/service/master-categories";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GenerateSingleArticleForm from "./generate-ai-single-form";
import GenerateContentRewriteForm from "./generate-ai-content-rewrite-form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
  }),
});

export default function CreateArticleForm() {
  const userLevel = Cookies.get("ulne");
  const animatedComponents = makeAnimated();
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [useAi, setUseAI] = useState(false);
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [tag, setTag] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState<File[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<number | null>(
    null
  );
  const [thumbnailValidation, setThumbnailValidation] = useState("");
  const [filesValidation, setFileValidation] = useState("");
  const [diseData, setDiseData] = useState<DiseData>();
  const [selectedWritingType, setSelectedWritingType] = useState("single");
  const [status, setStatus] = useState<"publish" | "draft" | "scheduled">(
    "publish"
  );
  const [isScheduled, setIsScheduled] = useState(false);

  const [startDateValue, setStartDateValue] = useState<any>(null);

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
    if ((thumbnailImg.length < 1 && !selectedMainImage) || files.length < 1) {
      if (files.length < 1) {
        setFileValidation("Required");
      } else {
        setFileValidation("");
      }
      if (thumbnailImg.length < 1 && !selectedMainImage) {
        setThumbnailValidation("Required");
      } else {
        setThumbnailValidation("");
      }
    } else {
      setThumbnailValidation("");
      setFileValidation("");
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
    }
  };

  useEffect(() => {
    if (useAi === false) {
      setValue("description", "");
    }
  }, [useAi]);

  function removeImgTags(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(htmlString), "text/html");

    const images = doc.querySelectorAll("img");
    images.forEach((img) => img.remove());
    return doc.body.innerHTML;
  }

  const saveArticleToDise = async (
    values: z.infer<typeof createArticleSchema>
  ) => {
    if (useAi) {
      const request = {
        id: diseData?.id,
        title: values.title,
        articleBody: removeImgTags(values.description),
        metaDescription: diseData?.metaDescription,
        metaTitle: diseData?.metaTitle,
        mainKeyword: diseData?.mainKeyword,
        additionalKeywords: diseData?.additionalKeywords,
        createdBy: "345",
        style: "Informational",
        projectId: 2,
        clientId: "humasClientIdtest",
        lang: "id",
      };
      const res = await updateManualArticle(request);
      if (res.error) {
        error(res.message);
        return false;
      }

      return diseData?.id;
    } else {
      const request = {
        title: values.title,
        articleBody: removeImgTags(values.description),
        metaDescription: values.title,
        metaTitle: values.title,
        mainKeyword: values.title,
        additionalKeywords: values.title,
        createdBy: "345",
        style: "Informational",
        projectId: 2,
        clientId: "humasClientIdtest",
        lang: "id",
      };

      const res = await saveManualContext(request);
      if (res.error) {
        res.message;
        return 0;
      }
      return res?.data?.data?.id;
    }
  };

  const getUserLevelApprovalStatus = async () => {
    const res = await getUserLevels(String(userLevel));
    return res?.data?.data?.isApprovalActive;
  };

  const save = async (values: z.infer<typeof createArticleSchema>) => {
    loading();

    const userLevelStatus = await getUserLevelApprovalStatus();
    const formData = {
      title: values.title,
      typeId: 1,
      slug: values.slug,
      categoryIds: values.category.map((a) => a.id).join(","),
      tags: values.tags.join(","),
      description: htmlToString(removeImgTags(values.description)),
      htmlDescription: removeImgTags(values.description),
      aiArticleId: await saveArticleToDise(values),
      // isDraft: userLevelStatus ? true : status === "draft",
      // isPublish: userLevelStatus ? false : status === "publish",
      isDraft: status === "draft",
      isPublish: status === "publish",
    };

    const response = await createArticle(formData);

    if (response?.error) {
      error(response.message);
      return false;
    }
    const articleId = response?.data?.data?.id;

    if (files?.length > 0) {
      const formFiles = new FormData();

      for (const element of files) {
        formFiles.append("file", element);
        const resFile = await uploadArticleFile(articleId, formFiles);
      }
    }
    if (thumbnailImg?.length > 0 || files?.length > 0) {
      if (thumbnailImg?.length > 0) {
        const formFiles = new FormData();

        formFiles.append("files", thumbnailImg[0]);
        const resFile = await uploadArticleThumbnail(articleId, formFiles);
      } else {
        const formFiles = new FormData();

        if (selectedMainImage) {
          formFiles.append("files", files[selectedMainImage - 1]);

          const resFile = await uploadArticleThumbnail(articleId, formFiles);
        }
      }
    }

    if (status === "scheduled") {
      const request = {
        id: articleId,
        date: `${startDateValue?.year}-${startDateValue?.month}-${startDateValue?.day}`,
      };
      const res = await createArticleSchedule(request);
    }

    close();
    successSubmit("/admin/article", articleId, values.slug);
  };

  function successSubmit(redirect: string, id: number, slug: string) {
    const url =
      `${window.location.protocol}//${window.location.host}` +
      "/news/detail/" +
      `${id}-${slug}`;
    MySwal.fire({
      title: "Sukses",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(redirect);
        successToast("Article Url", url);
      } else {
        router.push(redirect);
        successToast("Article Url", url);
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
        <Image
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className=" rounded border p-0.5"
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

  const fileList = files.map((file, index) => (
    <div
      key={file.name}
      className=" flex justify-between border px-3.5 py-3 my-6 rounded-md"
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id={String(index)}
              value={String(index)}
              checked={selectedMainImage === index + 1}
              onCheckedChange={() => setSelectedMainImage(index + 1)}
            />
            <label htmlFor={String(index)} className="text-black text-xs">
              Jadikan Thumbnail
            </label>
          </div>
        </div>
      </div>

      <Button
        className="rounded-full"
        variant="ghost"
        onClick={() => handleRemoveFile(file)}
      >
        <TimesIcon />
      </Button>
    </div>
  ));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setThumbnailImg(Array.from(selectedFiles));
    }
  };

  const selectedCategory = watch("category");

  useEffect(() => {
    getDetailCategory();
  }, [selectedCategory]);

  const getDetailCategory = async () => {
    let temp = getValues("tags");
    for (const element of selectedCategory) {
      const res = await getCategoryById(element?.id);
      const tagList = res?.data?.data?.tags;
      if (tagList) {
        temp = [...temp, ...res?.data?.data?.tags];
      }
    }
    const uniqueArray = temp.filter(
      (item, index) => temp.indexOf(item) === index
    );

    setValue("tags", uniqueArray as [string, ...string[]]);
  };

  return (
    <form
      className="flex flex-col lg:flex-row gap-8 text-black"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full lg:w-[65%] bg-white rounded-lg p-8 flex flex-col gap-1">
        <p className="text-sm">Judul</p>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              id="title"
              type="text"
              placeholder="Masukkan judul artikel"
              className="w-full border rounded-lg dark:border-gray-400"
              {...field}
            />
          )}
        />

        {errors?.title && (
          <p className="text-red-400 text-sm mb-3">{errors.title?.message}</p>
        )}
        <p className="text-sm mt-3">Slug</p>
        <Controller
          control={control}
          name="slug"
          render={({ field }) => (
            <Input
              type="text"
              id="title"
              placeholder=""
              value={field.value ?? ""}
              onChange={field.onChange}
              className="w-full border rounded-lg dark:border-gray-400"
            />
          )}
        />

        {errors?.slug && (
          <p className="text-red-400 text-sm mb-3">{errors.slug?.message}</p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <Switch checked={useAi} onCheckedChange={setUseAI} />
          <p className="text-sm text-black">Bantuan AI</p>
        </div>

        {useAi && (
          <div className="flex flex-col gap-2">
            <Select
              value={selectedWritingType ?? ""}
              onValueChange={(value) => {
                if (value !== "") setSelectedWritingType(value);
              }}
            >
              <SelectTrigger className="w-full border rounded-lg text-black dark:border-gray-400">
                <SelectValue placeholder="Writing Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Article</SelectItem>
                <SelectItem value="rewrite">Content Rewrite</SelectItem>
              </SelectContent>
            </Select>
            {selectedWritingType === "single" ? (
              <GenerateSingleArticleForm
                content={(data) => {
                  setDiseData(data);
                  setValue(
                    "description",
                    data?.articleBody ? data?.articleBody : ""
                  );
                }}
              />
            ) : (
              <GenerateContentRewriteForm
                content={(data) => {
                  setDiseData(data);
                  setValue(
                    "description",
                    data?.articleBody ? data?.articleBody : ""
                  );
                }}
              />
            )}
          </div>
        )}

        <p className="text-sm mt-3">Deskripsi</p>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <CustomEditor onChange={onChange} initialData={value} />
          )}
        />
        {errors?.description && (
          <p className="text-red-400 text-sm mb-3">
            {errors.description?.message}
          </p>
        )}

        <p className="text-sm mt-3">File Media</p>
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
              <div>{fileList}</div>
              <div className="flex justify-between gap-2">
                <Button onClick={() => setFiles([])} size="sm">
                  Hapus Semua
                </Button>
              </div>
            </Fragment>
          ) : null}
        </Fragment>
        {filesValidation !== "" && files.length < 1 && (
          <p className="text-red-400 text-sm mb-3">Upload File Media</p>
        )}
      </div>
      <div className="w-full lg:w-[35%]  flex flex-col gap-8">
        <div className="h-fit bg-white rounded-lg p-8 flex flex-col gap-1">
          <p className="text-sm">Thubmnail</p>

          {selectedMainImage && files.length >= selectedMainImage ? (
            <div className="flex flex-row">
              <img
                src={URL.createObjectURL(files[selectedMainImage - 1])}
                className="w-[30%]"
                alt="thumbnail"
              />
              <Button
                className="border-none rounded-full"
                variant="outline"
                size="sm"
                onClick={() => setSelectedMainImage(null)}
              >
                <TimesIcon />
              </Button>
            </div>
          ) : thumbnailImg.length > 0 ? (
            <div className="flex flex-row">
              <img
                src={URL.createObjectURL(thumbnailImg[0])}
                className="w-[30%]"
                alt="thumbnail"
              />
              <Button
                className="border-none rounded-full"
                variant="outline"
                size="sm"
                onClick={() => setThumbnailImg([])}
              >
                <TimesIcon />
              </Button>
            </div>
          ) : (
            <>
              {/* <label htmlFor="file-upload">
                <button>Upload Thumbnail</button>
              </label>{" "} */}
              <input
                id="file-upload"
                type="file"
                multiple
                className="w-fit h-fit"
                accept="image/*"
                onChange={handleFileChange}
              />
              {thumbnailValidation !== "" && (
                <p className="text-red-400 text-sm mb-3">
                  Upload thumbnail atau pilih dari File Media
                </p>
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
                onChange={onChange}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isClearable={true}
                isSearchable={true}
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

          <p className="text-sm">Tags</p>
          {/* <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, value } }) => (
              <Textarea
                type="text"
                id="tags"
                placeholder=""
                label=""
                value={tag}
                onValueChange={setTag}
                startContent={
                  <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => (
                      <Chip
                        color="primary"
                        key={index}
                        className=""
                        onClose={() => {
                          const filteredTags = value.filter((tag) => tag !== item);
                          if (filteredTags.length === 0) {
                            setError("tags", {
                              type: "manual",
                              message: "Tags tidak boleh kosong",
                            });
                          } else {
                            clearErrors("tags");
                            setValue("tags", filteredTags as [string, ...string[]]);
                          }
                        }}
                      >
                        {item}
                      </Chip>
                    ))}
                  </div>
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (tag.trim() !== "") {
                      setValue("tags", [...value, tag.trim()]);
                      setTag("");
                      e.preventDefault();
                    }
                  }
                }}
                labelPlacement="outside"
                className="w-full h-fit"
                classNames={{
                  inputWrapper: ["border-1 rounded-lg", "dark:group-data-[focused=false]:bg-transparent !border-1 dark:!border-gray-400"],
                }}
                variant="bordered"
              />
            )}
          /> */}
          <Controller
            control={control}
            name="tags"
            render={({ field: { value } }) => (
              <div className="w-full">
                {/* Menampilkan tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {value.map((item: string, index: number) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 text-sm"
                      variant="secondary"
                    >
                      {item}
                      <button
                        type="button"
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
                        className="text-red-500 text-xs ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Textarea input */}
                <Textarea
                  id="tags"
                  placeholder="Tekan Enter untuk menambahkan tag"
                  value={tag ?? ""}
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
                  className="border rounded-lg"
                  aria-label="Tags Input"
                />
              </div>
            )}
          />
          {errors?.tags && (
            <p className="text-red-400 text-sm  mb-3">{errors.tags?.message}</p>
          )}
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-switch"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <label htmlFor="schedule-switch" className="text-black text-sm">
                Publish dengan Jadwal
              </label>
            </div>

            {/* {isScheduled && (
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-[140px] flex flex-col gal-2 ">
                  <p className="text-sm">Tanggal</p>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        type="button"
                        className="w-full !h-[30px] lg:h-[40px] border-1 rounded-lg text-black"
                        variant="outline"
                      >
                        {startDateValue
                          ? convertDateFormatNoTime(startDateValue)
                          : "-"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-transparent p-0">
                      <Calendar
                        selected={startDateValue}
                        onSelect={setStartDateValue}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )} */}
          </div>
        </div>

        <div className="flex flex-row justify-end gap-3">
          <Button
            color="primary"
            type="submit"
            disabled={isScheduled && startDateValue == null}
            onClick={() =>
              isScheduled ? setStatus("scheduled") : setStatus("publish")
            }
          >
            Publish
          </Button>
          <Button
            color="success"
            type="submit"
            onClick={() => setStatus("draft")}
          >
            <p className="text-white">Draft</p>
          </Button>

          <Link href="/admin/article">
            <Button variant="outline" type="button">
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
