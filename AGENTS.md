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
| **Styling** | Tailwind CSS v3 + CSS Variables (oklch) |
| **UI Kit** | Shadcn/UI (style: `base-nova`, base color: `neutral`) |
| **State Management** | Zustand |
| **Data Fetching** | TanStack React Query |
| **Form Handling** | React Hook Form + Zod |
| **Charts** | ApexCharts (via `react-apexcharts`) |
| **Rich Text** | Tiptap |
| **Icons** | Lucide React |
| **Theme** | `next-themes` (light default, dark mode via class strategy) |

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
│   │   └── page.tsx              # Homepage / Landing Page
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
│   ├── public/                   # Komponen untuk area publik (kosong saat ini)
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
├── features/                     # 🏗️ BELUM ADA — untuk fitur domain bisnis
├── services/                     # 🏗️ BELUM ADA — untuk API layer global
├── hooks/                        # 🏗️ BELUM ADA — untuk custom hooks global
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
| `(public)` | Tanpa layout khusus (langsung root) | Landing page, halaman customer | Belum ada layout sendiri |
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

### CSS Variables (oklch)
Semua warna didefinisikan di `globals.css` menggunakan format **oklch**:
- Light mode: `:root { ... }`
- Dark mode: `.dark { ... }`

### Semantic Color Tokens
```
background, foreground, card, popover, primary, secondary,
destructive, muted, accent, border, input, ring,
chart-1~5, sidebar-*
```

### Tailwind Integration
Warna Tailwind di-mapping ke CSS variables di `tailwind.config.js`:
```js
colors: {
  background: "var(--background)",
  primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
  // ... dst
}
```

### Aturan Styling
1. **Gunakan semantic color** (e.g. `bg-background`, `text-foreground`, `border-border`) — BUKAN hardcoded hex/rgb
2. **Dark mode otomatis** via CSS variables — tidak perlu prefix `dark:`
3. **`cn()` helper** wajib digunakan untuk menggabungkan class conditional
4. Komponen UI base dari **shadcn/ui** — cek `src/components/ui/` sebelum buat komponen baru

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

Proyek ini masih dalam tahap **starter / boilerplate**. Fitur-fitur yang sudah ada:
- ✅ Admin dashboard layout (sidebar + header)
- ✅ Theme switching (light/dark)
- ✅ Komponen UI showcase (base-ui, extended-ui, charts, forms, tables, icons)
- ✅ Halaman auth (login, register, recover-password, confirm-mail, login-pin)
- ✅ Halaman error (400, 401, 403, 404, 500, 503)
- ✅ Halaman standalone (coming-soon, maintenance)
- ✅ Demo Zustand + React Query di homepage

Yang **belum ada** dan perlu dibangun:
- ❌ Halaman publik / landing page cafe (saat ini hanya demo)
- ❌ Feature modules (`src/features/`)
- ❌ API service layer (`src/services/`)
- ❌ Custom hooks global (`src/hooks/`)
- ❌ Global types (`src/types/`)
- ❌ Authentication logic (login flow, token, guards)
- ❌ CRUD fitur domain bisnis (menu cafe, orders, dll)

---

## 13. Aturan untuk AI Agent

1. **Selalu baca file ini** sebelum memulai pekerjaan apapun
2. **Gunakan Bun** — jangan pernah suggest/jalankan npm/yarn/pnpm
3. **Ikuti folder structure** di `STRUCTURE.md` dan section 3 dokumen ini
4. **Gunakan semantic color tokens** — jangan hardcode warna
5. **Cek komponen yang sudah ada** di `src/components/ui/` sebelum buat baru
6. **Feature baru** → buat di `src/features/<nama>/` dengan sub-folder sesuai pattern
7. **Jangan hapus komentar/docstring** yang sudah ada kecuali diminta
8. **"use client"** wajib di komponen yang pakai hooks/events/browser API
9. **Gunakan `cn()` helper** untuk class conditional, bukan string concatenation manual
10. **Baca docs Next.js 16** di `node_modules/next/dist/docs/` bila ragu soal API
