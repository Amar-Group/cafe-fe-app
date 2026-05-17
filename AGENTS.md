<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Agent Rules for cafe-fe-app

> Baca file ini **SELALU** di awal setiap conversation/task baru. File ini berisi aturan, konvensi, dan konteks project agar kamu tidak perlu diinstruksikan ulang.

## 1. Project Context

- **Project**: cafe-fe-app — Admin Dashboard (starter/template phase, belum ada fitur bisnis)
- **Framework**: Next.js 16 App Router
- **Bahasa**: TypeScript (strict: false)
- **Styling**: Tailwind CSS 3 + CSS Variables (OKLCH) + shadcn/ui (base-nova)
- **Package Manager**: Bun (JANGAN gunakan npm/yarn)
- **State**: Zustand 5 (client state) + TanStack React Query 5 (server state)
- **Forms**: React Hook Form 7 + Zod 4
- **Charts**: ApexCharts (react-apexcharts)
- **Editor**: Tiptap 3
- **Icons**: Lucide React
- **Theme**: next-themes (class-based dark mode)
- **Path Alias**: `@/*` → `./src/*`

## 2. File & Folder Conventions

### Reference: `STRUCTURE.md`
Baca `STRUCTURE.md` untuk detail lengkap folder structure. Berikut ringkasannya:

