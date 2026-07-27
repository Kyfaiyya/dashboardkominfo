import { Clock, TrendingUp, MapPin } from "lucide-react";
import type { CompletePegawaiData } from "../../../models/pegawai.model";

interface PresensiTabProps {
  currentData: CompletePegawaiData;
  isDark: boolean;
}

export function PresensiTab({ currentData, isDark }: PresensiTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Presensi Hari Ini</span>
          </div>
          <p className="text-base font-heading font-bold text-emerald-600 dark:text-emerald-400">{currentData.presensi.statusToday}</p>
          <p className="text-[11px] font-body text-slate-500 mt-1">Status Kehadiran GPS Mobile</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Jam Masuk — Pulang</span>
          </div>
          <p className={`text-base font-stat font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.presensi.jamMasuk} — {currentData.presensi.jamPulang}</p>
          <p className="text-[11px] font-body text-slate-500 mt-1">Jadwal Shift Kerja PPU</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            <span>Rekap Bulanan</span>
          </div>
          <p className="text-base font-stat font-bold text-blue-600 dark:text-blue-400">{currentData.presensi.persentaseBulan}</p>
          <p className="text-[11px] font-body text-slate-500 mt-1">{currentData.presensi.masukTepatWaktu} / {currentData.presensi.totalHariKerja} Tepat Waktu</p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
          <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Verifikasi GPS</span>
          </div>
          <p className="text-xs font-body font-bold text-emerald-600 dark:text-emerald-400 truncate">{currentData.presensi.gpsLocation}</p>
          <p className="text-[11px] font-body text-slate-500 mt-1">Radius Lokasi Disetujui</p>
        </div>
      </div>

      <div>
        <h4 className={`text-sm font-heading font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Log Riwayat Presensi Harian Terakhir</h4>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400 bg-slate-950" : "border-slate-200 text-slate-600 bg-slate-50"}`}>
                <th className="px-5 py-3 text-left font-bold">Tanggal</th>
                <th className="px-5 py-3 text-left font-bold">Jam Masuk</th>
                <th className="px-5 py-3 text-left font-bold">Jam Pulang</th>
                <th className="px-5 py-3 text-left font-bold">Status</th>
                <th className="px-5 py-3 text-left font-bold">Lokasi Absen</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-200/60"}`}>
              {currentData.presensi.logHarian.map((log: any, idx: number) => (
                <tr key={idx} className={isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-50"}>
                  <td className="px-5 py-3 font-bold">{log.tanggal}</td>
                  <td className="px-5 py-3 font-stat font-semibold">{log.masuk}</td>
                  <td className="px-5 py-3 font-stat font-semibold">{log.pulang}</td>
                  <td className="px-5 py-3 font-semibold">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{log.lokasi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
