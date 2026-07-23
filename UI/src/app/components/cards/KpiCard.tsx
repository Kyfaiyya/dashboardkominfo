import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { KPI } from "../../data/types";
import { fmt } from "../../utils/formatters";

export function KpiCard({ kpi, isDark }: { kpi: KPI; isDark: boolean }) {
  const up = kpi.change >= 0;

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        isDark
          ? "border-slate-800/80 bg-slate-900/70 hover:border-slate-700 shadow-lg"
          : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm hover:shadow-blue-500/10"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
          style={{ backgroundColor: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}
        >
          <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          up
            ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : isDark ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(kpi.change).toFixed(1)}%
        </div>
      </div>

      <p className={`text-xs font-body font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {kpi.label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-stat font-extrabold tabular-nums tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {fmt(kpi.value)}
        </span>
        <span className={`text-xs font-body font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.unit}</span>
      </div>
    </div>
  );
}
