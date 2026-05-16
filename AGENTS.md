<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Cafe Frontend App — Agent Context Guide

> Dokumen ini adalah satu-satunya referensi bagi AI agent untuk memahami **arsitektur, konvensi, alur, dan aturan** proyek ini. Baca dokumen ini terlebih dahulu sebelum menulis kode apapun.

---

## 1. Identitas Proyek

| Key | Value |
|---|---|
| **Nama** | `cafe-fe-app` |
| **Jenis** | Aplikasi frontend untuk manajemen cafe |
| **Framework** | Next.js 16 (App Router) |
| **Bahasa** | TypeScript (strict: false) |
| **Package Manager** | **Bun** (satu-satunya — jangan gunakan npm/yarn/pnpm) |
| **Styling** | Tailwind CSS v3 + CSS Variables (oklch untuk admin, RGB channels untuk public) |
| **UI Kit** | Shadcn/UI (style: `base-nova`, base color: `neutral`) |
| **State Management** | Zustand |
| **Data Fetching** | TanStack React Query |
| **Form Handling** | React Hook Form + Zod |
| **Charts** | ApexCharts (via `react-apexcharts`) |
| **Rich Text** | Tiptap |
| **Icons** | Lucide React |
| **Theme** | `next-themes` (light default, dark mode via class strategy) |
| **Animation** | Framer Motion + CSS scroll-reveal animations |

---

## 2. Perintah Dasar

```bash
bun install        # Install dependencies
bun dev            # Jalankan dev server
bun run build      # Build production
bun run lint       # Jalankan ESLint
```

> ⚠️ **JANGAN** gunakan `npm`, `yarn`, atau `pnpm`. Proyek ini hanya menggunakan **Bun**.

---

## 3. Arsitektur & Struktur Folder

```
src/
├── app/                          # Next.js App Router (route groups)
│   ├── layout.tsx                # Root layout (font, providers, theme)
│   ├── globals.css               # Global CSS + Tailwind + CSS vars
│   │
│   ├── (public)/                 # 🌐 Halaman publik/customer-facing
│   │   ├── layout.tsx            # Layout publik (Cormorant Garamond + Manrope)
│   │   └── page.tsx              # Landing page (11 section cinematic)
│   │
│   ├── (admin)/                  # 🔒 Dashboard admin (sidebar + header)
│   │   ├── layout.tsx            # Admin shell: sidebar + header + main
│   │   ├── dashboard/            # Halaman dashboard utama
│   │   ├── base-ui/             # Showcase komponen UI dasar (21 jenis)
│   │   ├── extended-ui/         # Komponen lanjutan (drag-drop, ratings)
│   │   ├── forms/               # Showcase form (9 jenis)
│   │   ├── tables/              # Basic tables + DataTable
│   │   ├── charts/              # 17 jenis chart (ApexCharts)
│   │   ├── icons/               # Icon gallery (Lucide)
│   │   ├── calendar/            # Kalender
│   │   └── pages/               # Halaman tambahan (blank, pricing, timeline)
│   │
│   ├── (auth)/                   # 🔑 Halaman autentikasi (tanpa sidebar)
│   │   ├── layout.tsx            # Layout minimal (bg: #F8F9FD)
│   │   └── auth/
│   │       ├── login/
│   │       ├── register/
│   │       ├── recover-password/
│   │       ├── confirm-mail/
│   │       └── login-pin/
│   │
│   ├── (error)/                  # ❌ Halaman error (centered layout)
│   │   ├── layout.tsx            # Layout centered + bg: #F8F9FD
│   │   └── error/
│   │       ├── 400/ 401/ 403/ 404/ 500/ 503/
│   │
│   └── (standalone)/             # 📄 Halaman standalone (centered)
│       ├── layout.tsx            # Layout centered + bg: #F8F9FD
│       └── pages/
│           ├── coming-soon/
│           └── maintenance/
│
├── components/                   # Komponen reusable global
│   ├── ui/                       # 23 komponen UI (shadcn/base-nova)
│   ├── layout/                   # Admin shell components
│   │   ├── admin-sidebar.tsx     # Sidebar navigasi + collapsible menu
│   │   └── admin-header.tsx      # Header + search + theme toggle + profile
│   ├── public/                   # 12 komponen landing page cafe
│   │   ├── navbar.tsx            # Navbar (transparan → solid on scroll, active tracking)
│   │   ├── hero-section.tsx      # Hero fullscreen (auto-rotate slides, Ken Burns)
│   │   ├── about-section.tsx     # About + image collage + feature highlights
│   │   ├── featured-menu-section.tsx  # 3 signature menu cards (dark bg)
│   │   ├── menu-preview-section.tsx   # Interactive menu grid + filter + search
│   │   ├── gallery-section.tsx   # Masonry gallery + lightbox
│   │   ├── testimonials-section.tsx   # Review cards + social proof bar
│   │   ├── events-section.tsx    # Events & promotions (dark bg)
│   │   ├── reservation-section.tsx    # Table reservation form
│   │   ├── cta-section.tsx       # CTA + marquee ticker
│   │   ├── location-section.tsx  # Google Maps + contact info
│   │   └── footer.tsx            # Footer (brand, links, social)
│   ├── theme-provider.tsx        # Wrapper next-themes
│   └── client-demo.tsx           # Demo komponen (Zustand + React Query)
│
├── providers/
│   └── query-provider.tsx        # TanStack React Query provider (staleTime: 60s)
│
├── stores/
│   └── use-store.ts              # Zustand global store (counter demo + sidebar toggle)
│
├── lib/
│   └── utils.ts                  # `cn()` helper (clsx + tailwind-merge)
│
├── hooks/
│   └── use-scroll-reveal.ts      # IntersectionObserver hook untuk scroll animations
│
├── features/                     # 🏗️ BELUM ADA — untuk fitur domain bisnis
├── services/                     # 🏗️ BELUM ADA — untuk API layer global
├── utils/                        # 🏗️ BELUM ADA — untuk utility global
├── constants/                    # 🏗️ BELUM ADA — untuk konstanta global
├── types/                        # 🏗️ BELUM ADA — untuk TypeScript types global
└── styles/                       # 🏗️ BELUM ADA — untuk styling tambahan
```

