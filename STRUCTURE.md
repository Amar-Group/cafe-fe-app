# Project Structure

## Overview

Aplikasi **Cafe FE App** — Admin dashboard untuk manajemen cafe (Amar Cafe Moncongloe).
Dibangun dengan **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v3**, dan **shadcn/ui**.

## Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 16.2.6 (App Router)               |
| UI Library       | React 19.2.4                              |
| Language         | TypeScript 6.0.3                          |
| Styling          | Tailwind CSS 3.4 + CSS Variables (oklch)  |
| Component Lib    | shadcn/ui v4 (base-nova style)            |
| State (Client)   | Zustand 5.0                               |
| State (Server)   | TanStack React Query 5.x                  |
| Tables           | TanStack React Table 8.x                  |
| Forms            | React Hook Form 7.x + Zod 4.x            |
| Charts           | ApexCharts (react-apexcharts)             |
| Rich Text Editor | TipTap 3.x                               |
| Icons            | Lucide React                              |
| Theme            | next-themes (light/dark)                  |
| HTTP Client      | Custom fetch wrapper (`apiClient`)        |
| Package Manager  | Bun                                       |

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000     # Backend API base URL
NEXT_PUBLIC_APP_TOKEN=<token>                 # X-App-Token for API auth
```

## Root Files

```
cafe-fe-app/
├── AGENTS.md             # Agent rules & coding conventions
├── STRUCTURE.md          # This file — project structure docs
├── package.json          # Dependencies & scripts (dev/build/start/lint)
├── tsconfig.json         # TypeScript config (paths: @/* → ./src/*)
├── tailwind.config.js    # Tailwind CSS v3 config (dark mode: class, CSS vars)
├── postcss.config.js     # PostCSS (tailwindcss + autoprefixer)
├── eslint.config.mjs     # ESLint (flat config, next core-web-vitals)
├── components.json       # shadcn/ui config (style: base-nova, baseColor: neutral)
├── next.config.mjs       # Next.js config (ignoreBuildErrors: true)
├── .env / .env.example   # Environment variables
└── bun.lock              # Bun lockfile
```

## Source Code Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (providers: Theme → Notification → Query)
│   ├── globals.css             # Global styles + Tailwind + CSS variable tokens (oklch)
│   │
│   ├── (admin)/                # ✅ Auth required — Admin dashboard area
│   │   ├── layout.tsx          # AdminLayout: AuthGuard → Sidebar + Header + Content
│   │   ├── dashboard/          # Dashboard page
│   │   │
│   │   ├── (rbac)/             # ✅ RBAC permission check per route
│   │   │   ├── layout.tsx      # RbacLayout: checks user navigation permissions
│   │   │   ├── master-data/
│   │   │   │   ├── roles/      # CRUD Roles
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   ├── role-columns.tsx
│   │   │   │   │   │   └── role-form-modal.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── users/      # CRUD Users page
│   │   │   └── web-management/
│   │   │       ├── menus/      # CRUD Menu items page
│   │   │       └── role-permissions/  # CRUD Role-Permission mapping
│   │   │
│   │   ├── base-ui/            # UI component showcase pages (accordion, alert, etc)
│   │   ├── extended-ui/        # Extended UI demos (drag-drop, ratings)
│   │   ├── charts/             # ApexCharts demo pages (area, bar, pie, etc)
│   │   ├── forms/              # Form element demos (validation, wizard, etc)
│   │   ├── tables/             # Table demos (basic, datatable)
│   │   ├── icons/              # Icons showcase page
│   │   ├── calendar/           # Calendar page
│   │   └── pages/              # Misc pages (blank, pricing, timeline)
│   │
│   ├── (auth)/                 # ❌ No auth — Authentication pages
│   │   ├── layout.tsx          # Minimal layout (bg #F8F9FD)
│   │   └── auth/
│   │       ├── login/          # Login page (with branding panel)
│   │       ├── register/       # Register page
│   │       ├── recover-password/
│   │       ├── confirm-mail/
│   │       └── login-pin/
│   │
│   ├── (public)/               # ❌ No auth — Public pages
│   │   └── page.tsx            # Homepage (currently: ClientDemo)
│   │
│   ├── (standalone)/           # ❌ No auth — Full-page standalone pages
│   │   ├── layout.tsx          # Centered layout
│   │   └── pages/
│   │       ├── coming-soon/
│   │       └── maintenance/
│   │
│   └── (error)/                # ❌ No auth — Error pages
│       ├── layout.tsx          # Centered + text-center layout
│       └── error/
│           ├── 400/
│           ├── 401/
│           ├── 403/
│           ├── 404/
│           ├── 500/
│           └── 503/
│
├── components/                 # Reusable components (global)
│   ├── ui/                     # shadcn/ui components (23 components)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx          # Button with variants (CVA)
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── collapse.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── link.tsx
│   │   ├── list-group.tsx
│   │   ├── modal.tsx           # Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose
│   │   ├── notification.tsx    # NotificationProvider + useNotification hook (toast system)
│   │   ├── offcanvas.tsx
│   │   ├── pagination.tsx
│   │   ├── placeholder.tsx
│   │   ├── progress.tsx
│   │   ├── rating.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   │
│   ├── shared/                 # Reusable business components
│   │   ├── data-table.tsx      # Generic DataTable (search, sort, paginate, export CSV, col toggle)
│   │   └── page-header.tsx     # PageHeader with breadcrumbs
│   │
│   ├── layout/                 # Layout components
│   │   ├── admin-sidebar.tsx   # Admin sidebar (dynamic menu from API + static demo links)
│   │   └── admin-header.tsx    # Admin header (search, theme toggle, user dropdown, logout)
│   │
│   ├── auth/                   # Auth-related components
│   │   └── auth-guard.tsx      # AuthGuard wrapper (redirects to /auth/login if not authenticated)
│   │
│   ├── theme-provider.tsx      # next-themes ThemeProvider wrapper
│   └── client-demo.tsx         # Demo component (Zustand counter + React Query)
│
├── features/                   # Feature modules (domain-driven)
│   ├── auth/                   # Authentication feature
│   │   ├── types/
│   │   │   └── index.ts        # LoginRequest, AuthUser, LoginResponse
│   │   └── services/
│   │       └── auth-service.ts # AuthService.login() (skipAuth: true)
│   │
│   └── rbac/                   # Role-Based Access Control feature
│       ├── user/               # User management
│       │   ├── types/
│       │   │   └── index.ts    # User, CreateUserRequest, UpdateUserRequest, NavigationItem, NavigationPermission
│       │   ├── services/
│       │   │   └── user-service.ts  # UserService (CRUD + getNavigation)
│       │   ├── hooks/
│       │   │   └── use-user.ts      # useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser, useUserNavigation, usePermissions
│       │   ├── constants/
│       │   │   └── dummy-data.ts    # DUMMY_USERS (sample data)
│       │   ├── store.ts             # Zustand store for user CRUD state
│       │   └── utils/               # (kosong, disiapkan untuk helper functions)
│       │
│       ├── role/               # Role management
│       │   ├── types/          # Role, CreateRoleRequest, UpdateRoleRequest
│       │   ├── services/       # RoleService (CRUD)
│       │   ├── hooks/          # useRoles, useRole, useCreateRole, etc.
│       │   ├── constants/      # DUMMY_ROLES
│       │   └── utils/          # (kosong)
│       │
│       ├── menu/               # Menu/navigation management
│       │   ├── types/          # Menu types
│       │   ├── services/       # MenuService (CRUD)
│       │   ├── hooks/          # useMenus, useCreateMenu, etc.
│       │   ├── constants/      # DUMMY_MENUS
│       │   └── utils/          # (kosong)
│       │
│       └── role-permission/    # Role-Permission mapping
│           ├── types/          # RolePermission types
│           ├── services/       # RolePermissionService (CRUD)
│           ├── hooks/          # useRolePermissions, etc.
│           ├── constants/      # DUMMY_ROLE_PERMISSIONS
│           └── utils/          # (kosong)
│
├── services/                   # Global service layer
│   └── api/
│       ├── client.ts           # apiClient<T>() — fetch wrapper (auto Bearer token + X-App-Token)
│       ├── config.ts           # API_BASE_URL, APP_TOKEN (from env vars)
│       └── types.ts            # ApiResponse<T>, WriteResult
│
├── stores/                     # Zustand stores (global state)
│   ├── use-auth.ts             # Auth state: token, user, isAuthenticated, setAuth, clearAuth, hydrate
│   ├── use-store.ts            # UI state: isSidebarOpen, toggleSidebar, (demo: count)
│   └── create-crud-store.ts    # Generic factory function for feature CRUD modal state
│
├── hooks/                      # Global reusable custom hooks (lintas feature)
│   └── (kosong — disiapkan untuk hooks yang dipakai lebih dari satu feature)
│
├── utils/                      # Global utility/helper functions (lintas feature)
│   └── (kosong — disiapkan untuk utils yang dipakai lebih dari satu feature)
│
├── providers/                  # React context providers
│   └── query-provider.tsx      # TanStack QueryClient provider ("use client", staleTime: 60s)
│
└── lib/                        # Core utilities
    └── utils.ts                # cn() — clsx + tailwind-merge
```

