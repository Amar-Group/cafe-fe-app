import { AboutCafeSection } from "@/components/public/about-cafe-section";
import { AboutBilliardSection } from "@/components/public/about-billiard-section";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <AboutCafeSection />
      <AboutBilliardSection/>
    </main>
  );
}
