import {
  Users, Radio, Camera, Globe, ArrowRight, ShieldCheck,
  Building2, FileText, Activity, Layers, ExternalLink,
  ChevronRight, Sparkles, CheckCircle2, DollarSign, Award
} from "lucide-react";
import type { DashboardKpis } from "../../controllers/useDashboardController";

interface BerandaUtamaProps {
  kpis: DashboardKpis;
  isDark: boolean;
  setActiveSection: (sec: string) => void;
}

export function BerandaUtama({ kpis, isDark, setActiveSection }: BerandaUtamaProps) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ─── SECTION 1: ELEGANT HERO BANNER ─────────────────────────────────── */}
      <div className={`p-8 sm:p-10 rounded-3xl border transition-all duration-300 shadow-xl relative overflow-hidden gpu-accelerate ${
        isDark
          ? "border-slate-800 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-950/50"
          : "border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-blue-500/15"
      }`}>
        {/* Optimized Ambient Background Accents */}
        <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-blue-400/10 pointer-events-none" />
        <div className="absolute right-30 -bottom-10 w-72 h-72 rounded-full bg-emerald-400/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Live Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border flex items-center gap-1.5 backdrop-blur-md ${
                isDark
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-white/20 text-white border-white/30"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Pemkab Penajam Paser Utara
              </span>

              <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border backdrop-blur-md ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-white/20 text-white border-white/30"
              }`}>
                Integrasi Digital 2026
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl sm:text-3xl xl:text-4xl font-heading font-extrabold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-white"
            }`}>
              Portal Hub Integrasi Digital & Layanan Perangkat Daerah (OPD) PPU
            </h1>

            {/* Description */}
            <p className={`text-xs sm:text-sm font-body leading-relaxed max-w-2xl ${
              isDark ? "text-slate-300" : "text-blue-50"
            }`}>
              Pusat komando integrasi data Kabupaten Penajam Paser Utara. Pantau statistik kepegawaian SIMPEG (BKPSDM), peta infrastruktur telekomunikasi & CCTV (Diskominfo), layanan kependudukan, hingga keuangan daerah secara real-time.
            </p>

            {/* Sub Stats Quick Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDark ? "bg-slate-800/80 text-slate-300" : "bg-white/15 text-white backdrop-blur-md"
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5 Perangkat Daerah Integrated</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDark ? "bg-slate-800/80 text-slate-300" : "bg-white/15 text-white backdrop-blur-md"
              }`}>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>TimescaleDB & Redis Live</span>
              </div>
            </div>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActiveSection("BKPSDM PPU")}
              className={`px-6 py-3.5 rounded-2xl font-body font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-lg ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                  : "bg-white text-blue-700 hover:bg-slate-50 shadow-black/10"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Portal BKPSDM PPU</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveSection("Diskominfo PPU")}
              className={`px-6 py-3.5 rounded-2xl font-body font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer border ${
                isDark
                  ? "border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white"
                  : "border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md"
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-300" />
              <span>Portal Diskominfo & MAPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: HIGH-IMPACT KPI STATS OVERVIEW STRIP ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Pegawai ASN */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
          isDark ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-blue-300"
        }`}>
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Pegawai ASN (SIMPEG)</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {kpis.totalPegawai}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-500 font-bold">98.4% Presensi Online</span>
            <span className={isDark ? "text-slate-500" : "text-slate-400"}>PNS & PPPK</span>
          </div>
        </div>

        {/* KPI 2: Menara BTS */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
          isDark ? "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-cyan-300"
        }`}>
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Menara BTS Telekomunikasi</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            132 Menara
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-500 font-bold">4 Kecamatan PPU</span>
            <span className={isDark ? "text-slate-500" : "text-slate-400"}>10 Operator</span>
          </div>
        </div>

        {/* KPI 3: CCTV & Spot WiFi */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
          isDark ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-emerald-300"
        }`}>
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>CCTV & WiFi Publik</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            156 Titik
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-500 font-bold">29 CCTV + 7 WiFi</span>
            <span className={isDark ? "text-slate-500" : "text-slate-400"}>Area Publik</span>
          </div>
        </div>

        {/* KPI 4: Website OPD & Desa */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
          isDark ? "bg-slate-900/80 border-slate-800 hover:border-purple-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-purple-300"
        }`}>
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Website OPD & Desa</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            65 Portal
          </p>
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-purple-500 font-bold">35 OPD + 30 Desa</span>
            <span className={isDark ? "text-slate-500" : "text-slate-400"}>.penajamkab</span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: MODUL INTEGRASI PERANGKAT DAERAH (5 OPD GRID) ──────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg sm:text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Modul Integrasi Layanan Digital OPD Pemkab PPU
            </h2>
            <p className={`text-xs font-body mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Pilih Perangkat Daerah di bawah ini untuk membuka halaman integrasi khusus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: BKPSDM PPU */}
          <div
            onClick={() => setActiveSection("BKPSDM PPU")}
            className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
              isDark
                ? "border-slate-800 bg-slate-900/70 hover:border-blue-500/50"
                : "border-slate-200/80 bg-white hover:border-blue-400 shadow-sm"
            }`}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SIMPEG Live
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold group-hover:text-blue-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  BKPSDM PPU
                </h3>
                <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Badan Kepegawaian & Pengembangan SDM. Pengelolaan SIMPEG Terpadu, presensi mobile harian, pangkat, KGB, SKP, & data PNS/PPPK.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              <span>{kpis.totalPegawai} Pegawai Terdaftar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Diskominfo PPU */}
          <div
            onClick={() => setActiveSection("Diskominfo PPU")}
            className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
              isDark
                ? "border-slate-800 bg-slate-900/70 hover:border-cyan-500/50"
                : "border-slate-200/80 bg-white hover:border-cyan-400 shadow-sm"
            }`}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-teal-500 absolute top-0 left-0" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  GIS Map Active
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold group-hover:text-cyan-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  Diskominfo PPU
                </h3>
                <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Dinas Komunikasi & Informatika. Peta interaktif GIS 132 Menara BTS, 32 Lokasi CCTV Publik, 7 Spot WiFi Gratis, & Direktori Web OPD/Desa.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              <span>132 Menara & 29 CCTV</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Disdukcapil PPU */}
          <div
            onClick={() => setActiveSection("Disdukcapil PPU")}
            className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
              isDark
                ? "border-slate-800 bg-slate-900/70 hover:border-indigo-500/50"
                : "border-slate-200/80 bg-white hover:border-indigo-400 shadow-sm"
            }`}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Integrated
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold group-hover:text-indigo-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  Disdukcapil PPU
                </h3>
                <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Dinas Kependudukan & Pencatatan Sipil. Integrasi layanan NIK kependudukan, agregat data warga per kecamatan, & Kartu Keluarga.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <span>Integrasi NIK Valid</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: BKAD PPU */}
          <div
            onClick={() => setActiveSection("BKAD PPU")}
            className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
              isDark
                ? "border-slate-800 bg-slate-900/70 hover:border-purple-500/50"
                : "border-slate-200/80 bg-white hover:border-purple-400 shadow-sm"
            }`}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  APBD 2026
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold group-hover:text-purple-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  BKAD PPU
                </h3>
                <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Badan Keuangan & Aset Daerah. Realisasi fisik & keuangan APBD OPD, status pencairan TPP ASN, serta pencatatan inventaris aset daerah.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
              <span>Keuangan & Aset Daerah</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: DPMPTSP PPU */}
          <div
            onClick={() => setActiveSection("DPMPTSP PPU")}
            className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
              isDark
                ? "border-slate-800 bg-slate-900/70 hover:border-amber-500/50"
                : "border-slate-200/80 bg-white hover:border-amber-400 shadow-sm"
            }`}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500 absolute top-0 left-0" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Perizinan OSS
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold group-hover:text-amber-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                  DPMPTSP PPU
                </h3>
                <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Dinas Penanaman Modal & PTSP. Tracking status perizinan usaha publik, pendaftaran UMKM daerah, & integrasi data OSS RBA.
                </p>
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              <span>Perizinan Terpadu OSS</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
