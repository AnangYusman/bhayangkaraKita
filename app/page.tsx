import Footer from "@/components/landing-page/footer";
import Beranda from "@/components/landing-page/headers";
import Navbar from "@/components/landing-page/navbar";
import News from "@/components/landing-page/news";
import Opini from "@/components/landing-page/opini";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)] bg-white">
      <Navbar />
      <div className="flex-1">
        <Beranda />
      </div>
      <News />
      <Opini />
      <Footer />
    </div>
  );
}
