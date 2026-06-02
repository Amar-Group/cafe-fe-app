"use client";

import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import {
  Clock,
  MessageSquare,
  Check,
  LayoutGrid,
  QrCode,
  Wallet,
  Banknote,
  Users,
  Calendar,
} from "lucide-react";

import { usePublicBilliardTables } from "@/features/billiard/table/hooks/use-table";
import { usePublicSchedules } from "@/features/billiard/schedule/hooks/use-schedule";
import { useCreateReservation, useReservation } from "@/features/billiard/reservation/hooks/use-reservation";
import { useCreatePayment } from "@/features/payment/hooks/use-payment";
import { PaymentService } from "@/features/payment/services/payment-service";

export function ReservationSection() {
  const ref = useScrollReveal();

  // Queries
  const { data: tablesData } = usePublicBilliardTables();
  const tables = tablesData || [];

  const { data: schedulesData } = usePublicSchedules();
  const schedules = schedulesData || [];

  const createReservation = useCreateReservation();
  const createPayment = useCreatePayment();

  // Navigation State
  const [step, setStep] = useState<"form" | "waiting-payment" | "success">("form");
  const [isRetrying, setIsRetrying] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<number | null>(null);

  // Polling for payment status
  const { data: polledReservation } = useReservation(createdReservationId || 0, {
    refetchInterval: step === "waiting-payment" ? 3000 : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    // If order is paid or completed, move to success
    const isPaid = (polledReservation as any)?.payment_status === "paid" || (polledReservation as any)?.status === "completed";
    if (step === "waiting-payment" && isPaid) {
      setStep("success");
    }
  }, [polledReservation, step]);

  // Input States
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");
  const [finalAmount, setFinalAmount] = useState<number>(0);

  // Calculated Price
  const selectedTable = tables.find((t) => t.id === Number(selectedTableId));
  const selectedSchedule = schedules.find((s) => s.id === Number(selectedScheduleId));
  
  const totalAmount = selectedTable ? Number(selectedTable.price) : 0;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId || !selectedScheduleId) {
      alert("Please select a table and time slot.");
      return;
    }

    try {
      // 1. Create Reservation
      const resData = await createReservation.mutateAsync({
        billiard_table_id: Number(selectedTableId),
        guest_name: name,
        guest_phone: phone,
        date: date,
        schedule_id: Number(selectedScheduleId),
        guest_count: guestCount,
        notes: notes || null,
        status: "pending",
      });

      const newReservationId = resData.data?.id;
      if (!newReservationId) throw new Error("Failed to create reservation");

      setCreatedReservationId(newReservationId);
      setFinalAmount(totalAmount);

      // 2. Process Payment
      if (paymentMethod === "qris") {
        const paymentRes = await createPayment.mutateAsync({
          type: "reservation",
          reservation_id: newReservationId,
          method: "qris",
          provider: "midtrans",
          gross_amount: totalAmount,
        });

        const snapToken = paymentRes.data?.snap_token;
        if (snapToken && typeof window !== "undefined" && (window as any).snap) {
          (window as any).snap.pay(snapToken, {
            onSuccess: async function (result: any) {
              if (paymentRes.data?.id) {
                await PaymentService.sync(paymentRes.data.id);
              }
              setStep("success");
            },
            onPending: function (result: any) {
              setStep("waiting-payment");
            },
            onError: function (result: any) {
              alert("Payment failed!");
              setStep("form");
            },
            onClose: function () {
              setStep("waiting-payment");
            },
          });
        } else {
          setStep("waiting-payment");
        }
      } else {
        // Cash payment
        await createPayment.mutateAsync({
          type: "reservation",
          reservation_id: newReservationId,
          method: "cash",
          provider: "cashier",
          gross_amount: totalAmount,
        });
        setStep("waiting-payment");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setSelectedTableId("");
    setSelectedScheduleId("");
    setGuestCount(2);
    setNotes("");
    setPaymentMethod("qris");
    setStep("form");
    setIsRetrying(true);
    setCreatedReservationId(null);

    setTimeout(() => {
      document.getElementById("reservation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

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
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Table</span>
                <span className="font-semibold">: {selectedTable?.name}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Date</span>
                <span className="font-semibold">: {date}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Time</span>
                <span className="font-semibold">: {selectedSchedule?.start_time} - {selectedSchedule?.end_time}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Payment Method</span>
                <span className="font-semibold uppercase">: {paymentMethod}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium text-cafe-charcoal/50 w-32 shrink-0">Total Paid</span>
                <span className="font-semibold text-cafe-olive">: {formatIDR(finalAmount)}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            className="px-8 py-3 bg-white border border-cafe-sand text-cafe-charcoal rounded-full text-sm font-semibold hover:bg-cafe-sand/30 transition-all duration-300 shadow-sm"
          >
            Make Another Booking
          </button>
        </div>
      </section>
    );
  }

  // ====================
  // RENDER TAHAP PAYMENT (WAITING)
  // ====================
  if (step === "waiting-payment") {
    return (
      <section
        id="reservation"
        ref={ref}
        className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
      >
        <div className="max-w-lg mx-auto px-4 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full border-4 border-cafe-brown/20 border-t-cafe-brown flex items-center justify-center mx-auto mb-6 animate-spin" />
          
          <h3 className="font-display text-3xl text-cafe-charcoal font-medium mb-4">
            Waiting for Payment
          </h3>
          <p className="text-cafe-charcoal/60 font-light mb-8">
            {paymentMethod === "qris" 
              ? "Please complete your payment in the popup window. We are checking your transaction status..."
              : "Your table is reserved! Please proceed to the cashier to pay."}
          </p>

          <div className="bg-white border border-cafe-sand/50 shadow-sm rounded-3xl p-6 md:p-8 text-left mb-8 w-full mx-auto relative overflow-hidden">
            <h4 className="text-xs font-bold text-cafe-brown uppercase tracking-[0.2em] mb-5 border-b border-cafe-sand/30 pb-3 text-center">
              Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cafe-charcoal/70">Table</span>
                <span className="font-semibold">{selectedTable?.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-cafe-charcoal/70">Time</span>
                <span className="font-semibold">{selectedSchedule?.start_time}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-cafe-charcoal/70">Total Amount</span>
                <span className="font-semibold text-lg text-cafe-brown">{formatIDR(totalAmount)}</span>
              </div>
            </div>
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
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              >
                <option value="">Choose a table...</option>
                {tables.map(table => (
                   <option key={table.id} value={table.id}>{table.name} ({formatIDR(Number(table.price))})</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Calendar size={12} className="inline mr-1.5" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Clock size={12} className="inline mr-1.5" />
                Time Slot
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              >
                <option value="">Select time slot</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.start_time} - {s.end_time}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Guest Count */}
            <div>
              <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-2">
                <Users size={12} className="inline mr-1.5" />
                Guests
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                required
                className="w-full px-4 py-3 bg-white border border-cafe-sand rounded-xl text-sm text-cafe-charcoal placeholder:text-cafe-charcoal/40 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/40 transition-all"
              />
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
          
          <div className="mt-8 pt-8 border-t border-cafe-sand/50">
             {/* Payment Options Selector */}
             <label className="block text-xs font-semibold text-cafe-charcoal tracking-wide uppercase mb-4 text-center">
                Payment Method
              </label>
             <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
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
            
            <div className="flex justify-between items-center mb-6 max-w-sm mx-auto bg-cafe-cream p-4 rounded-xl border border-cafe-sand/50">
                <span className="font-semibold text-cafe-charcoal">Total Amount</span>
                <span className="font-display text-xl text-cafe-brown font-semibold">{formatIDR(totalAmount)}</span>
            </div>

            <div className="text-center">
                <button
                type="submit"
                disabled={createReservation.isPending || createPayment.isPending}
                className="px-10 py-4 w-full md:w-auto bg-cafe-brown text-white rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-brown/90 transition-all duration-300 hover:shadow-lg hover:shadow-cafe-brown/20 disabled:opacity-50"
                >
                {(createReservation.isPending || createPayment.isPending) ? "Processing..." : "Proceed to Payment"}
                </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}