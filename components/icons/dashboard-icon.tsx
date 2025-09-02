import * as React from "react";
import { IconSvgProps } from "@/types/globals";

export const DashboardUserIcon = ({
  size,
  height = 48,
  width = 48,
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
      d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46"
    />
  </svg>
);

export const DashboardBriefcaseIcon = ({
  size,
  height = 48,
  width = 48,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 48 48"
    width={size || width}
    {...props}
  >
    <path fill="#f5bc00" d="M44,41H4V10h40V41z" />
    <polygon fill="#eb7900" points="44,26 24,26 4,26 4,10 44,10" />
    <path fill="#eb7900" d="M17,26h-6v3h6V26z" />
    <path fill="#eb7900" d="M37,26h-6v3h6V26z" />
    <rect width="14" height="3" x="17" y="7" fill="#f5bc00" />
    <path fill="#eb0000" d="M17,23h-6v3h6V23z" />
    <path fill="#eb0000" d="M37,23h-6v3h6V23z" />
  </svg>
);
export const DashboardMailboxIcon = ({
  size,
  height = 48,
  width = 48,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 48 48"
  >
    <path fill="#3dd9eb" d="M43,36H13V11h22c4.418,0,8,3.582,8,8V36z" />
    <path
      fill="#7debf5"
      d="M21,36H5V19c0-4.418,3.582-8,8-8l0,0c4.418,0,8,3.582,8,8V36z"
    />
    <path fill="#6c19ff" d="M21,36h5v8h-5V36z" />
    <polygon fill="#eb0000" points="27,16 27,20 35,20 35,24 39,24 39,16" />
    <rect width="8" height="3" x="9" y="20" fill="#3dd9eb" />
  </svg>
);
export const DashboardShareIcon = ({
  size,
  height = 48,
  width = 48,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132c13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328"
    />
  </svg>
);
export const DashboardSpeecIcon = ({
  size,
  height = 48,
  width = 48,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M7 0a2 2 0 0 0-2 2h9a2 2 0 0 1 2 2v12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
    />
    <path
      fill="currentColor"
      d="M13 20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM9 5h4v5H9zM4 5h4v1H4zm0 2h4v1H4zm0 2h4v1H4zm0 2h9v1H4zm0 2h9v1H4zm0 2h9v1H4z"
    />
  </svg>
);

export const DashboardConnectIcon = ({
  size,
  height = 48,
  width = 48,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm7.075-7.75L12 12.475l2.925 1.775l-.775-3.325l2.6-2.25l-3.425-.275L12 5.25L10.675 8.4l-3.425.275l2.6 2.25z"
    />
  </svg>
);

export const DashboardTopLeftPointIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M18 18L6 6m0 0h9M6 6v9"
    />
  </svg>
);

export const DashboardRightDownPointIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      fill="currentColor"
      // fillRule="evenodd"="evenodd"
      d="M5.47 5.47a.75.75 0 0 1 1.06 0l10.72 10.72V9a.75.75 0 0 1 1.5 0v9a.75.75 0 0 1-.75.75H9a.75.75 0 0 1 0-1.5h7.19L5.47 6.53a.75.75 0 0 1 0-1.06"
      //    // clipRule="evenodd"="evenodd"
    />
  </svg>
);
export const DashboardCommentIcon = ({
  size,
  height = 24,
  width = 24,
  fill = "currentColor",
  ...props
}: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 48 48"
  >
    <defs>
      <mask id="ipSComment0">
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <path fill="#fff" stroke="#fff" d="M44 6H4v30h9v5l10-5h21z" />
          <path stroke="#000" d="M14 19.5v3m10-3v3m10-3v3" />
        </g>
      </mask>
    </defs>
    <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSComment0)" />
  </svg>
);
