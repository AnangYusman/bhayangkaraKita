"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArticleIcon,
  DashboardIcon,
  MagazineIcon,
  MasterCategoryIcon,
  MasterRoleIcon,
  MasterUsersIcon,
  StaticPageIcon,
} from "../icons/sidebar-icon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";
import { motion } from "framer-motion";

export const Breadcrumbs = () => {
  const [currentPage, setCurrentPage] = useState<React.Key>("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathnameSplit = pathname.split("/");

  pathnameSplit.shift();
  const pathnameTransformed = pathnameSplit.map((item) => {
    const words = item.split("-");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPage(pathnameSplit[pathnameSplit.length - 1]);
  }, [pathnameSplit]);

  const handleAction = (key: any) => {
    const keyIndex = pathnameSplit.indexOf(key);
    const combinedPath = pathnameSplit.slice(0, keyIndex + 1).join("/");
    router.push("/" + combinedPath);
  };

  const getPageIcon = () => {
    if (pathname.includes("dashboard")) return <DashboardIcon size={40} />;
    if (pathname.includes("article")) return <ArticleIcon size={40} />;
    if (pathname.includes("master-category"))
      return <MasterCategoryIcon size={40} />;
    if (pathname.includes("magazine")) return <MagazineIcon size={40} />;
    if (pathname.includes("static-page")) return <StaticPageIcon size={40} />;
    if (pathname.includes("master-user")) return <MasterUsersIcon size={40} />;
    if (pathname.includes("master-role")) return <MasterRoleIcon size={40} />;
    return null;
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-6">
        <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="flex flex-col space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center space-x-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex-shrink-0"
      >
        {getPageIcon()}
      </motion.div>

      {/* Page Title and Breadcrumbs */}
      <div className="flex flex-col space-y-2">
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {pathnameTransformed[pathnameTransformed.length - 1]}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Breadcrumb>
            <BreadcrumbList className="flex items-center space-x-2">
              {pathnameTransformed
                ?.filter((item) => item !== "Admin")
                .map((item, index, array) => (
                  <React.Fragment key={pathnameSplit[index]}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => handleAction(pathnameSplit[index])}
                        className={`text-sm transition-all duration-200 hover:text-blue-600 ${
                          pathnameSplit[index] === currentPage
                            ? "font-semibold text-blue-600"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {item}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < array.length - 1 && (
                      <BreadcrumbSeparator className="text-slate-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
      </div>
    </motion.div>
  );
};
