"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { close, error, loading } from "@/config/swal";
import { delay } from "@/utils/global";
import dynamic from "next/dynamic";
import GetSeoScore from "./get-seo-score-form";
import {
  getDetailArticle,
  getGenerateRewriter,
} from "@/service/generate-article";
import { Button } from "@/components/ui/button";

const CustomEditor = dynamic(
  () => {
    return import("@/components/editor/custom-editor");
  },
  { ssr: false }
);

const writingStyle = [
  {
    id: 1,
    name: "Friendly",
  },
  {
    id: 1,
    name: "Professional",
  },
  {
    id: 3,
    name: "Informational",
  },
  {
    id: 4,
    name: "Neutral",
  },
  {
    id: 5,
    name: "Witty",
  },
];

const articleSize = [
  {
    id: 1,
    name: "News (300 - 900 words)",
    value: "News",
  },
  {
    id: 2,
    name: "Info (900 - 2000 words)",
    value: "Info",
  },
  {
    id: 3,
    name: "Detail (2000 - 5000 words)",
    value: "Detail",
  },
];

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

export default function GenerateContentRewriteForm(props: {
  content: (data: DiseData) => void;
}) {
  const [selectedWritingSyle, setSelectedWritingStyle] =
    useState("Informational");
  const [selectedArticleSize, setSelectedArticleSize] = useState("News");
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [mainKeyword, setMainKeyword] = useState("");
  const [articleIds, setArticleIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const onSubmit = async () => {
    loading();
    const request = {
      advConfig: "",
      context: mainKeyword,
      style: selectedWritingSyle,
      sentiment: "Informational",
      urlContext: null,
      contextType: "article",
      lang: selectedLanguage,
      createdBy: "123123",
      clientId: "humasClientIdtest",
    };
    const res = await getGenerateRewriter(request);
    close();
    if (res?.error) {
      error("Error");
    }
    setArticleIds([...articleIds, res?.data?.data?.id]);
  };

  useEffect(() => {
    getArticleDetail();
  }, [selectedId]);

  const checkArticleStatus = async (data: string | null) => {
    if (data === null) {
      delay(7000).then(() => {
        getArticleDetail();
      });
    }
  };

  const getArticleDetail = async () => {
    if (selectedId) {
      const res = await getDetailArticle(selectedId);
      const data = res?.data?.data;
      checkArticleStatus(data?.articleBody);
      if (data?.articleBody !== null) {
        setIsLoading(false);
        props.content(data);
      } else {
        setIsLoading(true);
        props.content({
          id: data?.id,
          articleBody: "",
          title: "",
          metaTitle: "",
          description: "",
          metaDescription: "",
          additionalKeywords: "",
          mainKeyword: "",
        });
      }
    }
  };

  return (
    <fieldset>
      <form className="flex flex-col w-full mt-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {/* <Select
            label="Writing Style"
            variant="bordered"
            labelPlacement="outside"
            placeholder=""
            selectedKeys={[selectedWritingSyle]}
            onChange={(e) =>
              e.target.value !== ""
                ? setSelectedWritingStyle(e.target.value)
                : ""
            }
            className="w-full"
            classNames={{
              label: "!text-black",
              value: "!text-black",
              trigger: [
                "border-1 rounded-lg",
                "dark:group-data-[focused=false]:bg-transparent !border-1 dark:!border-gray-400",
              ],
            }}
          >
            <SelectSection>
              {writingStyle.map((style) => (
                <SelectItem key={style.name}>{style.name}</SelectItem>
              ))}
            </SelectSection>
          </Select> */}
          <div className="w-full space-y-1">
            <label className="text-sm font-medium text-black dark:text-white">
              Writing Style
            </label>
            <Select
              value={selectedWritingSyle}
              onValueChange={(value) => setSelectedWritingStyle(value)}
            >
              <SelectTrigger className="w-full border rounded-lg text-black dark:border-gray-400">
                <SelectValue placeholder="Writing Style" />
              </SelectTrigger>
              <SelectContent>
                {writingStyle.map((style) => (
                  <SelectItem key={style.name} value={style.name}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <Select
            label="Article Size"
            variant="bordered"
            labelPlacement="outside"
            placeholder=""
            selectedKeys={[selectedArticleSize]}
            onChange={(e) => (e.target.value !== "" ? setSelectedArticleSize(e.target.value) : "")}
            className="w-full"
            classNames={{
              label: "!text-black",
              value: "!text-black",
              trigger: ["border-1 rounded-lg", "dark:group-data-[focused=false]:bg-transparent !border-1 dark:!border-gray-400"],
            }}
          >
            <SelectSection>
              {articleSize.map((size) => (
                <SelectItem key={size.value}>{size.name}</SelectItem>
              ))}
            </SelectSection>
          </Select> */}
          <div className="w-full space-y-1">
            <label className="text-sm font-medium text-black dark:text-white">
              Article Size
            </label>
            <Select
              value={selectedArticleSize}
              onValueChange={(value) => setSelectedArticleSize(value)}
            >
              <SelectTrigger className="w-full border rounded-lg text-black dark:border-gray-400">
                <SelectValue placeholder="Writing Style" />
              </SelectTrigger>
              <SelectContent>
                {articleSize.map((size) => (
                  <SelectItem key={size.name} value={size.name}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <Select
            label="Bahasa"
            variant="bordered"
            labelPlacement="outside"
            placeholder=""
            selectedKeys={[selectedLanguage]}
            onChange={(e) => (e.target.value !== "" ? setSelectedLanguage(e.target.value) : "")}
            className="w-full"
            classNames={{
              label: "!text-black",
              value: "!text-black",
              trigger: ["border-1 rounded-lg", "dark:group-data-[focused=false]:bg-transparent !border-1 dark:!border-gray-400"],
            }}
          >
            <SelectSection>
              <SelectItem key="id">Indonesia</SelectItem>
              <SelectItem key="en">English</SelectItem>
            </SelectSection>
          </Select> */}
          <div className="w-full space-y-1">
            <label className="text-sm font-medium text-black dark:text-white">
              Language
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value)}
            >
              <SelectTrigger className="w-full border rounded-lg text-black dark:border-gray-400">
                <SelectValue placeholder="Writing Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm">Text</p>
          </div>
          <div className="w-[78vw] lg:w-full">
            <CustomEditor onChange={setMainKeyword} initialData={mainKeyword} />
          </div>
          {mainKeyword == "" && (
            <p className="text-red-400 text-sm">Required</p>
          )}
          {/* {articleIds.length < 3 && (
            <Button color="primary" className="my-5 w-full py-5 text-xs md:text-base" type="button" onPress={onSubmit} isDisabled={mainKeyword == ""}>
              Generate
            </Button>
          )} */}
          {articleIds.length < 3 && (
            <Button
              onClick={onSubmit}
              type="button"
              disabled={mainKeyword === ""}
              className="my-5 w-full py-5 text-xs md:text-base"
            >
              Generate
            </Button>
          )}
        </div>
        {articleIds.length > 0 && (
          <div className="flex flex-row gap-1 mt-2">
            {/* {articleIds?.map((id, index) => (
              <Button onPress={() => setSelectedId(id)} key={id} isLoading={isLoading && selectedId == id} color={selectedId == id && isLoading ? "warning" : selectedId == id ? "success" : "default"}>
                <p className={selectedId == id ? "text-white" : "text-black"}>Article {index + 1}</p>
              </Button>
            ))} */}
            {articleIds?.map((id, index) => (
              <Button
                key={id}
                onClick={() => setSelectedId(id)}
                disabled={isLoading && selectedId === id}
                variant={
                  selectedId === id
                    ? isLoading
                      ? "secondary"
                      : "default"
                    : "outline"
                }
                className={
                  selectedId === id ? "bg-green-600 text-white" : "text-black"
                }
              >
                {isLoading && selectedId === id
                  ? "Loading..."
                  : `Article ${index + 1}`}
              </Button>
            ))}
          </div>
        )}
        {!isLoading && (
          <div>
            <GetSeoScore id={String(selectedId)} />
          </div>
        )}
      </form>
    </fieldset>
  );
}
