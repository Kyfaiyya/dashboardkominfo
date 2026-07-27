import { Search, Camera } from "lucide-react";
import type { CctvRecord } from "../../../models/kominfo.model";

interface CctvTabProps {
  filteredCctv: CctvRecord[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isDark: boolean;
}

export function CctvTab({ filteredCctv, searchQuery, setSearchQuery, isDark }: CctvTabProps) {
  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-80">
        <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        <input
          type="text"
          placeholder="Cari lokasi CCTV, area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full rounded-xl pl-10 pr-3.5 py-2 text-xs font-mono border focus:outline-none transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCctv.map((c) => (
          <div key={c.id} className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"
          }`}>
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {c.lokasi}
                    </h4>
                    <p className={`text-[11px] font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {c.area}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {c.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className={isDark ? "text-slate-400" : "text-slate-500"}>Kapasitas Kamera:</span>
                <span className="font-bold text-emerald-500">{c.jumlah_titik} Kamera</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
