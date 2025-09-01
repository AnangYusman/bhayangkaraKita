import React from "react";

type CircularProgressProps = {
  value: number; // antara 0 - 100
  size?: number; // diameter lingkaran (px)
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
};

export const CustomCircularProgress = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = "#f59e0b", // shadcn's warning color
  bgColor = "#e5e7eb", // gray-200
  label,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100); // jaga antara 0 - 100
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: "stroke-dashoffset 0.35s" }}
        />
      </svg>
      <span className="absolute text-sm font-semibold text-gray-800 dark:text-white">
        {label ?? `${Math.round(progress)}%`}
      </span>
    </div>
  );
};
