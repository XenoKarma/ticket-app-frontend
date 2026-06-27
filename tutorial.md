# Tutorial Aplikasi Ticketing — Frontend (React + Vite)

## 📋 Tentang Aplikasi

Frontend untuk **Ticketing System** — SPA (Single Page Application) yang memungkinkan User melaporkan kendala, IT Staff mengelola ticket, dan Head IT mengawasi seluruh sistem. Dibangun dengan React, TypeScript, Tailwind CSS v4, dan shadcn/ui v2.

### Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Bundler | Vite 8 |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| HTTP Client | Axios |
| Form + Validation | React Hook Form + Zod |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI) |
| Icons | Lucide React |
| Toast | Sonner |

### Role-Based UI

| Role | Sidebar Menu | Fitur Tambahan |
|---|---|---|
| `user` | Dashboard, Tiket Saya, Buat Tiket | — |
| `it_staff` | Dashboard, Semua Tiket, Kelola Tiket | Update status, assign |
| `head_it` | Dashboard, Semua Tiket, Kelola Tiket | + Hapus tiket |

---

## 🚀 Cara Install & Setup

### Prasyarat

- Node.js 20+
- npm 10+
- Backend API sudah running (lihat `backend/tutorial.md`)

### Langkah Install

```bash
# 1. Masuk ke direktori frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Konfigurasi environment
#    Copy atau buat file .env dengan isi:
#    VITE_API_URL=http://localhost:8000/api/v1

# 4. Jalankan development server
npm run dev
```

Akses di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
# Output: frontend/dist/
```

---

## 🗺️ Halaman & Routing

| Halaman | Route | Auth | Deskripsi |
|---|---|---|---|
| Login | `/login` | ❌ | Form email + password |
| Register | `/register` | ❌ | Form registrasi user baru |
| Dashboard | `/dashboard` | ✅ | Statistik ticket (by role) |
| Tiket List | `/tickets` | ✅ | Table + filter + pagination |
| Buat Tiket | `/tickets/create` | ✅ | Form + file upload |
| Detail Tiket | `/tickets/:id` | ✅ | Info + komentar + attachments |
| Kelola Tiket | `/manage` | ✅ (IT Staff) | Quick status + assign |
| 404 | `*` | ❌ | Halaman tidak ditemukan |

### Protected Routes

Semua route kecuali `/login` dan `/register` dilindungi oleh `useAuthGuard()` di `AppLayout.tsx`. Jika token tidak ada atau expired, user akan di-redirect ke `/login`.

---

## 📁 Struktur Proyek

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui: button, card, badge, table, select, dialog, avatar, dropdown-menu, pagination, skeleton, separator, textarea, label, input
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Layout utama: sidebar + topbar + outlet
│   │   │   ├── Sidebar.tsx        # Sidebar collapsible, menu berubah berdasarkan role
│   │   │   └── Topbar.tsx         # User avatar + dropdown menu (profile, logout)
│   │   ├── tickets/
│   │   │   ├── StatusBadge.tsx    # Badge warna berdasarkan status ticket
│   │   │   └── PriorityBadge.tsx  # Text warna berdasarkan prioritas
│   │   └── shared/
│   │       ├── Loading.tsx        # PageLoading + TableLoading skeleton
│   │       ├── EmptyState.tsx     # Komponen "tidak ada data"
│   │       └── ErrorState.tsx     # Komponen error + tombol retry
│   ├── hooks/                     # React Query hooks
│   │   ├── useAuth.ts            # Auth guard untuk protected routes
│   │   ├── useTickets.ts         # useTickets, useTicket, useCreateTicket, useUpdateTicket, useUpdateStatus, useAssignTicket, useDeleteTicket
│   │   ├── useComments.ts        # useComments, useCreateComment
│   │   ├── useCategories.ts      # useCategories
│   │   ├── useDashboard.ts       # useDashboard
│   │   └── useUsers.ts           # useItStaff
│   ├── lib/
│   │   ├── axios.ts              # Axios instance + interceptor Bearer token + 401 handling
│   │   ├── utils.ts              # cn() helper (clsx + tailwind-merge)
│   │   ├── auth.ts               # isItStaff(), isHeadIt() utility functions
│   │   └── constants.ts          # STATUS_LABELS, PRIORITY_LABELS, color variants
│   ├── types/
│   │   └── index.ts              # Semua TypeScript interfaces (User, Ticket, Comment, Category, dll)
│   ├── contexts/
│   │   └── AuthContext.tsx        # AuthProvider + useAuth hook (login, register, logout, getUser)
│   ├── pages/
│   │   ├── Login.tsx             # Form login
│   │   ├── Register.tsx          # Form register
│   │   ├── Dashboard.tsx         # Stat cards + recent tickets
│   │   ├── NotFound.tsx          # 404 page
│   │   └── tickets/
│   │       ├── TicketList.tsx    # Table + filter (status, priority, category, search) + pagination
│   │       ├── TicketCreate.tsx  # Form create + file upload (max 5 files, 5MB)
│   │       ├── TicketDetail.tsx  # Detail + attachments + komentar + actions (IT Staff)
│   │       └── TicketManage.tsx  # IT Staff: quick status update table
│   ├── App.tsx                   # Router + QueryClientProvider + AuthProvider + Toaster
│   └── main.tsx                  # Entry point
├── .env                          # VITE_API_URL
├── components.json               # Konfigurasi shadcn/ui
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts                # Vite + React + Tailwind CSS + @ alias
└── package.json
```

