"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Crosshair, Trophy, Users, Star } from "lucide-react";

const BILLIARD_FEATURES = [
  {
    icon: Crosshair,
    title: "Premium Tables",
    description: "Equipped with professional-grade tournament tables and perfectly leveled slates for precise shots.",
  },
  {
    icon: Users,
    title: "Spacious Arena",
    description: "Ample room between tables ensuring comfortable cue action and uninterrupted gameplay for everyone.",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Join our regular 8-ball and 9-ball competitions to test your skills and win exclusive prizes.",
  },
  {
    icon: Star,
    title: "VIP Experience",
    description: "Book our private billiard room complete with dedicated service, perfect for parties or executive gatherings.",
  },
];

export function AboutBilliardSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="billiard"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-charcoal overflow-hidden"
    >
      {/* Background decorative element */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4" />
      <div className="absolute inset-0 cafe-noise opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-emerald-500 text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            The Billiard Lounge
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-cream font-light leading-tight mb-6">
            Rack 'em Up &
            <br />
            <em className="font-medium not-italic text-emerald-400">Break Hard</em>
          </h2>
          <p className="text-cafe-sand/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Experience the thrill of the game in our dedicated billiard lounge. 
            Whether you are a casual player enjoying a night out or a seasoned 
            pro honing your break, we provide the perfect arena for every shot.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Features (Reversed position for visual variety) */}
          <div className="cafe-reveal-left order-2 lg:order-1">
            <div className="space-y-8 cafe-stagger">
              {BILLIARD_FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="cafe-reveal group flex gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-cafe-cream transition-colors duration-300">
                    <feat.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-cafe-cream font-semibold text-lg mb-1.5 font-display">
                      {feat.title}
                    </h3>
                    <p className="text-cafe-sand/60 text-sm leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image Collage */}
          <div className="relative cafe-reveal-right order-1 lg:order-2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden cafe-img-zoom border border-white/10 shadow-2xl">
              <Image
                src="/images/revisi/16.jpg" // Sesuaikan path ini dengan foto billiard kamu
                alt="Premium billiard tables at Savoria Lounge"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-cafe-charcoal border border-white/10 rounded-2xl shadow-xl p-5 max-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Crosshair size={18} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-cafe-cream">
                    12
                  </p>
                </div>
              </div>
              <p className="text-xs text-cafe-sand/70 font-medium leading-relaxed">
                Tournament-grade tables waiting for your best break
              </p>
            </div>
            
            {/* Decorative line */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-r-2 border-t-2 border-emerald-500/30 rounded-tr-3xl" />
          </div>

        </div>
      </div>
    </section>
  );
}