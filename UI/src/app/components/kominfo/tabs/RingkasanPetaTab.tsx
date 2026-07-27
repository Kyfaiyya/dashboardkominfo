import { KominfoMap } from "../KominfoMap";
import type { KominfoSummary, MenaraRecord, CctvRecord, WifiRecord } from "../../../models/kominfo.model";

interface RingkasanPetaTabProps {
  menaraList: MenaraRecord[];
  cctvList: CctvRecord[];
  wifiList: WifiRecord[];
  summary: KominfoSummary | null;
  isDark: boolean;
}

export function RingkasanPetaTab({ menaraList, cctvList, wifiList, summary, isDark }: RingkasanPetaTabProps) {
  return (
    <div className="space-y-6">
      <KominfoMap
        menaraList={menaraList}
        cctvList={cctvList}
        wifiList={wifiList}
        isDark={isDark}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary?.menaraPerKecamatan?.map((k, i) => (
          <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"
          }`}>
            <div>
              <p className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>Menara Kec. {k.kecamatan}</p>
              <p className={`text-xl font-heading font-extrabold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{k.count} Menara</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-mono font-bold text-xs">
              {Math.round((k.count / (summary?.totalMenara || 132)) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
