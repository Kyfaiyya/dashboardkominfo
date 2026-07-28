import React from "react";
import { Sun, Moon, ShieldCheck, LogOut, KeyRound, Search, Command } from "lucide-react";
import { fmtTime } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  time: Date;
  onOpenSearch?: () => void;
}

export function Header({ isDark, toggleTheme, time, onOpenSearch }: HeaderProps) {
  const { isLoggedIn, user, openAuthModal, logout } = useAuth();

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

      <div className="flex items-center gap-3">
        {/* Global Search Button Trigger */}
        <button
          onClick={onOpenSearch}
          className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-body font-medium transition-all active:scale-95 cursor-pointer ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-blue-500" />
          <span>Cari Instansi / Data...</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 ml-1">
            Ctrl K
          </kbd>
        </button>

        {/* System Online Status */}
        <div className={`hidden sm:flex items-center gap-2 text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${
          isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Online</span>
        </div>

        {/* Global Admin Login / Profile Badge */}
        {isLoggedIn ? (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-slate-200"
              : "bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
          }`}>
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[11px] whitespace-nowrap">Admin</span>
            <button
              onClick={logout}
              title="Logout Admin"
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 shadow-sm"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login Admin</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-body font-bold transition-all active:scale-95 cursor-pointer ${
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
