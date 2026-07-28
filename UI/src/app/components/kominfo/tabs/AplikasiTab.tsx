import { Search, ExternalLink, CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";
import type { AplikasiRecord } from "../../../models/kominfo.model";

interface AplikasiTabProps {
  filteredAplikasi: AplikasiRecord[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  isDark: boolean;
  isLoggedIn?: boolean;
  onEdit?: (item: AplikasiRecord) => void;
  onDelete?: (id: number, name?: string) => void;
}

export function AplikasiTab({
  filteredAplikasi,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  isDark,
  isLoggedIn = false,
  onEdit,
  onDelete,
}: AplikasiTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Cari aplikasi, URL, jenis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-3.5 py-2 text-xs font-mono border focus:outline-none transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <option value="All">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAplikasi.map((app) => (
          <div
            key={app.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200/80 shadow-sm hover:border-blue-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700 font-bold"
                }`}>
                  {app.jenis || "Aplikasi"}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    app.status?.toLowerCase() === "aktif"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}>
                    {app.status?.toLowerCase() === "aktif" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {app.status}
                  </span>

                  {isLoggedIn && (
                    <>
                      <button
                        onClick={() => onEdit?.(app)}
                        title="Edit Aplikasi"
                        className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete?.(app.id, app.nama)}
                        title="Hapus Aplikasi"
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h4 className={`text-sm font-heading font-bold mt-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                {app.nama}
              </h4>
              {app.platform && (
                <p className={`text-[11px] font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Platform: {app.platform}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className={`font-mono text-[11px] truncate max-w-[180px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {app.url || "-"}
              </span>
              {app.url && (
                <a
                  href={app.url.startsWith("http") ? app.url : `https://${app.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  Buka <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
