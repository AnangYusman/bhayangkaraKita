import * as React from "react";
import { IconSvgProps } from "@/types/globals";

export const PdfIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    viewBox="0 0 15 15"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3.5 8H3V7h.5a.5.5 0 0 1 0 1M7 10V7h.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"
    />
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M1 1.5A1.5 1.5 0 0 1 2.5 0h8.207L14 3.293V13.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 13.5zM3.5 6H2v5h1V9h.5a1.5 1.5 0 1 0 0-3m4 0H6v5h1.5A1.5 1.5 0 0 0 9 9.5v-2A1.5 1.5 0 0 0 7.5 6m2.5 5V6h3v1h-2v1h1v1h-1v2z"
      //    // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const CsvIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M1 1.5A1.5 1.5 0 0 1 2.5 0h8.207L14 3.293V13.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 13.5zM2 6h3v1H3v3h2v1H2zm7 0H6v3h2v1H6v1h3V8H7V7h2zm2 0h-1v3.707l1.5 1.5l1.5-1.5V6h-1v3.293l-.5.5l-.5-.5z"
      // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const ExcelIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
    width={size || width}
    height={size || height}
    {...props}
  >
    <path
      fill="currentColor"
      d="M3.793 7.5L2.146 5.854l.708-.708L4.5 6.793l1.646-1.647l.708.708L5.207 7.5l1.647 1.646l-.708.708L4.5 8.207L2.854 9.854l-.708-.708z"
    />
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M3.5 0A1.5 1.5 0 0 0 2 1.5V3h-.5A1.5 1.5 0 0 0 0 4.5v6A1.5 1.5 0 0 0 1.5 12H2v1.5A1.5 1.5 0 0 0 3.5 15h10a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 13.5 0zm-2 4a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5z"
      // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const WordIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      d="m2.015 5.621l1 4a.5.5 0 0 0 .901.156l.584-.876l.584.876a.5.5 0 0 0 .901-.156l1-4l-.97-.242l-.726 2.903l-.373-.56a.5.5 0 0 0-.832 0l-.373.56l-.726-2.903z"
    />
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M3.5 0A1.5 1.5 0 0 0 2 1.5V3h-.5A1.5 1.5 0 0 0 0 4.5v6A1.5 1.5 0 0 0 1.5 12H2v1.5A1.5 1.5 0 0 0 3.5 15h10a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 13.5 0zm-2 4a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5z"
      // clipRule="evenodd"="evenodd"
    />
  </svg>
);

export const PptIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      d="M3 8h.5a.5.5 0 0 0 0-1H3zm4 0h.5a.5.5 0 0 0 0-1H7z"
    />
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M1 1.5A1.5 1.5 0 0 1 2.5 0h8.207L14 3.293V13.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 13.5zM2 6h1.5a1.5 1.5 0 1 1 0 3H3v2H2zm4 0h1.5a1.5 1.5 0 1 1 0 3H7v2H6zm5 5h1V7h1V6h-3v1h1z"
      // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const FileIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 15 15"
  >
    <path
      fill="currentColor"
      d="m10.5.5l.354-.354L10.707 0H10.5zm3 3h.5v-.207l-.146-.147zm-1 10.5h-10v1h10zM2 13.5v-12H1v12zM2.5 1h8V0h-8zM13 3.5v10h1v-10zM10.146.854l3 3l.708-.708l-3-3zM2.5 14a.5.5 0 0 1-.5-.5H1A1.5 1.5 0 0 0 2.5 15zm10 1a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5zM2 1.5a.5.5 0 0 1 .5-.5V0A1.5 1.5 0 0 0 1 1.5z"
    />
  </svg>
);
export const UserProfileIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M11 7c0 1.66-1.34 3-3 3S5 8.66 5 7s1.34-3 3-3s3 1.34 3 3"
    />
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M16 8c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8M4 13.75C4.16 13.484 5.71 11 7.99 11c2.27 0 3.83 2.49 3.99 2.75A6.98 6.98 0 0 0 14.99 8c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 2.38 1.19 4.49 3.01 5.75"
      // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const SettingsIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    {...props}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
    />
  </svg>
);
