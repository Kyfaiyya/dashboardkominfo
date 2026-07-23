import { Globe, ChevronLeft } from "lucide-react";
import type { SidebarProps } from "../../data/types";
import { NAV_ITEMS } from "../../data/constants";

export function Sidebar({ activeSection, setActiveSection, isDark, isOpen, setIsOpen }: SidebarProps) {
  const categories: ("DASHBOARD" | "PERANGKAT DAERAH (OPD)" | "DOKUMENTASI")[] = [
    "DASHBOARD",
    "PERANGKAT DAERAH (OPD)",
    "DOKUMENTASI"
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r transition-all duration-300 ease-in-out relative z-30 ${
        isOpen ? "w-64" : "w-20"
      } ${
        isDark ? "border-slate-800/80 bg-[#0B0F19]/95 text-slate-100" : "border-slate-200/80 bg-white text-slate-900 shadow-sm"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Floating Border Toggle Pin */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-3.5 top-7 w-7 h-7 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-50 ${
          isDark
            ? "border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600"
            : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-slate-200"
        }`}
        title={isOpen ? "Ciutkan Sidebar" : "Perluas Sidebar"}
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Brand Header */}
      <div className={`flex items-center h-20 border-b px-4 ${isOpen ? "justify-start gap-3.5" : "justify-center"} ${isDark ? "border-slate-800/80" : "border-slate-200/80"}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
          <Globe className="w-5 h-5 animate-pulse" />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <h2 className={`text-sm font-heading font-extrabold tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>
              Portal Pemkab PPU
            </h2>
            <p className={`text-[11px] font-body font-medium truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Integrasi Layanan Digital
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu Categorized */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {categories.map((cat) => {
          const itemsInCat = NAV_ITEMS.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-1">
              {isOpen && (
                <p className={`px-3 text-[10px] font-body font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {cat}
                </p>
              )}
              {itemsInCat.map((item) => {
                const isActive = activeSection === item.label;
                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => setActiveSection(item.label)}
                      className={`w-full flex items-center ${
                        isOpen ? "justify-between px-3.5" : "justify-center w-11 h-11 mx-auto"
                      } py-2.5 rounded-xl text-xs font-body font-semibold transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-md font-bold"
                            : "bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm"
                          : isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-900/80"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? isDark ? "text-blue-400" : "text-blue-600" : "text-slate-400"}`} />
                        {isOpen && <span className="truncate">{item.label}</span>}
                      </div>

                      {isOpen && item.badge && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          item.badge === "Live"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : isDark ? "bg-slate-900 text-slate-400 border border-slate-800" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Tooltip on Hover when Collapsed */}
                    {!isOpen && (
                      <div className="absolute left-16 top-1.5 bg-slate-900 text-white text-[11px] font-body font-semibold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label} {item.badge && `(${item.badge})`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Workspace Box */}
      {isOpen && (
        <div className={`p-4 m-3 rounded-xl border ${isDark ? "border-slate-800/80 bg-slate-900/40" : "border-slate-200/80 bg-slate-50"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
              PPU
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-heading font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>Diskominfo PPU</p>
              <p className={`text-[11px] font-body mt-0.5 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>Integrasi Pemkab PPU</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
