"use client";

import AdvertiseTable from "@/components/table/advertise/advertise-table";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDropzone } from "react-dropzone";
import { close, error, loading } from "@/config/swal";

import {
  createAdvertise,
  createMediaFileAdvertise,
} from "@/service/advertisement";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddIcon, CloudUploadIcon, TimesIcon } from "@/components/icons";
import useDisclosure from "@/components/useDisclosure";

const createArticleSchema = z.object({
  title: z.string().min(2, {
    message: "Judul harus diisi",
  }),
  url: z.string().min(1, {
    message: "Link harus diisi",
  }),
  description: z.string().min(2, {
    message: "Deskripsi harus diisi",
  }),
});

export default function AdvertisePage() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const MySwal = withReactContent(Swal);

  const [refresh, setRefresh] = useState(false);
  const [placement, setPlacement] = useState("banner");

  const [files, setFiles] = useState<File[]>([]);

  const formOptions = {
    resolver: zodResolver(createArticleSchema),
    defaultValues: { title: "", description: "", url: "" },
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file)));
    },
    maxFiles: 1,
    accept:
      placement === "banner"
        ? {
            "image/*": [],
            "video/*": [],
          }
        : { "image/*": [] },
  });
  type UserSettingSchema = z.infer<typeof createArticleSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSettingSchema>(formOptions);

  const onSubmit = async (values: z.infer<typeof createArticleSchema>) => {
    loading();

    const payload = {
      Title: values.title,
      Description: values.description,
      Placement: placement,
      RedirectLink: values.url,
    };

    const res = await createAdvertise(payload);

    if (res?.error) {
      error(res?.message);
      return false;
    }

    const idNow = res?.data?.data?.id;

    if (files.length > 0 && idNow) {
      const formFiles = new FormData();
      formFiles.append("file", files[0]);
      const resFile = await createMediaFileAdvertise(idNow, formFiles);

      if (resFile?.error) {
        error(resFile?.message);
        return false;
      }
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
            className="bg-[#F07C00] text-white w-full lg:w-fit"
            onClick={onOpen}
          >
            Buat Baru
            <AddIcon />
          </Button>
          <AdvertiseTable triggerRefresh={refresh} />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
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
                    id="title"
                    value={value}
                    onChange={onChange}
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
              <p className="text-sm">Link</p>
              <Controller
                control={control}
                name="url"
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="url"
                    value={value}
                    onChange={onChange}
                    className="w-full border rounded-lg"
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
                <Label htmlFor="banner">Banner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jumbotron" id="jumbotron" />
                <Label htmlFor="jumbotron">Jumbotron</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-col gap-1">
              <p className="text-sm mt-3">Thumbnail</p>
              {files.length < 1 && (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
                    <CloudUploadIcon />
                    <h4 className="text-2xl font-medium mb-1 mt-3 text-card-foreground/80">
                      Tarik file disini atau klik untuk upload.
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      (Upload file dengan format .jpg, .jpeg, atau .png. Ukuran
                      maksimal 100mb.)
                    </div>
                  </div>
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
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFile(files[0])}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit">Simpan</Button>
              <Button variant="ghost" onClick={onClose}>
                Tutup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