---

## 🧩 Hooks API (React Query)

Semua komunikasi dengan backend API dilakukan melalui hooks di `src/hooks/`.

### Auth
```typescript
const { login, register, logout, user, token, isLoading, getUser } = useAuth()
```

### Tickets
```typescript
// Query
const { data, isLoading, error, refetch } = useTickets({ status: 'open', priority: 'high', page: '1' })
const { data: ticket } = useTicket(id)

// Mutation
const { mutateAsync: createTicket, isPending } = useCreateTicket()
const { mutateAsync: updateTicket } = useUpdateTicket(id)
const { mutateAsync: updateStatus } = useUpdateStatus(id)
const { mutateAsync: assignTicket } = useAssignTicket(id)
const { mutateAsync: deleteTicket } = useDeleteTicket(id)
```

### Comments
```typescript
const { data: comments } = useComments(ticketId)
const { mutateAsync: addComment } = useCreateComment(ticketId)
```

### Categories & Dashboard
```typescript
const { data: categories } = useCategories()
const { data: dashboard } = useDashboard()
const { data: itStaff } = useItStaff()
```

### Axios Interceptor

`src/lib/axios.ts` secara otomatis:
- Menambahkan header `Authorization: Bearer <token>` dari localStorage
- Jika response 401, hapus token dan redirect ke `/login`

---

## 🎨 Implementasi Halaman

### 1. Login / Register

Halaman publik (tanpa auth). Form sederhana dengan validasi:
- Login: email + password
- Register: name + email + password + confirm password

Setelah sukses:
- Token disimpan di `localStorage`
- User disimpan di context
- Redirect ke `/dashboard`

### 2. Dashboard

Menampilkan statistik dari `GET /api/v1/dashboard`:

```
User:       total tiket pribadi + counts by status + 5 tiket terbaru
IT Staff:   total seluruh tiket + counts + assigned count + 5 tiket terbaru
```

### 3. Ticket List

Table dengan fitur:
- **Filter**: status (dropdown), priority (dropdown), category (dropdown), search (text input)
- **Pagination**: page navigation
- **Role-based**: User hanya lihat tiket sendiri, IT Staff lihat semua
- **Row action**: klik "Detail" untuk ke halaman detail

Filter menggunakan URL search params (`useSearchParams`), sehingga bisa di-bookmark.

### 4. Buat Tiket

Form dengan:
- Kategori (dropdown — dari API)
- Prioritas (dropdown — low/medium/high/urgent)
- Judul + Deskripsi (text input + textarea)
- File upload (drag/click, max 5 files, 5MB each)
- Validasi client-side + server-side

File diupload via `FormData` dengan `multipart/form-data`.

### 5. Detail Tiket

Tiga bagian utama:
- **Kiri (2/3)**: Deskripsi, Lampiran (download link), Komentar (list + create)
- **Kanan (1/3)**: Info detail (pelapor, email, assignee, tanggal)
- **IT Staff only**: Update status dropdown, Assign dropdown, Delete button

Komentar menampilkan avatar, nama, role badge (User / IT Staff), body, dan timestamp.

### 6. Kelola Tiket (IT Staff)

Table khusus untuk IT Staff dengan:
- Filter by status
- Quick status update dropdown per baris
- Link ke detail ticket

---

## 🔐 Auth Flow

