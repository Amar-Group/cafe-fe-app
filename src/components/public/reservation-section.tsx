"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  Users,
  Utensils,
  MessageSquare,
  Check,
} from "lucide-react";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, "9+"];

export function ReservationSection() {
  const ref = useScrollReveal();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string | number>("");
  const [seatingPref, setSeatingPref] = useState<"indoor" | "outdoor" | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section
        id="reservation"
        ref={ref}
        className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
      >
        <div className="max-w-lg mx-auto px-4 text-center cafe-reveal">
          <div className="w-20 h-20 rounded-full bg-cafe-olive/10 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-cafe-olive" />
          </div>
          <h3 className="font-display text-3xl text-cafe-charcoal font-medium mb-4">
            Reservation Confirmed!
          </h3>
          <p className="text-cafe-charcoal/55 font-light mb-8">
            Thank you, {name}. We&apos;ve received your reservation. You&apos;ll receive
            a confirmation via WhatsApp shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-cafe-charcoal text-cafe-cream rounded-full text-sm font-semibold tracking-wide hover:bg-cafe-dark transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reservation"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-cafe-sand/30 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Reserve Your Spot
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Book a
            <br />
            <em className="font-medium not-italic text-cafe-brown">Table</em>
          </h2>
          <p className="text-cafe-charcoal/80 text-base md:text-lg max-w-lg mx-auto font-light">
            Secure your perfect spot at Savoria. Whether it&apos;s a casual lunch or
            a special dinner — we&apos;ll make it memorable.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl shadow-cafe-charcoal/5 p-6 md:p-10 border border-cafe-sand/30 cafe-reveal"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal placeholder:text-cafe-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812 xxxx xxxx"
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal placeholder:text-cafe-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <CalendarDays size={12} className="inline mr-1.5" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Clock size={12} className="inline mr-1.5" />
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Users size={12} className="inline mr-1.5" />
                Guests
              </label>
              <div className="flex flex-wrap gap-2">
                {GUEST_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGuests(g)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-sm font-medium border transition-all duration-200",
                      selectedGuests === g
                        ? "bg-cafe-charcoal text-cafe-cream border-cafe-charcoal"
                        : "bg-white text-cafe-charcoal border-cafe-sand hover:border-cafe-brown/40"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Utensils size={12} className="inline mr-1.5" />
                Seating Preference
              </label>
              <div className="flex gap-3">
                {(["indoor", "outdoor"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSeatingPref(opt)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-medium border capitalize transition-all duration-200",
                      seatingPref === opt
                        ? "bg-cafe-charcoal text-cafe-cream border-cafe-charcoal"
                        : "bg-white text-cafe-charcoal border-cafe-sand hover:border-cafe-brown/40"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <MessageSquare size={12} className="inline mr-1.5" />
                Special Requests (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Birthday cake, dietary needs, high chair, etc."
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal placeholder:text-cafe-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-10 py-4 bg-cafe-charcoal text-cafe-cream rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-dark transition-all duration-300 hover:shadow-lg hover:shadow-cafe-charcoal/20"
            >
              Confirm Reservation
            </button>
            <p className="mt-3 text-xs text-cafe-charcoal/60 font-light">
              Confirmation will be sent via WhatsApp within 30 minutes
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
