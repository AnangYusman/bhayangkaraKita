"use client";

import React, { Dispatch, SetStateAction, useState, useEffect } from "react";

import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import DashboardContainer from "../main/dashboard/dashboard-container";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../layout/theme-context";
import Option from "./option";

interface RetractingSidebarProps {
  sidebarData: boolean;
  updateSidebarData: (newData: boolean) => void;
}

const sidebarSections = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        icon: () => (
          <Icon icon="material-symbols:dashboard" className="text-lg" />
        ),
        link: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Articles",
        icon: () => <Icon icon="ri:article-line" className="text-lg" />,
        link: "/admin/article",
      },
      {
        title: "Categories",
        icon: () => <Icon icon="famicons:list-outline" className="text-lg" />,
        link: "/admin/master-category",
      },
      // {
      //   title: "Majalah",
      //   icon: () => <Icon icon="emojione-monotone:newspaper" className="text-lg" />,
      //   link: "/admin/magazine",
      // },
      {
        title: "Advertisements",
        icon: () => <Icon icon="ic:round-ads-click" className="text-lg" />,
        link: "/admin/advertise",
      },
      // {
      //   title: "Komentar",
      //   icon: () => <Icon icon="material-symbols:comment-outline-rounded" className="text-lg" />,
      //   link: "/admin/komentar",
      // },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Static Pages",
        icon: () => <Icon icon="fluent-mdl2:page-solid" className="text-lg" />,
        link: "/admin/static-page",
      },
      {
        title: "User Management",
        icon: () => <Icon icon="ph:users-three-fill" className="text-lg" />,
        link: "/admin/master-user",
      },
    ],
  },
];

