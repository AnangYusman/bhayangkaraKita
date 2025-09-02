import React from "react";
import clsx from "clsx";

export type ChipColor = "default" | "primary" | "success" | "danger";

export interface ChipProps {
  children: React.ReactNode;
  color?: ChipColor;
  className?: string;
  size?: string;
  variant?: string;
}

const colorMap: Record<ChipColor, string> = {
  default: "bg-gray-200 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
};

export const Chip: React.FC<ChipProps> = ({ children, color = "default", className }) => {
  return <span className={clsx("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", colorMap[color], className)}>{children}</span>;
};
