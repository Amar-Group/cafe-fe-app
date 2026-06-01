"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Camera,
  Globe,
  AtSign,
  MessageCircle,
} from "lucide-react";

export function LocationSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-warm-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Find Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Visit
            <br />
            <em className="font-medium not-italic text-cafe-brown">Savoria</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-3 cafe-reveal-left">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-cafe-sand/20 border border-cafe-sand/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2087634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Savoria cafe location on Google Maps"
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-5 cafe-reveal-right cafe-stagger">
            {/* Address */}
            <div className="cafe-reveal bg-white rounded-2xl p-6 border border-cafe-sand/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-cafe-brown/10 flex items-center justify-center text-cafe-brown">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-display text-cafe-charcoal font-semibold text-base mb-1">
                    Address
                  </h4>
                  <p className="text-cafe-charcoal/55 text-sm font-light leading-relaxed">
                    Jl. Sunset Boulevard No. 88
                    <br />
                    Jakarta Selatan, DKI Jakarta 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="cafe-reveal bg-white rounded-2xl p-6 border border-cafe-sand/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-cafe-olive/10 flex items-center justify-center text-cafe-olive">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-display text-cafe-charcoal font-semibold text-base mb-1">
                    Opening Hours
                  </h4>
                  <div className="text-cafe-charcoal/55 text-sm font-light space-y-1">
                    <p>Monday – Friday: 08:00 – 23:00</p>
                    <p>Saturday – Sunday: 07:00 – 00:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="cafe-reveal bg-white rounded-2xl p-6 border border-cafe-sand/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-cafe-orange/10 flex items-center justify-center text-cafe-orange">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-display text-cafe-charcoal font-semibold text-base mb-1">
                    Contact
                  </h4>
                  <div className="text-cafe-charcoal/55 text-sm font-light space-y-1">
                    <p>+62 812 3456 7890</p>
                    <p>hello@savoria.cafe</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div className="cafe-reveal bg-white rounded-2xl p-6 border border-cafe-sand/30">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-cafe-sand/50 flex items-center justify-center text-cafe-charcoal/60">
                  <Car size={20} />
                </div>
                <div>
                  <h4 className="font-display text-cafe-charcoal font-semibold text-base mb-1">
                    Parking
                  </h4>
                  <p className="text-cafe-charcoal/55 text-sm font-light">
                    Free parking available for cars & motorcycles.
                    Valet service on weekends.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/6281234567890?text=Hi%20Savoria!"
              target="_blank"
              rel="noopener noreferrer"
              className="cafe-reveal flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-2xl text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-300 group"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>

            {/* Social Links */}
            <div className="cafe-reveal flex items-center justify-center gap-4 pt-2">
              {[
                { icon: Camera, href: "https://instagram.com/savoria.cafe", label: "Instagram" },
                { icon: Globe, href: "https://facebook.com/savoriacafe", label: "Facebook" },
                { icon: AtSign, href: "https://twitter.com/savoriacafe", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-cafe-sand/40 flex items-center justify-center text-cafe-charcoal/50 hover:bg-cafe-brown hover:text-cafe-cream transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
