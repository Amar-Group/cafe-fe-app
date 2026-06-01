import { GallerySection } from "./_components/gallery-section";
import { TestimonialsSection } from "@/app/(public)/_components/testimonials-section";
import { BilliardSection } from "./_components/gallery-billiard-section";
export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <GallerySection />
      <BilliardSection/>
      <TestimonialsSection/>
    </main>
  );
}
