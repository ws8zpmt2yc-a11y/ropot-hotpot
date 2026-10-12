import { Hero } from "@/components/home/Hero";
import { BrandStrip } from "@/components/home/BrandStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StationShowreel } from "@/components/home/StationShowreel";
import { FoodFeature } from "@/components/home/FoodFeature";
import { TakeawaySection } from "@/components/home/TakeawaySection";
import { MeetRoPot } from "@/components/home/MeetRoPot";
import { PosterSection } from "@/components/home/PosterSection";
import { LocationsStrip } from "@/components/home/LocationsStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <HowItWorks />
      <StationShowreel />
      <FoodFeature />
      <TakeawaySection />
      <MeetRoPot />
      <PosterSection />
      <LocationsStrip />
    </>
  );
}
