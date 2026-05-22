<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Cafe FE App — Agent Rules & Conventions

> Baca file ini SEBELUM menulis kode apa pun di project ini.
> File ini adalah sumber kebenaran untuk semua konvensi, arsitektur, dan pattern yang berlaku.

## 1. Project Identity

| Key              | Value                                            |
| ---------------- | ------------------------------------------------ |
| **Nama**         | Cafe FE App (Amar Cafe Frontend)                 |
| **Stack**        | Next.js 16 (App Router) · React 19 · TypeScript 6 |
| **Styling**      | Tailwind CSS v3 + CSS Variables (oklch) + shadcn/ui (base-nova style) |
| **State**        | Zustand v5 (global) · TanStack React Query v5 (server state) |
| **Forms**        | React Hook Form v7 + Zod v4 (validation)         |
| **Tables**       | TanStack React Table v8                          |
| **Icons**        | Lucide React                                     |
| **Rich Text**    | TipTap v3                                        |
| **Charts**       | ApexCharts (via react-apexcharts)                |
| **Theme**        | next-themes (light/dark via class strategy)      |
| **Package Mgr**  | Bun                                              |
| **Backend API**  | REST API di `cafe-be-app` (default: http://localhost:4000) |
| **Bahasa UI**    | **Bahasa Indonesia** untuk semua label, placeholder, notifikasi, dan pesan error |

## 2. Architecture Overview

```
Architecture: Feature-Sliced Design (Modular)
Rendering: Client-side heavy (most pages use "use client")
Auth: JWT token via localStorage + Zustand store
RBAC: Backend-driven navigation & permission per route
API Layer: Custom fetch wrapper (apiClient) → Service classes → React Query hooks
```

### Provider Hierarchy (Root Layout)

```
<html> → <body>
  └─ ThemeProvider (next-themes)
     └─ NotificationProvider (custom toast system)
        └─ QueryProvider (TanStack React Query, staleTime: 60s)
           └─ {children}
```

### Route Group Strategy

Project menggunakan Next.js **route groups** `(groupName)` untuk memisahkan layout:

| Group          | Path Prefix   | Layout Behavior                              | Auth Required |
| -------------- | ------------- | -------------------------------------------- | ------------- |
| `(admin)`      | `/dashboard`, `/master-data/*`, dll | Sidebar + Header + AuthGuard | ✅ Ya |
| `(admin)/(rbac)` | `/master-data/*`, `/web-management/*` | RBAC permission check per route | ✅ Ya |
| `(auth)`       | `/auth/*`     | Minimal layout (bg #F8F9FD)                  | ❌ Tidak |
| `(public)`     | `/`           | No layout wrapper                            | ❌ Tidak |
| `(standalone)` | `/pages/maintenance`, `/pages/coming-soon` | Centered layout | ❌ Tidak |
| `(error)`      | `/error/400`, `/error/401`, dst | Centered + text-center | ❌ Tidak |

## 3. Directory & File Conventions

### Path Alias

```
@/* → ./src/*   (dikonfigurasi di tsconfig.json)
```

### Feature Module Structure

Setiap domain bisnis diorganisir sebagai feature module di `src/features/`:

```
src/features/<domain>/
├── types/           # TypeScript types & interfaces (index.ts)
├── services/        # Service class (static methods, uses apiClient)
├── hooks/           # React Query hooks (useXxx, useCreateXxx, dst)
├── constants/       # Konstanta & dummy data
├── utils/           # Helper functions khusus feature
└── components/      # (opsional) Komponen khusus feature
```

> **Catatan:** Semua folder di atas (kecuali `components/`) WAJIB ada di setiap feature module.
> Jika belum ada isinya, biarkan kosong (gunakan `.gitkeep` agar folder ter-track di Git).

### Global Hooks & Utils

Selain hooks dan utils di dalam feature module, project juga memiliki folder global:

```
src/hooks/           # Global reusable custom hooks (lintas feature)
src/utils/           # Global utility/helper functions (lintas feature)
```

**Aturan:**
- Jika hook/util hanya relevan untuk satu feature → taruh di `features/<domain>/hooks/` atau `features/<domain>/utils/`
- Jika hook/util dipakai oleh **lebih dari satu feature** → taruh di `src/hooks/` atau `src/utils/`

**Contoh feature yang sudah ada:**
- `features/auth/` — Login service & auth types
- `features/rbac/user/` — CRUD user, navigation, permissions
- `features/rbac/role/` — CRUD role
- `features/rbac/menu/` — CRUD menu (sidebar items)
- `features/rbac/role-permission/` — CRUD role-permission mapping

### Component Organization

```
src/components/
├── ui/              # shadcn/ui components (DO NOT edit manually, use `npx shadcn add`)
├── shared/          # Reusable business components (DataTable, PageHeader)
├── layout/          # Layout components (AdminSidebar, AdminHeader)
├── auth/            # Auth-related components (AuthGuard)
├── forms/           # (future) Reusable form components
└── theme-provider.tsx
```

### Store Organization

```
src/stores/
├── use-auth.ts      # Auth state (token, user, isAuthenticated, setAuth, clearAuth, hydrate)
└── use-store.ts     # UI state (isSidebarOpen, toggleSidebar, dll)
```

## 4. Coding Patterns & Rules

### 4.1 Service Class Pattern

Setiap service WAJIB menggunakan pattern **static class** yang memanggil `apiClient`:

```typescript
// src/features/<domain>/services/<domain>-service.ts
import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { MyEntity, CreateRequest, UpdateRequest } from "../types";

export class MyEntityService {
  static async getAll(): Promise<ApiResponse<MyEntity[]>> {
    return apiClient<ApiResponse<MyEntity[]>>("/api/my-entities");
  }

  static async create(payload: CreateRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/my-entities", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  // ... getById, update, delete
}
```

**Rules:**
- Semua method HARUS `static async`
- Return type HARUS eksplisit `Promise<ApiResponse<T>>`
- Gunakan `WriteResult` untuk operasi create/update/delete
- Untuk endpoint publik (tanpa JWT), tambahkan `skipAuth: true`
- JANGAN buat instance dari service class
- JANGAN install library baru tanpa izin user
- JANGAN buat store Zustand baru kecuali benar-benar perlu state global

### 4.2 React Query Hook Pattern

Setiap feature WAJIB memiliki hooks file yang membungkus service calls:

```typescript
// src/features/<domain>/hooks/use-<domain>.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query Key Factory — WAJIB digunakan untuk konsistensi cache invalidation
export const ENTITY_KEYS = {
  all: ["entities"] as const,
  lists: () => [...ENTITY_KEYS.all, "list"] as const,
  list: (filters: string) => [...ENTITY_KEYS.lists(), { filters }] as const,
  details: () => [...ENTITY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ENTITY_KEYS.details(), id] as const,
};

// Query hook — untuk GET
export function useEntities() {
  return useQuery({
    queryKey: ENTITY_KEYS.lists(),
    queryFn: async () => {
      const res = await EntityService.getAll();
      return res.data; // ← unwrap ApiResponse.data
    },
  });
}

// Mutation hook — untuk POST/PUT/DELETE
export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequest) => EntityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITY_KEYS.lists() });
    },
  });
}
```

**Rules:**
- Selalu definisikan `ENTITY_KEYS` factory untuk query keys
- Query hooks HARUS unwrap `res.data` dari `ApiResponse`
- Mutation hooks HARUS invalidate queries terkait di `onSuccess`
- Nama hook: `use<Entity>s` (list), `use<Entity>` (detail), `useCreate<Entity>`, `useUpdate<Entity>`, `useDelete<Entity>`

### 4.3 API Response Contract

Backend selalu mengembalikan format:

```typescript
// Success response
{ success: true, data: T, message: "..." }

// Error response (thrown by apiClient)
{ success: false, message: "..." }

// Write operations return
{ success: true, data: { id: number | string }, message: "..." }
```

### 4.4 Auth & RBAC Pattern

**Auth Flow:**
1. Login → `AuthService.login()` → response berisi `{ token, user }`
2. Token & user disimpan di `localStorage` + Zustand (`useAuthStore.setAuth()`)
3. `apiClient` otomatis attach `Authorization: Bearer <token>` header
4. Semua request juga attach `X-App-Token` header

**RBAC Flow:**
1. Setelah login, sidebar memanggil `useUserNavigation()` → `GET /api/users/me/navigation`
2. Navigation response berisi tree of menu items dengan `permissions` per item
3. `(rbac)` layout mengecek apakah current pathname ada di allowed paths
4. `usePermissions()` hook memberikan `can_read/can_create/can_update/can_delete/can_report`
5. UI buttons/actions dikontrol berdasarkan permissions

**PENTING:**
- JANGAN hardcode permission checks — selalu gunakan `usePermissions()`
- Sidebar menu dirender dari API response, BUKAN dari static config
- Static `overviewLinks` dan `componentLinks` di sidebar adalah untuk demo/showcase pages

### 4.5 Page Pattern (Admin CRUD Pages)

Setiap halaman admin CRUD mengikuti pattern:

```tsx
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

export default function EntityPage() {
  const { data, isLoading } = useEntities();
  const permissions = usePermissions();
  const { add } = useNotification(); // toast notifications

  // 1. PageHeader with breadcrumbs
  // 2. Card wrapping DataTable
  // 3. Create/Edit Modal
  // 4. Delete Confirmation Modal
  // 5. Permission-gated buttons

  return (
    <div className="space-y-6">
      <PageHeader
        title="Judul Halaman"
        description="Deskripsi halaman"
        breadcrumbs={[{ label: "Parent", href: "#" }, { label: "Current" }]}
      />
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Entity</CardTitle>
          {permissions.can_create && <Button>Tambah</Button>}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable data={data} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>
      {/* Modals */}
    </div>
  );
}
```

### 4.6 UI Component Rules

- **shadcn/ui components** di `src/components/ui/` — JANGAN edit manual, gunakan `npx shadcn add <component>`
- shadcn style: **base-nova**, base color: **neutral**, CSS variables: **enabled**
- `cn()` helper dari `@/lib/utils` untuk merging Tailwind classes
- Icons: selalu gunakan **Lucide React** (`lucide-react`)
- Notifications/Toast: gunakan `useNotification()` hook dari `@/components/ui/notification`
  - Variants: `"success"`, `"danger"`, `"warning"`, `"info"`
  - Format: `add({ title: "...", message: "...", variant: "success" })`

### 4.7 Styling Rules

- **Tailwind CSS v3** dengan PostCSS + Autoprefixer
- Dark mode: `class` strategy (dikontrol oleh next-themes)
- Color tokens menggunakan **oklch** CSS variables (lihat `globals.css`)
- Selalu gunakan design tokens: `bg-background`, `text-foreground`, `bg-card`, `border-border`, dll
- JANGAN hardcode warna kecuali untuk branding tertentu (misal: `bg-blue-600` untuk brand accent)
- Border radius: gunakan `rounded-lg` / `rounded-xl` (sesuai `--radius` token)
- Scrollbar hide: gunakan class `no-scrollbar`

### 4.8 TypeScript Rules

- `strict: false` di tsconfig (project ini tidak strict mode)
- Semua types HARUS didefinisikan di `types/index.ts` dalam feature folder
- Gunakan `type` keyword (bukan `interface`) untuk consistency
- Path alias `@/*` WAJIB digunakan untuk semua imports (jangan relative `../../`)
- Global shared types di `src/services/api/types.ts`: `ApiResponse<T>`, `WriteResult`

### 4.9 Naming Conventions

| Item              | Convention                    | Example                      |
| ----------------- | ----------------------------- | ---------------------------- |
| Feature folder    | kebab-case                    | `role-permission/`           |
| Service file      | kebab-case + `-service.ts`    | `user-service.ts`            |
| Hook file         | kebab-case + `use-` prefix    | `use-user.ts`                |
| Service class     | PascalCase + `Service`        | `UserService`                |
| Hook function     | camelCase + `use` prefix      | `useUsers`, `useCreateUser`  |
| Query key factory | SCREAMING_SNAKE + `_KEYS`     | `USER_KEYS`                  |
| Type              | PascalCase                    | `CreateUserRequest`          |
| Component         | PascalCase                    | `PageHeader`, `DataTable`    |
| Route page        | `page.tsx` (Next.js convention)| -                           |
| Layout            | `layout.tsx`                  | -                            |
| Store             | `use-<name>.ts`               | `use-auth.ts`, `use-store.ts`|
| Constants         | SCREAMING_SNAKE_CASE          | `DUMMY_USERS`, `API_BASE_URL`|

## 5. Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000     # Base URL backend API
NEXT_PUBLIC_APP_TOKEN=<token>                 # X-App-Token header value
```

- Semua env vars yang diakses di client HARUS prefix `NEXT_PUBLIC_`
- Config terpusat di `src/services/api/config.ts`

## 6. Checklist Sebelum Menulis Kode

- [ ] Sudah baca `node_modules/next/dist/docs/` untuk Next.js 16 APIs?
- [ ] Feature baru → buat folder di `src/features/<domain>/` dengan **5 folder wajib** (types, services, hooks, constants, utils)?
- [ ] Types sudah didefinisikan di `types/index.ts`?
- [ ] Service class menggunakan `apiClient` dan pattern static methods?
- [ ] Hooks menggunakan `useQuery`/`useMutation` dengan query key factory?
- [ ] Page menggunakan `"use client"` directive?
- [ ] Permission check via `usePermissions()` untuk RBAC pages?
- [ ] Notification menggunakan `useNotification().add()`?
- [ ] Labels dan pesan dalam **Bahasa Indonesia**?
- [ ] Import menggunakan `@/` alias?

## 7. File Reference Quick Links

| Concern              | File                                          |
| -------------------- | --------------------------------------------- |
| API Client           | `src/services/api/client.ts`                  |
| API Config           | `src/services/api/config.ts`                  |
| API Types            | `src/services/api/types.ts`                   |
| Auth Store           | `src/stores/use-auth.ts`                      |
| UI Store             | `src/stores/use-store.ts`                     |
| Auth Guard           | `src/components/auth/auth-guard.tsx`          |
| Theme Provider       | `src/components/theme-provider.tsx`           |
| Query Provider       | `src/providers/query-provider.tsx`            |
| Root Layout          | `src/app/layout.tsx`                          |
| Admin Layout         | `src/app/(admin)/layout.tsx`                  |
| RBAC Guard Layout    | `src/app/(admin)/(rbac)/layout.tsx`           |
| Sidebar              | `src/components/layout/admin-sidebar.tsx`     |
| Header               | `src/components/layout/admin-header.tsx`      |
| DataTable            | `src/components/shared/data-table.tsx`        |
| PageHeader           | `src/components/shared/page-header.tsx`       |
| Global CSS           | `src/app/globals.css`                         |
| Tailwind Config      | `tailwind.config.js`                          |
| shadcn Config        | `components.json`                             |
| Utils (cn)           | `src/lib/utils.ts`                            |
