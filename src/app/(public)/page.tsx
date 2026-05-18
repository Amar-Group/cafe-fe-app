import { HeroSection } from "@/components/public/hero-section";
import { FeaturedMenuSection } from "@/components/public/featured-menu-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { CtaSection } from "@/components/public/cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedMenuSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
