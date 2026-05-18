"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ShoppingBag,
  MapPin,
  Phone,
  Clock,
  Camera,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Reservation", href: "/reservation" },
  { label: "Contact", href: "/contact" },
];

export function CafeNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Use pathname for active tracking
  const activeSection = pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        )}
      >
        <div className="bg-cafe-charcoal/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9 text-xs tracking-wide">
            <div className="hidden sm:flex items-center gap-5 text-cafe-sand/80">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                Mon–Sun: 08:00 – 23:00
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} />
                +62 812 3456 7890
              </span>
            </div>
            <div className="flex items-center gap-4 text-cafe-sand/80 ml-auto sm:ml-0">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} />
                Jl. Sunset Boulevard No. 88
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cafe-orange transition-colors"
              >
                <Camera size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        className={cn(
          "fixed left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "top-0 bg-white backdrop-blur-xl shadow-lg shadow-cafe-charcoal/10 border-b border-cafe-sand/50"
            : "top-9 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => handleNavClick("/")}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300",
                scrolled
                  ? "bg-cafe-charcoal text-cafe-cream"
                  : "bg-cafe-cream/20 text-cafe-cream backdrop-blur-sm"
              )}
            >
              <span className="font-display text-xl font-bold leading-none">
                S
              </span>
            </div>
            <span
              className={cn(
                "font-display text-2xl font-semibold tracking-wide transition-colors duration-300",
                scrolled ? "text-cafe-charcoal" : "text-cafe-cream"
              )}
            >
              Savoria
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "relative px-4 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-300",
                  scrolled
                    ? activeSection === link.href
                      ? "text-cafe-brown"
                      : "text-cafe-charcoal hover:text-cafe-brown"
                    : activeSection === link.href
                    ? "text-cafe-orange"
                    : "text-cafe-cream/80 hover:text-cafe-cream"
                )}
              >
                {link.label}
                {activeSection === link.href && (
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full transition-colors duration-300",
                      scrolled ? "bg-cafe-brown" : "bg-cafe-orange"
                    )}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              className={cn(
                "hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide uppercase transition-all duration-300",
                scrolled
                  ? "bg-cafe-charcoal text-cafe-cream hover:bg-cafe-dark"
                  : "bg-cafe-cream/15 text-cafe-cream backdrop-blur-sm border border-cafe-cream/20 hover:bg-cafe-cream/25"
              )}
            >
              <ShoppingBag size={15} />
              Order Now
            </button>
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors duration-300",
                scrolled
                  ? "text-cafe-charcoal hover:bg-cafe-sand/50"
                  : "text-cafe-cream hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden transition-all duration-500",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-cafe-dark/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 w-[280px] h-full bg-cafe-warm-white shadow-2xl transition-transform duration-500 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-6 pt-20 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "text-left px-4 py-3 rounded-xl text-base font-medium tracking-wide transition-colors",
                  activeSection === link.href
                    ? "bg-cafe-sand/60 text-cafe-brown"
                    : "text-cafe-charcoal/70 hover:bg-cafe-sand/30 hover:text-cafe-charcoal"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 border-t border-cafe-sand pt-6">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cafe-charcoal text-cafe-cream text-sm font-semibold tracking-wide uppercase hover:bg-cafe-dark transition-colors">
                <ShoppingBag size={16} />
                Order Now
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs text-cafe-charcoal/50">
              <p className="flex items-center gap-2">
                <Clock size={12} /> Mon–Sun: 08:00 – 23:00
              </p>
              <p className="flex items-center gap-2">
                <Phone size={12} /> +62 812 3456 7890
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={12} /> Jl. Sunset Boulevard No. 88
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
