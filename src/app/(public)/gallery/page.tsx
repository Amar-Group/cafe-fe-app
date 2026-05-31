import { GallerySection } from "@/components/public/gallery-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { BilliardSection } from "@/components/public/gallery-billiard-section";
export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <GallerySection />
      <BilliardSection/>
      <TestimonialsSection/>
    </main>
  );
}
