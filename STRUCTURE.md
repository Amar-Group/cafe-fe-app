# Project Structure

## Overview

Ini adalah project **cafe-fe-app** — sebuah admin dashboard starter/template yang dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 3**, dan **shadcn/ui (base-nova style)**. Project ini menggunakan **Bun** sebagai package manager.

Saat ini project masih dalam tahap **starter/boilerplate** dengan halaman-halaman demo untuk showcase komponen UI (charts, forms, tables, base-ui, dll). Belum ada fitur bisnis (business features) yang diimplementasikan.

---

## Tech Stack

| Layer            | Technology                                            |
|------------------|-------------------------------------------------------|
| Framework        | Next.js 16 (App Router, RSC support)                  |
| Language         | TypeScript 6 (strict: false)                          |
| Styling          | Tailwind CSS 3 + CSS Variables (OKLCH color space)    |
| UI Components    | shadcn/ui (base-nova style) + custom components       |
| Icons            | Lucide React                                          |
| State Management | Zustand 5                                             |
| Server State     | TanStack React Query 5                                |
| Tables           | TanStack React Table 8                                |
| Forms            | React Hook Form 7 + Zod 4 + @hookform/resolvers       |
| Charts           | ApexCharts (react-apexcharts)                         |
| Rich Text Editor | Tiptap 3                                              |
| Theme            | next-themes (dark/light mode, class-based)            |
| Package Manager  | Bun                                                   |
| Linting          | ESLint 9 (eslint-config-next)                         |

---

## Path Alias

```
@/* → ./src/*
```

Dikonfigurasi di `tsconfig.json`. Semua import internal menggunakan prefix `@/`.

---

## Folder Structure (Actual)

```
cafe-fe-app/
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router (semua routing ada di sini)
│   │   ├── globals.css            # Global styles + CSS variables (light/dark theme)
│   │   ├── layout.tsx             # Root layout (fonts, ThemeProvider, QueryProvider)
│   │   │
│   │   ├── (admin)/               # Route group: Admin dashboard area
│   │   │   ├── layout.tsx         # Admin layout (Sidebar + Header + main content)
│   │   │   ├── dashboard/         # /dashboard
│   │   │   ├── calendar/          # /calendar
│   │   │   ├── base-ui/           # /base-ui/* (21 demo pages: accordions, alerts, dll)
│   │   │   ├── extended-ui/       # /extended-ui/* (drag-drop, ratings)
│   │   │   ├── charts/            # /charts/* (17 chart types: area, bar, pie, dll)
│   │   │   ├── forms/             # /forms/* (9 form demos: basic, wizard, editor, dll)
│   │   │   ├── tables/            # /tables/* (basic, datatable)
│   │   │   ├── icons/             # /icons (icon showcase)
│   │   │   └── pages/             # /pages/* (blank, pricing, timeline)
│   │   │
│   │   ├── (auth)/                # Route group: Auth pages (tanpa sidebar/header)
│   │   │   ├── layout.tsx         # Layout minimal (bg #F8F9FD)
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       ├── recover-password/
│   │   │       ├── confirm-mail/
│   │   │       └── login-pin/
│   │   │
│   │   ├── (error)/               # Route group: Error pages (centered layout)
│   │   │   ├── layout.tsx         # Layout centered
│   │   │   └── error/
│   │   │       ├── 400/
│   │   │       ├── 401/
│   │   │       ├── 403/
│   │   │       ├── 404/
│   │   │       ├── 500/
│   │   │       └── 503/
│   │   │
│   │   ├── (standalone)/          # Route group: Standalone pages (centered, no nav)
│   │   │   ├── layout.tsx
│   │   │   └── pages/
│   │   │       ├── coming-soon/
│   │   │       └── maintenance/
│   │   │
│   │   └── (public)/              # Route group: Public/customer-facing pages
│   │       └── page.tsx           # Homepage (/) — saat ini hanya ClientDemo
│   │
│   ├── components/                # Reusable components
│   │   ├── ui/                    # shadcn/ui components (23 komponen)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── collapse.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── link.tsx
│   │   │   ├── list-group.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── notification.tsx
│   │   │   ├── offcanvas.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── placeholder.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── rating.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── admin-sidebar.tsx  # Sidebar navigasi admin (collapsible, multi-level)
│   │   │   └── admin-header.tsx   # Top header (search, theme toggle, profile dropdown)
│   │   │
│   │   ├── client-demo.tsx        # Demo component (Zustand + React Query showcase)
│   │   └── theme-provider.tsx     # ThemeProvider wrapper (next-themes)
│   │
│   ├── lib/                       # Library/utility functions
│   │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│   │
│   ├── providers/                 # React context providers
│   │   └── query-provider.tsx     # TanStack React Query provider (staleTime: 60s)
│   │
│   └── stores/                    # Zustand global stores
│       └── use-store.ts           # Global store (sidebar toggle, demo counter)
│
├── components.json                # shadcn/ui configuration (base-nova, RSC, Lucide)
├── tailwind.config.js             # Tailwind config (CSS vars, darkMode: class)
├── tsconfig.json                  # TypeScript config (bundler, path alias)
├── next.config.mjs                # Next.js config (ignoreBuildErrors: true)
├── eslint.config.mjs              # ESLint flat config
├── postcss.config.js              # PostCSS (tailwindcss + autoprefixer)
├── package.json                   # Dependencies & scripts
└── bun.lock                       # Bun lockfile
```

---

## Architecture & Flow

### 1. Layout Hierarchy

