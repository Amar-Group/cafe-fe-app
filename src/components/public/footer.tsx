"use client";

import Link from "next/link";
import {
  Camera,
  Globe,
  AtSign,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from "lucide-react";

const FOOTER_LINKS = {
  Menu: [
    { label: "Coffee & Drinks", href: "#menu" },
    { label: "Main Course", href: "#menu" },
    { label: "Desserts & Pastry", href: "#menu" },
    { label: "Signature Collection", href: "#featured" },
  ],
  Visit: [
    { label: "Location & Hours", href: "#contact" },
    { label: "Reserve a Table", href: "#reservation" },
    { label: "Gallery", href: "#gallery" },
    { label: "Events", href: "#events" },
  ],
  Connect: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Partnership", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
};

export function CafeFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-cafe-charcoal text-cafe-cream overflow-hidden">
      {/* Noise */}
      <div className="absolute inset-0 cafe-noise" />

      {/* Top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-cafe-brown/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-full bg-cafe-cream/10 flex items-center justify-center">
                <span className="font-display text-xl font-bold text-cafe-cream">
                  S
                </span>
              </div>
              <span className="font-display text-2xl font-semibold tracking-wide">
                Savoria
              </span>
            </div>
            <p className="text-cafe-sand/45 text-sm font-light leading-relaxed max-w-xs mb-6">
              A modern lifestyle cafe & restaurant where every flavor tells a
              story. Great food, creative drinks, and the perfect atmosphere.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm text-cafe-sand/40">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-cafe-brown-light" />
                Jl. Sunset Boulevard No. 88, Jakarta Selatan
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-cafe-brown-light" />
                +62 812 3456 7890
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-cafe-brown-light" />
                hello@savoria.cafe
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Camera, href: "#", label: "Instagram" },
                { icon: Globe, href: "#", label: "Facebook" },
                { icon: AtSign, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-cafe-cream/5 flex items-center justify-center text-cafe-sand/40 hover:bg-cafe-brown hover:text-cafe-cream transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-base font-semibold text-cafe-cream mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cafe-sand/40 hover:text-cafe-cream transition-colors duration-200 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-cafe-cream/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cafe-sand/25 font-light">
            © {new Date().getFullYear()} Savoria Cafe & Restaurant. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs text-cafe-sand/30 hover:text-cafe-cream transition-colors"
          >
            Back to top
            <div className="w-8 h-8 rounded-full bg-cafe-cream/5 flex items-center justify-center group-hover:bg-cafe-cream/15 transition-colors">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