### Route Groups
| Group          | Path Pattern      | Layout                        | Gunakan Untuk            |
|----------------|-------------------|-------------------------------|--------------------------|
| `(admin)`      | `/*`              | Sidebar + Header + Content    | Halaman admin dashboard  |
| `(auth)`       | `/auth/*`         | Minimal centered (bg #F8F9FD) | Login, register, dll     |
| `(error)`      | `/error/*`        | Centered flexbox              | Error pages (400-503)    |
| `(standalone)` | `/pages/*`        | Centered flexbox              | Coming soon, maintenance |
| `(public)`     | `/`               | Dari root layout langsung     | Customer-facing pages    |

### Key Directories
| Directory            | Isi                                      |
|----------------------|------------------------------------------|
| `src/components/ui/` | shadcn/ui components (JANGAN edit manual kecuali styling) |
| `src/components/layout/` | Admin sidebar & header              |
| `src/stores/`        | Zustand stores                           |
| `src/providers/`     | React context providers                  |
| `src/lib/utils.ts`   | `cn()` helper (clsx + tailwind-merge)    |
| `src/features/`      | (PLANNED) Feature-based modules          |
| `src/services/`      | (PLANNED) Global API services            |

## 3. Coding Rules

### Component Rules
1. **"use client"** — Tambahkan HANYA jika komponen memerlukan hooks, event handlers, atau browser API.
2. **Page components**: `export default function XxxPage()` — selalu default export.
3. **Non-page components**: `export function XxxComponent()` — named export.
4. **Layout components**: `export default function XxxLayout({ children })` — default export.

### Styling Rules
1. **WAJIB** gunakan **semantic color tokens** dari CSS variables:
   - ✅ `text-foreground`, `bg-card`, `bg-background`, `text-muted-foreground`, `border-border`
   - ❌ `text-gray-900`, `bg-white`, `bg-gray-50` (hardcoded)
2. **Dark mode** sudah ditangani otomatis via CSS variables. Gunakan `dark:` prefix HANYA untuk warna yang tidak ada semantic token-nya (misal: `text-blue-600 dark:text-blue-400`).
3. **Responsive**: Gunakan mobile-first approach (`sm:`, `md:`, `lg:` breakpoints).
4. **Animations**: Gunakan `transition-colors`, `transition-all` untuk hover/state effects.
5. **`cn()` helper**: Gunakan `cn()` dari `@/lib/utils` untuk conditional class merging.
6. Komponen shadcn/ui sudah menggunakan `class-variance-authority` (CVA) untuk variants.

### Import Order
```tsx
// 1. React/Next.js
import { useState } from "react";
import Link from "next/link";

// 2. External libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Internal - components
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

// 4. Internal - logic (stores, hooks, utils, services)
import { useStore } from "@/stores/use-store";
import { cn } from "@/lib/utils";

// 5. Types (jika terpisah)
import type { SomeType } from "@/types/some-type";
```

### State Management Rules
1. **Zustand** untuk UI state global (sidebar toggle, modal state, dll).
   - Store file: `src/stores/use-[name].ts`
   - Pattern: `create((set) => ({ ... }))`
2. **TanStack React Query** untuk server state / API data.
   - Provider sudah terpasang di root layout.
   - Default staleTime: 60s.
3. **JANGAN** campur server state di Zustand. API data → React Query.

## 4. Naming Conventions

| Item            | Convention                  | Contoh                           |
|-----------------|-----------------------------|----------------------------------|
| File/folder     | kebab-case                  | `admin-sidebar.tsx`, `use-store.ts` |
| Component       | PascalCase                  | `AdminSidebar`, `DashboardPage`  |
| Hook            | camelCase, prefix `use`     | `useStore`, `useAuth`            |
| Store file      | `use-[name].ts`             | `use-store.ts`, `use-auth.ts`    |
| Type/Interface  | PascalCase                  | `UserProfile`, `ApiResponse`     |
| Constant        | UPPER_SNAKE_CASE            | `API_BASE_URL`, `MAX_FILE_SIZE`  |
| CSS Variable    | kebab-case, prefix `--`     | `--background`, `--primary`      |

## 5. Saat Menambah Fitur Baru

### Checklist:
1. [ ] Buat route page: `src/app/(admin)/[feature]/page.tsx`
2. [ ] Buat feature module: `src/features/[feature]/`
   - `components/` — komponen UI khusus fitur
   - `hooks/` — custom hooks fitur
   - `services/` — API service functions
   - `types/` — TypeScript types/interfaces
3. [ ] Tambahkan navigasi di `src/components/layout/admin-sidebar.tsx`
4. [ ] Jika butuh global state → buat store baru di `src/stores/`
5. [ ] Jika komponen reusable lintas fitur → letakkan di `src/components/`

### Pattern API Service (Planned):
```tsx
// src/features/[feature]/services/[feature]-service.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FEATURE_KEYS = {
  all: ["feature"] as const,
  list: () => [...FEATURE_KEYS.all, "list"] as const,
  detail: (id: string) => [...FEATURE_KEYS.all, "detail", id] as const,
};

export function useFeatureList() {
  return useQuery({
    queryKey: FEATURE_KEYS.list(),
    queryFn: () => fetch("/api/feature").then((r) => r.json()),
  });
}
```

## 6. Theming

### CSS Variables (globals.css)
- **Light**: Defined in `:root`
- **Dark**: Defined in `.dark`
- **Color space**: OKLCH
- **Semantic tokens**: background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, sidebar-*, chart-*
- **Border radius**: `--radius: 0.625rem`

### Catatan Penting:
- Auth pages (`(auth)`) dan Error pages (`(error)`) menggunakan hardcoded `bg-[#F8F9FD]` — TIDAK ikut dark mode. Ini **by design**.
- Admin area `(admin)` sepenuhnya mendukung dark mode via semantic tokens.

## 7. Perintah Umum

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build production
bun run build

# Start production server
bun run start

# Lint
bun run lint

# Tambah shadcn/ui component
bunx --bun shadcn@latest add [component-name]
```

## 8. Known Quirks & Gotchas

1. **`next.config.mjs`** memiliki `typescript.ignoreBuildErrors: true` — TypeScript errors tidak menghalangi build. TAPI tetap tulis kode yang type-safe.
2. **`tsconfig.json`** memiliki `strict: false` — Tipe tidak seketat mode strict. Pertimbangkan untuk beralih ke `strict: true` di masa depan.
3. **shadcn/ui style**: `base-nova` — Ini bukan style default shadcn. Komponen UI-nya mungkin berbeda dari style `default` atau `new-york`.
4. **Sidebar navigation** menggunakan hardcoded link arrays di `admin-sidebar.tsx`. Ketika fitur bisnis ditambahkan, pertimbangkan untuk memindahkan ke config terpisah atau dynamic dari API.
5. **`package-lock.json`** masih ada di repo meski project sudah migrasi ke Bun. Bisa diabaikan (Bun menggunakan `bun.lock`).
6. **`page.module.css`** ada tapi tidak digunakan (leftover dari create-next-app). Bisa dihapus.
