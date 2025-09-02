import HeadersAchievment from "@/components/landing-page/achievments";
import Footer from "@/components/landing-page/footer";
import HeadersActivity from "@/components/landing-page/headers-activity";
import HeadersOpini from "@/components/landing-page/headers-opinion";
import Navbar from "@/components/landing-page/navbar";

export default function Achievments() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <Navbar />
        <div className="flex-1">
          <HeadersAchievment />
        </div>
        <Footer />
      </div>
    </div>
  );
}
