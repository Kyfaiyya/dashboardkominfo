import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface PensiunTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function PensiunTab({ currentData, isDark }: PensiunTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Proyeksi Pensiun (BUP), Satyalancana & Disiplin</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Batas Usia Pensiun (BUP)</p>
          <p className={`font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.pensiun.bupUsia}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Proyeksi TMT Pensiun</p>
          <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">{currentData.pensiun.proyeksiPensiun}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Tanda Penghargaan</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.pensiun.satyalancana}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Catatan Hukuman Disiplin</p>
          <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.pensiun.catatanDisiplin}</p>
        </div>
      </div>
    </div>
  );
}
