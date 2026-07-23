import { Sun, Moon } from "lucide-react";
import { fmtTime } from "../../utils/formatters";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  time: Date;
}

export function Header({ isDark, toggleTheme, time }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-8 h-20 border-b shrink-0 transition-colors ${
        isDark
          ? "border-slate-800/80 bg-slate-950/90 text-white"
          : "border-slate-200/80 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-heading font-extrabold tracking-tight">Portal Hub Pemkab Penajam Paser Utara</h1>
          <p className={`text-xs font-body font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Dashboard Layanan Integrasi Digital Antar Perangkat Daerah (OPD)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Indicator */}
        <div className={`flex items-center gap-2 text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${
          isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Online</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-body font-bold transition-all active:scale-95 ${
            isDark
              ? "bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span>Gelap</span>
            </>
          )}
        </button>

        <div className={`text-right border-l pl-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <p className="text-sm font-stat font-extrabold tabular-nums">{fmtTime(time)}</p>
        </div>
      </div>
    </header>
  );
}