```
RootLayout (src/app/layout.tsx)
├── Fonts: Geist Sans + Geist Mono (Google Fonts)
├── ThemeProvider (next-themes, class-based, default: light)
├── QueryProvider (TanStack Query, staleTime: 60s)
│
├── (admin) layout → AdminSidebar + AdminHeader + {children}
├── (auth) layout → Minimal centered layout (bg: #F8F9FD)
├── (error) layout → Centered layout
├── (standalone) layout → Centered layout
└── (public) layout → Tidak ada layout khusus (langsung children)
```

### 2. Route Group Strategy

Project menggunakan **Route Groups** (`(parentheses)`) untuk memisahkan area dengan layout berbeda:

| Route Group    | Layout                     | Keterangan                         |
|----------------|----------------------------|------------------------------------|
| `(admin)`      | Sidebar + Header + Content | Area admin dashboard               |
| `(auth)`       | Minimal, centered          | Login, register, dll (external links dari sidebar) |
| `(error)`      | Centered, flexbox          | Halaman error (400-503)            |
| `(standalone)` | Centered, flexbox          | Coming soon, maintenance           |
| `(public)`     | Langsung dari root         | Homepage / customer-facing pages   |

### 3. State Management

- **Zustand** (`src/stores/use-store.ts`): Untuk state global client-side
  - `isSidebarOpen` + `toggleSidebar`: Kontrol sidebar collapse
  - `count` + `increment/decrement/reset`: Demo counter (bisa dihapus)
- **TanStack React Query** (`src/providers/query-provider.tsx`): Untuk server state / API data fetching
  - Default `staleTime: 60s`

### 4. Theming System

- **CSS Variables** di `globals.css` menggunakan **OKLCH color space**
- **Light mode**: `:root` selector
- **Dark mode**: `.dark` class selector
- **Color semantic tokens**: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `card`, `popover`, `border`, `input`, `ring`, `sidebar-*`, `chart-*`
- **Theme toggle**: Di `AdminHeader` via `next-themes` (`useTheme`)

### 5. Navigation Structure

Navigasi sidebar (`admin-sidebar.tsx`) terbagi 2 section:

**Overview:**
- Dashboard (`/dashboard`)
- Calendar (`/calendar`)
- Pages (submenu: Blank, Pricing, Maintenance*, Timeline, Coming Soon*)
- Auth Pages (submenu: Login*, Register*, Recover Password*, Confirm Mail*, Login Pin*)
- Error Pages (submenu: 400*-503*)

**Component:**
- Base UI (21 submenu)
- Extended UI (2 submenu)
- Icons
- Charts (17 submenu)
- Forms (9 submenu)
- Tables (2 submenu)

> `*` = `external: true` — membuka di tab baru (menggunakan `<a>` tag bukan `<Link>`)

---

## Key Conventions

### Component Patterns

1. **Client Components**: Gunakan `"use client"` di baris pertama jika memerlukan hooks, event handlers, atau browser API.
2. **Server Components**: Default di Next.js App Router — tidak perlu directive khusus.
3. **Page Components**: Export default function bernama `[Feature]Page` (contoh: `DashboardPage`).
4. **Layout Components**: Export default function bernama `[Area]Layout`.
5. **Reusable Components**: Named export (bukan default), contoh: `export function AdminSidebar()`.

### Styling Conventions

1. **Tailwind utility classes** sebagai styling utama.
2. **Semantic color tokens** (`text-foreground`, `bg-card`, `border-border`, dll) — JANGAN gunakan hardcoded colors.
3. **Dark mode**: Gunakan `dark:` prefix untuk override di dark mode, ATAU andalkan semantic tokens yang sudah berbeda di `.dark`.
4. **Responsive**: Mobile-first (`sm:`, `md:`, `lg:` breakpoints).
5. **Transitions**: Gunakan `transition-colors`, `transition-all` untuk efek hover/state.

### Import Conventions

```tsx
// 1. External libraries
import { useQuery } from "@tanstack/react-query";

// 2. Internal (absolute path via @/)
import { useStore } from "@/stores/use-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

---

## Rencana Pengembangan (Planned Structure)

Ketika fitur bisnis mulai dibangun, tambahkan folder-folder berikut di `src/`:

```
src/
├── features/                  # Modular feature/domain bisnis
│   └── [feature-name]/
│       ├── components/        # Komponen khusus feature
│       ├── hooks/             # Custom hooks feature
│       ├── services/          # API service functions feature
│       ├── types/             # TypeScript types/interfaces feature
│       ├── constants/         # Konstanta feature
│       └── utils/             # Helper/utils feature
│
├── services/                  # Global service & API layer
│   ├── api/                   # API function wrappers
│   ├── http/                  # HTTP client (axios/fetch config)
│   └── endpoints/             # Endpoint constants
│
├── hooks/                     # Global reusable custom hooks
├── types/                     # Global TypeScript types/interfaces
├── constants/                 # Konstanta global
└── utils/                     # Global utility functions
```

### Pola Feature Module

Setiap fitur bisnis baru harus mengikuti pola:

1. **Route page** di `src/app/(admin)/[feature]/page.tsx`
2. **Feature module** di `src/features/[feature]/`
3. **Komponen UI khusus** di `src/features/[feature]/components/`
4. **API calls** di `src/features/[feature]/services/`
5. **Types** di `src/features/[feature]/types/`
6. **Hooks** di `src/features/[feature]/hooks/`
7. Komponen yang **reusable lintas feature** → pindah ke `src/components/`