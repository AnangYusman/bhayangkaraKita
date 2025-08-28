"use client";
import { Timer } from "lucide-react";
import { useRef } from "react";

type Article = {
  image?: string;
  title: string;
  category?: string;
  author?: string;
  date?: string;
  excerpt?: string;
};

const listNews: Article[] = [
  {
    title:
      "Jadwal Imunisasi Dewasa 2024: Rekomendasi ACIP untuk Meningkatkan Tingkat Vaksinasi",
    image: "/imunisasi.jpg",
  },
  {
    title:
      "Lonjakan Kasus COVID-19 di Singapura Terjadi karena Varian EG.5, Ciri-cirinya Diketahui",
    image: "/covid-19.jpg",
  },
  {
    title: "Waspada Pneumonia, Kemenkes Minta Semua Jajaran Kesehatan Siaga",
    image: "/pneumonia.jpg",
  },

  {
    title: "GEMUVI: Netralitas Polri Tidak Perlu Dipertanyakan Lagi",
    image: "/gemuvi.jpg",
  },
  {
    title:
      "Jakarta Terpilih sebagai Salah Satu Destinasi Terbaik oleh Lonely Planet untuk Tahun 2024",
    image: "/jakarta.jpg",
  },
];

const opiniNews = [
  {
    title: "Polsek Tapung Segel Tambang Ilegal di Karya Indah Kampar",
  },
  {
    title: "Polsek Tapung Segel Tambang Ilegal di Karya Indah Kampar",
  },
  {
    title: "Polsek Tapung Segel Tambang Ilegal di Karya Indah Kampar",
  },
  {
    title: "Polsek Tapung Segel Tambang Ilegal di Karya Indah Kampar",
  },
  {
    title: "Polsek Tapung Segel Tambang Ilegal di Karya Indah Kampar",
  },
];

const popularNews = [
  {
    title:
      "Dr Jumadi Dalam Puncak Peringatan Hari Koperasi Tingkat Jawa Tengah",
    image: "/jumadi.jpg",
    category: "JAGA NEGERI",
    author: "DODDODYDOD",
    date: "25 Juli 2023",
    excerpt:
      "Semarang – Pada tanggal 21 Juli, Wakil Walikota Tegal, Dr. Jumadi, ST., MM, yang juga menjabat sebagai wakil ketua Dekopinwil...",
  },
  {
    title: "Simak 5 Manfaat Kunyit untuk Kesehatan",
    image: "/kunyit.jpg",
  },
  {
    title: "Manfaat Daun Kelor untuk Daya Tahan Tubuh",
    image: "/bola.jpg",
  },
  {
    title: "Manfaat Daun Kelor untuk Daya Tahan Tubuh",
    image: "/libur.jpg",
  },
];

const mainNews: Article = {
  title:
    "Kabar Penghapusan Gaji ke-13 dan 14 ASN Ramai Dibahas di Media Sosial X",
  author: "SALMA HASNA",
  date: "7 Februari 2025",
  excerpt:
    "Jakarta - Media sosial X tengah diramaikan dengan kabar yang menyebutkan bahwa gaji ke-13 dan 14, atau Tunjangan Hari Raya...",
};

const latestNews: Article[] = [
  {
    image: "/kapolri.png",
    category: "BERANDA",

    date: "14 Januari 2025",
    title:
      "Kapolri Pimpin Upacara Sertijab Kapolda Sumbar dan Kenaikan Pangkat untuk 10.548 Perwira",
    excerpt:
      " Kapolda Sumbar secara resmi diserahterimakan dari Irjen Pol Suharyono, S.I.K., S.H., M.H., kepada Irjen Pol Dr. Gatot...",
  },
  {
    image: "/WAMENHUB.png",
    category: "BERANDA",
    title:
      "Kakorlantas dan Wamenhub Evaluasi Pengelolaan Arus Lalu Lintas Selama Libur Nataru",
    excerpt:
      "Brebes –Wakil Menteri Perhubungan (Wamenhub) RI, Suntana, bersama Kepala Korps Lalu Lintas (Kakorlantas) Polri, Irjen Pol Aan Suhanan, melakukan peninjauan...",
  },
  {
    image: "/TERMINAL.jpg",
    category: "SUARA WARGA",
    date: "14 Januari 2025",

    title:
      "Pastikan Keamanan Lalu Lintas, Kakorlantas dan Wamenhub Ramp Check serta Tes Kesehatan Pengemudi Angkutan Umum di Terminal Pekalongan",
    excerpt:
      "Pekalongan - Wakil Menteri Perhubungan (Wamenhub) RI, Suntana, bersama Kakorlantas Polri, Irjen Pol Aan Suhanan, meninjau Terminal Pekalongan pada Minggu...",
  },
  {
    image: "/yogyakarta.jpg",
    category: "BERANDA",
    date: "14 Januari 2025",

    title:
      "Tinjau Yogyakarta, Wamenhub RI dan Kakorlantas Polri Pastikan Arus Lalu Lintas Nataru Aman",
    excerpt:
      "Yogyakarta - Wakil Menteri Perhubungan RI Suntana bersama Kakorlantas Polri Irjen Pol Aan Suhanan, Dirut PT Jasa Raharja Rivan A....",
  },
];

