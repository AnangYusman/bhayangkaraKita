import React from "react";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  value: number; // 0 to 100
  className?: string;
}

export function CircularProgress({ size = 48, strokeWidth = 4, value, className }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className={className} viewBox={`0 0 ${size} ${size}`}>
      <circle className="text-gray-200" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      <circle
        className="text-primary"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="text-xs fill-primary font-medium">
        {Math.round(value)}%
      </text>
    </svg>
  );
}
