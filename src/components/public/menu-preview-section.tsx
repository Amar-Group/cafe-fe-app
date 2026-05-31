"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Flame, Leaf, Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/use-store"; // <-- Import Zustand Store

/* ── Menu Data ── */
const CATEGORIES = [
  "All",
  "Coffee",
  "Non Coffee",
  "Tea",
  "Mocktail",
  "Main Course",
  "Pasta",
  "Rice Bowl",
  "Dessert",
  "Pastry",
  "Snacks",
] as const;

type Category = (typeof CATEGORIES)[number];

interface MenuItem {
  name: string;
  category: Category;
  price: string;
  image: string;
  description: string;
  bestSeller?: boolean;
  isNew?: boolean;
  spicyLevel?: number;
  vegetarian?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { name: "House Blend Espresso", category: "Coffee", price: "28K", image: "/images/cafe/signature-drink.png", description: "Rich double-shot espresso from single-origin beans", bestSeller: true },
  { name: "Oat Milk Latte", category: "Coffee", price: "42K", image: "/images/cafe/signature-drink.png", description: "Smooth espresso with creamy oat milk and vanilla" },
  { name: "Matcha Latte", category: "Non Coffee", price: "45K", image: "/images/cafe/signature-drink.png", description: "Premium ceremonial grade matcha with steamed milk", bestSeller: true },
  { name: "Tropical Sunset", category: "Mocktail", price: "48K", image: "/images/cafe/signature-drink.png", description: "Mango, passion fruit, and sparkling water with mint", isNew: true },
  { name: "Jasmine Oolong", category: "Tea", price: "35K", image: "/images/cafe/signature-drink.png", description: "Fragrant jasmine infused Taiwanese oolong" },
  { name: "Truffle Carbonara", category: "Pasta", price: "89K", image: "/images/cafe/pasta.png", description: "Creamy carbonara with truffle oil and crispy bacon", bestSeller: true },
  { name: "Teriyaki Rice Bowl", category: "Rice Bowl", price: "72K", image: "/images/cafe/food-spread.png", description: "Glazed chicken teriyaki with steamed rice and veggies", spicyLevel: 1 },
  { name: "Grilled Salmon", category: "Main Course", price: "125K", image: "/images/cafe/food-spread.png", description: "Atlantic salmon with lemon butter and asparagus" },
  { name: "Crème Brûlée", category: "Dessert", price: "55K", image: "/images/cafe/dessert.png", description: "Classic French vanilla custard with caramelized top", bestSeller: true },
  { name: "Butter Croissant", category: "Pastry", price: "32K", image: "/images/cafe/dessert.png", description: "Flaky, golden French croissant with premium butter" },
  { name: "Truffle Fries", category: "Snacks", price: "45K", image: "/images/cafe/food-spread.png", description: "Crispy fries tossed in truffle oil and parmesan" },
  { name: "Korean Fried Chicken", category: "Snacks", price: "68K", image: "/images/cafe/food-spread.png", description: "Double-fried chicken with sweet gochujang glaze", spicyLevel: 2, isNew: true },
  { name: "Mushroom Risotto", category: "Main Course", price: "85K", image: "/images/cafe/pasta.png", description: "Creamy arborio rice with wild mushrooms and herbs", vegetarian: true },
  { name: "Cold Brew Tonic", category: "Coffee", price: "45K", image: "/images/cafe/signature-drink.png", description: "24-hour cold brew with tonic water and citrus", isNew: true },
  { name: "Strawberry Cheesecake", category: "Dessert", price: "58K", image: "/images/cafe/dessert.png", description: "NY-style cheesecake with fresh strawberry compote" },
  { name: "Aglio Olio", category: "Pasta", price: "75K", image: "/images/cafe/pasta.png", description: "Spaghetti with garlic, chili, olive oil, and prawns", spicyLevel: 1 },
];

export function MenuPreviewSection() {
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart); // <-- Selector-based access
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const ref = useScrollReveal([activeCategory, searchQuery, showAll]);

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <section
      id="menu"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cafe-sand/40 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Our Menu
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Discover Our
            <br />
            <em className="font-medium not-italic text-cafe-brown">
              Full Menu
            </em>
          </h2>
          <p className="text-cafe-charcoal/70 text-base md:text-lg max-w-xl mx-auto font-light">
            From aromatic coffees to gourmet dishes — explore flavors crafted
            for every craving and occasion.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 cafe-reveal">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cafe-charcoal/50"
            />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-cafe-sand text-cafe-charcoal text-sm placeholder:text-cafe-charcoal/50 focus:outline-none focus:ring-2 focus:ring-cafe-brown/20 focus:border-cafe-brown/30 transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 cafe-reveal">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 border",
                  activeCategory === cat
                    ? "bg-cafe-charcoal text-cafe-cream border-cafe-charcoal shadow-md"
                    : "bg-white text-cafe-charcoal border-cafe-latte hover:bg-cafe-sand/40 hover:border-cafe-brown/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 cafe-stagger">
          {displayedItems.map((item) => (
            <div
              key={item.name}
              className="cafe-reveal group bg-white rounded-2xl overflow-hidden border border-cafe-sand/60 hover:border-cafe-brown/20 hover:shadow-xl hover:shadow-cafe-charcoal/5 transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {item.bestSeller && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-cafe-orange text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                      <Flame size={10} /> Best Seller
                    </span>
                  )}
                  {item.isNew && (
                    <span className="px-2 py-1 bg-cafe-olive text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                      New
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-full">
                      <Leaf size={10} />
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-cafe-brown tracking-[0.15em] uppercase font-medium">
                    {item.category}
                  </span>
                  {item.spicyLevel && (
                    <span className="text-[11px]">
                      {"🌶️".repeat(item.spicyLevel)}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-cafe-charcoal leading-snug">
                  {item.name}
                </h3>
                <p className="text-cafe-charcoal/70 text-xs leading-relaxed font-light line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-cafe-orange">
                    {item.price}
                  </span>
                  
                  {/* Tombol Tambah + Terintegrasi Global State */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        name: item.name,
                        price: item.price,
                        category: item.category,
                        image: item.image,
                      });
                    }}
                    className="w-8 h-8 rounded-full bg-cafe-charcoal text-cafe-cream flex items-center justify-center hover:bg-cafe-brown duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {filteredItems.length > 8 && !showAll && (
          <div className="text-center mt-10 cafe-reveal">
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-cafe-charcoal/20 text-cafe-charcoal rounded-full text-sm font-semibold tracking-wide hover:bg-cafe-charcoal hover:text-cafe-cream hover:border-cafe-charcoal transition-all duration-300"
            >
              View Full Menu
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="text-center mt-6 text-cafe-charcoal/50 text-xs tracking-wide">
          Showing {displayedItems.length} of {filteredItems.length} items
        </p>
      </div>
    </section>
  );
}