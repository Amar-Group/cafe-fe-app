# Project Structure

## Overview
Ini adalah struktur folder project Next Starter.

```
src/                          # Root source code aplikasi
├── app/                      # Routing utama Next.js App Router
│   ├── (public)/             # Halaman publik/customer
│   │   ├── login/            # Halaman login
│   │   ├── register/         # Halaman register
│   │   ├── .../              # Halaman publik lainnya
│   │   ├── page.tsx          # Homepage/landing page
│   │   └── layout.tsx        # Layout khusus area public
│   │
│   └── (admin)/              # Area dashboard admin
│       ├── dashboard/        # Halaman dashboard utama admin
│       ├── .../              # Halaman admin lainnya
│       └── layout.tsx        # Layout khusus admin
│
├── components/               # Reusable components global
│   ├── ui/                   # Komponen UI dari shadcn/ui
│   ├── shared/               # Komponen umum reusable
│   ├── layout/               # Komponen layout/navbar/sidebar
│   ├── forms/                # Komponen form reusable
│   └── .../                  # Komponen global lainnya
│
├── features/                 # Modular feature/domain bisnis aplikasi
│   ├── menu/                 # Feature menu cafe
│   │   ├── components/       # Komponen khusus feature menu
│   │   ├── hooks/            # Custom hooks feature menu
│   │   ├── services/         # API/service feature menu
│   │   ├── types/            # Types/interfaces feature menu
│   │   ├── constants/        # Konstanta feature menu
│   │   └── utils/            # Helper/utils feature menu
│   │
│   └── .../                  # Feature lainnya
│
├── services/                 # Global service & API layer
│   ├── api/                  # API functions global
│   ├── http/                 # HTTP client/configuration
│   ├── endpoints/            # Endpoint API constants
│   └── .../                  # Service lainnya
│
├── stores/                   # Global Zustand state management
│
├── hooks/                    # Global reusable custom hooks
│
├── providers/                # React providers/context wrappers
│
├── lib/                      # Konfigurasi library/helper inti
│
├── utils/                    # Global utility/helper functions
│
├── constants/                # Konstanta global aplikasi
│
├── types/                    # Global TypeScript types/interfaces
│
└── styles/                   # Global styling tambahan
```