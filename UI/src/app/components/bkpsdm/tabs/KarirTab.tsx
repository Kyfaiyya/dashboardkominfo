import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface KarirTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function KarirTab({ currentData, isDark }: KarirTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Riwayat Pangkat, Golongan & KGB</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-body">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Golongan / Ruang</p>
          <p className="font-stat font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-1">{currentData.karir.golongan}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Pangkat</p>
          <p className={`font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.karir.pangkat}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Masa Kerja Golongan (MKG)</p>
          <p className={`font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.karir.mkg}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">TMT Pangkat Terakhir</p>
          <p className={`font-mono mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.karir.tmtPangkat}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jadwal KGB Berikutnya</p>
          <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">{currentData.karir.jadwalKgb}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jadwal Kenaikan Pangkat berikutnya</p>
          <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{currentData.karir.jadwalKp}</p>
        </div>
      </div>
    </div>
  );
}
