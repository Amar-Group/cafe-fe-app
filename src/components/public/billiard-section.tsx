"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import {
  Circle,
  Clock,
  User,
  Phone,
  ArrowLeft,
  Check,
  QrCode,
  Wallet,
  Banknote,
  ChevronLeft,
} from "lucide-react";

const BILLIARD_TABLES = [
  { id: "01", name: "Table 1 (9-Ball)", bookedSlots: ["13:00", "14:00"] },
  { id: "02", name: "Table 2 (9-Ball)", bookedSlots: ["15:00", "16:00", "19:00"] },
  { id: "03", name: "Table 3 (9-Ball)", bookedSlots: [] },
  { id: "04", name: "Table 4 (9-Ball)", bookedSlots: ["18:00", "20:00"] },
  { id: "05", name: "Table 5 (VIP)", bookedSlots: ["14:00", "15:00"] },
  { id: "06", name: "Table 6 (9-Ball)", bookedSlots: ["21:00"] },
  { id: "07", name: "Table 7 (9-Ball)", bookedSlots: [] },
  { id: "08", name: "Table 8 (VIP)", bookedSlots: ["19:00", "20:00", "21:00"] },
];

const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

// Simulated hourly rates
const RATE_STANDARD = 50000;
const RATE_VIP = 80000;

