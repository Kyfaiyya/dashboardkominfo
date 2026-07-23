import { Clock } from "lucide-react";

export function ChartTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl border px-4 py-3 text-xs shadow-xl backdrop-blur-xl space-y-1 ${
      isDark ? "border-slate-800 bg-slate-900/95 text-white" : "border-slate-200 bg-white/98 text-slate-900"
    }`}>
      <p className={`font-mono text-[11px] mb-1 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <Clock className="w-3.5 h-3.5 text-blue-500" /> {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className={`flex items-center gap-1.5 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}:
          </span>
          <span className="font-bold tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
