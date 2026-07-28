import { Building2, Globe, ExternalLink, Edit2, Trash2 } from "lucide-react";
import type { WebsiteOpdRecord, WebsiteDesaRecord } from "../../../models/kominfo.model";

interface DirektoriTabProps {
  websiteOpdList: WebsiteOpdRecord[];
  websiteDesaList: WebsiteDesaRecord[];
  isDark: boolean;
  isLoggedIn?: boolean;
  onEditOpd?: (item: WebsiteOpdRecord) => void;
  onDeleteOpd?: (id: number, name?: string) => void;
  onEditDesa?: (item: WebsiteDesaRecord) => void;
  onDeleteDesa?: (id: number, name?: string) => void;
}

export function DirektoriTab({
  websiteOpdList,
  websiteDesaList,
  isDark,
  isLoggedIn = false,
  onEditOpd,
  onDeleteOpd,
  onEditDesa,
  onDeleteDesa,
}: DirektoriTabProps) {
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
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{opd.nama}</p>
                  {isLoggedIn && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditOpd?.(opd)}
                        title="Edit Web OPD"
                        className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteOpd?.(opd.id, opd.nama)}
                        title="Hapus Web OPD"
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-emerald-500 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">
                    Kec. {desa.kecamatan}
                  </span>
                  {isLoggedIn && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditDesa?.(desa)}
                        title="Edit Web Desa"
                        className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDesa?.(desa.id, desa.nama)}
                        title="Hapus Web Desa"
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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
