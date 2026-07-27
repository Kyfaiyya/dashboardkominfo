import { Building2, Server, CheckCircle2, ChevronRight } from "lucide-react";

interface ServiceItem {
  name: string;
  description: string;
  category: string;
  method: string;
}

interface GenericOpdPageProps {
  title: string;
  opd: string;
  endpoint: string;
  services: ServiceItem[];
  isDark: boolean;
}

export function GenericOpdPage({ title, opd, endpoint, services, isDark }: GenericOpdPageProps) {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className={`p-8 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/30"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-indigo-50/50 shadow-indigo-500/5"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {opd}
              </span>
              <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Ready & Connected
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
            </h1>
            <p className={`text-xs font-mono max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              API Gateway Endpoint: <span className="font-bold text-indigo-500">{endpoint}</span> | Pemkab Penajam Paser Utara
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <Server className="w-6 h-6 text-emerald-500" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Status API</span>
                <span className="text-xs font-heading font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Normal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        <h2 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
          Katalog Layanan Digital & API
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${
                isDark ? "border-slate-800/80 bg-slate-900/60 hover:border-indigo-500/40" : "border-slate-200/80 bg-white hover:border-indigo-300 shadow-sm"
              }`}
            >
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {s.category}
                </span>
                <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>{s.name}</h3>
                <p className={`text-xs font-body leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{s.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-indigo-500">
                <span>Method: /{s.method}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
