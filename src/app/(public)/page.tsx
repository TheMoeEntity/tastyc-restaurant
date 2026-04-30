import AboutSection from "@/components/sections/Home/AboutSection";
import DownloadAppSection from "@/components/sections/Home/DownloadApp";
import Features from "@/components/sections/Home/Features";
import Hero from "@/components/sections/Home/Hero";
import Newsletter from "@/components/sections/Home/NewsLetter";
import Testimonials from "@/components/sections/Home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Features />
      <Testimonials />
      <DownloadAppSection />
      <Newsletter />
    </>
  );
}
