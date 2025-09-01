"use client";

import { useCallback, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { close, error, loading } from "@/config/swal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { editCustomStaticPage, getCustomStaticDetail } from "@/service/static-page-service";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function StaticPageBuilderEdit() {
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const formOptions = {
    resolver: zodResolver(formSchema),
  };
  type UserSettingSchema = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<UserSettingSchema>(formOptions);

  useEffect(() => {
    initFetch();
  }, [id]);

  const initFetch = async () => {
    const res = await getCustomStaticDetail(id ? String(id) : "");
    const data = res?.data?.data;
    console.log("res", data);
    setValue("title", data?.title);
    setValue("slug", data?.slug);
    setValue("description", data?.description);
    setValue("htmlBody", addPreCode(data?.htmlBody));
  };

  const addPreCode = (htmlString: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const bodyContent = doc.body.innerHTML.trim();

    return `<pre><code class="language-html">${bodyContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  };

  const content = watch("htmlBody");
  const generatedPage = useCallback(() => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const textArea = document.createElement("textarea");
    textArea.innerHTML = sanitizedContent;

    return (
      <Card className="rounded-md border p-4">
        <div dangerouslySetInnerHTML={{ __html: textArea.value }} />
      </Card>
    );
  }, [content]);

  function createSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const request = {
      id: Number(id),
      title: values.title,
      slug: values.slug,
      description: values.description,
      htmlBody: values.htmlBody,
    };
    loading();
    const res = await editCustomStaticPage(request);

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
    <form className="flex flex-col gap-3 px-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <div className="w-full space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input type="text" id="title" placeholder="Title" value={value ?? ""} onChange={onChange} />
          </div>
        )}
      />
      {errors.title?.message && <p className="text-red-400 text-sm">{errors.title?.message}</p>}
      <Controller
        control={control}
        name="slug"
        render={({ field: { onChange, value } }) => (
          <div className="w-full space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug
            </Label>
            <Input type="text" id="slug" placeholder="Slug" value={value ?? ""} onChange={onChange} />
          </div>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Description"
          value={value ?? ""}
          onChange={onChange}
        />
      </div>}
      />
      {errors.description?.message && <p className="text-red-400 text-sm">{errors.description?.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          Editor
          <Controller control={control} name="htmlBody" render={({ field: { onChange, value } }) => <CustomEditor onChange={onChange} initialData={value} />} />
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
