"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CustomCircularProgress } from "@/components/layout/costum-circular-progress";
import { getSeoScore } from "@/service/generate-article";
import { useEffect, useState } from "react";

export default function GetSeoScore(props: { id: string }) {
  useEffect(() => {
    fetchSeoScore();
  }, [props.id]);

  const [totalScoreSEO, setTotalScoreSEO] = useState();
  const [errorSEO, setErrorSEO] = useState<any>([]);
  const [warningSEO, setWarningSEO] = useState<any>([]);
  const [optimizedSEO, setOptimizedSEO] = useState<any>([]);

  const fetchSeoScore = async () => {
    const res = await getSeoScore(props?.id);
    if (res.error) {
      // error(res.message);
      return false;
    }
    setTotalScoreSEO(res.data.data?.seo_analysis?.score || 0);
    const errorList: any[] = [
      ...res.data.data?.seo_analysis?.analysis?.keyword_optimization?.error,
      ...res.data.data?.seo_analysis?.analysis?.content_quality?.error,
    ];
    setErrorSEO(errorList);
    const warningList: any[] = [
      ...res.data.data?.seo_analysis?.analysis?.keyword_optimization?.warning,
      ...res.data.data?.seo_analysis?.analysis?.content_quality?.warning,
    ];
    setWarningSEO(warningList);
    const optimizedList: any[] = [
      ...res.data.data?.seo_analysis?.analysis?.keyword_optimization?.optimized,
      ...res.data.data?.seo_analysis?.analysis?.content_quality?.optimized,
    ];
    setOptimizedSEO(optimizedList);
  };
  return (
    <div className="overflow-y-auto my-2">
      <div className="text-black flex flex-col rounded-md gap-3">
        <p className="font-semibold text-lg"> SEO Score</p>
        {totalScoreSEO ? (
          <div className="flex flex-row gap-5 w-full">
            {/* <CircularProgress
              aria-label=""
              color="warning"
              showValueLabel={true}
              size="lg"
              value={Number(totalScoreSEO) * 100}
            /> */}
            <CustomCircularProgress value={Number(totalScoreSEO) * 100} />
            <div>
              {/* <ApexChartDonut value={Number(totalScoreSEO) * 100} /> */}
            </div>
            <div className="flex flex-row gap-5">
              <div className="px-2 py-1 border radius-md flex flex-row gap-2 items-center border-red-500 rounded-lg">
                {/* <TimesIcon size={15} className="text-danger" /> */}
                Error : {errorSEO.length || 0}
              </div>
              <div className="px-2 py-1 border radius-md flex flex-row gap-2 items-center border-yellow-500 rounded-lg">
                {/* <p className="text-warning w-[15px] h-[15px] text-center mt-[-10px]">
              !
            </p> */}
                Warning : {warningSEO.length || 0}
              </div>
              <div className="px-2 py-1 border radius-md flex flex-row gap-2 items-center border-green-500 rounded-lg">
                {/* <CheckIcon size={15} className="text-success" /> */}
                Optimize : {optimizedSEO.length || 0}
              </div>
            </div>
          </div>
        ) : (
          "Belum ada Data"
        )}
        {totalScoreSEO && (
          // <Accordion
          //   variant="splitted"
          //   itemClasses={{
          //     base: "!bg-transparent",
          //     title: "text-black",
          //   }}
          // >
          //   <AccordionItem
          //     key="1"
          //     aria-label="Error"
          //     // startContent={<TimesIcon size={20} className="text-danger" />}
          //     title={`${errorSEO?.length || 0} Errors`}
          //   >
          //     <div className="flex flex-col gap-2">
          //       {errorSEO?.map((item: any) => (
          //         <p key={item} className="w-full border border-red-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3">
          //           {item}
          //         </p>
          //       ))}
          //     </div>
          //   </AccordionItem>
          //   <AccordionItem
          //     key="2"
          //     aria-label="Warning"
          //     // startContent={
          //     //   <p className="text-warning w-[20px] h-[20px] text-center mt-[-10px]">
          //     //     !
          //     //   </p>
          //     // }
          //     title={`${warningSEO?.length || 0} Warnings`}
          //   >
          //     <div className="flex flex-col gap-2">
          //       {warningSEO?.map((item: any) => (
          //         <p key={item} className="w-full border border-yellow-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3">
          //           {item}
          //         </p>
          //       ))}
          //     </div>
          //   </AccordionItem>
          //   <AccordionItem
          //     key="3"
          //     aria-label="Optimized"
          //     // startContent={<CheckIcon size={20} className="text-success" />}
          //     title={`${optimizedSEO?.length || 0} Optimized`}
          //   >
          //     <div className="flex flex-col gap-2">
          //       {optimizedSEO?.map((item: any) => (
          //         <p key={item} className="w-full border border-green-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3">
          //           {item}
          //         </p>
          //       ))}
          //     </div>
          //   </AccordionItem>
          // </Accordion>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="error">
              <AccordionTrigger className="text-black">{`${
                errorSEO?.length || 0
              } Errors`}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {errorSEO?.map((item: any) => (
                    <p
                      key={item}
                      className="w-full border border-red-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="warning">
              <AccordionTrigger className="text-black">{`${
                warningSEO?.length || 0
              } Warnings`}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {warningSEO?.map((item: any) => (
                    <p
                      key={item}
                      className="w-full border border-yellow-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="optimized">
              <AccordionTrigger className="text-black">{`${
                optimizedSEO?.length || 0
              } Optimized`}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  {optimizedSEO?.map((item: any) => (
                    <p
                      key={item}
                      className="w-full border border-green-500 rounded-md h-[40px] text-left flex flex-col justify-center px-3"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}
