"use client";

import { useEffect, useState } from "react";
import { close, error, loading } from "@/config/swal";
import { delay } from "@/utils/global";
import GetSeoScore from "./get-seo-score-form";
import {
  generateDataArticle,
  getDetailArticle,
  getGenerateKeywords,
  getGenerateTitle,
} from "@/service/generate-article";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export default function GenerateSingleArticleForm(props: {
  content: (data: DiseData) => void;
}) {
  const [selectedWritingSyle, setSelectedWritingStyle] =
    useState("Informational");
  const [selectedArticleSize, setSelectedArticleSize] = useState("News");
  const [selectedLanguage, setSelectedLanguage] = useState("id");
  const [mainKeyword, setMainKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [additionalKeyword, setAdditionalKeyword] = useState("");
  const [articleIds, setArticleIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const generateAll = async (keyword: string | undefined) => {
    if (keyword) {
      generateTitle(keyword);
      generateKeywords(keyword);
    }
  };

  const generateTitle = async (keyword: string | undefined) => {
    if (keyword) {
      loading();
      const req = {
        keyword: keyword,
        style: selectedWritingSyle,
        website: "None",
        connectToWeb: true,
        lang: selectedLanguage,
        pointOfView: "None",
        clientId: "",
      };
      const res = await getGenerateTitle(req);
      const data = res?.data?.data;
      setTitle(data);
      close();
    }
  };

  const generateKeywords = async (keyword: string | undefined) => {
    if (keyword) {
      const req = {
        keyword: keyword,
        style: selectedWritingSyle,
        website: "None",
        connectToWeb: true,
        lang: selectedLanguage,
        pointOfView: "0",
        clientId: "",
      };
      loading();
      const res = await getGenerateKeywords(req);
      const data = res?.data?.data;
      setAdditionalKeyword(data);
      close();
    }
  };

  const onSubmit = async () => {
    loading();
    const request = {
      advConfig: "",
      style: selectedWritingSyle,
      website: "None",
      connectToWeb: true,
      lang: selectedLanguage,
      pointOfView: "None",
      title: title,
      imageSource: "Web",
      mainKeyword: mainKeyword,
      additionalKeywords: additionalKeyword,
      targetCountry: null,
      articleSize: selectedArticleSize,
      projectId: 2,
      createdBy: "123123",
      clientId: "humasClientIdtest",
    };
    const res = await generateDataArticle(request);
    close();
    if (res?.error) {
      error("Error");
    }
    setArticleIds([...articleIds, res?.data?.data?.id]);
    // props.articleId(res?.data?.data?.id);
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
          <Select
            value={selectedWritingSyle}
            onValueChange={(value) => {
              if (value !== "") setSelectedWritingStyle(value);
            }}
          >
            <SelectTrigger className="w-full border border-gray-300 dark:border-gray-400 rounded-lg text-black">
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
          <Select
            value={selectedArticleSize}
            onValueChange={(value) => {
              if (value !== "") setSelectedArticleSize(value);
            }}
          >
            <SelectTrigger className="w-full border border-gray-300 dark:border-gray-400 rounded-lg text-black">
              <SelectValue placeholder="Writing Style" />
            </SelectTrigger>
            <SelectContent>
              {articleSize.map((style) => (
                <SelectItem key={style.name} value={style.name}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select
            value={selectedLanguage}
            onValueChange={(value) => {
              if (value !== "") setSelectedLanguage(value);
            }}
          >
            <SelectTrigger className="w-full border border-gray-300 dark:border-gray-400 rounded-lg text-black">
              <SelectValue placeholder="Bahasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm">Main Keyword</p>
            <Button
              variant="default"
              size="sm"
              onClick={() => generateAll(mainKeyword)}
              disabled={isLoading} // tambahkan state kontrol loading
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process"
              )}
            </Button>
          </div>

          <Input
            type="text"
            id="mainKeyword"
            placeholder="Masukkan keyword utama"
            value={mainKeyword}
            onChange={(e) => setMainKeyword(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg dark:border-gray-400"
          />

          {mainKeyword == "" && (
            <p className="text-red-400 text-sm">Required</p>
          )}
          <div className="flex flex-row gap-2 items-center mt-3">
            <p className="text-sm">Title</p>
            <Button
              variant="default"
              size="sm"
              onClick={() => generateTitle(mainKeyword)}
              disabled={mainKeyword === ""}
            >
              Generate
            </Button>
          </div>

          <Input
            type="text"
            id="title"
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" // Custom styling using className
            aria-label="Title"
          />

          {/* {title == "" && <p className="text-red-400 text-sm">Required</p>} */}
          <div className="flex flex-row gap-2 items-center mt-2">
            <p className="text-sm">Additional Keyword</p>
            <Button
              className="text-sm"
              size="sm"
              onClick={() => generateKeywords(mainKeyword)}
              disabled={mainKeyword === ""}
            >
              Generate
            </Button>
          </div>

          <Input
            type="text"
            id="additionalKeyword"
            placeholder=""
            value={additionalKeyword}
            onChange={(e) => setAdditionalKeyword(e.target.value)}
            className="mt-1 border rounded-lg dark:bg-transparent dark:border-gray-400"
            aria-label="Additional Keyword"
          />

          {/* {additionalKeyword == "" && (
            <p className="text-red-400 text-sm">Required</p>
          )} */}
          {/* {articleIds.length < 3 && (
            <Button color="primary" className="my-5 w-full py-5 text-xs md:text-base" type="button" onPress={onSubmit} isDisabled={mainKeyword == "" || title == "" || additionalKeyword == ""}>
              Generate
            </Button>
          )} */}
          {articleIds.length < 3 && (
            <Button
              className="my-5 w-full py-5 text-xs md:text-base"
              type="button"
              onClick={onSubmit}
              disabled={
                mainKeyword === "" || title === "" || additionalKeyword === ""
              }
            >
              Generate
            </Button>
          )}
        </div>
        {articleIds.length > 0 && (
          <div className="flex flex-row gap-1 mt-2">
            {articleIds.map((id, index) => (
              <Button
                key={id}
                onClick={() => setSelectedId(id)}
                disabled={isLoading && selectedId === id}
                className={`
          ${
            selectedId === id
              ? isLoading
                ? "bg-yellow-500"
                : "bg-green-600"
              : "bg-gray-200"
          }
          text-sm px-4 py-2 rounded text-white transition-colors
        `}
              >
                Article {index + 1}
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
