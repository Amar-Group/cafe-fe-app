# Project Structure

## Overview
Struktur folder proyek `cafe-fe-app` — aplikasi frontend manajemen cafe berbasis Next.js 16 App Router.

## Root Files

```
cafe-fe-app/
├── AGENTS.md              # Dokumentasi lengkap untuk AI agent (WAJIB BACA)
├── STRUCTURE.md            # Dokumen ini — referensi struktur folder
├── README.md               # Panduan singkat proyek
│
├── package.json            # Dependencies & scripts (gunakan Bun)
├── bun.lock                # Lockfile Bun (satu-satunya lockfile)
│
├── next.config.mjs         # Konfigurasi Next.js
├── tsconfig.json           # Konfigurasi TypeScript
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── postcss.config.js       # Konfigurasi PostCSS
├── eslint.config.mjs       # Konfigurasi ESLint
├── components.json         # Konfigurasi Shadcn/UI
│
├── public/                 # Static assets (svg, images)
│   └── images/
│       └── cafe/           # 6 editorial-quality images untuk landing page
│           ├── hero.png
│           ├── food-spread.png
│           ├── signature-drink.png
│           ├── interior.png
│           ├── dessert.png
│           └── pasta.png
└── src/                    # Source code utama
```

## Source Code (`src/`)