export const RetractingSidebar = ({
  sidebarData,
  updateSidebarData,
}: RetractingSidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <AnimatePresence mode="wait">
        <motion.nav
          key="desktop-sidebar"
          layout
          className="hidden md:flex sticky top-0 h-screen shrink-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-r border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-sm flex-col justify-between"
          style={{
            width: sidebarData ? "280px" : "80px",
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SidebarContent
            open={sidebarData}
            pathname={pathname}
            updateSidebarData={updateSidebarData}
          />
        </motion.nav>
      </AnimatePresence>

      {/* Desktop Toggle Button - appears when sidebar is collapsed */}
      <AnimatePresence>
        {!sidebarData && (
          <motion.button
            key="desktop-toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="hidden md:flex fixed top-4 left-20 z-40 p-3 bg-white rounded-xl shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-200 hover:bg-slate-50"
            onClick={() => updateSidebarData(true)}
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 text-slate-600"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <AnimatePresence>
        {!sidebarData && (
          <motion.button
            key="mobile-toggle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-200"
            onClick={() => updateSidebarData(true)}
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-6 h-6 text-slate-600"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarData && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 z-50 w-[280px] h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-4 flex flex-col md:hidden shadow-2xl backdrop-blur-sm"
          >
            {/* <button onClick={() => updateSidebarData(false)} className="mb-4 self-end text-zinc-500">
              ✕
            </button> */}
            <SidebarContent
              open={true}
              pathname={pathname}
              updateSidebarData={updateSidebarData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({
  open,
  pathname,
  updateSidebarData,
}: {
  open: boolean;
  pathname: string;
  updateSidebarData: (newData: boolean) => void;
}) => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil cookie secara client-side
    const cookies = document.cookie.split("; ").reduce((acc: any, cur) => {
      const [key, value] = cur.split("=");
      acc[key] = value;
      return acc;
    }, {});
    setUsername(cookies.username || "Guest");
  }, []);
  return (
    <div className="flex flex-col h-full">
      {/* SCROLLABLE TOP SECTION */}
      <div className="flex-1 overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col space-y-6">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between px-4 py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/bhayangkarakita.png"
                  className="w-10 h-10 rounded-lg shadow-sm"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-sm"></div>
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    BhayangkaraKita
                  </span>
                  <span className="text-xs text-slate-500">Admin Panel</span>
                </motion.div>
              )}
            </Link>

            {open && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
                onClick={() => updateSidebarData(false)}
              >
                <Icon
                  icon="heroicons:chevron-left"
                  className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors"
                />
              </motion.button>
            )}
          </div>

          {/* Navigation Sections */}
          <div className="space-y-3 px-3 pb-6">
            {sidebarSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + sectionIndex * 0.1 }}
                className="space-y-3"
              >
                {open && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3"
                  >
                    {section.title}
                  </motion.h3>
                )}
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <Link href={item.link} key={item.title}>
                      <Option
                        Icon={item.icon}
                        title={item.title}
                        active={pathname === item.link}
                        open={open}
                      />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM SECTION */}
      <div className="flex-shrink-0 space-y-1 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        {/* Divider */}
        {/* <div className="px-3 pb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div> */}

        {/* Theme Toggle */}
        <div className="px-3 pt-1">
          <motion.button
            onClick={toggleTheme}
            className={`relative flex h-12 w-full items-center rounded-xl transition-all duration-200 cursor-pointer group ${
              open ? "px-3" : "justify-center"
            } ${
              theme === "dark"
                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200/50 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`h-full flex items-center justify-center ${
                open ? "w-12" : "w-full"
              }`}
            >
              <div
                className={`text-lg transition-all duration-200 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                }`}
              >
                {theme === "dark" ? (
                  <Icon icon="solar:sun-bold" className="text-lg" />
                ) : (
                  <Icon icon="solar:moon-bold" className="text-lg" />
                )}
              </div>
            </motion.div>

            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className={`text-sm font-medium transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Settings */}
        <div className="px-3">
          <Link href="/settings">
            <Option
              Icon={() => (
                <Icon icon="lets-icons:setting-fill" className="text-lg" />
              )}
              title="Settings"
              active={pathname === "/settings"}
              open={open}
            />
          </Link>
        </div>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-3 py-3 border-t border-slate-200/60"
        >
          <div
            className={`${
              open
                ? "flex items-center space-x-3"
                : "flex items-center justify-center"
            } p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-200/50 transition-all duration-200 cursor-pointer group`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-800 truncate">
                  {username}
                </p>
                <Link href="/auth">
                  <p className="text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200">
                    Sign out
                  </p>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Expand Button for Collapsed State */}
        {/* {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="px-3 pt-2"
          >
            <button
              onClick={() => updateSidebarData(true)}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl group"
            >
              <div className="flex items-center justify-center">
                <Icon 
                  icon="heroicons:chevron-right" 
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
                />
              </div>
            </button>
          </motion.div>
        )} */}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil cookie secara client-side
    const cookies = document.cookie.split("; ").reduce((acc: any, cur) => {
      const [key, value] = cur.split("=");
      acc[key] = value;
      return acc;
    }, {});
    setUsername(cookies.username || "Guest");
  }, []);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-1 hidden md:flex flex-col justify-between"
      style={{
        width: open ? "120px" : "90px",
      }}
    >
      {/* BAGIAN ATAS */}
      <div>
        {!open && (
          <div className="w-full flex justify-center items-center">
            <button
              className="w-5 h-5 text-zinc-400 border border-zinc-400 rounded-full flex justify-center items-center"
              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="m10 17l5-5m0 0l-5-5"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          className={`flex ${
            open ? "justify-between" : "justify-center"
          } w-full items-center px-2`}
        >
          <Link href="/" className="flex flex-row items-center gap-3 font-bold">
            <img src="/assets/icon/Logo.png" className="w-20" />
          </Link>
          {open && (
            <button
              className="w-5 h-5 text-zinc-400 border border-zinc-400 rounded-full flex justify-center items-center"
              onClick={() => setOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="m14 7l-5 5m0 0l5 5"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-1">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <p className="font-bold text-[14px] py-2">{section.title}</p>
              {section.items.map((item) => (
                <Link href={item.link} key={item.title}>
                  <Option
                    Icon={item.icon}
                    title={item.title}
                    active={pathname === item.link}
                    open={open}
                  />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* BAGIAN BAWAH */}
      <div className="space-y-1">
        <Option
          Icon={() => <Icon icon="solar:moon-bold" className="text-lg" />}
          title="Theme"
          active={false}
          open={open}
        />
        <Link href="/settings">
          <Option
            Icon={() => (
              <Icon icon="lets-icons:setting-fill" className="text-lg" />
            )}
            title="Settings"
            active={pathname === "/settings"}
            open={open}
          />
        </Link>{" "}
        <div className="flex flex-row gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="6" r="4" />
              <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
            </g>
          </svg>
          <div className="flex flex-col gap-0.5 text-xs">
            <p>{username}</p>
            <p className="underline">Logout</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
      <div className="flex items-center">
        <motion.div
          layout
          initial={{ opacity: 0, y: 12, scale: 0.5 }}
          animate={
            open
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 1, y: 0, scale: 0.5 }
          }
          transition={{ delay: 0.125 }}
        >
          <Image
            src="/assets/icon/Logo.png"
            alt="logo"
            width={1920}
            height={1080}
            className="w-full h-fit"
          />
        </motion.div>
      </div>
      {/* {open && <FiChevronDown className="mr-2" />} */}
    </div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button layout onClick={() => setOpen((pv) => !pv)}>
      <div className="flex justify-center items-center pt-2">
        <motion.div layout className="grid size-10 text-lg">
          {/* <FiChevronsRight
            className={`transition-transform  ${open && "rotate-180"}`}
          /> */}
        </motion.div>
        {/* {open && (
          <motion.span layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.125 }} className="text-xs font-medium">
            Hide
          </motion.span>
        )} */}
      </div>
    </motion.button>
  );
};

const ExampleContent = () => (
  <div>
    <DashboardContainer />
  </div>
);
