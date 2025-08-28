"use client";
import { Timer } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function Beranda() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-1 px-4 py-4 bg-white ">
        <button
          onClick={scrollLeft}
          className="flex items-center justify-center w-8 h-24 border rounded hover:bg-gray-100"
        >
          <span className="text-xl font-bold text-gray-700">&lt;</span>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-hidden max-w-7xl mx-auto"
        >
          <div className="flex-shrink-0 flex items-start gap-3 w-[350px] ">
            <Image
              src="/menhub.jpg"
              alt="Berita 1"
              width={56} // 14 * 4 = 56px
              height={56}
              className="w-14 h-14 object-cover"
            />
            <div className="flex flex-col">
              <p className="text-xs font-medium w-[250px]">
                Persiapan Mudik 2025: Kakorlantas dan Menhub Optimis Pelabuhan
                Merak Terkendali
              </p>
              <p className="flex items-center text-[12px] text-gray-500">
                <Timer size={15} />
                24 Maret 2025
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-start gap-3 w-[350px]">
            <Image
              src="/gugur.jpg"
              alt="Berita 1"
              width={56} // 14 * 4 = 56px
              height={56}
              className="w-14 h-14 object-cover"
            />

            <div className="flex flex-col">
              <p className="text-xs font-medium w-[250px]">
                3 Polisi Gugur dalam Tugas Penggerebekan Tempat Perjudian Sabung
                Ayam di Lampung
              </p>
              <p className="flex items-center text-[12px] text-gray-500">
                <Timer size={15} />
                24 Maret 2025
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-start gap-3 w-[350px]">
            <Image
              src="/bergizi.png"
              alt="Berita 1"
              width={56} // 14 * 4 = 56px
              height={56}
              className="w-14 h-14 object-cover"
            />
            <div className="flex flex-col">
              <p className="text-xs font-medium w-[250px]">
                Program Makan Bergizi Gratis dari SPPG yang Libatkan Sinergi
                Polri dan Pemerintah
              </p>
              <p className="flex items-center text-[12px] text-gray-500">
                <Timer size={15} />
                24 Maret 2025
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={scrollRight}
          className="flex items-center justify-center w-8 h-24 border rounded hover:bg-gray-100"
        >
          <span className="text-xl font-bold text-gray-700">&gt;</span>
        </button>
      </div>
    </div>
  );
}
