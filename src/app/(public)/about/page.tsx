import { AboutCafeSection } from "./_components/about-cafe-section";
import { AboutBilliardSection } from "./_components/about-billiard-section";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <AboutCafeSection />
      <AboutBilliardSection/>
    </main>
  );
}
