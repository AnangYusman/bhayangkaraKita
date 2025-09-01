"use client";

import {
  DashboardCommentIcon,
  DashboardConnectIcon,
  DashboardShareIcon,
  DashboardSpeecIcon,
  DashboardUserIcon,
} from "@/components/icons/dashboard-icon";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getListArticle,
  getStatisticSummary,
  getTopArticles,
  getUserLevelDataStat,
} from "@/service/article";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  convertDateFormat,
  convertDateFormatNoTime,
  textEllipsis,
} from "@/utils/global";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/components/ui/checkbox";
import ApexChartColumn from "@/components/main/dashboard/chart/column-chart";
import CustomPagination from "@/components/layout/custom-pagination";
import { motion } from "framer-motion";
import { Article } from "@/types/globals";

type ArticleData = Article & {
  no: number;
  createdAt: string;
};

interface TopPages {
  id: number;
  no: number;
  title: string;
  viewCount: number;
}

interface PostCount {
  userLevelId: number;
  no: number;
  userLevelName: string;
  totalArticle: number;
}

export default function DashboardContainer() {
  const username = Cookies.get("username");
  const fullname = Cookies.get("ufne");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [topPagesTotalPage, setTopPagesTotalPage] = useState(1);
  const [article, setArticle] = useState<ArticleData[]>([]);
  // const [analyticsView, setAnalyticView] = useState<string[]>(["comment", "view", "share"]);
  // const [startDateValue, setStartDateValue] = useState(parseDate(convertDateFormatNoTimeV2(new Date())));
  // const [postContentDate, setPostContentDate] = useState({
  //   startDate: parseDate(convertDateFormatNoTimeV2(new Date(new Date().setDate(new Date().getDate() - 7)))),
  //   endDate: parseDate(convertDateFormatNoTimeV2(new Date())),
  // });

  const [startDateValue, setStartDateValue] = useState(new Date());
  const [analyticsView, setAnalyticView] = useState<string[]>([]);
  const options = [
    { label: "Comment", value: "comment" },
    { label: "View", value: "view" },
    { label: "Share", value: "share" },
  ];
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      setAnalyticView([...analyticsView, value]);
    } else {
      setAnalyticView(analyticsView.filter((v) => v !== value));
    }
  };
  const [postContentDate, setPostContentDate] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [typeDate, setTypeDate] = useState("monthly");
  const [summary, setSummary] = useState<any>();

  const [topPages, setTopPages] = useState<TopPages[]>([]);
  const [postCount, setPostCount] = useState<PostCount[]>([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    initState();
  }, [page]);

  async function initState() {
    const req = {
      limit: "4",
      page: page,
      search: "",
    };
    const res = await getListArticle(req);
    setArticle(res.data?.data);
    setTotalPage(res?.data?.meta?.totalPage);
  }

  async function fetchSummary() {
    const res = await getStatisticSummary();
    setSummary(res?.data?.data);
  }

  useEffect(() => {
    fetchTopPages();
  }, [page]);

  async function fetchTopPages() {
    const req = {
      limit: "10",
      page: page,
      search: "",
    };
    const res = await getTopArticles(req);
    setTopPages(getTableNumber(10, res.data?.data));
    setTopPagesTotalPage(res?.data?.meta?.totalPage);
  }

  useEffect(() => {
    fetchPostCount();
  }, [postContentDate]);
  async function fetchPostCount() {
    const getDate = (data: any) => {
      return `${data.year}-${data.month < 10 ? `0${data.month}` : data.month}-${
        data.day < 10 ? `0${data.day}` : data.day
      }`;
    };
    const res = await getUserLevelDataStat(
      getDate(postContentDate.startDate),
      getDate(postContentDate.endDate)
    );
    setPostCount(getTableNumber(10, res?.data?.data));
  }

  const getTableNumber = (limit: number, data: any) => {
    if (data) {
      const startIndex = limit * (page - 1);
      let iterate = 0;
      const newData = data.map((value: any) => {
        iterate++;
        value.no = startIndex + iterate;
        return value;
      });
      return newData;
    }
  };

  const getMonthYear = (date: any) => {
    return date.month + " " + date.year;
  };
  const getMonthYearName = (date: any) => {
    const newDate = new Date(date);

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const year = newDate.getFullYear();

    const month = months[newDate.getMonth()];
    return month + " " + year;
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* User Profile Card */}
        <motion.div
          className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">{fullname}</h3>
              <p className="text-slate-600">{username}</p>
              <div className="flex space-x-6 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {summary?.totalToday}
                  </p>
                  <p className="text-sm text-slate-500">Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {summary?.totalThisWeek}
                  </p>
                  <p className="text-sm text-slate-500">This Week</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <DashboardUserIcon size={60} />
            </div>
          </div>
        </motion.div>

        {/* Total Posts */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <DashboardSpeecIcon />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {summary?.totalAll}
              </p>
              <p className="text-sm text-slate-500">Total Posts</p>
            </div>
          </div>
        </motion.div>

        {/* Total Views */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <DashboardConnectIcon />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {summary?.totalViews}
              </p>
              <p className="text-sm text-slate-500">Total Views</p>
            </div>
          </div>
        </motion.div>

        {/* Total Shares */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <DashboardShareIcon />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {summary?.totalShares}
              </p>
              <p className="text-sm text-slate-500">Total Shares</p>
            </div>
          </div>
        </motion.div>

        {/* Total Comments */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <DashboardCommentIcon size={40} />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {summary?.totalComments}
              </p>
              <p className="text-sm text-slate-500">Total Comments</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics Chart */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Analytics Overview
            </h3>
            <div className="flex space-x-4">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={analyticsView.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleChange(option.value, checked as boolean)
                    }
                  />
                  <span className="text-sm text-slate-600">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ApexChartColumn
              type="monthly"
              date={`${new Date().getMonth() + 1} ${new Date().getFullYear()}`}
              view={analyticsView}
            />
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Articles
            </h3>
            <Link href="/admin/article/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                Create Article
              </Button>
            </Link>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
            {article?.map((list: any) => (
              <motion.div
                key={list?.id}
                className="flex space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  alt="thumbnail"
                  src={list?.thumbnailUrl || `/default-image.jpg`}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-800 line-clamp-2 mb-1">
                    {list?.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {convertDateFormat(list?.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <CustomPagination
              totalPage={totalPage}
              onPageChange={(data) => setPage(data)}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
