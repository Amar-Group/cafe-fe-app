import { HeroSection } from "./_components/hero-section";
import { FeaturedMenuSection } from "./_components/featured-menu-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CtaSection } from "./_components/cta-section";
import { OwnerQuoteSection } from "./_components/owner-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <OwnerQuoteSection/>
      <FeaturedMenuSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
