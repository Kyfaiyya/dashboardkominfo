import { Building2, Globe, ExternalLink } from "lucide-react";
import type { WebsiteOpdRecord, WebsiteDesaRecord } from "../../../models/kominfo.model";

interface DirektoriTabProps {
  websiteOpdList: WebsiteOpdRecord[];
  websiteDesaList: WebsiteDesaRecord[];
  isDark: boolean;
}

export function DirektoriTab({ websiteOpdList, websiteDesaList, isDark }: DirektoriTabProps) {
  return (
    <div className="space-y-6">
      {/* Website OPD */}
      <div>
        <h3 className={`text-sm font-heading font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>Direktori Website Perangkat Daerah (OPD) Pemkab PPU ({websiteOpdList.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websiteOpdList.map((opd) => (
            <div key={opd.id} className={`p-4 rounded-xl border flex flex-col justify-between text-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"
            }`}>
              <div>
                <p className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{opd.nama}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-500 truncate max-w-[180px]">{opd.website || "Belum ada domain"}</span>
                {opd.website && (
                  <a href={opd.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold hover:underline">
                    Kunjungi <ExternalLink className="w-3 h-3 inline" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Website Desa */}
      <div>
        <h3 className={`text-sm font-heading font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <Globe className="w-4 h-4 text-emerald-500" />
          <span>Direktori Website Resmi Desa PPU ({websiteDesaList.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websiteDesaList.map((desa) => (
            <div key={desa.id} className={`p-4 rounded-xl border flex flex-col justify-between text-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm"
            }`}>
              <div>
                <span className="text-[10px] font-mono text-emerald-500 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">
                  Kec. {desa.kecamatan}
                </span>
                <p className={`font-bold mt-1.5 ${isDark ? "text-slate-200" : "text-slate-900"}`}>{desa.nama}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-500 truncate max-w-[180px]">{desa.url}</span>
                {desa.url && (
                  <a href={desa.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold hover:underline">
                    Buka <ExternalLink className="w-3 h-3 inline" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