export function BilliardSection() {
  const ref = useScrollReveal();

  const [selectedTable, setSelectedTable] = useState<typeof BILLIARD_TABLES[0] | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  
  // Navigation internal state within the reservation container
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");

  // Pricing calculations
  const isVip = selectedTable?.name.toLowerCase().includes("vip");
  const pricePerHour = isVip ? RATE_VIP : RATE_STANDARD;
  const duration = selectedTimes.length;
  const totalAmount = duration * pricePerHour;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBackToLayout = () => {
    setSelectedTable(null);
    setSelectedTimes([]);
    setStep("form");
    setFormData({ name: "", phone: "" });
  };

  const handleTimeClick = (time: string) => {
    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTimes.length === 0 || !formData.name || !formData.phone) return;
    setStep("payment"); // Progress to payment step
  };

  const handlePaymentSuccess = () => {
    setStep("success"); // Progress to confirmation screen
  };

  return (
    <section
      id="billiard-layout"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-charcoal overflow-hidden transition-all duration-500"
    >
      <div className="absolute inset-0 cafe-noise" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {!selectedTable ? (
          <div>
            {/* Header Area */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
              <span className="inline-block text-cafe-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
                Ambiance & Entertainment
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-cream font-light leading-tight mb-6">
                Billiard Arena
                <br />
                <em className="font-medium not-italic text-emerald-400">Layout Selection</em>
              </h2>
              <p className="text-cafe-sand/50 text-base md:text-lg max-w-xl mx-auto font-light">
                Tap on any table below to start your reservation.
              </p>
            </div>

            {/* Table Floor Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {BILLIARD_TABLES.map((table, index) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both group relative rounded-3xl p-5 border bg-cafe-dark/60 border-cafe-cream/5 hover:border-emerald-500/40 shadow-lg hover:shadow-emerald-950/20 overflow-hidden flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all"
                >
                  <div className="mb-4 text-center">
                    <span className="font-display text-lg text-cafe-cream font-medium group-hover:text-emerald-400 transition-colors">
                      {table.name}
                    </span>
                  </div>

                  <div className="relative aspect-[1.8/1] w-full rounded-2xl bg-amber-950 p-2.5 shadow-inner border border-amber-900/40 overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                    <div className="relative w-full h-full rounded-lg border border-amber-900/30 flex items-center justify-center transition-colors duration-500 bg-emerald-700 group-hover:bg-emerald-600">
                      <Circle size={8} className="absolute top-0.5 left-0.5 fill-black text-black opacity-80" />
                      <Circle size={8} className="absolute top-0.5 right-0.5 fill-black text-black opacity-80" />
                      <Circle size={8} className="absolute bottom-0.5 left-0.5 fill-black text-black opacity-80" />
                      <Circle size={8} className="absolute bottom-0.5 right-0.5 fill-black text-black opacity-80" />
                      <Circle size={8} className="absolute top-0.5 left-1/2 -translate-x-1/2 fill-black text-black opacity-80" />
                      <Circle size={8} className="absolute bottom-0.5 left-1/2 -translate-x-1/2 fill-black text-black opacity-80" />

                      <div className="flex gap-1 group-hover:animate-bounce">
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm" />
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-cafe-sand/30 tracking-widest uppercase group-hover:text-emerald-400/70 transition-colors">
                    Click to Reserve
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-cafe-dark/40 border border-cafe-cream/5 rounded-3xl p-6 md:p-10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            {/* Back Button (hidden during success state) */}
            {step !== "success" && (
              <button
                type="button"
                onClick={handleBackToLayout}
                className="inline-flex items-center gap-2 text-cafe-sand/60 hover:text-white text-sm font-medium mb-8 transition-all duration-300 group animate-in fade-in duration-500 ease-out fill-mode-both"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Cancel & Back to Table Layout</span>
              </button>
            )}

            {/* STEP 1: FORM */}
            {step === "form" && (
              <form onSubmit={handleBookingSubmit} className="space-y-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
                  <span className="text-cafe-orange text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
                    Multi-Slot Reservation
                  </span>
                  <h3 className="font-display text-3xl text-cafe-cream font-light">
                    Reservation for <em className="text-emerald-400 font-medium not-italic">{selectedTable.name}</em>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 ease-out fill-mode-both">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cafe-sand/60 uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-sand/40" />
                      <input
                        type="text"
                        required
                        placeholder="e.g., Alexander Wright"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-cafe-charcoal/50 border border-cafe-cream/5 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-cafe-sand/20 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cafe-sand/60 uppercase tracking-wider block">WhatsApp Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-sand/40" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g., 081234567xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-cafe-charcoal/50 border border-cafe-cream/5 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-cafe-sand/20 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 ease-out fill-mode-both">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <label className="text-xs font-semibold text-cafe-sand/60 uppercase tracking-wider block">
                        Select Playing Hours
                      </label>
                      <span className="text-[11px] text-emerald-400/60 block">
                        *You can select multiple time slots at once
                      </span>
                    </div>
                    <div className="flex gap-4 text-[10px] uppercase tracking-wider font-medium">
                      <span className="text-cafe-sand/30 line-through">● Booked</span>
                      <span className="text-emerald-400">● Available</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {TIME_SLOTS.map((time) => {
                      const isBooked = selectedTable.bookedSlots.includes(time);
                      const isSelected = selectedTimes.includes(time);

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleTimeClick(time)}
                          className={cn(
                            "py-3 px-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center gap-1",
                            isBooked && "bg-transparent border-dashed border-cafe-cream/5 text-cafe-sand/20 line-through cursor-not-allowed opacity-40",
                            !isBooked && !isSelected && "bg-cafe-charcoal/40 border-cafe-cream/5 text-cafe-cream hover:border-emerald-500/40 hover:text-white shadow-sm",
                            isSelected && "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-bold scale-105"
                          )}
                        >
                          <Clock size={12} className={cn(isSelected ? "text-black" : isBooked ? "text-cafe-sand/20" : "text-cafe-sand/40")} />
                          <span>{time}</span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedTimes.length === 0}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all duration-1  00 mt-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700 ease-out fill-mode-both",
                    selectedTimes.length > 0
                      ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-950/20 cursor-pointer"
                      : "bg-cafe-cream/5 text-cafe-sand/30 border border-cafe-cream/5 cursor-not-allowed"
                  )}
                >
                  Proceed to Payment
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {step === "payment" && (
              <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center text-xs font-medium text-cafe-sand/60 hover:text-emerald-400 mb-6 transition-colors group"
                >
                  <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                  Back to details
                </button>

                <div className="text-center mb-8">
                  <h3 className="font-display text-3xl text-cafe-cream font-medium mb-3">
                    Payment Method
                  </h3>
                  <p className="text-sm text-cafe-sand/60">
                    Complete your payment to secure your reservation for <br className="hidden sm:block" />
                    <strong className="text-white">{selectedTable.name}</strong>.
                  </p>
                </div>

                <div className="bg-cafe-charcoal/30 rounded-3xl p-6 border border-cafe-cream/5">
                  {/* Order Summary */}
                  <div className="bg-cafe-dark/50 rounded-2xl p-4 mb-6 text-sm border border-cafe-cream/5">
                    <div className="flex justify-between mb-2">
                      <span className="text-cafe-sand/60">Rate ({isVip ? "VIP" : "Standard"})</span>
                      <span className="text-white font-medium">{formatIDR(pricePerHour)} / hr</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cafe-sand/60">Duration</span>
                      <span className="text-white font-medium">{duration} Hr{duration > 1 ? "s" : ""} ({selectedTimes.length} Slot{selectedTimes.length > 1 ? "s" : ""})</span>
                    </div>
                    <div className="border-t border-cafe-cream/10 my-3 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-cafe-cream">Total Due</span>
                      <span className="font-display text-xl text-emerald-400 font-semibold">{formatIDR(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200",
                        paymentMethod === "qris"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-cafe-cream/5 bg-cafe-charcoal/40 text-cafe-sand/60 hover:border-emerald-500/40 hover:text-white"
                      )}
                    >
                      <QrCode size={24} className="mb-2" />
                      <span className="text-sm font-semibold tracking-wide">QRIS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200",
                        paymentMethod === "cash"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-cafe-cream/5 bg-cafe-charcoal/40 text-cafe-sand/60 hover:border-emerald-500/40 hover:text-white"
                      )}
                    >
                      <Banknote size={24} className="mb-2" />
                      <span className="text-sm font-semibold tracking-wide">Cash</span>
                    </button>
                  </div>

                  {/* Payment Instructions */}
                  {paymentMethod === "qris" ? (
                    <div className="border border-dashed border-cafe-cream/20 rounded-2xl p-6 text-center mb-6 bg-cafe-dark/30 animate-in fade-in zoom-in-95">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-black">
                        <QrCode size={32} />
                      </div>
                      <h4 className="font-bold text-cafe-cream text-lg mb-1">Scan QRIS</h4>
                      <p className="text-xs text-cafe-sand/50">
                        Open your e-wallet or mobile banking app and scan the QR code above.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-dashed border-cafe-cream/20 rounded-2xl p-6 text-center mb-6 bg-cafe-dark/30 animate-in fade-in zoom-in-95">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
                        <Banknote size={32} />
                      </div>
                      <h4 className="font-bold text-cafe-cream text-lg mb-1">Pay at Cashier</h4>
                      <p className="text-xs text-cafe-sand/50">
                        Your table will be marked for reservation. Please complete your payment in cash upon arrival.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handlePaymentSuccess}
                    className="w-full flex items-center justify-center px-6 py-4 bg-emerald-500 text-black rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 transition-all duration-300"
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
            )}

            {/* STEP 3: SUCCESS */}
            {step === "success" && (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <div className="animate-in fade-in zoom-in-50 duration-700 ease-out fill-mode-both">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} />
                  </div>
                  <h3 className="font-display text-2xl text-cafe-cream font-medium mb-2">Booking Successful!</h3>
                </div>

                <p className="text-cafe-sand/50 text-sm max-w-sm leading-relaxed mb-6 animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 ease-out fill-mode-both">
                  Thank you, <span className="text-white font-medium">{formData.name}</span>. Your reservation for <span className="text-emerald-400 font-semibold">{selectedTable.name}</span> on: <br />
                  <span className="text-white font-medium bg-white/5 px-3 py-1 rounded-md inline-block mt-2 mb-2">
                    {selectedTimes.join(", ")}
                  </span> <br />
                  has been successfully registered.
                  {paymentMethod === "qris" 
                    ? " Your QRIS payment is currently being verified." 
                    : " Please remember to settle your payment at the cashier."}
                </p>

                <div className="bg-cafe-dark/50 border border-cafe-cream/5 rounded-2xl p-4 w-full max-w-sm mb-8 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700 ease-out fill-mode-both text-left space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-cafe-sand/50">Total Amount</span>
                     <span className="text-emerald-400 font-bold">{formatIDR(totalAmount)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-cafe-sand/50">Payment Method</span>
                     <span className="text-white font-medium uppercase">{paymentMethod}</span>
                   </div>
                </div>

                <button
                  type="button"
                  onClick={handleBackToLayout}
                  className="px-8 py-4 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 ease-out fill-mode-both"
                >
                  Done & View Other Tables
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}