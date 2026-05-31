"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { 
  Music, 
  Calendar, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Trophy, 
  Target } from "lucide-react";

const EVENTS = [
  {
    icon: Music,
    title: "Live Acoustic Night",
    date: "Every Friday & Saturday",
    time: "19:00 – 22:00",
    description: "Enjoy dinner and drinks with soulful live acoustic performances from local artists.",
    tag: "Weekly",
    tagColor: "bg-cafe-olive text-white",
    accentBg: "bg-gradient-to-br from-cafe-olive/10 to-cafe-olive/5",
  },
  {
    icon: Trophy,
    title: "8-Ball Savoria Cup",
    date: "End of Every Month",
    time: "15:00 – Finish",
    description: "Compete against the local finest players. Secure your bracket slot, aim true, and win the grand cash prize.",
    tag: "Tournament",
    tagColor: "bg-amber-600 text-white",
    accentBg: "bg-gradient-to-br from-amber-600/10 to-amber-600/5",
  },
  {
    icon: Sparkles,
    title: "Seasonal Tasting Menu",
    date: "June 2024",
    time: "Limited Time",
    description: "A 5-course culinary journey featuring the finest seasonal ingredients curated by our chef.",
    tag: "New",
    tagColor: "bg-cafe-orange text-white",
    accentBg: "bg-gradient-to-br from-cafe-orange/10 to-cafe-orange/5",
  },
  {
    icon: Target,
    title: "Billiard Coaching Clinic",
    date: "Every Tuesday Night",
    time: "18:00 – 20:00",
    description: "Want to fix your stance or learn trick shots? Get free hands-on guidance from certified billiard coaches.",
    tag: "Free Clinic",
    tagColor: "bg-emerald-600 text-white",
    accentBg: "bg-gradient-to-br from-emerald-600/10 to-emerald-600/5",
  },
  {
    icon: Tag,
    title: "Weekday Happy Hour",
    date: "Monday – Thursday",
    time: "15:00 – 17:00",
    description: "Buy 1 Get 1 on all signature drinks. Bring a friend, share the moment.",
    tag: "Promo",
    tagColor: "bg-rose-500 text-white",
    accentBg: "bg-gradient-to-br from-rose-500/10 to-rose-500/5",
  },
  {
    icon: Calendar,
    title: "Private Event Booking",
    date: "Available Anytime",
    time: "Custom",
    description: "Host your birthday, gathering, or corporate event in our exclusive private dining area.",
    tag: "Book Now",
    tagColor: "bg-cafe-brown text-white",
    accentBg: "bg-gradient-to-br from-cafe-brown/10 to-cafe-brown/5",
  },
];

export function EventsSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="events"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-charcoal overflow-hidden"
    >
      <div className="absolute inset-0 cafe-noise" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cafe-brown/8 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            What&apos;s Happening
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-cream font-light leading-tight mb-6">
            Events &
            <br />
            <em className="font-medium not-italic text-cafe-brown-light">
              Promotions
            </em>
          </h2>
          <p className="text-cafe-sand/50 text-base md:text-lg max-w-xl mx-auto font-light">
            There&apos;s always something special brewing. Join us for live
            music, billiard tournaments, and irresistible deals.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-5 cafe-stagger">
          {EVENTS.map((event) => (
            <div
              key={event.title}
              className={cn(
                "cafe-reveal group relative rounded-2xl p-6 md:p-8 border border-cafe-cream/5 hover:border-cafe-cream/15 transition-all duration-500 cursor-pointer",
                event.accentBg
              )}
            >
              <div className="flex gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cafe-cream/10 flex items-center justify-center text-cafe-cream/70 group-hover:text-cafe-orange transition-colors duration-300">
                  <event.icon size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-display text-xl text-cafe-cream font-medium leading-snug">
                      {event.title}
                    </h3>
                    <span
                      className={cn(
                        "flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase",
                        event.tagColor
                      )}
                    >
                      {event.tag}
                    </span>
                  </div>
                  <p className="text-cafe-sand/45 text-sm leading-relaxed font-light mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-cafe-sand/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {event.date}
                    </span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-cafe-cream/5 flex items-center justify-center text-cafe-cream/30 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}