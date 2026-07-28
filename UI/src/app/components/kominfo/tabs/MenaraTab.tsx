import { Search, Filter, Edit2, Trash2 } from "lucide-react";
import type { MenaraRecord } from "../../../models/kominfo.model";

interface MenaraTabProps {
  menaraList: MenaraRecord[];
  filteredMenara: MenaraRecord[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedKecamatan: string;
  setSelectedKecamatan: (val: string) => void;
  isDark: boolean;
  isLoggedIn?: boolean;
  onEdit?: (item: MenaraRecord) => void;
  onDelete?: (id: number, name?: string) => void;
}

export function MenaraTab({
  menaraList,
  filteredMenara,
  searchQuery,
  setSearchQuery,
  selectedKecamatan,
  setSelectedKecamatan,
  isDark,
  isLoggedIn = false,
  onEdit,
  onDelete,
}: MenaraTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Cari alamat, kelurahan, operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-3.5 py-2 text-xs font-mono border focus:outline-none transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          <span className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>Kecamatan:</span>
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono border focus:outline-none ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <option value="All">Semua Kecamatan ({menaraList.length})</option>
            <option value="Penajam">Penajam</option>
            <option value="Sepaku">Sepaku</option>
            <option value="Babulu">Babulu</option>
            <option value="Waru">Waru</option>
          </select>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden transition-all ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                isDark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Alamat / Lokasi</th>
                <th className="py-3.5 px-4">Kelurahan</th>
                <th className="py-3.5 px-4">Kecamatan</th>
                <th className="py-3.5 px-4">Pemilik Menara</th>
                <th className="py-3.5 px-4">Operator Aktif</th>
                <th className="py-3.5 px-4 text-center">Tinggi (m)</th>
                <th className="py-3.5 px-4 text-center">Tahun</th>
                {isLoggedIn && <th className="py-3.5 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-body ${
              isDark ? "divide-slate-800/80 text-slate-200" : "divide-slate-100 text-slate-700"
            }`}>
              {filteredMenara.length === 0 ? (
                <tr>
                  <td colSpan={isLoggedIn ? 9 : 8} className="py-8 text-center text-slate-500 font-mono text-xs">
                    Tidak ada data menara yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredMenara.map((m, idx) => (
                  <tr key={m.id} className={`transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold">{m.alamat}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{m.kelurahan || "-"}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 font-bold text-[10px]">
                        {m.kecamatan}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{m.pemilik_menara || "-"}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                        {m.operator || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cyan-500">{m.tinggi ? `${m.tinggi}m` : "-"}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{m.tahun || "-"}</td>
                    {isLoggedIn && (
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEdit?.(m)}
                            title="Edit Data Menara"
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete?.(m.id, m.alamat)}
                            title="Hapus Data Menara"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
