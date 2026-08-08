import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturesGrid } from "@/components/features-grid";
import { DashboardPreview } from "@/components/dashboard-preview";
import { CtaBand } from "@/components/cta-band";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <DashboardPreview />
      <CtaBand />
    </main>
  );
}