```
1. User mengakses halaman protected
2. AppLayout → useAuthGuard() dijalankan
3. Cek token di localStorage:
   - Tidak ada → redirect /login
   - Ada + user null → panggil GET /auth/user
4. Jika GET /auth/user gagal (401) → hapus token → redirect /login
5. Jika sukses → render halaman
```

### Logout
```
1. Panggil POST /auth/logout
2. Hapus token dari localStorage
3. Set user ke null
4. Redirect ke /login
```

---

## 🎨 Styling Convention

### Status Colors
| Status | Badge Style |
|---|---|
| `open` | bg-blue-100 text-blue-700 |
| `in_progress` | bg-amber-100 text-amber-700 |
| `resolved` | bg-green-100 text-green-700 |
| `closed` | bg-gray-100 text-gray-500 |

### Priority Colors
| Priority | Text Style |
|---|---|
| `low` | text-gray-500 |
| `medium` | text-blue-600 |
| `high` | text-orange-600 |
| `urgent` | text-red-600 font-semibold |

### Role Badges
| Role | Label |
|---|---|
| `user` | User (default badge) |
| `it_staff` | IT Staff (secondary badge) |
| `head_it` | Head IT (yellow/primary badge) |

---

## ⚙️ Cara Menambahkan Halaman Baru

1. Buat file di `src/pages/` (contoh: `Profile.tsx`)
2. Buat hook di `src/hooks/` jika perlu query API baru
3. Tambahkan route di `src/App.tsx`
4. Tambahkan link di `src/components/layout/Sidebar.tsx`

```typescript
// Contoh: menambah route Profile
// src/App.tsx
<Route element={<AppLayout />}>
  <Route path="/profile" element={<Profile />} />
</Route>

// src/components/layout/Sidebar.tsx
const links = [
  { to: '/profile', label: 'Profile', icon: User },
]
```

---

## 📦 Best Practice yang Diterapkan

| Best Practice | Implementasi |
|---|---|
| **TypeScript Strict** | Semua data dari API punya tipe di `types/index.ts` |
| **Separation of Concerns** | Components (UI) terpisah dari hooks (logic) |
| **Server State** | React Query untuk API calls, cache, refetch |
| **Auth State** | Context API untuk user state |
| **Protected Routes** | `useAuthGuard()` wrapper |
| **Error Handling** | ErrorState component + toast notifications |
| **Loading State** | Skeleton components di setiap page |
| **Empty State** | EmptyState component untuk data kosong |
| **Responsive** | Tailwind breakpoints + collapsible sidebar |
| **File Upload** | FormData + validasi client-side |
| **Pagination** | shadcn Pagination component + URL search params |
| **Filter** | URL-based filter (shareable/bookmarkable) |
| **API Layer** | Axios interceptor untuk token + error handling |
| **Consistent UI** | shadcn/ui design system + CSS variables |

---

## 🧪 Testing

### Frontend Testing (belum diimplementasi)
Untuk testing frontend bisa menggunakan:
- **Vitest** (unit test untuk hooks, utils)
- **React Testing Library** (component test)
- **Cypress / Playwright** (E2E test)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## 📝 Catatan Pengembangan Lanjutan

1. **Dark mode** — sudah ada CSS variables di `index.css`, tinggal toggle class `.dark`
2. **Notification** — real-time ticket updates via Laravel Broadcasting + WebSocket
3. **User management** — halaman admin untuk CRUD user + roles
4. **Export laporan** — export tickets ke CSV/PDF
5. **Profile page** — ganti password, edit profil
6. **Dashboard chart** — visualisasi dengan Recharts
7. **Search** — debounce search input untuk mengurangi request

---

## 🔗 Integrasi dengan Backend

Pastikan backend sudah running dan CORS dikonfigurasi:

```
# .env (frontend)
VITE_API_URL=http://localhost:8000/api/v1
```

Backend di `config/cors.php` harus mengizinkan origin frontend:
```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

---

## 🐳 Deploy

1. Build frontend:
   ```bash
   npm run build
   # output: dist/
   ```

2. Deploy ke hosting statis (Vercel, Netlify, atau serve via Laravel public/):
   - Arahkan root domain ke `dist/index.html`
   - Konfigurasi SPA fallback (semua route ke `index.html`)
   - Set environment variable `VITE_API_URL` ke URL production backend

3. Contoh deploy ke Vercel:
   ```bash
   vercel --prod
   ```
