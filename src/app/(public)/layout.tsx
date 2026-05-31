import { Cormorant_Garamond, Manrope } from "next/font/google";

const cormorant = Cormorant_Garamond({
  variable: "--font-cafe-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-cafe-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Savoria — Modern Lifestyle Cafe & Restaurant",
  description:
    "Experience the perfect blend of premium coffee, artisan cuisine, and modern ambience. From signature drinks to gourmet meals, Savoria is your destination for unforgettable moments.",
};

import { CafeNavbar } from "@/components/public/navbar";
import { CafeFooter } from "@/components/public/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${manrope.variable} cafe-scroll cafe-scrollbar`}
      style={{ fontFamily: "var(--font-cafe-body), sans-serif" }}
    >
      <CafeNavbar />
      {children}
      <CafeFooter />
    </div>
  );
}
