import CallToAction from "@/components/landing/CallToAction";
import FeaturedAlbums from "@/components/landing/FeaturedAlbums";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedAlbums />
      <HowItWorks />
      <CallToAction />
    </>
  );
}
