"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/use-store";
import { useScrollReveal } from "@/hooks/use-scroll-reveal"; 
import { cn } from "@/lib/utils";
import { useCreateDishOrder, useDishOrder } from "@/features/cafe/dish-order/hooks/use-dish-order";
import { DishOrderDetailService } from "@/features/cafe/dish-order/services/dish-order-detail-service";
import { useCreatePayment, useUpdatePayment } from "@/features/payment/hooks/use-payment";
import { useNotification } from "@/components/ui/notification";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  Store, 
  User, 
  Phone, 
  FileText, 
  Plus, 
  Minus,
  Utensils,
  Check,
  QrCode,
  Wallet,
  Banknote,
  ChevronLeft
} from "lucide-react";

export function OrderPage() { 
  const router = useRouter();
  
  // Ambil state keranjang aktif dari Zustand
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    tableOrAddress: "",
    notes: "",
  });
  
  // Alur Navigasi Internal Pembayaran (Mengikuti BilliardSection)
  const [step, setStep] = useState<"form" | "payment" | "waiting-payment" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash">("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const createDishOrder = useCreateDishOrder();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const { add: notify } = useNotification();

  // Polling for payment status
  const { data: polledOrder } = useDishOrder(createdOrderId || 0, {
    refetchInterval: step === "waiting-payment" ? 3000 : false,
  });

  useEffect(() => {
    // Apabila order sudah dibayar, otomatis ke halaman success
    if (step === "waiting-payment" && (polledOrder as any)?.payment_status === "paid") {
      setStep("success");
      if (clearCart) clearCart();
    }
  }, [polledOrder, step, clearCart]);

  // Inisialisasi Scroll Reveal dengan dependency state
  const ref = useScrollReveal([orderType, cart, step, paymentMethod]);

  // Helper Kalkulasi Harga
  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const subtotal = cart.reduce((total, item) => {
    return total + parsePrice(item.price) * item.quantity;
  }, 0);
  
  const tax = subtotal * 0.11; // Pajak 11%
  const serviceFee = subtotal * 0.05; // Service Fee 5%
  const totalAmount = subtotal + tax + serviceFee;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Validasi Form Awal & Lanjut ke Tahap Pembayaran
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty, please select some items first!");
      return;
    }
    setStep("payment"); // Progress to payment step
  };

  // Finalisasi Pembayaran & Pembuatan Pesanan
  const handleFinalizeOrder = async () => {
    setIsSubmitting(true);

    try {
      // 1. Create Dish Order
      const res = await createDishOrder.mutateAsync({
        guest_name: formData.name,
        guest_phone: formData.phone,
        total: String(subtotal),
        tax: String(tax),
        service_fee: String(serviceFee),
        nett_price: String(totalAmount),
        status: "pending",
      });

      // Extract the insertId depending on different potential response formats
      let extractedId = null;
      if (Array.isArray(res.data) && res.data[0]?.insertId) {
        extractedId = res.data[0].insertId;
      } else if (res.data?.id) {
        extractedId = res.data.id;
      } else if ((res as any).id) {
        extractedId = (res as any).id;
      } else if (typeof res.data === 'number' || typeof res.data === 'string') {
        extractedId = res.data;
      }

      if (extractedId) {
        const orderIdNum = Number(extractedId);
        setCreatedOrderId(orderIdNum);
        
        // 2. Create Order Details
        for (const item of cart) {
          if (!item.dish_id) continue;
          await DishOrderDetailService.create({
            dish_order_id: orderIdNum,
            dish_id: item.dish_id,
            quantity: item.quantity,
            notes: formData.notes || null,
          });
        }

        // 3. Move to next step based on payment method
        if (paymentMethod === "cash") {
          setStep("waiting-payment");
        } else {
          // QRIS Flow (Midtrans Snap Integration)
          const paymentPayload = {
            type: "dish_order" as const,
            dish_order_id: orderIdNum,
            gross_amount: totalAmount.toString(),
            method: "qris" as const,
            provider: "midtrans" as const,
          };

          const paymentRes = await createPayment.mutateAsync(paymentPayload);
          const result = paymentRes.data;

          if (result && result.snap_token) {
            if (typeof (window as any).snap !== "undefined") {
              (window as any).snap.pay(result.snap_token, {
                onSuccess: async function () {
                  try {
                    await updatePayment.mutateAsync({
                      id: result.id,
                      data: { status: "paid" }
                    });
                    setStep("success");
                    if (clearCart) clearCart();
                  } catch (e) {
                    console.error("Failed updating payment status:", e);
                  }
                },
                onPending: function () {
                  notify("Payment pending. Please complete it.", "warning");
                },
                onError: function () {
                  notify("Payment failed or encountered an error.", "error");
                  setIsSubmitting(false);
                },
                onClose: function () {
                  notify("Payment window closed before completing.", "warning");
                  setIsSubmitting(false);
                }
              });
            } else {
              notify("Midtrans Snap is not loaded.", "error");
              setIsSubmitting(false);
            }
          }
        }
      } else {
        console.error("Could not extract order ID from response", res);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to finalize order:", error);
      notify("Failed to process your order. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  // --- WAITING PAYMENT STATE ---
  if (step === "waiting-payment") {
    return (
      <div ref={ref} className="min-h-screen bg-cafe-cream flex items-center justify-center p-4 mt-20">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-xl shadow-cafe-charcoal/5 border border-cafe-sand/50 space-y-6 cafe-reveal">
          <div className="w-16 h-16 bg-cafe-orange/10 text-cafe-orange rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Store size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-cafe-charcoal">Waiting for Payment</h2>
            <p className="text-cafe-charcoal/70 text-sm font-light leading-relaxed">
              Order <span className="font-semibold text-cafe-brown">#{createdOrderId}</span> has been placed.
              Please head to the cashier to complete your cash payment.
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 text-cafe-charcoal/50 text-xs">
            <div className="w-4 h-4 border-2 border-cafe-orange border-t-transparent rounded-full animate-spin" />
            Waiting for cashier confirmation...
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: SUCCESS STATE ---
  if (step === "success") {
    return (
      <div ref={ref} className="min-h-screen bg-cafe-cream flex items-center justify-center p-4 mt-20">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-xl shadow-cafe-charcoal/5 border border-cafe-sand/50 space-y-6 cafe-reveal">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <Check size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-cafe-charcoal">Order Successful!</h2>
            <p className="text-cafe-charcoal/70 text-sm font-light leading-relaxed">
              Thank you, <span className="font-semibold text-cafe-brown">{formData.name}</span>. Your order has been successfully registered and sent to the kitchen.
              {paymentMethod === "qris" 
                ? " Your QRIS payment is currently being verified." 
                : " Please remember to settle your payment at the cashier counter."}
            </p>
          </div>

          <div className="bg-cafe-cream/30 border border-cafe-sand rounded-2xl p-4 w-full text-left space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-cafe-charcoal/60">Total Amount</span>
               <span className="text-cafe-orange font-bold">{formatIDR(totalAmount)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-cafe-charcoal/60">Payment Method</span>
               <span className="text-cafe-charcoal font-medium uppercase">{paymentMethod}</span>
             </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 bg-cafe-charcoal text-cafe-cream rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-cafe-dark transition-colors duration-300 shadow-md"
          >
            Done & Back to Home
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT (STEP 1: FORM & STEP 2: PAYMENT) ---
  return (
    <div ref={ref} className="min-h-screen bg-cafe-cream py-12 px-4 sm:px-6 lg:px-8 mt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Tombol Cancel / Back (Hanya tampil saat form isi data) */}
        {step === "form" && (
          <Link
            href="/menu" 
            className="inline-flex items-center gap-2 text-cafe-charcoal/70 hover:text-cafe-brown text-sm font-medium mb-8 transition-colors group cafe-reveal"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Cancel & Back to Menu
          </Link>
        )}

        {/* STEP 1: FORMULIR DATA & CART */}
        {step === "form" && (
          <>
            <div className="mb-10 cafe-reveal">
              <span className="text-cafe-orange text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
                Dining & Culinary Experience
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-cafe-charcoal font-light">
                Savoria <em className="font-medium not-italic text-cafe-brown">Checkout</em>
              </h1>
              <p className="text-cafe-charcoal/60 text-sm font-light mt-1">
                Complete your details below to finalize your dining selection.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start cafe-stagger">
              {/* KOLOM KIRI: FORMULIR DATA */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-cafe-sand/60 cafe-reveal">
                <form id="checkout-form" onSubmit={handleBookingSubmit} className="space-y-6">
                  
                  {/* Pilihan Jenis Pesanan */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-charcoal/60 mb-3">
                      Order Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "dine-in", label: "Dine In", icon: Store },
                        { id: "takeaway", label: "Takeaway", icon: ShoppingBag },
                        { id: "delivery", label: "Delivery", icon: Truck },
                      ].map((type) => {
                        const Icon = type.icon;
                        const isActive = orderType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setOrderType(type.id as any)}
                            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border text-xs font-bold tracking-wide transition-all active:scale-95 ${
                              isActive
                                ? "bg-cafe-charcoal text-cafe-cream border-cafe-charcoal shadow-sm"
                                : "bg-transparent text-cafe-charcoal/70 border-cafe-sand hover:bg-cafe-sand/20"
                            }`}
                          >
                            <Icon size={18} />
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Informasi Pribadi */}
                  <div className="space-y-4 pt-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-charcoal/60 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-charcoal/40" />
                          <input
                            type="text"
                            required
                            placeholder="e.g., Alexander Wright"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 bg-cafe-cream/20 rounded-xl border border-cafe-sand text-cafe-charcoal text-sm focus:outline-none focus:border-cafe-brown transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-charcoal/60 mb-1.5">
                          WhatsApp Number
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-charcoal/40" />
                          <input
                            type="text"
                            required
                            placeholder="e.g., 081234567xxx"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 bg-cafe-cream/20 rounded-xl border border-cafe-sand text-cafe-charcoal text-sm focus:outline-none focus:border-cafe-brown transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input Dinamis Berdasarkan Jenis Pesanan */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-charcoal/60 mb-1.5">
                        {orderType === "dine-in" ? "Table Number" : orderType === "delivery" ? "Delivery Address" : "Pickup Time Note"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          orderType === "dine-in" 
                            ? "e.g., Table 04" 
                            : orderType === "delivery" 
                            ? "Your full home/office address" 
                            : "e.g., Pickup at 15:00"
                        }
                        value={formData.tableOrAddress}
                        onChange={(e) => setFormData({ ...formData, tableOrAddress: e.target.value })}
                        className="w-full px-4 py-3 bg-cafe-cream/20 rounded-xl border border-cafe-sand text-cafe-charcoal text-sm focus:outline-none focus:border-cafe-brown transition-all"
                      />
                    </div>

                    {/* Catatan Tambahan */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-cafe-charcoal/60 mb-1.5">
                        Order Notes (Optional)
                      </label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-4 top-3.5 text-cafe-charcoal/40" />
                        <textarea
                          rows={3}
                          placeholder="Less sugar, extra shot, allergies, etc..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-cafe-cream/20 rounded-xl border border-cafe-sand text-cafe-charcoal text-sm focus:outline-none focus:border-cafe-brown transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* KOLOM KANAN: DAFTAR KERANJANG AKTIF */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-cafe-sand/60 flex flex-col h-full cafe-reveal">
                <h3 className="font-display text-lg font-semibold text-cafe-charcoal border-b border-cafe-sand pb-4 flex items-center gap-2">
                  <Utensils size={20} /> Your Cart Items
                </h3>
                
                {/* List Menu Yang Dipesan */}
                <div className="flex-1 py-4 overflow-y-auto max-h-[400px] pr-2 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60 py-10">
                      <ShoppingBag size={48} className="text-cafe-charcoal/40" />
                      <p className="text-sm font-light text-cafe-charcoal">Your cart is empty.</p>
                      <Link href="/menu" className="text-xs font-semibold text-cafe-brown hover:underline">
                        Select Menu Items First
                      </Link>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemTotal = parsePrice(item.price) * item.quantity;
                      return (
                        <div 
                          key={item.name}
                          className="flex justify-between items-center bg-cafe-cream/10 p-3.5 rounded-2xl border border-cafe-sand/30"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-cafe-charcoal max-w-[150px] truncate">{item.name}</p>
                            <p className="text-xs font-bold text-cafe-orange">
                              {formatIDR(itemTotal)}
                            </p>
                          </div>

                          {/* Kontrol Jumlah Kuantitas */}
                          <div className="flex items-center gap-3 border border-cafe-sand rounded-full px-2.5 py-1.5 bg-white shadow-sm">
                            <button 
                              type="button" 
                              onClick={() => item.quantity === 1 ? removeFromCart(item.name) : updateQuantity(item.name, item.quantity - 1)}
                              className="text-cafe-charcoal hover:text-cafe-orange transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold text-cafe-charcoal min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item.name, item.quantity + 1)}
                              className="text-cafe-charcoal hover:text-cafe-brown transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Perhitungan Ringkasan Harga Form */}
                <div className="mt-auto border-t border-cafe-sand pt-5 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-cafe-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatIDR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-cafe-charcoal/70">
                      <span>Pajak (11%)</span>
                      <span>{formatIDR(tax)}</span>
                    </div>
                    <div className="flex justify-between text-cafe-charcoal/70">
                      <span>Service Fee (5%)</span>
                      <span>{formatIDR(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-cafe-charcoal pt-3 border-t border-dashed border-cafe-sand">
                      <span className="font-display">Total Due</span>
                      <span className="font-display text-cafe-orange">
                        {formatIDR(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    form="checkout-form"
                    type="submit"
                    disabled={cart.length === 0}
                    className={cn(
                      "w-full py-3.5 mt-2 text-white rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-md flex justify-center items-center",
                      cart.length > 0 
                        ? "bg-cafe-orange hover:bg-cafe-orange/90 active:scale-[0.98]" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT METHOD (Tampilan baru mengadopsi BilliardSection) */}
        {step === "payment" && (
          <div className="max-w-md mx-auto bg-white border border-cafe-sand/60 rounded-3xl p-6 md:p-8 shadow-sm text-cafe-charcoal animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setStep("form")}
              className="flex items-center text-xs font-medium text-cafe-charcoal/60 hover:text-cafe-brown mb-6 transition-colors group"
            >
              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to details
            </button>

            <div className="text-center mb-8">
              <h3 className="font-display text-3xl text-cafe-charcoal font-medium mb-2">
                Payment Method
              </h3>
              <p className="text-sm text-cafe-charcoal/60">
                Complete your payment to secure your order items.
              </p>
            </div>

            <div className="space-y-6">
              {/* Order Summary Summary Card */}
              <div className="bg-cafe-cream/20 rounded-2xl p-4 border border-cafe-sand/40 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-cafe-charcoal/60">Subtotal</span>
                  <span className="text-cafe-charcoal font-medium">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-cafe-charcoal/60">Pajak (11%)</span>
                  <span className="text-cafe-charcoal font-medium">{formatIDR(tax)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-cafe-charcoal/60">Service Fee (5%)</span>
                  <span className="text-cafe-charcoal font-medium">{formatIDR(serviceFee)}</span>
                </div>
                <div className="border-t border-cafe-sand/60 my-3 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-cafe-charcoal">Total Due</span>
                  <span className="font-display text-xl text-cafe-orange font-semibold">{formatIDR(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Tabs Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200",
                    paymentMethod === "qris"
                      ? "border-cafe-orange bg-cafe-orange/5 text-cafe-orange"
                      : "border-cafe-sand bg-transparent text-cafe-charcoal/60 hover:border-cafe-brown hover:text-cafe-charcoal"
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
                      ? "border-cafe-orange bg-cafe-orange/5 text-cafe-orange"
                      : "border-cafe-sand bg-transparent text-cafe-charcoal/60 hover:border-cafe-brown hover:text-cafe-charcoal"
                  )}
                >
                  <Banknote size={24} className="mb-2" />
                  <span className="text-sm font-semibold tracking-wide">Cash</span>
                </button>
              </div>

              {/* Dynamic Payment Instructions Card */}
              {paymentMethod === "qris" ? (
                <div className="border border-dashed border-cafe-sand rounded-2xl p-6 text-center bg-cafe-cream/10 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 bg-cafe-charcoal text-cafe-cream rounded-xl flex items-center justify-center mx-auto mb-4">
                    <QrCode size={32} />
                  </div>
                  <h4 className="font-bold text-cafe-charcoal text-base mb-1">Scan QRIS Code</h4>
                  <p className="text-xs text-cafe-charcoal/60">
                    Open your e-wallet or mobile banking app and scan the barcode above to fulfill the total settlement.
                  </p>
                </div>
              ) : (
                <div className="border border-dashed border-cafe-sand rounded-2xl p-6 text-center bg-cafe-cream/10 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 bg-cafe-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-cafe-orange">
                    <Banknote size={32} />
                  </div>
                  <h4 className="font-bold text-cafe-charcoal text-base mb-1">Pay at Cashier</h4>
                  <p className="text-xs text-cafe-charcoal/60">
                    Your kitchen ticket will be issued shortly. Kindly proceed to make a cash counter payment balance upon service checkout.
                  </p>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                onClick={handleFinalizeOrder}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-4 bg-cafe-orange text-white rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-cafe-orange/90 shadow-md transition-all duration-300 disabled:bg-gray-200"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : paymentMethod === "qris" ? (
                  <>
                    <Wallet size={16} className="mr-2" />
                    I Have Paid
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}