---

## 4. Route Groups & Layout Strategy

Proyek ini menggunakan **Route Groups** (`(nama)`) agar halaman dengan layout berbeda tidak saling mempengaruhi:

| Route Group | Layout | Kegunaan | Ciri Khas |
|---|---|---|---|
| `(public)` | Layout khusus (font Cormorant Garamond + Manrope, smooth scroll) | Landing page cafe (11 section) | Navbar, Hero, About, Menu, Gallery, Testimonials, Events, Reservation, CTA, Location, Footer |
| `(admin)` | Sidebar + Header + Main | Dashboard & semua fitur admin | `AdminSidebar` + `AdminHeader` |
| `(auth)` | Minimal (bg biru muda) | Login, register, dll | Tanpa navigasi |
| `(error)` | Centered (bg biru muda) | Halaman error HTTP | Centered + flex |
| `(standalone)` | Centered (bg biru muda) | Coming soon, maintenance | Centered + flex |

### Root Layout (`src/app/layout.tsx`)
- Load font **Geist** (sans + mono) dari Google Fonts
- Wrap semua children dengan `ThemeProvider` → `QueryProvider`
- Default theme: `light`

---

## 5. Design System & Theming

### A. Admin Design System (oklch)
Semua warna admin didefinisikan di `globals.css` menggunakan format **oklch**:
- Light mode: `:root { ... }`
- Dark mode: `.dark { ... }`

### Semantic Color Tokens (Admin)
```
background, foreground, card, popover, primary, secondary,
destructive, muted, accent, border, input, ring,
chart-1~5, sidebar-*
```

### B. Cafe Public Design System (RGB Channels)
Warna untuk area publik (landing page) menggunakan format **RGB channels** agar mendukung Tailwind opacity modifier (`text-cafe-charcoal/70`):

