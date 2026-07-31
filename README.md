# Dashboard Terpadu Pemkab Penajam Paser Utara (Diskominfo & OPD)

Dashboard eksekutif terpadu untuk monitoring data sektoral, statistik daerah, tata kelola halaman/konten, peta persebaran infrastruktur menara telekomunikasi, data kepegawaian (BKPSDM), pajak BPHTB (BAPENDA), serta indikator strategis BPS Kabupaten Penajam Paser Utara (PPU).

---

## 🛠️ Teknologi & Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet / Maplibre (Peta Interaktif)
- **Backend**: Node.js, Express.js, Socket.io (Realtime Update), Cron Jobs
- **Database & Cache**: PostgreSQL / TimescaleDB, Redis
- **Orchestration**: Docker & Docker Compose
- **Monorepo / Workspace**: npm workspaces (`UI` & `server`)

---

## 📋 Prasyarat Sistem

Sebelum menjalankan proyek di komputer/laptop baru, pastikan perangkat Anda telah terinstall:
1. **Node.js** (v18.x LTS atau v20+ disarankan) & **npm**
2. **Git**
3. **Docker Desktop** (untuk menjalankan PostgreSQL/TimescaleDB & Redis)

---

## 🚀 Panduan Menjalankan di Laptop Lain (Step-by-Step)

### 1. Clone Repository
Buka Terminal / PowerShell / Command Prompt, lalu jalankan:
```bash
git clone https://github.com/Kyfaiyya/dashboardkominfo.git
cd dashboardkominfo
```

### 2. Install Seluruh Dependencies
Jalankan perintah berikut di root folder untuk menginstall semua dependensi (root, `server`, dan `UI`):
```bash
npm run install:all
```

### 3. Jalankan Database & Redis (Docker)
Pastikan aplikasi **Docker Desktop** sudah berjalan di laptop Anda, lalu jalankan:
```bash
docker compose up -d
```
> Perintah ini akan menyalakan container:
> - **Redis**: Port `6379`
> - **TimescaleDB / PostgreSQL**: Port `5433`

### 4. Konfigurasi Environment (`.env`)
Buat file `.env` pada direktori `server/` (dapat menyalin dari `server/.env.example`):

**Windows (PowerShell):**
```powershell
copy server\.env.example server\.env
```

**Linux / macOS:**
```bash
cp server/.env.example server/.env
```

Isi file `server/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://dashboard_user:dashboard_pass@localhost:5433/dashboard_db
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
POLL_CRON=*/30 * * * * *
```

### 5. Inisialisasi Data / Seeding (Opsional)
Untuk mengisi database lokal dengan data seeder awal:
```bash
npm run seed
```

### 6. Jalankan Aplikasi (Frontend + Backend)
Jalankan perintah berikut untuk memulai server backend dan frontend UI secara bersamaan:
```bash
npm run dev
```

Akses melalui browser:
- 🌐 **Frontend (UI)**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📌 Perintah Utama (Scripts Reference)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server backend & frontend UI secara bersamaan (Concurrent mode) |
| `npm run dev:server` | Menjalankan hanya server backend (`localhost:3001`) |
| `npm run dev:ui` | Menjalankan hanya frontend UI (`localhost:5173`) |
| `npm run install:all` | Menginstall seluruh dependensi di root, server, dan UI |
| `npm run seed` | Menjalankan script seeder data awal ke database |
| `npm run build` | Melakukan build produksi untuk frontend UI |

---

## 📄 Struktur Direktori Ringkas

```text
dashboardkominfo/
├── server/               # Express.js Backend & API Modules
│   ├── src/
│   │   ├── modules/      # Modul Kominfo, Governance, Bapenda, BKPSDM, BPS, dll.
│   │   └── models/       # Skema Database & Migrasi
│   └── scripts/          # Script Seeder & Utilities DB
├── UI/                   # React + TypeScript Frontend
│   └── src/
│       ├── app/
│       │   ├── components/  # Komponen UI & Layout
│       │   ├── pages/       # Halaman Dashboard OPD
│       │   └── services/    # Integration Service API
├── docker-compose.yml    # Konfigurasi Container Redis & TimescaleDB
└── package.json          # Root npm Workspaces Config
```