## Key Architectural Patterns

### 1. Feature Module Pattern

Setiap domain bisnis terisolasi di `src/features/<domain>/` dengan **5 sub-folder wajib**:
```
types/ → services/ → hooks/ → constants/ → utils/ → (components/ opsional)
```

> Semua 5 folder wajib ada meskipun belum ada isinya (gunakan `.gitkeep`).
> Folder `components/` bersifat opsional, hanya dibuat jika feature membutuhkan komponen khusus.

Data flow: **Service** → **React Query Hook** → **Page Component**

### 2. API Layer Pattern

```
apiClient (fetch wrapper)
  ↓ auto-attaches headers: Content-Type, X-App-Token, Authorization
  ↓ handles error responses → throws Error with status & data
Feature Service (static class)
  ↓ calls apiClient with typed generics
React Query Hook
  ↓ wraps service calls, manages cache keys & invalidation
Page Component
  ↓ consumes hooks, renders UI
```

### 3. Auth Pattern

```
Login Page → AuthService.login() → useAuthStore.setAuth(token, user)
                                      ↓ saves to localStorage
Every API call → apiClient reads token from localStorage → attaches Bearer header
Admin Layout → AuthGuard checks useAuthStore.isAuthenticated → redirect if not
```

### 4. RBAC Pattern

