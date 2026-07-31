import React from "react";
import {
  Users, Radio, Camera, Globe, ArrowRight, ShieldCheck,
  Building2, FileText, Activity, Layers, ExternalLink,
  ChevronRight, Sparkles, CheckCircle2, DollarSign, Award,
  Landmark, BarChart3, TrendingUp, Download, Printer, Wallet,
  Heart, GraduationCap, Scale, MapPin, Lock
} from "lucide-react";
import type { DashboardKpis } from "../../controllers/useDashboardController";

interface BerandaUtamaProps {
  kpis: DashboardKpis;
  isDark: boolean;
  setActiveSection: (sec: string) => void;
  pageConfigs?: Record<string, boolean>;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
}

export function BerandaUtama({
  kpis,
  isDark,
  setActiveSection,
  pageConfigs = {},
  isLoggedIn = false,
  onOpenLogin,
}: BerandaUtamaProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleSectionClick = (secName: string) => {
    if (!isLoggedIn && pageConfigs[secName] === false) {
      if (onOpenLogin) onOpenLogin();
      return;
    }
    setActiveSection(secName);
  };

  const isBkpsdmLocked = !isLoggedIn && pageConfigs["BKPSDM PPU"] === false;
  const isBapendaLocked = !isLoggedIn && pageConfigs["Bapenda PPU"] === false;
  const isBpsLocked = !isLoggedIn && pageConfigs["BPS PPU"] === false;
  const isDiskominfoLocked = !isLoggedIn && pageConfigs["Diskominfo PPU"] === false;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ─── SECTION 1: ELEGANT HERO BANNER ─────────────────────────────────── */}
      <div className={`p-8 sm:p-10 rounded-3xl border transition-all duration-300 shadow-xl relative overflow-hidden gpu-accelerate ${
        isDark
          ? "border-slate-800 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-blue-950/50"
          : "border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-blue-500/15"
      }`}>
        {/* Ambient Background Accents */}
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
              Portal Hub Integrasi Digital & Eksekutif OPD Pemkab PPU
            </h1>

            {/* Description */}
            <p className={`text-xs sm:text-sm font-body leading-relaxed max-w-2xl ${
              isDark ? "text-slate-300" : "text-blue-50"
            }`}>
              Pusat komando eksekutif Kabupaten Penajam Paser Utara. Pantau statistik kepegawaian SIMPEG (BKPSDM), realisasi PAD & Pajak (Bapenda), indikator statistik strategis (BPS), peta GIS CCTV & Menara (Diskominfo), hingga layanan keuangan & kependudukan secara real-time.
            </p>

            {/* Sub Stats Quick Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDark ? "bg-slate-800/80 text-slate-300" : "bg-white/15 text-white backdrop-blur-md"
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>7 Perangkat Daerah Integrated</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                isDark ? "bg-slate-800/80 text-slate-300" : "bg-white/15 text-white backdrop-blur-md"
              }`}>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Realtime BAPENDA & BPS Live</span>
              </div>
            </div>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className={`px-6 py-3.5 rounded-2xl font-body font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-lg ${
                isDark
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                  : "bg-white text-emerald-800 hover:bg-slate-50 shadow-black/10"
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-500" />
              <span>Cetak / Export Ringkasan Eksekutif</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleSectionClick("Bapenda PPU")}
                className={`flex-1 px-4 py-3 rounded-2xl font-body font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer border ${
                  isDark
                    ? "border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white"
                    : "border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md"
                }`}
              >
                <Landmark className="w-4 h-4 text-amber-300" />
                <span>Bapenda</span>
              </button>

              <button
                onClick={() => handleSectionClick("BPS PPU")}
                className={`flex-1 px-4 py-3 rounded-2xl font-body font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer border ${
                  isDark
                    ? "border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white"
                    : "border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-300" />
                <span>BPS Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: HIGH-IMPACT EXECUTIVE KPI STATS STRIP ───────────────── */}
      {(!isBkpsdmLocked || !isBapendaLocked || !isBpsLocked || !isDiskominfoLocked) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Pegawai ASN */}
          {!isBkpsdmLocked && (
            <div
              onClick={() => handleSectionClick("BKPSDM PPU")}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden cursor-pointer ${
                isDark ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-blue-300"
              }`}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 absolute top-0 left-0" />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Pegawai ASN (SIMPEG)</span>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {kpis.totalPegawai}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">98.4% Presensi Online</span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>PNS & PPPK</span>
              </div>
            </div>
          )}

          {/* KPI 2: Realisasi PAD BAPENDA */}
          {!isBapendaLocked && (
            <div
              onClick={() => handleSectionClick("Bapenda PPU")}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden cursor-pointer ${
                isDark ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-emerald-300"
              }`}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Realisasi PAD (BAPENDA)</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold mt-4 tracking-tight text-emerald-600 dark:text-emerald-400">
                Rp 67,78 M
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">35.1% dari Target</span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>136k SKPD</span>
              </div>
            </div>
          )}

          {/* KPI 3: IPM & Ekonomi BPS */}
          {!isBpsLocked && (
            <div
              onClick={() => handleSectionClick("BPS PPU")}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden cursor-pointer ${
                isDark ? "bg-slate-900/80 border-slate-800 hover:border-violet-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-violet-300"
              }`}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-500 absolute top-0 left-0" />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>IPM & Ekonomi (BPS)</span>
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-extrabold mt-4 tracking-tight text-violet-600 dark:text-violet-400">
                IPM 73,90
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-500 font-bold">Growth +30.68%</span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>202k Jiwa</span>
              </div>
            </div>
          )}

          {/* KPI 4: CCTV & Infrastructure Diskominfo */}
          {!isDiskominfoLocked && (
            <div
              onClick={() => handleSectionClick("Diskominfo PPU")}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden cursor-pointer ${
                isDark ? "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-cyan-300"
              }`}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute top-0 left-0" />
              <div className="flex items-center justify-between">
                <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Menara & CCTV (Diskominfo)</span>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-4 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                156 Titik
              </p>
              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-500 font-bold">132 BTS Menara</span>
                <span className={isDark ? "text-slate-500" : "text-slate-400"}>4 Kecamatan</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── SECTION 3: MODUL INTEGRASI PERANGKAT DAERAH (7 OPD GRID) ──────── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg sm:text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Direktori Modul Integrasi & Sektoral Pemkab PPU
            </h2>
            <p className={`text-xs font-body mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Pilih Perangkat Daerah atau Instansi di bawah ini untuk membuka portal integrasi khusus.
            </p>
          </div>
        </div>

        {(!isBkpsdmLocked || !isBapendaLocked || !isBpsLocked || !isDiskominfoLocked || (!isLoggedIn && pageConfigs["Disdukcapil PPU"] !== false) || (!isLoggedIn && pageConfigs["BKAD PPU"] !== false)) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: BAPENDA PPU */}
            {!isBapendaLocked && (
              <div
                onClick={() => handleSectionClick("Bapenda PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-emerald-500/50" : "border-slate-200/80 bg-white hover:border-emerald-400 shadow-sm"
                }`}
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600 absolute top-0 left-0" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Realtime Scraped
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-base font-heading font-extrabold group-hover:text-emerald-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                      Bapenda PPU
                    </h3>
                    <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Badan Pendapatan Daerah. Monitoring PAD Rp 67,78 M, 23 sektor pajak & retribusi (tb4), channel pembayaran QRIS/Teller, BKU Rp 2,86 T, & 20 pembayar terakhir.
                    </p>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Realisasi PAD & 23 Sektor</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Card 2: BPS PPU */}
            {!isBpsLocked && (
              <div
                onClick={() => handleSectionClick("BPS PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-violet-500/50" : "border-slate-200/80 bg-white hover:border-violet-400 shadow-sm"
                }`}
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-600 absolute top-0 left-0" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                      Official BPS Live
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-base font-heading font-extrabold group-hover:text-violet-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>
                      BPS PPU (Badan Pusat Statistik)
                    </h3>
                    <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Statistik Daerah Resmi. IPM 73,90, Pertumbuhan Ekonomi +30,68%, Penduduk 202.067 jiwa, Kemiskinan 6,69%, TPT 2,05%, & Berita Resmi Statistik (BRS).
                    </p>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                  <span>Indikator Strategis & BRS</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Card 3: BKPSDM PPU */}
            {!isBkpsdmLocked && (
              <div
                onClick={() => handleSectionClick("BKPSDM PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-blue-500/50" : "border-slate-200/80 bg-white hover:border-blue-400 shadow-sm"
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
            )}

            {/* Card 4: Diskominfo PPU */}
            {!isDiskominfoLocked && (
              <div
                onClick={() => handleSectionClick("Diskominfo PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-cyan-500/50" : "border-slate-200/80 bg-white hover:border-cyan-400 shadow-sm"
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
                      Dinas Komunikasi & Informatika. Peta interaktif GIS 132 Menara BTS, 29 Lokasi CCTV Publik, 7 Spot WiFi Gratis, & Direktori Web OPD/Desa.
                    </p>
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  <span>132 Menara & 29 CCTV</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Card 5: Disdukcapil PPU */}
            {(isLoggedIn || pageConfigs["Disdukcapil PPU"] !== false) && (
              <div
                onClick={() => handleSectionClick("Disdukcapil PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-indigo-500/50" : "border-slate-200/80 bg-white hover:border-indigo-400 shadow-sm"
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
            )}

            {/* Card 6: BKAD PPU */}
            {(isLoggedIn || pageConfigs["BKAD PPU"] !== false) && (
              <div
                onClick={() => handleSectionClick("BKAD PPU")}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer group relative overflow-hidden ${
                  isDark ? "border-slate-800 bg-slate-900/70 hover:border-purple-500/50" : "border-slate-200/80 bg-white hover:border-purple-400 shadow-sm"
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
            )}
          </div>
        ) : (
          <div className={`p-12 rounded-3xl border text-center space-y-4 shadow-xl ${
            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className={`text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                Seluruh Modul OPD Di-set Khusus Admin 🔒
              </h3>
              <p className={`text-xs font-body max-w-md mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Akses publik ke seluruh modul OPD saat ini dibatasi oleh Tata Kelola. Silakan Login Administrator untuk mengakses data secara utuh.
              </p>
            </div>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Login Administrator</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
