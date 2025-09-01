"use client";
import { getStatisticMonthly } from "@/service/article";
import React, { useEffect, useState } from "react";
import { SafeReactApexChart } from "@/utils/dynamic-import";

type WeekData = {
  week: number;
  days: number[];
  total: number;
};

type RemainingDays = {
  days: number[];
  total: number;
};

function processMonthlyData(count: number[]): {
  weeks: WeekData[];
  remaining_days: RemainingDays;
} {
  const weeks: WeekData[] = [];
  let weekIndex = 1;

  for (let i = 0; i < count.length; i += 7) {
    const weekData = count.slice(i, i + 7);
    weeks.push({
      week: weekIndex,
      days: weekData,
      total: weekData.reduce((sum, day) => sum + day, 0),
    });
    weekIndex++;
  }

  const remainingDays: RemainingDays = {
    days: count.length % 7 === 0 ? [] : count.slice(-count.length % 7),
    total: count.slice(-count.length % 7).reduce((sum, day) => sum + day, 0),
  };

  return {
    weeks,
    remaining_days: remainingDays,
  };
}

const ApexChartColumn = (props: {
  type: string;
  date: string;
  view: string[];
}) => {
  const { date, type, view } = props;
  const [categories, setCategories] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [seriesComment, setSeriesComment] = useState<number[]>([]);
  const [seriesView, setSeriesView] = useState<number[]>([]);
  const [seriesShare, setSeriesShare] = useState<number[]>([]);

  useEffect(() => {
    initFetch();
  }, [date, type, view]);

  const initFetch = async () => {
    const splitDate = date.split(" ");

    const res = await getStatisticMonthly(splitDate[1]);
    const data = res?.data?.data;
    const getDatas = data?.find(
      (a: any) =>
        a.month == Number(splitDate[0]) && a.year === Number(splitDate[1])
    );
    if (getDatas) {
      const temp1 = processMonthlyData(getDatas?.comment);
      const temp2 = processMonthlyData(getDatas?.view);
      const temp3 = processMonthlyData(getDatas?.share);

      if (type == "weekly") {
        setSeriesComment(
          temp1.weeks.map((list) => {
            return list.total;
          })
        );
        setSeriesView(
          temp2.weeks.map((list) => {
            return list.total;
          })
        );
        setSeriesShare(
          temp3.weeks.map((list) => {
            return list.total;
          })
        );
      } else {
        setSeriesComment(getDatas.comment);
        setSeriesView(getDatas.view);
        setSeriesShare(getDatas.share);
      }
      if (type === "weekly") {
        const category = [];
        for (let i = 1; i <= temp1.weeks.length; i++) {
          category.push(`Week ${i}`);
        }
        setCategories(category);
      }
    } else {
      setSeriesComment([]);
    }
  };

  useEffect(() => {
    const temp = [
      {
        name: "Comment",
        data: view.includes("comment") ? seriesComment : [],
      },
      {
        name: "View",
        data: view.includes("view") ? seriesView : [],
      },
      {
        name: "Share",
        data: view.includes("share") ? seriesShare : [],
      },
    ];

    console.log("temp", temp);

    setSeries(temp);
  }, [view, seriesShare, seriesView, seriesComment]);

  return (
    <div className="h-full">
      <div id="chart" className="h-full">
        <SafeReactApexChart
          options={{
            chart: {
              height: "100%",
              type: "area",
            },
            stroke: {
              curve: "smooth",
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: type == "weekly" ? categories : [],
            },
          }}
          series={series}
          type="area"
          height="100%"
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChartColumn;
