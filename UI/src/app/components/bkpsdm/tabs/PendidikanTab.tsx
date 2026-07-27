import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface PendidikanTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function PendidikanTab({ currentData, isDark }: PendidikanTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Riwayat Pendidikan & Diklat SDM</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jenjang & Jurusan Pendidikan</p>
          <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.pendidikan.jenjangTerakhir}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Institusi Perguruan Tinggi / Sekolah</p>
          <p className={`font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.pendidikan.institusi}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Tahun Lulus</p>
          <p className={`font-mono mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.pendidikan.tahunLulus}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Diklat Kepemimpinan / Teknis Terakhir</p>
          <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">{currentData.pendidikan.diklatTerakhir}</p>
        </div>
      </div>
    </div>
  );
}
