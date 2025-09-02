import DetailContent from "@/components/details/details-content";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="relative z-10 bg-[#F2F4F3] max-w-7xl mx-auto">
        <Navbar />
        <div className="flex-1">
          <DetailContent />
        </div>

        <Footer />
      </div>
    </div>
  );
}
