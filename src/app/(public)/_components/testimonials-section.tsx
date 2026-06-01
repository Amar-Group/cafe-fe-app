"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Anisa Putri",
    role: "Food Blogger",
    avatar: "AP",
    rating: 5,
    text: "Savoria completely redefines what a cafe can be. The truffle pasta is out of this world, and the ambience? Perfect for content creation. I keep coming back!",
    accentColor: "bg-cafe-orange",
  },
  {
    name: "Rizky Aditya",
    role: "Remote Worker",
    avatar: "RA",
    rating: 5,
    text: "My go-to workspace! Fast WiFi, great coffee, and the rice bowls keep me fueled all day. The staff really understands what WFH warriors need.",
    accentColor: "bg-cafe-olive",
  },
  {
    name: "Sarah Lim",
    role: "Regular Customer",
    avatar: "SL",
    rating: 5,
    text: "We celebrated my daughter's birthday here — the private area was perfect, and the desserts were stunning. Savoria makes every occasion feel special.",
    accentColor: "bg-cafe-brown",
  },
  {
    name: "Marco Tanaka",
    role: "Culinary Enthusiast",
    avatar: "MT",
    rating: 4,
    text: "Finally, a place that does both coffee AND food exceptionally well. The signature drink menu is creative without being pretentious. Love the mocktails too!",
    accentColor: "bg-rose-400",
  },
];

export function TestimonialsSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cafe-sand/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            What They Say
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Loved by
            <br />
            <em className="font-medium not-italic text-cafe-brown">
              Our Guests
            </em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 cafe-stagger">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className={cn(
                "cafe-reveal relative bg-white rounded-2xl p-6 border border-cafe-sand/50 hover:shadow-xl hover:shadow-cafe-charcoal/5 transition-all duration-500 group",
                idx === 0 && "md:col-span-2 lg:col-span-1"
              )}
            >
              {/* Quote Icon */}
              <div className="absolute top-5 right-5 text-cafe-sand">
                <Quote size={28} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < t.rating
                        ? "fill-cafe-orange text-cafe-orange"
                        : "fill-cafe-sand text-cafe-sand"
                    )}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-cafe-charcoal text-sm leading-relaxed mb-6 min-h-[80px]">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-cafe-sand/40">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    t.accentColor
                  )}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-cafe-charcoal font-semibold text-sm">
                    {t.name}
                  </p>
                  <p className="text-cafe-charcoal/70 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 cafe-reveal">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-cafe-charcoal">
              4.9
            </p>
            <div className="flex items-center gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  className="fill-cafe-orange text-cafe-orange"
                />
              ))}
            </div>
            <p className="text-cafe-charcoal/70 text-xs mt-1">Google Reviews</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-cafe-sand" />
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-cafe-charcoal">
              2.5K+
            </p>
            <p className="text-cafe-charcoal/70 text-xs mt-1">
              Happy Customers Monthly
            </p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-cafe-sand" />
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-cafe-charcoal">
              15K+
            </p>
            <p className="text-cafe-charcoal/70 text-xs mt-1">
              Instagram Followers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
