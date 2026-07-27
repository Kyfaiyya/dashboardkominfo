import { maskNama, maskNip } from "../../../utils/formatters";
import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface ProfilTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function ProfilTab({ currentData, isDark }: ProfilTabProps) {
  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
      <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Identitas Resmi Pegawai</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nama Lengkap & Gelar</p>
          <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{maskNama(currentData.profil.nama)}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nomor Induk Pegawai (NIP)</p>
          <p className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 mt-1">{maskNip(currentData.profil.nip)}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Status Kepegawaian</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.profil.status}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Kedudukan Hukum</p>
          <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.kedudukanHukum}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Unit Kerja</p>
          <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.unitKerja}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Alamat Unit Kerja</p>
          <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.alamatInstansi}</p>
        </div>
      </div>
    </div>
  );
}