```
src/
├── app/                          # Routing utama Next.js App Router
│   ├── layout.tsx                # Root layout (Geist font, ThemeProvider, QueryProvider)
│   ├── globals.css               # Global CSS + Tailwind directives + CSS vars (oklch)
│   ├── favicon.ico               # Favicon
│   │
│   ├── (public)/                 # 🌐 Area publik / customer-facing
│   │   ├── layout.tsx            # Layout publik (Cormorant Garamond + Manrope fonts)
│   │   └── page.tsx              # Landing page (11 section cinematic)
│   │
│   ├── (admin)/                  # 🔒 Area dashboard admin
│   │   ├── layout.tsx            # Admin shell (AdminSidebar + AdminHeader + main)
│   │   ├── dashboard/page.tsx    # Dashboard utama
│   │   ├── calendar/page.tsx     # Kalender
│   │   ├── icons/page.tsx        # Gallery icon Lucide
│   │   ├── base-ui/              # 21 showcase komponen UI dasar
│   │   │   ├── accordions/
│   │   │   ├── alerts/
│   │   │   ├── avatars/
│   │   │   ├── badges/
│   │   │   ├── breadcrumb/
│   │   │   ├── buttons/
│   │   │   ├── cards/
│   │   │   ├── carousel/
│   │   │   ├── collapse/
│   │   │   ├── dropdowns/
│   │   │   ├── links/
│   │   │   ├── list-group/
│   │   │   ├── modals/
│   │   │   ├── notifications/
│   │   │   ├── offcanvas/
│   │   │   ├── pagination/
│   │   │   ├── placeholders/
│   │   │   ├── progress/
│   │   │   ├── spinners/
│   │   │   ├── tabs/
│   │   │   └── tooltips/
│   │   ├── extended-ui/          # Komponen lanjutan
│   │   │   ├── drag-drop/
│   │   │   └── ratings/
│   │   ├── charts/               # 17 jenis chart (ApexCharts)
│   │   │   ├── area/
│   │   │   ├── bar/
│   │   │   ├── boxplot/
│   │   │   ├── bubble/
│   │   │   ├── candlestick/
│   │   │   ├── column/
│   │   │   ├── heatmap/
│   │   │   ├── line/
│   │   │   ├── mixed/
│   │   │   ├── pie/
│   │   │   ├── polar-area/
│   │   │   ├── radar/
│   │   │   ├── radialbar/
│   │   │   ├── scatter/
│   │   │   ├── sparklines/
│   │   │   ├── timeline/
│   │   │   └── treemap/
│   │   ├── forms/                # 9 jenis form showcase
│   │   │   ├── basic-elements/
│   │   │   ├── editors/
│   │   │   ├── file-uploads/
│   │   │   ├── inputmask/
│   │   │   ├── picker/
│   │   │   ├── range-slider/
│   │   │   ├── select/
│   │   │   ├── validation/
│   │   │   └── wizard/
│   │   ├── tables/               # Tabel
│   │   │   ├── basic/
│   │   │   └── datatable/
│   │   └── pages/                # Halaman tambahan
│   │       ├── blank/
│   │       ├── pricing/
│   │       └── timeline/
│   │
│   ├── (auth)/                   # 🔑 Halaman autentikasi
│   │   ├── layout.tsx            # Layout minimal (bg: #F8F9FD)
│   │   └── auth/
│   │       ├── login/
│   │       ├── register/
│   │       ├── recover-password/
│   │       ├── confirm-mail/
│   │       └── login-pin/
│   │
│   ├── (error)/                  # ❌ Halaman error
│   │   ├── layout.tsx            # Layout centered (bg: #F8F9FD)
│   │   └── error/
│   │       ├── 400/
│   │       ├── 401/
│   │       ├── 403/
│   │       ├── 404/
│   │       ├── 500/
│   │       └── 503/
│   │
│   └── (standalone)/             # 📄 Halaman standalone
│       ├── layout.tsx            # Layout centered (bg: #F8F9FD)
│       └── pages/
│           ├── coming-soon/
│           └── maintenance/
│
├── components/                   # Komponen reusable global
│   ├── ui/                       # 23 komponen Shadcn/UI (base-nova)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── collapse.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── link.tsx
│   │   ├── list-group.tsx
│   │   ├── modal.tsx
│   │   ├── notification.tsx
│   │   ├── offcanvas.tsx
│   │   ├── pagination.tsx
│   │   ├── placeholder.tsx
│   │   ├── progress.tsx
│   │   ├── rating.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   │
│   ├── layout/                   # Admin shell components
│   │   ├── admin-sidebar.tsx     # Sidebar navigasi (collapsible, 2 section)
│   │   └── admin-header.tsx      # Header (search, theme toggle, profile dropdown)
│   │
│   ├── public/                   # 12 komponen landing page cafe (Savoria)
│   │   ├── navbar.tsx            # Navbar (transparan → solid on scroll, active section tracking)
│   │   ├── hero-section.tsx      # Hero fullscreen (auto-rotating slides, Ken Burns zoom)
│   │   ├── about-section.tsx     # About + image collage + floating stats card
│   │   ├── featured-menu-section.tsx  # 3 signature menu cards (dark bg)
│   │   ├── menu-preview-section.tsx   # Interactive menu grid + 11 kategori + search
│   │   ├── gallery-section.tsx   # Masonry gallery + fullscreen lightbox
│   │   ├── testimonials-section.tsx   # 4 review cards + social proof bar
│   │   ├── events-section.tsx    # Events & promotions (dark bg)
│   │   ├── reservation-section.tsx    # Table reservation form
│   │   ├── cta-section.tsx       # CTA section + marquee ticker
│   │   ├── location-section.tsx  # Google Maps embed + contact info cards
│   │   └── footer.tsx            # Footer (brand, 3 kolom link, social icons)
│   │
│   ├── theme-provider.tsx        # Wrapper next-themes (client component)
│   └── client-demo.tsx           # Demo Zustand + React Query (client component)
│
├── providers/
│   └── query-provider.tsx        # TanStack React Query provider (staleTime: 60s)
│
├── stores/
│   └── use-store.ts              # Zustand store (isSidebarOpen, counter demo)
│
├── lib/
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
│
├── hooks/
│   └── use-scroll-reveal.ts      # IntersectionObserver hook untuk scroll animations
│
├── features/                     # 🏗️ BELUM ADA — domain bisnis modular
├── services/                     # 🏗️ BELUM ADA — API layer global
├── utils/                        # 🏗️ BELUM ADA — utility global
├── constants/                    # 🏗️ BELUM ADA — konstanta global
├── types/                        # 🏗️ BELUM ADA — TypeScript types global
└── styles/                       # 🏗️ BELUM ADA — styling tambahan
```

## Feature Module Pattern

Ketika membuat fitur domain bisnis baru, buat di `src/features/`:

```
src/features/<nama-feature>/
├── components/     # Komponen khusus feature
├── hooks/          # Custom hooks feature
├── services/       # API calls feature
├── types/          # TypeScript types/interfaces
├── constants/      # Konstanta khusus
└── utils/          # Helper/utils khusus
```

> Setiap feature terisolasi — tidak mencemari namespace global.