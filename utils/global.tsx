"use client";
import { useEffect } from "react";

export function convertDateFormat(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedTime =
    (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
  const formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    year +
    ", " +
    formattedTime;

  return formattedDate;
}
// export function convertDateFormatNoTime(dateString: any) {
//   var date = new Date(dateString);

//   var day = date.getDate();
//   var month = date.getMonth() + 1;
//   var year = date.getFullYear();

//   var formattedDate =
//     (day < 10 ? "0" : "") +
//     day +
//     "-" +
//     (month < 10 ? "0" : "") +
//     month +
//     "-" +
//     year;

//   return formattedDate;
// }

export function convertDateFormatNoTimeV2(dateString: string | Date) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate =
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day;

  return formattedDate;
}

export function formatTextToHtmlTag(text: string) {
  if (text) {
    const htmlText = text.replaceAll("\\n", "<br>").replaceAll(/"/g, "");
    return { __html: htmlText };
  }
}

const LoadScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.userway.org/widget.js";
    script.setAttribute("data-account", "X36s1DpjqB");
    script.async = true;

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      document.head.removeChild(script);
    };
  }, []);

  return null; // Tidak perlu merender apa-apa
};

export default LoadScript;

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function textEllipsis(
  str: string,
  maxLength: number,
  { side = "end", ellipsis = "..." } = {}
) {
  if (str !== undefined && str?.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));

      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
}

export function htmlToString(str: string) {
  if (str == undefined || str == null) {
    return "";
  }
  return (
    str
      .replaceAll(/<style[^>]*>.*<\/style>/gm, "")
      // Remove script tags and content
      .replaceAll(/<script[^>]*>.*<\/script>/gm, "")
      // Replace &nbsp,&ndash
      .replaceAll("&nbsp;", "")
      .replaceAll("&ndash;", "-")
      // Replace quotation mark
      .replaceAll("&ldquo;", '"')
      .replaceAll("&rdquo;", '"')
      // Remove all opening, closing and orphan HTML tags
      .replaceAll(/<[^>]+>/gm, "")
      // Remove leading spaces and repeated CR/LF
      .replaceAll(/([\n\r]+ +)+/gm, "")
  );
}

export function formatMonthString(dateString: string) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(dateString); // Konversi string ke objek Date
  const day = date.getDate(); // Ambil tanggal
  const month = months[date.getMonth()]; // Ambil nama bulan
  const year = date.getFullYear(); // Ambil tahun

  return `${day} ${month} ${year}`;
}

export function convertDateFormatNoTime(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
