// src/app/page.tsx

import Hero from "@/components/Hero.tsx";
import HowItWorks from "@/components/HowItWorks.tsx";
import FeatureGrid from "@/components/FeaturesGrid.tsx";
import DashboardPreview from "@/components/DashboardPreview.tsx";
import CtaBand from "@/components/CtaBand.tsx";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <HowItWorks />
        <FeatureGrid />
        <DashboardPreview />
        <CtaBand />
      </main>
    </>
  );
}
