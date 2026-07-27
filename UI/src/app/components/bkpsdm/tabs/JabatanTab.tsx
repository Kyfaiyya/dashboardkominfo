import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface JabatanTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function JabatanTab({ currentData, isDark }: JabatanTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Informasi Jabatan & Unit Kerja</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nama Jabatan</p>
          <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.jabatan.namaJabatan}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jenis Jabatan / Jenjang</p>
          <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">{currentData.jabatan.jenisJabatan}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Perangkat Daerah (OPD)</p>
          <p className={`font-semibold mt-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{currentData.jabatan.unitKerja}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">TMT Jabatan</p>
          <p className={`font-mono font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.jabatan.tmtJabatan}</p>
        </div>
        <div className={`col-span-2 p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Atasan Langsung</p>
          <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.jabatan.atasanLangsung}</p>
        </div>
      </div>
    </div>
  );
}
