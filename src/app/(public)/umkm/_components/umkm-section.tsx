"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Store, ShoppingBag, Star, Tag } from "lucide-react";

const UMKM_PRODUCTS = [
  { 
    id: "01", 
    name: "Keripik Tempe Organik", 
    vendor: "Dapur Mak Nyak",
    category: "Kuliner", 
    price: "Rp 18.500", 
    rating: 4.8, 
    status: "Bestseller" 
  },
  { 
    id: "02", 
    name: "Tas Anyaman Rotan", 
    vendor: "Kriya Kencana",
    category: "Kerajinan", 
    price: "Rp 245.000", 
    rating: 4.9, 
    status: "Pre-order" 
  },
  { 
    id: "03", 
    name: "Kopi Arabika Gayo", 
    vendor: "Selasar Coffee",
    category: "Minuman", 
    price: "Rp 75.000", 
    rating: 4.7, 
    status: "Ready Stock" 
  },
  { 
    id: "04", 
    name: "Kain Batik Tulis", 
    vendor: "Batik Ayu",
    category: "Fashion", 
    price: "Rp 550.000", 
    rating: 5.0, 
    status: "Limited Edition" 
  },
];

export function UmkmSection() {
  const ref = useScrollReveal();

  return (
    <section
      id="umkm-products"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-warm-white overflow-hidden"
    >
      <div className="absolute inset-0 cafe-noise opacity-60" />
      
      {/* Background Glow Effect - Dibuat sangat soft agar serasi dengan warm white */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-cafe-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-orange text-xs tracking-[0.4em] uppercase font-bold mb-4">
            Dukung Lokal
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Katalog Produk <em className="font-medium not-italic text-cafe-orange">UMKM</em>
          </h2>
          <p className="text-cafe-charcoal/70 text-base md:text-lg max-w-xl mx-auto font-light">
            Temukan berbagai produk kreatif, inovatif, dan berkualitas tinggi dari pengusaha lokal di sekitar kita.
          </p>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 cafe-stagger">
          {UMKM_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="cafe-reveal group relative rounded-3xl p-5 bg-white border border-cafe-charcoal/5 hover:border-cafe-orange/30 shadow-sm hover:shadow-xl hover:shadow-cafe-charcoal/5 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Badge Status */}
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-cafe-charcoal text-[10px] font-bold uppercase tracking-wider text-cafe-warm-white">
                {product.status}
              </div>

              {/* Image Placeholder / Visual Card */}
              <div className="relative aspect-square w-full rounded-2xl bg-cafe-warm-white/50 p-4 border border-cafe-charcoal/5 mb-5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] flex flex-col items-center justify-center">
                <Store size={48} className="text-cafe-charcoal/20 group-hover:text-cafe-orange transition-colors duration-500" />
                <span className="mt-4 text-[10px] font-bold text-cafe-charcoal/40 tracking-widest uppercase">
                  {product.category}
                </span>
              </div>

              {/* Info Produk */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg text-cafe-charcoal font-semibold group-hover:text-cafe-orange transition-colors mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-cafe-charcoal/60 mb-3">by {product.vendor}</p>
                </div>

                <div className="border-t border-cafe-charcoal/5 pt-3 mt-2 flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-cafe-charcoal">
                    {product.price}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>

              {/* OVERLAY HOVER */}
              <div 
                className="absolute inset-0 flex flex-col justify-center items-center text-center p-5 z-20 bg-cafe-charcoal/95 backdrop-blur-sm transition-all duration-300 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto"
              >
                <Tag className="text-cafe-orange mb-3" size={28} />
                <p className="text-cafe-warm-white text-sm font-medium mb-1">Lihat Detail Produk</p>
                <p className="text-cafe-warm-white/50 text-xs mb-5">Dukung {product.vendor} dengan membeli produk ini.</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Beli ${product.name}`);
                  }}
                  className="px-5 py-2 flex items-center gap-2 bg-cafe-orange text-cafe-charcoal font-bold text-xs rounded-full hover:bg-orange-400 transition-colors shadow-lg shadow-cafe-orange/20"
                >
                  <ShoppingBag size={14} />
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}