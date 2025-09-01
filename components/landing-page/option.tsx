import { motion } from "framer-motion";
import { useState, Dispatch, SetStateAction } from "react";

export type OptionProps = {
  Icon: any;
  title: string;
  selected?: string;
  setSelected?: Dispatch<SetStateAction<string>>;
  open: boolean;
  notifs?: number;
  active?: boolean;
};

const Option = ({ Icon, title, selected, setSelected, open, notifs, active }: OptionProps) => {
  const [hovered, setHovered] = useState(false);
  const isActive = active ?? selected === title;

  return (
    <motion.button
      layout
      onClick={() => setSelected?.(title)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex h-12 w-full px-3 items-center rounded-xl transition-all duration-200 cursor-pointer group ${
        isActive 
          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25" 
          : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200/50 hover:text-slate-800"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <motion.div 
        layout 
        className={`h-full flex items-center justify-center ${
          open ? "w-12" : "w-full"
        }`}
      >
        <div className={`text-lg transition-all duration-200 ${
          isActive 
            ? "text-white" 
            : "text-slate-500 group-hover:text-slate-700"
        }`}>
          <Icon />
        </div>
      </motion.div>

      {open && (
        <motion.span 
          layout 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1, duration: 0.2 }} 
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-white" : "text-slate-700"
          }`}
        >
          {title}
        </motion.span>
      )}

      {/* Tooltip for collapsed state */}
      {!open && hovered && (
        <motion.div
          initial={{ opacity: 0, x: 8, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute left-full ml-3 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-sm text-white shadow-xl z-50"
        >
          <div className="relative">
            {title}
            {/* Tooltip arrow */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        </motion.div>
      )}

      {/* Notification badge */}
      {notifs && open && (
        <motion.span 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.3, type: "spring" }} 
          className={`absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full text-xs font-semibold flex items-center justify-center ${
            isActive 
              ? "bg-white text-emerald-500" 
              : "bg-red-500 text-white"
          }`}
        >
          {notifs}
        </motion.span>
      )}

      {/* Hover effect overlay */}
      {hovered && !isActive && (
        <motion.div
          layoutId="hoverOverlay"
          className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};

export default Option;
