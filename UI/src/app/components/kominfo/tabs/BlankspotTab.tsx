import type { BlankspotRecord } from "../../../models/kominfo.model";

interface BlankspotTabProps {
  blankspotList: BlankspotRecord[];
  isDark: boolean;
}

export function BlankspotTab({ blankspotList, isDark }: BlankspotTabProps) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-body">
          <thead>
            <tr className={`border-b font-mono text-[11px] uppercase tracking-wider ${
              isDark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
            }`}>
              <th className="py-3.5 px-4">No</th>
              <th className="py-3.5 px-4">Kecamatan</th>
              <th className="py-3.5 px-4">Desa</th>
              <th className="py-3.5 px-4 text-center">Status BTS</th>
              <th className="py-3.5 px-4">Provider Sinyal</th>
              <th className="py-3.5 px-4">Kualitas Sinyal</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-slate-800/80 text-slate-200" : "divide-slate-100 text-slate-700"}`}>
            {blankspotList.map((b, i) => (
              <tr key={b.id} className={`transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
                <td className="py-3 px-4 font-mono text-slate-500">{i + 1}</td>
                <td className="py-3 px-4 font-bold capitalize">{b.kecamatan}</td>
                <td className="py-3 px-4 capitalize">{b.desa}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    b.has_bts
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}>
                    {b.has_bts ? "Ada BTS" : "Tanpa BTS"}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{b.provider || "-"}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {b.kualitas_sinyal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