```
After login → Sidebar calls useUserNavigation() → GET /api/users/me/navigation
                ↓ returns menu tree with permissions per item
(rbac) Layout → checks if current pathname is in allowed paths → redirect if not
usePermissions() → returns { can_read, can_create, can_update, can_delete, can_report }
                     ↓ used in pages to conditionally show/hide buttons
```

### 5. Admin Page Pattern (CRUD)

Setiap halaman admin CRUD dipisah ke dalam beberapa komponen modular:
1. `"use client"` directive di entry page (`page.tsx`)
2. Menggunakan `createCrudStore<T>()` untuk global modal state (`openEdit`, `closeModal`, dll).
3. `page.tsx`: Bertugas sebagai orchestrator (fetch data via React Query, render header & table).
4. `_components/*-columns.tsx`: Definisi kolom tabel, menggunakan Zustand store untuk trigger modal edit/delete tanpa prop drilling.
5. `_components/*-form-modal.tsx`: Modal form, membaca `editingItem` dari store dan menembak mutasi.
6. `DeleteConfirmModal` dari shared components, dikontrol via store `deleteId`.
7. Permission-gated actions diatur otomatis via `usePermissions()`.
8. Toast notifications menempel di mutation success/error via `useNotification().add()`.

### 6. Provider Stack (Root → Leaf)

```
RootLayout
  → ThemeProvider (class-based dark mode, default: light)
    → NotificationProvider (global toast system)
      → QueryProvider (React Query, staleTime: 60s)
        → Route Group Layout
          → Page Component
```

## Folder Responsibilities (Quick Reference)

| Folder              | Tanggung Jawab                                         |
| ------------------- | ------------------------------------------------------ |
| `src/app/`          | Routing & layouts (Next.js App Router)                 |
| `src/components/ui/`| Primitive UI components (shadcn/ui, don't edit manually)|
| `src/components/shared/` | Reusable business components (DataTable, PageHeader) |
| `src/components/layout/` | App shell components (Sidebar, Header)              |
| `src/components/auth/`   | Auth guard wrapper                                  |
| `src/hooks/`         | Global reusable hooks (lintas feature)                 |
| `src/utils/`         | Global utility functions (lintas feature)              |
| `src/features/`     | Domain-specific modules (types, services, hooks, constants, utils) |
| `src/services/api/` | Global HTTP client & API configuration                 |
| `src/stores/`       | Zustand global state stores                            |
| `src/providers/`    | React context providers                                |
| `src/lib/`          | Core utility functions (`cn()`)                        |
