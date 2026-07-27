import { Wifi } from "lucide-react";
import type { WifiRecord } from "../../../models/kominfo.model";

interface WifiTabProps {
  wifiList: WifiRecord[];
  isDark: boolean;
}

export function WifiTab({ wifiList, isDark }: WifiTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {wifiList.map((w) => (
        <div key={w.id} className={`p-6 rounded-2xl border space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{w.lokasi}</h4>
                <span className="text-[11px] font-mono text-cyan-500 font-bold">{w.layanan}</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              {w.bandwidth_mbps} Mbps
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] text-slate-500 block">Status Operasional</span>
              <span className="font-bold text-emerald-500">{w.keterangan || "OK"}</span>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] text-slate-500 block">Koordinat GPS</span>
              <span className="font-bold text-slate-400 truncate block text-[10px]">{w.koordinat || "-"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
