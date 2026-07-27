import { FileText, Code2, ShieldCheck } from "lucide-react";

export function KatalogDokumentasi({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className={`p-8 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-purple-950/30"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-purple-50/50 shadow-purple-500/5"
      }`}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Dokumentasi Integrasi API
            </span>
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              v1.0 Standard
            </span>
          </div>
          <h1 className={`text-2xl lg:text-3xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Katalog Dokumentasi & API Reference
          </h1>
          <p className={`text-xs font-mono max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Panduan teknis pengembang, spesifikasi REST API, otentikasi Bearer Token, dan petunjuk skema database Kabupaten Penajam Paser Utara.
          </p>
        </div>
      </div>

      {/* Docs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <FileText className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>REST API Endpoints</h3>
          <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Spesifikasi endpoint /api/kominfo/* dan /api/pegawai/* dengan format JSON standar.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>Admin Auth & Security</h3>
          <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Standar otentikasi Authorization: Bearer token untuk operasi penambahan & penghapusan data.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <Code2 className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>Skema Database PostgreSQL</h3>
          <p className={`text-xs font-body mt-1 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Struktur 7 tabel Kominfo & TimescaleDB hypertables untuk agregasi real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
