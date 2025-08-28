// components/landing-page/opini.tsx
"use client";

import Image from "next/image";

const data = {
  pelayanan: {
    title: "Pelayanan",
    color: "bg-red-600",
    items: [
      {
        id: 1,
        title:
          "Polres Rokan Hulu dan Dukungan Program Makan Bergizi Gratis SDN 016 Sei Bungo",
        date: "28 JANUARI 2025",
        image: "/rokanhulu.png",
      },
      {
        id: 2,
        title: "Polri Buka Rekrutmen Khusus Lulusan Pertanian dan Peternakan",
        date: "4 NOVEMBER 2024",
      },
      {
        id: 3,
        title:
          "Polri Siap Dukung Presiden Prabowo Subianto Menuju Ketahanan Pangan Nasional Indonesia",
        date: "24 OKTOBER 2024",
      },
      {
        id: 4,
        title:
          "Divisi Humas Polri dan TVRI Gelar Pelatihan Presenter untuk Optimalisasi Komunikasi Publik",
        date: "15 JULI 2024",
      },
    ],
  },
  opini: {
    title: "Opini",
    color: "bg-red-600",
    items: [
      {
        id: 1,
        title:
          "KH Abu Bakar Abdul Jalil Apresiasi Rekrutmen Jalur Khusus di Polri bagi Santri dan Hafiz Al-Qur’an",
        date: "25 FEBRUARI 2025",
        image: "/abubakar.png",
      },
      {
        id: 2,
        title:
          "Polisi Istimewa Pejuang Kemerdekaan ke Peringatan Hari Juang Polri",
        date: "8 NOVEMBER 2024",
      },
      {
        id: 3,
        title:
          "Menkodmigi Meutya Hafid Apresiasi Polri dalam Pemberantasan Judi Online di Indonesia",
        date: "1 NOVEMBER 2024",
      },
      {
        id: 4,
        title:
          "Komjen Purn Boy Rafli Amar Bicara Inovasi Humas Polri dalam Meningkatkan Kepercayaan Publik dan Pelayanan Prima Kepolisian",
        date: "31 OKTOBER 2024",
      },
    ],
  },
  inspirasi: {
    title: "Inspirasi",
    color: "bg-red-600",
    items: [
      {
        id: 1,
        title:
          "Apa yang dimaksud Bhayangkari? Apa Sejarah, Fungsi dan Perannya",
        date: "20 FEBRUARI 2023",
        image: "/bhayangkari.jpg",
      },
      {
        id: 2,
        title: "Lirik Lagu Mars Bhayangkari",
        date: "6 JULI 2023",
      },
      {
        id: 3,
        title:
          "Pendidikan Minimal Istri Polisi di Indonesia: Syarat dan Peranannya",
        date: "4 JULI 2023",
      },
      {
        id: 4,
        title: "Polri Gowes Presisi Khatulistiwa Cetak Rekor MURI",
        date: "27 JUNI 2022",
      },
    ],
  },
};

function NewsColumn({ title, color, items }: any) {
  return (
    <div className="bg-transparent   p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className={`${color} text-white px-3 py-1 font-semibold rounded`}>
          {title}
        </div>
        <div className="flex-1 border-t border-gray-300 ml-2" />
      </div>

      <div className="space-y-4">
        {items.map((item: any, index: number) => (
          <div
            key={item.id}
            className={`flex flex-col ${
              index === 0 ? "md:flex-row" : ""
            } border-b border-gray-200 pb-3`}
          >
            {index === 0 && item?.image && (
              <div className="w-full md:w-40 h-24 relative mr-3">
                <Image
                  src={item?.image}
                  alt={item?.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-sm font-medium hover:text-blue-600 cursor-pointer">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="mr-1">🕒</span> {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start items-center mt-4">
        <button className="px-3 py-1 text-xs border rounded bg-white text-gray-600 hover:bg-gray-200">
          &lt; PREV
        </button>
        <button className="px-3 py-1 text-xs border rounded bg-white text-gray-600 hover:bg-gray-200">
          NEXT &gt;
        </button>
      </div>
    </div>
  );
}

export default function Opini() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gray-100 p-6 ">
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          <NewsColumn {...data.pelayanan} />
          <NewsColumn {...data.opini} />
          <NewsColumn {...data.inspirasi} />
        </div>
      </div>
      <div className="relative my-5 max-w-full h-[125px] overflow-hidden flex items-center mx-auto border">
        <Image
          src="/image-kolom.png"
          alt="Berita Utama"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
