import {
  Facebook,
  Instagram,
  RefreshCcwIcon,
  ThumbsUpIcon,
  Twitter,
  UserRoundPlus,
  Youtube,
} from "lucide-react";
import Image from "next/image";

const newsData = [
  {
    title:
      "Polri Perketat Pengamanan! Ambulans Udara Disiagakan Selama Ops Ketupat 2025",
    date: "December 27, 2024",
    excerpt:
      "Kepolisian Republik Indonesia (Polri) menyiagakan dua ambulans udara dalam rangka pengamanan Ops Ketupat 2025. Keberadaan ambulans udara ini bertujuan untuk...",
    image: "/ketupat.png",
  },
  {
    title:
      "Persiapan Mudik 2025: Kakorlantas dan Menhub Optimis Pelabuhan Merak Terkendali",
    date: "December 27, 2024",
    excerpt:
      "Cilegon - Kakorlantas Polri Irjen Pol Drs. Agus Suryonugroho S.H, M.Hum bersama Menteri Perhubungan (Menhub) Dudy Purwagandhi meninjau kondisi Pelabuhan...",
    image: "/bergizi1.jpg",
  },
  {
    title:
      "3 Polisi Gugur dalam Tugas Penggerebekan Tempat Perjudian Sabung Ayam di Lampung",
    date: "December 27, 2024",
    excerpt:
      "Jakarta - Operasi penggerebekan terhadap tempat perjudian sabung ayam berujung pada kematian tiga anggota polisi. Tindakan penegakan hukum yang berlangsung...",
    image: "/gugur.jpg",
  },
  {
    title:
      "Program Makan Bergizi Gratis dari SPPG yang Libatkan Sinergi Polri dan Pemerintah",
    date: "December 27, 2024",
    excerpt:
      " Jakarta - Kapolri Jenderal Polisi Listyo Sigit Prabowo, bersama dengan Menteri Pendidikan Dasar Menengah Abdul Mu’ti, Kepala Badan Gizi Nasional...",
    image: "/bergizi.png",
  },
  {
    title:
      "Mutasi Personel Polri 2025: Penguatan Institusi dengan 10 Kapolda Baru dan Langkah Strategis untuk Polwan",
    date: "December 27, 2024",
    excerpt:
      "Jakarta – Kepolisian Negara Republik Indonesia (Polri) telah menetapkan langkah besar dengan melaksanakan mutasi massal yang mencakup 1.255 personelnya. Berdasarkan...",
    image: "/mutasi.jpg",
  },
];

export default function News() {
  return (
    <section className="bg-white py-10 px-4 md:px-10 w-full">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-5">
        {/* Left: News Section */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-row items-center pb-2 mb-3 gap-4">
            <h2 className="text-lg font-bold ">BERITA TERBARU</h2>
            <div className="flex-grow border-t-3 border-gray-300 rounded-md"></div>
          </div>
          <div className="space-y-10">
            {newsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4  pb-6"
              >
                <div className="w-full md:w-[250px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={250}
                    height={180}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-xl font-serif mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#999999] mb-2 flex items-center gap-2">
                    by <span className="text-black">Dian Purwanto</span>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                        />
                      </g>
                    </svg>{" "}
                    {item.date}{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>{" "}
                    0{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M16 8C7.664 8 1.25 15.344 1.25 15.344L.656 16l.594.656s5.848 6.668 13.625 7.282c.371.046.742.062 1.125.062s.754-.016 1.125-.063c7.777-.613 13.625-7.28 13.625-7.28l.594-.657l-.594-.656S24.336 8 16 8m0 2c2.203 0 4.234.602 6 1.406A6.9 6.9 0 0 1 23 15a6.995 6.995 0 0 1-6.219 6.969c-.02.004-.043-.004-.062 0c-.239.011-.477.031-.719.031c-.266 0-.523-.016-.781-.031A6.995 6.995 0 0 1 9 15c0-1.305.352-2.52.969-3.563h-.031C11.717 10.617 13.773 10 16 10m0 2a3 3 0 1 0 .002 6.002A3 3 0 0 0 16 12m-8.75.938A9 9 0 0 0 7 15c0 1.754.5 3.395 1.375 4.781A23.2 23.2 0 0 1 3.531 16a24 24 0 0 1 3.719-3.063zm17.5 0A24 24 0 0 1 28.469 16a23.2 23.2 0 0 1-4.844 3.781A8.93 8.93 0 0 0 25 15c0-.715-.094-1.398-.25-2.063z"
                      />
                    </svg>{" "}
                    19
                  </p>
                  <p className="text-black text-sm font-serif">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2 justify-start">
            <button className="border px-3 py-1 text-xs hover:bg-gray-100 rounded-sm">
              ‹ PREV
            </button>
            <button className="border px-3 py-1 text-xs hover:bg-gray-100 rounded-sm">
              NEXT ›
            </button>
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

        <aside className="w-full lg:w-[340px]">
          <div className="relative w-[1111px] max-w-full h-[400px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/xtweet.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
          <div className="relative w-[1111px] max-w-full h-[400px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/xtweet.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
          <div className="relative w-[1111px] max-w-full h-[300px] overflow-hidden flex items-center mx-auto border my-6 rounded">
            <Image
              src="/kolom.png"
              alt="Berita Utama"
              fill
              className="object-contain rounded"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