```css
/* globals.css */
:root {
  --cafe-cream: 245 240 232;
  --cafe-charcoal: 42 42 42;
  --cafe-brown: 139 111 71;
  /* ... dst */
}
```

```js
/* tailwind.config.js */
cafe: {
  cream: "rgb(var(--cafe-cream) / <alpha-value>)",
  charcoal: "rgb(var(--cafe-charcoal) / <alpha-value>)",
  // ... dst
}
```

### Cafe Color Palette
| Token | RGB | Hex Equiv. | Kegunaan |
|---|---|---|---|
| `cafe-cream` | 245 240 232 | `#F5F0E8` | Background utama light sections |
| `cafe-warm-white` | 250 250 246 | `#FAFAF6` | Background sections lebih terang |
| `cafe-charcoal` | 42 42 42 | `#2A2A2A` | Text utama, dark section bg |
| `cafe-dark` | 26 26 26 | `#1A1A1A` | Darkest background |
| `cafe-brown` | 139 111 71 | `#8B6F47` | Primary accent, headings |
| `cafe-brown-light` | 184 149 106 | `#B8956A` | Secondary accent |
| `cafe-orange` | 200 121 65 | `#C87941` | CTA, highlights, badges |
| `cafe-olive` | 107 125 62 | `#6B7D3E` | Nature/success accent |
| `cafe-sand` | 232 221 208 | `#E8DDD0` | Borders, muted bg |
| `cafe-latte` | 212 197 178 | `#D4C5B2` | Dividers, subtle elements |

### Cafe Typography
| Font | Variabel | Kegunaan |
|---|---|---|
| **Cormorant Garamond** | `font-display` | Headings, section titles |
| **Manrope** | `font-body` | Body text, UI elements |

### Cafe Animations (CSS)
- `cafe-reveal`, `cafe-reveal-left`, `cafe-reveal-right` — scroll-triggered reveal
- `cafe-stagger` — staggered children animation delay
- `cafe-noise` — noise texture overlay
- `animate-kenburns` — Ken Burns zoom pada hero slides
- `animate-float` — floating decorative elements
- `animate-marquee` — horizontal text ticker

> ⚠️ **PENTING**: Gunakan format RGB channels untuk warna cafe, BUKAN hex. Tailwind opacity modifier (`/70`, `/50`) hanya bekerja dengan format `rgb(var(...) / <alpha-value>)`.

### Aturan Styling
1. **Admin area** → gunakan semantic color (`bg-background`, `text-foreground`) — oklch
2. **Public area** → gunakan cafe color tokens (`bg-cafe-cream`, `text-cafe-charcoal`) — RGB
3. **Dark mode** di admin area otomatis via CSS variables
4. **`cn()` helper** wajib digunakan untuk class conditional
5. Komponen UI base dari **shadcn/ui** — cek `src/components/ui/` sebelum buat baru
6. Opacity modifier: `text-cafe-charcoal/70` (✅) BUKAN `text-cafe-charcoal opacity-70` (❌)

---

## 6. State Management Pattern

### Zustand Store (`src/stores/use-store.ts`)
- Global store untuk state yang perlu shared across components
- Pattern: `useStore((state) => state.xxx)` — selector-based access
- Contoh existing: `isSidebarOpen`, `toggleSidebar`

### TanStack React Query (`src/providers/query-provider.tsx`)
- Untuk semua server state / data fetching
- Default `staleTime: 60 * 1000` (1 menit)
- Provider sudah di-wrap di root layout

---

## 7. Feature Module Pattern (Planned)

Ketika membuat fitur domain bisnis baru, ikuti struktur ini di `src/features/`:

```
src/features/<nama-feature>/
├── components/     # Komponen khusus feature ini
├── hooks/          # Custom hooks feature ini
├── services/       # API calls feature ini
├── types/          # TypeScript types/interfaces
├── constants/      # Konstanta khusus
└── utils/          # Helper/utils khusus
```

> Pemisahan ini memastikan setiap domain bisnis terisolasi dan tidak mencemari namespace global.

---

## 8. Navigasi Admin Sidebar

Sidebar admin memiliki 2 section utama:

