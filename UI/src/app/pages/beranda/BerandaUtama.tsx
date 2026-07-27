import { Database, ShieldCheck, Globe, Users, Server, ExternalLink, ArrowRight } from "lucide-react";
import type { DashboardKpis } from "../controllers/useDashboardController";

interface BerandaUtamaProps {
  kpis: DashboardKpis;
  isDark: boolean;
  setActiveSection: (sec: string) => void;
}

export function BerandaUtama({ kpis, isDark, setActiveSection }: BerandaUtamaProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className={`p-8 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-blue-950/30"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-blue-50/50 shadow-blue-500/5"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Pemkab Penajam Paser Utara
              </span>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Integrasi Digital 2026
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Portal Hub Integritas Layanan Digital OPD PPU
            </h1>
            <p className={`text-xs font-body max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Selamat datang di Dashboard Terpadu Pemerintah Kabupaten Penajam Paser Utara. Akses cepat pemantauan data statistik kepegawaian (SIMPEG), infrastruktur komunikasi Diskominfo, data kependudukan, hingga pengelolaan keuangan daerah.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveSection("BKPSDM PPU")}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-body font-bold text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Portal BKPSDM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSection("Diskominfo PPU")}
              className={`px-5 py-3 rounded-2xl border font-body font-bold text-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                isDark ? "border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white" : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm"
              }`}
            >
              <span>Portal Diskominfo</span>
              <Globe className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main OPD Modules Grid */}
      <div className="space-y-4">
        <h2 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
          Modul Integrasi Perangkat Daerah (OPD)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BKPSDM */}
          <div
            onClick={() => setActiveSection("BKPSDM PPU")}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
              isDark ? "border-slate-800/80 bg-slate-900/60 hover:border-blue-500/40" : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live Sync
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>BKPSDM PPU</h3>
                <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Sistem Informasi Kepegawaian (SIMPEG), presensi harian, SKP, KGB, & pangkat PNS/PPPK.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              <span>{kpis.totalPegawai} Pegawai Terdaftar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Diskominfo */}
          <div
            onClick={() => setActiveSection("Diskominfo PPU")}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
              isDark ? "border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40" : "border-slate-200/80 bg-white hover:border-cyan-300 shadow-sm"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  GIS Map Active
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>Diskominfo PPU</h3>
                <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Peta lokasi BTS, pemantauan CCTV publik, WiFi gratis, jaringan Fiber, & blankspot.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              <span>132 Menara & 32 CCTV</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Disdukcapil */}
          <div
            onClick={() => setActiveSection("Disdukcapil PPU")}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
              isDark ? "border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/40" : "border-slate-200/80 bg-white hover:border-indigo-300 shadow-sm"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Integrated
                </span>
              </div>
              <div>
                <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>Disdukcapil PPU</h3>
                <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Layanan administrasi kependudukan, verifikasi NIK, & agregat data kependudukan per kecamatan.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <span>Integrasi NIK Valid</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
