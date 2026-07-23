import { ChevronRight, Users, Building2, HeartHandshake, Server } from "lucide-react";
import { KpiCard } from "../components/cards/KpiCard";
import { NAV_ITEMS } from "../data/constants";
import type { KPI } from "../data/types";

interface BerandaUtamaProps {
  kpis: KPI[];
  isDark: boolean;
  setActiveSection: (s: string) => void;
}

export function BerandaUtama({ kpis, isDark, setActiveSection }: BerandaUtamaProps) {
  return (
    <>
      {/* Hero Banner */}
      <div className={`rounded-2xl p-6 border transition-all ${
        isDark
          ? "border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950 text-white"
          : "border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-extrabold tracking-tight">
              Portal Integrasi Layanan Pemkab Penajam Paser Utara
            </h2>
            <p className={`text-xs font-body leading-relaxed max-w-2xl ${isDark ? "text-slate-300" : "text-blue-100"}`}>
              Pusat kontrol dan integrasi layanan digital antar Perangkat Daerah (OPD). Silakan pilih modul perangkat daerah pada menu sidebar untuk membuka halaman khusus masing-masing instansi.
            </p>
          </div>

          <button
            onClick={() => setActiveSection("BKPSDM PPU")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-body font-bold transition-all shrink-0 shadow-sm active:scale-95 ${
              isDark
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            <span>Buka BKPSDM PPU</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} isDark={isDark} />
        ))}
      </div>

      {/* Quick Module Grid */}
      <div className="space-y-4">
        <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
          Daftar Halaman Perangkat Daerah (1 Dinas = 1 Halaman)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NAV_ITEMS.filter((n) => n.category === "PERANGKAT DAERAH (OPD)").map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? "border-slate-800/80 bg-slate-900/60 hover:border-blue-500/50"
                  : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className={`text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.label}</h4>
                <p className="text-xs font-body text-slate-500 mt-1">Halaman Khusus Modul {item.label}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-body font-bold text-blue-600 dark:text-blue-400">
                <span>Buka Halaman OPD</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