const mainNewsList = [
  {
    image: "/arif.jpg",
    title:
      "Komjen. Pol. (Purn.) Drs. Arif Wachyunadi Dorong Anggota Polri Hidupkan Semangat Perjuangan melalui Hari Juang Polri",
  },
  {
    image: "/kelor.png",
    title: "Manfaat Daun Kelor untuk Kesehatan",
  },
  {
    image: "/vaksin.jpg",
    title: "Efek Samping Langka Vaksin Astra Zeneca di Ungkap Kemenkes",
  },
  {
    image: "/idul-fitri.jpg",
    title: "Selamat Hari Raya Idul Fitri 1445H",
  },
  {
    image: "/jiwa.png",
    title:
      "Yuk, Periksa Kondisi Jiwa! Temukan Tes Kesehatan Mental yang Tepat...",
  },
  {
    image: "/kurma.jpg",
    title: "Berkah Kurma: 5 Manfaat Luar Biasa untuk Kesehatan Lambung Anda",
  },
];

const latestNewsMid: Article[] = [
  {
    image: "/ali-moc.jpg",
    category: "BERANDA",
    title:
      "Prof. Ali Mochtar Ngabalin Dorong Harmoni di Tengah Keberagaman lewat Bhinneka Tunggal Ika dan Moderasi Beragama",
    author: "SALMA HASNA",
    date: "14 Januari 2025",
  },
  {
    image: "/arif.jpg",
    category: "SUARA WARGA",
    title:
      "Komjen. Pol. (Purn.) Drs. Arif Wachyunadi Dorong Anggota Polri Hidupkan Semangat Perjuangan melalui Hari Juang Polri",
    date: "14 Januari 2025",
  },
];

const recentNewsData: Article[] = [
  {
    image: "/vaksin.jpg",
    category: "BERANDA",
    title: "Vaksinasi Pencegahan dan Pengenalian DBD",
    author: "SALMA HASNA",
    date: "14 Januari 2025",
    excerpt:
      "Fokusaja.com - Kementerian Kesehatan RI dan PT Takeda Innovative Medicines mengembangkan kampanye #Ayo3MPlusVaksinDBD ke Surabaya, Jawa Timur, melalui acara Langkah..., tetapi juga...",
  },
  {
    image: "/mental.png",
    category: "SUARA WARGA",
    date: "14 Januari 2025",
    author: "SALMA HASNA",
    title: "Pentingnya Kesehatan Mental",
    excerpt:
      "FokusAja.com - Kesehatan mental adalah kondisi yang berkaitan dengan keadaan emosi, kejiwaan, dan psikis seseorang. Ini mencakup bagaimana kita merasa,...",
  },
  {
    image: "/hpv.jpg",
    category: "BERANDA",
    date: "14 Januari 2025",
    author: "SALMA HASNA",
    title: "Vaksin HPV Cegah Kanker Serviks",
    excerpt:
      "FokusAja.com - Anindhita, seorang dokter dari Rumah Sakit Persahabatan, menekankan pentingnya memberikan vaksin human papillomavirus (HPV) kepada anak perempuan pada...",
  },
  {
    image: "/pmk.jpg",
    category: "BERANDA",
    author: "SALMA HASNA",
    date: "14 Januari 2025",
    title:
      "Penyebaran Kasus PMK di Kabupaten Garut: Langkah Cepat Diskannak dan Imbauan kepada Masyarakat",
    excerpt:
      " FokusAja.com - Wabah Penyakit Mulut dan Kuku (PMK) kembali menyebar di Kabupaten Garut, kali ini terdeteksi di Kecamatan Cilawu, Wanaraja,...",
  },
];

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
            <img
              src="/menhub.jpg"
              alt="Berita 1"
              className="w-14 h-14 object-cover rounded"
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
            <img
              src="/gugur.jpg"
              alt="Berita 2"
              className="w-14 h-14 object-cover rounded"
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
            <img
              src="/bergizi.png"
              alt="Berita 3"
              className="w-14 h-14 object-cover rounded"
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
