"use client";

import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { close, error, loading } from "@/config/swal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import { Card } from "@/components/ui/card";
import { createCustomStaticPage } from "@/service/static-page-service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CustomEditor = dynamic(
  () => {
    return import("@/components/editor/custom-editor");
  },
  { ssr: false }
);

const formSchema = z.object({
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Main Keyword must be at least 2 characters.",
  }),
  htmlBody: z.string().min(2, {
    message: "Main Keyword must be at least 2 characters.",
  }),
});

export default function StaticPageBuilder() {
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const formOptions = {
    resolver: zodResolver(formSchema),
  };
  type UserSettingSchema = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserSettingSchema>(formOptions);

  const content = watch("htmlBody");
  const generatedPage = useCallback(() => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const textArea = document.createElement("textarea");
    textArea.innerHTML = sanitizedContent;
    return (
      <Card className="rounded-md border p-4">
        {/* <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} /> */}
        <div dangerouslySetInnerHTML={{ __html: textArea.value }} />
      </Card>
    );
  }, [content]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const request = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      htmlBody: values.htmlBody,
    };
    loading();
    const res = await createCustomStaticPage(request);

    if (res?.error) {
      error(res.message);
      return false;
    }
    close();

    successSubmit("/admin/static-page");
  };

  function successSubmit(redirect: any) {
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
  // const title = watch("title");
  // useEffect(() => {
  //   if (getValues("title")) {
  //     setValue("slug", createSlug(getValues("title")));
  //   }
  // }, [title]);

  return (
    <form
      className="flex flex-col gap-3 px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <div className="w-full space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={value ?? ""}
              onChange={onChange}
            />
          </div>
        )}
      />
      {errors.title?.message && (
        <p className="text-red-400 text-sm">{errors.title?.message}</p>
      )}
      <Controller
        control={control}
        name="slug"
        render={({ field: { onChange, value } }) => (
          <div className="w-full space-y-1">
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              id="slug"
              placeholder="Slug"
              value={value ?? ""}
              onChange={onChange}
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <div className="w-full space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              value={value}
              onChange={onChange}
            />
          </div>
        )}
      />
      {errors.description?.message && (
        <p className="text-red-400 text-sm">{errors.description?.message}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          Editor
          <Controller
            control={control}
            name="htmlBody"
            render={({ field: { onChange, value } }) => (
              // <Textarea
              //   variant="bordered"
              //   label=""
              //   labelPlacement="outside"
              //   placeholder=""
              //   className="max-h-[80vh]"
              //   classNames={{
              //     mainWrapper: "h-[80vh] overflow-hidden",
              //     innerWrapper: "h-[80vh] overflow-hidden",
              //     input: "min-h-full",
              //     inputWrapper: "h-full",
              //   }}
              //   value={value}
              //   onChange={onChange}
              //   disableAutosize={false}
              // />
              <CustomEditor onChange={onChange} initialData={value} />
            )}
          />
        </div>
        <div className="px-4 flex flex-col gap-2">
          Preview
          {generatedPage()}
        </div>
      </div>
      <div className="flex justify-end w-full">
        <Button type="submit" color="primary" className="w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