### Overview
- Dashboard (`/dashboard`)
- Calendar (`/calendar`)
- Pages (sub-menu: blank, pricing, timeline)
- Auth Pages (sub-menu, external links)
- Error Pages (sub-menu, external links)

### Component
- Base UI (22 sub-item)
- Extended UI (2 sub-item)
- Icons (`/icons`)
- Charts (17 sub-item)
- Forms (9 sub-item)
- Tables (2 sub-item)

### Sidebar Behavior
- **Collapsible**: toggle via header button → state di Zustand (`isSidebarOpen`)
- **Mobile**: overlay + backdrop, close on click outside
- **Desktop collapsed**: width 72px, hanya tampil icon
- **Desktop expanded**: width 260px, tampil icon + label
- **Active state**: `bg-blue-50 text-blue-700` pada item aktif
- **External links**: halaman auth/error/standalone dibuka di tab baru

---

## 9. Konvensi Kode

### Umum
1. **File naming**: kebab-case untuk file/folder (`admin-header.tsx`, `use-store.ts`)
2. **Component naming**: PascalCase (`AdminHeader`, `QueryProvider`)
3. **Export**: Named export (bukan default) untuk komponen — kecuali page.tsx (default export)
4. **"use client"**: Wajib ditambahkan pada komponen yang menggunakan hooks, events, atau browser API

### Imports
- Path alias: `@/*` → `./src/*`
- Urutan: (1) external libs → (2) `@/` aliases → (3) relative imports
- Komponen UI: `import { Button } from "@/components/ui/button"`

### TypeScript
- `strict: false` — tidak wajib typing ketat, tapi tetap direkomendasikan
- `ignoreBuildErrors: true` di `next.config.mjs` — build tidak gagal karena TS error

---

## 10. Dependency Penting

| Package | Versi | Kegunaan |
|---|---|---|
| `next` | 16.2.6 | Framework utama |
| `react` / `react-dom` | 19.2.4 | UI library |
| `zustand` | ^5.0 | Client state management |
| `@tanstack/react-query` | ^5.100 | Server state / data fetching |
| `@tanstack/react-table` | ^8.21 | DataTable headless |
| `react-hook-form` | ^7.75 | Form management |
| `@hookform/resolvers` | ^5.2 | Resolver (Zod, dll) |
| `zod` | ^4.4 | Schema validation |
| `next-themes` | ^0.4 | Dark/light mode |
| `lucide-react` | ^1.14 | Icon library |
| `class-variance-authority` | ^0.7 | Variant-based styling |
| `clsx` + `tailwind-merge` | latest | Class merging utility |
| `apexcharts` + `react-apexcharts` | latest | Charts |
| `@tiptap/*` | ^3.23 | Rich text editor |
| `react-datepicker` | ^9.1 | Date picker |
| `react-dropzone` | ^15.0 | File upload |
| `react-select` | ^5.10 | Select dropdown advanced |
| `shadcn` | ^4.7 | CLI untuk generate komponen |
| `framer-motion` | ^12.38 | Animasi kompleks (future use) |

---

## 11. Konfigurasi Penting

### `next.config.mjs`
```js
typescript: { ignoreBuildErrors: true }
```

### `tsconfig.json`
- `module`: esnext, `moduleResolution`: bundler
- Path alias `@/*` → `./src/*`
- JSX: `react-jsx`

