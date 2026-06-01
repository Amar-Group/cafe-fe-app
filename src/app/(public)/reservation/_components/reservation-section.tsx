"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import {
  Clock,
  Timer,
  MessageSquare,
  Check,
  LayoutGrid,
  QrCode,
  ChevronLeft,
  Wallet,
  Banknote,
} from "lucide-react";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
  "22:00", "23:00",
];

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

// Harga simulasi per jam
const RATE_STANDARD = 50000;
const RATE_VIP = 80000;

export function ReservationSection() {
  const ref = useScrollReveal();

  // Navigation State
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isRetrying, setIsRetrying] = useState(false);

  // Input States
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");

  // Kalkulasi Harga
  const isVip = selectedTable.toLowerCase().includes("vip");
  const pricePerHour = isVip ? RATE_VIP : RATE_STANDARD;
  const totalAmount = duration * pricePerHour;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) {
      alert("Please select a duration (hours) for your booking.");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setSelectedTable("");
    setSelectedTime("");
    setDuration(0);
    setNotes("");
    setPaymentMethod("qris");
    setStep("form");
    setIsRetrying(true);

    setTimeout(() => {
      document.getElementById("reservation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  // Format ke Rupiah
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ====================
  // RENDER TAHAP SUKSES
  // ====================
  if (step === "success") {
    return (
      <section
        id="reservation"
        ref={ref}
        className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
      >
        <div className="max-w-lg mx-auto px-4 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-cafe-olive/10 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-cafe-olive" />
          </div>
          <h3 className="font-display text-3xl text-cafe-charcoal font-medium mb-4">
            Booking Confirmed!
          </h3>
          <p className="text-cafe-charcoal/60 font-light mb-8">
            Thank you, <span className="font-medium text-cafe-charcoal">{name}</span>. We&apos;ve received your reservation.
            {paymentMethod === "qris"
              ? " Your payment has been verified."
              : " Please make your payment at the cashier upon arrival."}
          </p>

          <div className="bg-white border border-cafe-sand/50 shadow-sm rounded-3xl p-6 md:p-8 text-left mb-8 w-full mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-cafe-olive/60" />
            <h4 className="text-xs font-bold text-cafe-brown uppercase tracking-[0.2em] mb-5 border-b border-cafe-sand/30 pb-3 text-center">
              Booking Details
            </h4>
            <ul className="space-y-3.5 text-sm text-cafe-charcoal">
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Name</span>
                <span className="font-semibold">: {name}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Table No.</span>
                <span className="font-semibold">: {selectedTable}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Time</span>
                <span className="font-semibold">: {selectedTime}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Duration</span>
                <span className="font-semibold">: {duration} Hour(s)</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Payment Method</span>
                <span className="font-semibold uppercase">: {paymentMethod}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Total Due</span>
                <span className="font-semibold text-cafe-olive">: {formatIDR(totalAmount)}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            className="px-8 py-3.5 bg-cafe-charcoal text-cafe-cream rounded-full text-sm font-semibold tracking-wide hover:bg-cafe-dark transition-colors shadow-lg shadow-cafe-charcoal/10"
          >
            Make Another Booking
          </button>
        </div>
      </section>
    );
  }

  // ========================
  // RENDER TAHAP PEMBAYARAN
  // ========================
  if (step === "payment") {
    return (
      <section
        id="reservation"
        ref={ref}
        className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
      >
        <div className="max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setStep("form")}
            className="flex items-center text-sm font-medium text-cafe-charcoal/60 hover:text-cafe-brown mb-8 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to edit details
          </button>

          <div className="text-center mb-8">
            <h3 className="font-display text-3xl text-cafe-charcoal font-medium mb-3">
              Payment Method
            </h3>
            <p className="text-sm text-cafe-charcoal/70">
              Select how you would like to pay to secure <br className="hidden sm:block" />
              <strong>{selectedTable}</strong> at <strong>{selectedTime}</strong>.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-cafe-charcoal/5 p-6 border border-cafe-sand/30">
            {/* Order Summary */}
            <div className="bg-cafe-cream/50 rounded-2xl p-4 mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-cafe-charcoal/60">Rate ({isVip ? "VIP" : "Standard"})</span>
                <span className="font-medium">{formatIDR(pricePerHour)} / hr</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-cafe-charcoal/60">Duration</span>
                <span className="font-medium">{duration} Hour(s)</span>
              </div>
              <div className="border-t border-cafe-sand/50 my-3 pt-3 flex justify-between items-center">
                <span className="font-semibold text-cafe-charcoal">Total Amount</span>
                <span className="font-display text-xl text-cafe-brown font-semibold">{formatIDR(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Options Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200",
                  paymentMethod === "qris"
                    ? "border-cafe-brown bg-cafe-brown/5 text-cafe-brown"
                    : "border-cafe-sand bg-white text-cafe-charcoal/60 hover:border-cafe-brown/40"
                )}
              >
                <QrCode size={24} className="mb-2" />
                <span className="text-sm font-semibold tracking-wide">QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200",
                  paymentMethod === "cash"
                    ? "border-cafe-brown bg-cafe-brown/5 text-cafe-brown"
                    : "border-cafe-sand bg-white text-cafe-charcoal/60 hover:border-cafe-brown/40"
                )}
              >
                <Banknote size={24} className="mb-2" />
                <span className="text-sm font-semibold tracking-wide">Cash</span>
              </button>
            </div>

            {/* Conditional Payment Info */}
            {paymentMethod === "qris" ? (
              <div className="border-2 border-dashed border-cafe-sand rounded-2xl p-6 text-center mb-6 bg-white animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-cafe-charcoal rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  <QrCode size={32} />
                </div>
                <h4 className="font-bold text-cafe-charcoal text-lg mb-1">Scan to Pay (QRIS)</h4>
                <p className="text-xs text-cafe-charcoal/50">
                  Open your e-wallet or banking app to scan the QR code above.
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-cafe-sand rounded-2xl p-6 text-center mb-6 bg-cafe-cream/30 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-cafe-sand/50 rounded-xl flex items-center justify-center mx-auto mb-4 text-cafe-charcoal">
                  <Banknote size={32} />
                </div>
                <h4 className="font-bold text-cafe-charcoal text-lg mb-1">Pay at Cashier</h4>
                <p className="text-xs text-cafe-charcoal/60">
                  Your table will be reserved. Please finalize your payment using cash when you arrive at Savoria Billiards.
                </p>
              </div>
            )}

            <button
              onClick={handlePaymentSuccess}
              className="w-full flex items-center justify-center px-6 py-4 bg-cafe-charcoal text-cafe-cream rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-dark transition-all duration-300"
            >
              {paymentMethod === "qris" ? (
                <>
                  <Wallet size={16} className="mr-2" />
                  I Have Paid
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ====================
  // RENDER TAHAP FORMULIR
  // ====================
  return (
    <section
      id="reservation"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-cafe-sand/30 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div className={cn("text-center mb-14", !isRetrying && "cafe-reveal")}>
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Reserve Your Spot
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Book a
            <br />
            <em className="font-medium not-italic text-cafe-brown">Billiard Table</em>
          </h2>
          <p className="text-cafe-charcoal/80 text-base md:text-lg max-w-lg mx-auto font-light">
            Secure your table at Savoria Billiards. Select your preferred time and table type below to proceed to payment.
          </p>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className={cn(
            "bg-white rounded-3xl shadow-xl shadow-cafe-charcoal/5 p-6 md:p-10 border border-cafe-sand/30",
            !isRetrying && "cafe-reveal"
          )}
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

            {/* Table Selection */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <LayoutGrid size={12} className="inline mr-1.5" />
                Select Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              >
                <option value="">Choose a table...</option>
                <option value="Table 01">Table 01 (Standard)</option>
                <option value="Table 02">Table 02 (Standard)</option>
                <option value="Table 03">Table 03 (Standard)</option>
                <option value="Table 04">Table 04 (Standard)</option>
                <option value="VIP 01">VIP 01 (Premium)</option>
                <option value="VIP 02">VIP 02 (Premium)</option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Clock size={12} className="inline mr-1.5" />
                Start Time
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

            {/* Duration */}
            <div className="md:col-span-2 flex flex-col items-center">
              <label className="flex items-center justify-center text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Timer size={12} className="mr-1.5" />
                Duration (Hours)
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {DURATION_OPTIONS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDuration(h)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-sm font-medium border transition-all duration-200",
                      duration === h
                        ? "bg-cafe-charcoal text-cafe-cream border-cafe-charcoal"
                        : "bg-white text-cafe-charcoal border-cafe-sand hover:border-cafe-brown/40"
                    )}
                  >
                    {h}
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
                placeholder="Request extra chalk or cues, etc."
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal placeholder:text-cafe-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all resize-none"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-10 py-4 bg-cafe-brown text-white rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-brown/90 transition-all duration-300 hover:shadow-lg hover:shadow-cafe-brown/20"
            >
              Proceed to Payment
            </button>
            <p className="mt-3 text-xs text-cafe-charcoal/60 font-light">
              You will be asked to review your total before paying
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}