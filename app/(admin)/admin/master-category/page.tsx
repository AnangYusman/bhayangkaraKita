"use client";
import { AddIcon, CloudUploadIcon, TimesIcon } from "@/components/icons";
import CategoriesTable from "@/components/table/master-categories/categories-table";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import { useDropzone } from "react-dropzone";
import { close, error, loading } from "@/config/swal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";

import { getArticleByCategory } from "@/service/article";
import {
  createCategory,
  uploadCategoryThumbnail,
} from "@/service/master-categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useDisclosure from "@/components/useDisclosure";

const createArticleSchema = z.object({
  title: z.string().min(2, {
    message: "Judul harus diisi",
  }),
  description: z.string().min(2, {
    message: "Deskripsi harus diisi",
  }),
  tags: z.array(z.string()),
  // parent: z.array(categorySchema).nonempty({
  //   message: "Kategori harus memiliki setidaknya satu item",
  // }),
  // tags: z.array(z.string()).nonempty({
  //   message: "Minimal 1 tag",
  // }),
});

interface CategoryType {
  id: number;
  label: string;
  value: number;
}

export default function MasterCategoryTable() {
  const MySwal = withReactContent(Swal);
  const animatedComponents = makeAnimated();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [tag, setTag] = useState("");
  const [selectedParent, setSelectedParent] = useState<any>();
  const [isDetail] = useState<any>();

  const formOptions = {
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", description: "", tags: [] },
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
    maxFiles: 1,
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
    console.log("values,", values);
    loading();
    const formData = {
      title: values.title,
      statusId: 1,
      parentId: selectedParent ? selectedParent.id : 0,
      tags: values.tags.join(","),
      description: values.description,
    };

    const response = await createCategory(formData);

    if (response?.error) {
      error(response.message);
      return false;
    }
    const categoryId = response?.data?.data?.id;
    const formFiles = new FormData();

    formFiles.append("files", files[0]);
    const resFile = await uploadCategoryThumbnail(categoryId, formFiles);
    if (resFile?.error) {
      error(resFile.message);
      return false;
    }
    close();
    setRefresh(!refresh);
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
    <div className="overflow-x-hidden overflow-y-scroll">
      <div className="px-2 md:px-4 md:py-4 w-full">
        <div className="bg-white shadow-lg dark:bg-[#18181b] rounded-xl p-3">
          <Button
            size="default"
            className="bg-[#F07C00] text-white w-full lg:w-fit flex items-center gap-2"
            onClick={onOpen}
          >
            Tambah Kategori
            <AddIcon />
          </Button>
          <CategoriesTable triggerRefresh={refresh} />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Kategori Baru</DialogTitle>
          </DialogHeader>
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
                    value={value}
                    onChange={onChange}
                    readOnly={isDetail}
                    className="w-full border rounded-lg"
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
                    readOnly={isDetail}
                    className="w-full border rounded-lg"
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
                className="basic-single text-black z-50"
                classNames={{
                  control: () =>
                    "!rounded-lg bg-white !border !border-gray-200 dark:!border-stone-500",
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
                  <Input
                    id="tags"
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
                    className="w-full border rounded-lg"
                  />
                )}
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {getValues("tags")?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => {
                        const filteredTags = getValues("tags").filter(
                          (tag) => tag !== item
                        );
                        if (filteredTags.length === 0) {
                          setError("tags", {
                            type: "manual",
                            message: "Tags tidak boleh kosong",
                          });
                        } else {
                          clearErrors("tags");
                          setValue("tags", filteredTags);
                        }
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm mt-3">Thumbnail</p>
              {files.length < 1 && (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <div className="w-full text-center border-dashed border rounded-md py-[52px] flex flex-col items-center">
                    <CloudUploadIcon />
                    <h4 className="text-2xl font-medium mb-1 mt-3 text-muted-foreground">
                      Tarik file disini atau klik untuk upload.
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      ( Upload file dengan format .jpg, .jpeg, atau .png. Ukuran
                      maksimal 100mb.)
                    </div>
                  </div>
                </div>
              )}
              {files.length > 0 && (
                <div className="flex flex-row gap-2">
                  <Image
                    src={URL.createObjectURL(files[0])}
                    className="w-[30%]"
                    alt="thumbnail"
                    width={480}
                    height={480}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveFile(files[0])}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter className="self-end">
              {!isDetail && <Button type="submit">Simpan</Button>}
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
