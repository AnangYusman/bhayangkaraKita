"use client";

import DashboardContainer from "@/components/main/dashboard/dashboard-container";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full overflow-auto bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <DashboardContainer />
      </div>
    </motion.div>
  );
}
