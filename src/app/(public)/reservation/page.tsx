import { ReservationSection } from "@/components/public/reservation-section";
import { BilliardSection } from "@/components/public/billiard-section";

export default function ReservationPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <BilliardSection/>
      <ReservationSection />
    </main>
  );
}
