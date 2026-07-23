import { Globe, ExternalLink, ChevronRight } from "lucide-react";

interface GenericOpdPageProps {
  title: string;
  endpoint: string;
  opd: string;
  services: { category: string; method: string; name: string; description: string }[];
  isDark: boolean;
}

export function GenericOpdPage({ title, endpoint, opd, services, isDark }: GenericOpdPageProps) {
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className={`p-6 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all shadow-xl backdrop-blur-xl ${
        isDark ? "border-slate-800/80 bg-slate-900/80" : "border-slate-200/80 bg-white shadow-blue-500/5"
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className={`text-lg font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                {title}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Sistem Online
              </span>
            </div>
            <p className={`text-xs font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Domain: https://{endpoint}/ | Pengelola: {opd}
            </p>
          </div>
        </div>

        <a
          href={`https://${endpoint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shrink-0"
        >
          <span>Akses Portal Resmi</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
              isDark
                ? "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
                : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full ${
                  isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700 font-bold"
                }`}>
                  {svc.category}
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-500">Service Active</span>
              </div>

              <h4 className={`text-sm font-heading font-bold mt-3 mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{svc.name}</h4>
              <p className={`text-xs font-body leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{svc.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className={`font-mono text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Terintegrasi Pemkab</span>
              <button className="text-blue-600 dark:text-blue-400 font-body font-bold hover:underline flex items-center gap-1">
                Buka Modul <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
