import DetailContent from "@/components/details/details-content";
import Footer from "@/components/landing-page/footer";
import HeadersActivity from "@/components/landing-page/headers-activity";
import Navbar from "@/components/landing-page/navbar";
import HeadersService from "@/components/landing-page/service";
import Image from "next/image";

export default function Service() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <Navbar />
        <div className="flex-1">
          <HeadersService />
        </div>
        <Footer />
      </div>
    </div>
  );
}
