import { CafeNavbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { FeaturedMenuSection } from "@/components/public/featured-menu-section";
import { MenuPreviewSection } from "@/components/public/menu-preview-section";
import { GallerySection } from "@/components/public/gallery-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { EventsSection } from "@/components/public/events-section";
import { ReservationSection } from "@/components/public/reservation-section";
import { CtaSection } from "@/components/public/cta-section";
import { LocationSection } from "@/components/public/location-section";
import { CafeFooter } from "@/components/public/footer";

export default function HomePage() {
  return (
    <main>
      <CafeNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturedMenuSection />
      <MenuPreviewSection />
      <GallerySection />
      <TestimonialsSection />
      <EventsSection />
      <ReservationSection />
      <CtaSection />
      <LocationSection />
      <CafeFooter />
    </main>
  );
}
