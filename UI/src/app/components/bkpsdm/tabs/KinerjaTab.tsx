import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface KinerjaTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function KinerjaTab({ currentData, isDark }: KinerjaTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-5 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Capaian Kinerja Pegawai (E-Kinerja & SKP)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Predikat Kinerja SKP 2025</p>
          <p className="font-heading font-bold text-emerald-600 dark:text-emerald-400 text-base mt-1.5">{currentData.kinerja.predikatSkp2025}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nilai Capaian Kinerja</p>
          <p className="font-stat font-bold text-blue-600 dark:text-blue-400 text-xl mt-1.5">{currentData.kinerja.nilaiCapaian}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Laporan Kinerja Harian (LKH)</p>
          <p className={`font-semibold text-sm mt-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{currentData.kinerja.totalLkhVerified}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Catatan Evaluasi Atasan</p>
          <p className={`font-medium italic mt-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>"{currentData.kinerja.catatanAtasan}"</p>
        </div>
      </div>
    </div>
  );
}
