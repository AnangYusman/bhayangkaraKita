import Footer from "@/components/landing-page/footer";
import HeadersActivity from "@/components/landing-page/headers-activity";
import HeadersOpini from "@/components/landing-page/headers-opinion";
import Navbar from "@/components/landing-page/navbar";

export default function Opinion() {
  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <Navbar />
        <div className="flex-1">
          <HeadersOpini />
        </div>
        <Footer />
      </div>
    </div>
  );
}
