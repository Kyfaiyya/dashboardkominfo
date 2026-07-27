import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface CutiTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function CutiTab({ currentData, isDark }: CutiTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-5 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Informasi Kuota Cuti & Pengajuan Online</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-body">
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Total Kuota Cuti Tahunan</p>
          <p className={`font-stat font-bold text-2xl mt-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.cuti.kuotaTahunan}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Sisa Kuota Cuti Aktif</p>
          <p className="font-stat font-bold text-emerald-600 dark:text-emerald-400 text-2xl mt-1.5">{currentData.cuti.sisaKuota}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Cuti Terpakai Tahun Ini</p>
          <p className={`font-stat font-bold text-2xl mt-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.cuti.terpakai}</p>
        </div>
        <div className={`col-span-3 p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Status Pengajuan Cuti Terakhir</p>
          <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm mt-1">{currentData.cuti.statusPengajuanTerakhir}</p>
        </div>
      </div>
    </div>
  );
}