### `components.json` (Shadcn)
- Style: `base-nova`
- Base color: `neutral`
- CSS Variables: `true`
- Icon library: `lucide`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`

### `tailwind.config.js`
- Content scan: `src/pages/`, `src/components/`, `src/app/`, `src/features/`
- Dark mode: `class` strategy
- Plugin: `tailwindcss-animate`

---

## 12. Status Proyek

### Sudah Selesai
- ✅ Admin dashboard layout (sidebar + header)
- ✅ Theme switching (light/dark)
- ✅ Komponen UI showcase (base-ui, extended-ui, charts, forms, tables, icons)
- ✅ Halaman auth (login, register, recover-password, confirm-mail, login-pin)
- ✅ Halaman error (400, 401, 403, 404, 500, 503)
- ✅ Halaman standalone (coming-soon, maintenance)
- ✅ Demo Zustand + React Query
- ✅ **Landing page cafe** (11 section, premium cinematic design)
  - Navbar (transparan → solid, scroll-based active tracking)
  - Hero (fullscreen, auto-rotating slides, Ken Burns effect)
  - About (image collage, stats card, feature highlights)
  - Featured Menu (3 signature cards, dark bg)
  - Interactive Menu Grid (11 kategori, search, badges, filter)
  - Gallery (masonry grid, lightbox prev/next)
  - Testimonials (4 review cards, social proof bar)
  - Events & Promotions (live acoustic, happy hour, dll)
  - Reservation Form (date, time, guests, seating preference)
  - CTA (dual buttons, marquee ticker)
  - Location (Google Maps embed, contact info, WhatsApp CTA)
  - Footer (brand, 3 kolom link, social icons)
- ✅ Custom hooks (`use-scroll-reveal`)
- ✅ Cafe design system (warm palette, premium fonts, scroll animations)
- ✅ 6 editorial-quality image assets (`public/images/cafe/`)

### Belum Ada (Perlu Dibangun)
- ❌ Feature modules (`src/features/`)
- ❌ API service layer (`src/services/`)
- ❌ Global types (`src/types/`)
- ❌ Authentication logic (login flow, token, guards)
- ❌ CRUD fitur domain bisnis (menu cafe, orders, dll)
- ❌ Online ordering system (cart via Zustand, checkout flow)
- ❌ Reservation backend integration
- ❌ Dedicated menu page (full catalog)
- ❌ User authentication & profile

---

## 13. Aturan untuk AI Agent

1. **Selalu baca file ini** sebelum memulai pekerjaan apapun
2. **Gunakan Bun** — jangan pernah suggest/jalankan npm/yarn/pnpm
3. **Ikuti folder structure** di `STRUCTURE.md` dan section 3 dokumen ini
4. **Gunakan semantic color tokens** — admin: `bg-background`, public: `bg-cafe-cream`
5. **Cek komponen yang sudah ada** di `src/components/ui/` dan `src/components/public/` sebelum buat baru
6. **Feature baru** → buat di `src/features/<nama>/` dengan sub-folder sesuai pattern
7. **Jangan hapus komentar/docstring** yang sudah ada kecuali diminta
8. **"use client"** wajib di komponen yang pakai hooks/events/browser API
9. **Gunakan `cn()` helper** untuk class conditional, bukan string concatenation manual
10. **Baca docs Next.js 16** di `node_modules/next/dist/docs/` bila ragu soal API
11. **Cafe colors harus pakai format RGB channels** — bukan hex — agar Tailwind opacity modifier bekerja
12. **Komponen publik** → taruh di `src/components/public/`, ikuti pattern scroll-reveal dan cafe design tokens
13. **Scroll animations** → gunakan class `cafe-reveal` / `cafe-reveal-left` / `cafe-reveal-right` + hook `useScrollReveal`

---

## 14. Public Landing Page — Referensi Cepat

### Section Order (di `page.tsx`)
```
CafeNavbar → HeroSection → AboutSection → FeaturedMenuSection →
MenuPreviewSection → GallerySection → TestimonialsSection →
EventsSection → ReservationSection → CtaSection →
LocationSection → CafeFooter
```

### Section IDs (untuk navigasi)
| Komponen | Section ID | Nav Link |
|---|---|---|
| `HeroSection` | `#hero` | Home |
| `AboutSection` | `#about` | About |
| `MenuPreviewSection` | `#menu` | Menu |
| `GallerySection` | `#gallery` | Gallery |
| `EventsSection` | `#events` | Events |
| `LocationSection` | `#contact` | Contact |

### Image Assets (`public/images/cafe/`)
- `hero.png` — Cafe atmosphere hero shot
- `food-spread.png` — Flat-lay food photography
- `signature-drink.png` — Iced latte close-up
- `interior.png` — Warm interior shot
- `dessert.png` — Dessert plating
- `pasta.png` — Gourmet pasta dish
