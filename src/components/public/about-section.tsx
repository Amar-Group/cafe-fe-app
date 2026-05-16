"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Utensils, Coffee, Clock, Wifi } from "lucide-react";

const FEATURES = [
  {
    icon: Utensils,
    title: "Full Menu",
    description: "From artisan coffee to gourmet meals — breakfast, lunch, dinner, and everything in between.",
  },
  {
    icon: Coffee,
    title: "Crafted Drinks",
    description: "Specialty coffee, fresh mocktails, premium tea — every sip is a masterpiece.",
  },
  {
    icon: Clock,
    title: "Open Late",
    description: "Morning hustle or midnight cravings — we're here from dawn till the city sleeps.",
  },
  {
    icon: Wifi,
    title: "Work Friendly",
    description: "Fast WiFi, power outlets, and the perfect ambience for your most productive hours.",
  },
];

export function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-warm-white overflow-hidden"
    >
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cafe-sand/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Our Story
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            More Than Just
            <br />
            <em className="font-medium not-italic text-cafe-brown">a Cafe</em>
          </h2>
          <p className="text-cafe-charcoal/80 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Savoria is a modern lifestyle destination where great food, creative drinks, 
            and warm atmosphere come together. Whether you're here to work, celebrate, 
            or simply enjoy a quiet moment — this is your place.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image Collage */}
          <div className="relative cafe-reveal-left">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden cafe-img-zoom">
              <Image
                src="/images/cafe/interior.png"
                alt="Savoria cafe interior with warm ambient lighting"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl shadow-xl shadow-cafe-charcoal/8 p-5 max-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-cafe-olive/10 flex items-center justify-center text-cafe-olive">
                  <Utensils size={18} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-cafe-charcoal">
                    150+
                  </p>
                </div>
              </div>
              <p className="text-xs text-cafe-charcoal/70 font-medium leading-relaxed">
                Menu items crafted with passion and premium ingredients
              </p>
            </div>
            {/* Decorative line */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-cafe-brown/20 rounded-tl-3xl" />
          </div>

          {/* Right - Features */}
          <div className="cafe-reveal-right">
            <div className="space-y-8 cafe-stagger">
              {FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="cafe-reveal group flex gap-5 p-4 rounded-2xl hover:bg-cafe-sand/30 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cafe-sand/50 flex items-center justify-center text-cafe-brown group-hover:bg-cafe-brown group-hover:text-cafe-cream transition-colors duration-300">
                    <feat.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-cafe-charcoal font-semibold text-lg mb-1.5 font-display">
                      {feat.title}
                    </h3>
                    <p className="text-cafe-charcoal/75 text-sm leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
