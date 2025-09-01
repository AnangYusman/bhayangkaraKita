"use client";

import { useEffect, useState } from "react";
import React, { ReactNode } from "react";
import { SidebarProvider } from "./sidebar-context";
import { ThemeProvider } from "./theme-context";
import { Breadcrumbs } from "./breadcrumbs";
import { BurgerButtonIcon } from "../icons";
import { motion, AnimatePresence } from "framer-motion";
import { RetractingSidebar } from "../landing-page/retracting-sidedar";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const updateSidebarData = (newData: boolean) => {
    setIsOpen(newData);
  };

  // Hooks
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render loading state until mounted
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="flex h-screen overflow-hidden">
            <RetractingSidebar
              sidebarData={isOpen}
              updateSidebarData={updateSidebarData}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key="main-content"
                className="flex-1 flex flex-col overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <motion.header
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        onClick={() => updateSidebarData(true)}
                      >
                        <BurgerButtonIcon />
                      </button>
                      <Breadcrumbs />
                    </div>
                  </div>
                </motion.header>

                {/* Main Content */}
                <motion.main
                  className="flex-1 overflow-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="h-full">{children}</div>
                </motion.main>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};
