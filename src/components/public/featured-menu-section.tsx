"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star, Flame, Award, Heart } from "lucide-react";

const SIGNATURE_ITEMS = [
  {
    name: "Truffle Mushroom Pasta",
    category: "Main Course",
    description:
      "Hand-rolled fettuccine tossed in a velvety truffle cream sauce with wild mushrooms, finished with aged parmesan and fresh herbs.",
    price: "89K",
    image: "/images/cafe/pasta.png",
    badge: "Chef's Pick",
    badgeIcon: Award,
    badgeColor: "bg-cafe-olive text-white",
  },
  {
    name: "Caramel Cloud Latte",
    category: "Signature Drink",
    description:
      "Double-shot espresso layered with silky oat milk, house-made caramel, and a cloud of vanilla cream foam.",
    price: "52K",
    image: "/images/cafe/signature-drink.png",
    badge: "Best Seller",
    badgeIcon: Flame,
    badgeColor: "bg-cafe-orange text-white",
  },
  {
    name: "Berry Crème Brûlée",
    category: "Dessert",
    description:
      "Classic French custard with a caramelized sugar crust, served with seasonal berries and matcha roll cake.",
    price: "65K",
    image: "/images/cafe/dessert.png",
    badge: "Fan Favorite",
    badgeIcon: Heart,
    badgeColor: "bg-rose-500 text-white",
  },
];

export function FeaturedMenuSection() {
  const ref = useScrollReveal();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="featured"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-charcoal overflow-hidden"
    >
      {/* Subtle grain */}
      <div className="absolute inset-0 cafe-noise" />

      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-cafe-brown/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Signature Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-cream font-light leading-tight mb-6">
            Curated with
            <br />
            <em className="font-medium not-italic text-cafe-brown-light">
              Passion
            </em>
          </h2>
          <p className="text-cafe-sand/50 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Our signature menu — handpicked favorites that define the Savoria
            experience. Each dish tells a story of flavor and craftsmanship.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 cafe-stagger">
          {SIGNATURE_ITEMS.map((item, idx) => (
            <div
              key={item.name}
              className="cafe-reveal group relative bg-cafe-dark/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-cafe-cream/5 hover:border-cafe-cream/15 transition-all duration-500"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700",
                    hoveredIdx === idx ? "scale-110" : "scale-100"
                  )}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cafe-dark/80 via-transparent to-transparent" />

                {/* Badge */}
                <div
                  className={cn(
                    "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase",
                    item.badgeColor
                  )}
                >
                  <item.badgeIcon size={12} />
                  {item.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <span className="text-cafe-brown-light text-xs tracking-[0.2em] uppercase font-medium">
                  {item.category}
                </span>
                <h3 className="font-display text-xl md:text-2xl text-cafe-cream font-medium leading-snug">
                  {item.name}
                </h3>
                <p className="text-cafe-sand/45 text-sm leading-relaxed font-light line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-cafe-cream/8">
                  <span className="font-display text-2xl text-cafe-orange font-semibold">
                    {item.price}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className="fill-cafe-orange text-cafe-orange"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
