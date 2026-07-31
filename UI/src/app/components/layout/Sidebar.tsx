import { Globe, ChevronLeft, ShieldCheck, LogOut, LogIn, User } from "lucide-react";
import type { SidebarProps, NavItem } from "../../data/types";
import { NAV_ITEMS } from "../../data/constants";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ activeSection, setActiveSection, isDark, isOpen, setIsOpen, pageConfigs }: SidebarProps) {
  const { isLoggedIn, logout, openAuthModal } = useAuth();

  const allNavItems: NavItem[] = [...NAV_ITEMS];
  if (isLoggedIn) {
    allNavItems.push({
      icon: ShieldCheck,
      label: "Akses Halaman",
      category: "PENGATURAN",
      badge: "Admin",
    });
  }

  // Filter items based on isLoggedIn & pageConfigs
  const visibleNavItems = allNavItems.filter((item) => {
    if (isLoggedIn) return true; // Admin can see everything in sidebar
    if (item.label === "Beranda Utama") return true;
    if (pageConfigs && pageConfigs[item.label] === false) return false;
    return true;
  });

  const categories = Array.from(new Set(visibleNavItems.map((i) => i.category)));

  return (
    <aside
      className={`hidden lg:flex flex-col border-r transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-30 select-none ${
        isOpen ? "w-72" : "w-20"
      } ${
        isDark ? "border-slate-800/80 bg-[#0B0F19]/95 text-slate-100" : "border-slate-200/80 bg-white text-slate-900 shadow-sm"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Floating Border Toggle Pin */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -right-3.5 top-7 w-7 h-7 rounded-full border shadow-md flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 z-50 cursor-pointer ${
          isDark
            ? "border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-600"
            : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-slate-200"
        }`}
        title={isOpen ? "Ciutkan Sidebar" : "Perluas Sidebar"}
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Brand Header */}
      <div className={`flex items-center h-20 border-b px-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "justify-start gap-3.5" : "justify-center"
      } ${isDark ? "border-slate-800/80" : "border-slate-200/80"}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
          <Globe className="w-5 h-5 animate-pulse" />
        </div>
        <div className={`min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
          isOpen ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"
        }`}>
          <h2 className={`text-sm font-heading font-extrabold tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>
            Portal Pemkab PPU
          </h2>
          <p className={`text-[11px] font-body font-medium truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Integrasi Layanan Digital
          </p>
        </div>
      </div>

      {/* Navigation Menu Categorized - Completely Hidden Scrollbar */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const itemsInCat = visibleNavItems.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-1">
              <div className={`px-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                isOpen ? "opacity-100 max-h-8 pt-1 pb-1.5" : "opacity-0 max-h-0 py-0"
              }`}>
                <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {cat}
                </p>
              </div>

              {itemsInCat.map((item) => {
                const isActive = activeSection === item.label || (item.label === "Akses Halaman" && activeSection === "Pengaturan Akses Halaman");
                return (
                  <div key={item.label} className="relative group flex justify-center">
                    <button
                      onClick={() => setActiveSection(item.label === "Akses Halaman" ? "Pengaturan Akses Halaman" : item.label)}
                      className={`w-full flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer px-3.5 py-2.5 rounded-xl text-xs ${
                        isActive
                          ? isDark
                            ? "bg-gradient-to-r from-blue-600/25 to-indigo-600/15 text-blue-400 font-bold border border-blue-500/40 shadow-sm"
                            : "bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-sm"
                          : isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-900/60 font-medium"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <item.icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                          isActive
                            ? isDark ? "text-blue-400" : "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        }`} />
                        <span className={`truncate text-left tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                          isOpen ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
                        }`}>
                          {item.label}
                        </span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ml-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                          isOpen ? "opacity-100 max-w-[80px]" : "opacity-0 max-w-0 p-0 border-0"
                        } ${
                          item.badge === "Admin"
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                            : isDark ? "bg-slate-800 text-slate-400 border border-slate-700" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Floating Tooltip when Collapsed */}
                    {!isOpen && (
                      <div className="fixed left-20 bg-slate-900 text-white text-xs font-body font-semibold px-3 py-1.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[9999] border border-slate-800">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Flush & Seamless Bottom User Profile Footer */}
      <div className={`p-3 border-t transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDark ? "border-slate-800/80 bg-[#0B0F19]" : "border-slate-200/80 bg-slate-50/50"
      }`}>
        {isLoggedIn ? (
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20 shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>

              <div className={`min-w-0 flex-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"
              }`}>
                <p className={`text-xs font-heading font-extrabold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                  Administrator
                </p>
                <p className="text-[10px] font-mono text-emerald-500 font-bold truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Sesi Aktif
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout Admin"
              className={`p-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer shrink-0 ${
                isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none w-0 p-0 border-0"
              } ${
                isDark
                  ? "text-slate-400 hover:text-rose-400 hover:bg-slate-800/80"
                  : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={openAuthModal}
                title="Login Administrator"
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer ${
                  isDark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <User className="w-4.5 h-4.5" />
              </button>

              <div className={`min-w-0 flex-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                isOpen ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"
              }`}>
                <p className={`text-xs font-heading font-extrabold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  Publik
                </p>
                <p className={`text-[10px] font-mono truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Pengunjung
                </p>
              </div>
            </div>

            <button
              onClick={openAuthModal}
              title="Login Administrator"
              className={`px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer shrink-0 active:scale-95 ${
                isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none w-0 p-0 border-0"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
