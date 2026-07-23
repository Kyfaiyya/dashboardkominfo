import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, Bell, ChevronUp, ChevronDown,
  Globe, LayoutDashboard, Radio, Sun, Moon,
  Server, Shield, Users, Lock, ShieldCheck,
  Clock, CheckCircle, XCircle, AlertCircle, Settings,
  Search, RefreshCw, Sparkles, Check, FileJson, Key,
  Send, Database, UserCheck, Terminal, Copy, Cpu,
  Layers, Code, ArrowUpRight, Filter, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { RealtimeProvider, useRealtimeData, EnvironmentVariable, PegawaiASN } from "./context/RealtimeContext";
import { ConnectionStatus } from "./components/connection-status";

// ─── Utilities ──────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function maskNip(nip: string) {
  if (nip.length < 18) return nip;
  return `${nip.slice(0, 8)}******${nip.slice(14)}`;
}

function maskNama(nama: string) {
  const parts = nama.split(" ");
  return parts
    .map((p, idx) => {
      if (idx === 0) return p;
      if (p.length <= 2) return p;
      return `${p[0]}***`;
    })
    .join(" ");
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
  glow: string;
  category: string;
}

interface TimePoint {
  t: string;
  traffic: number;
  energy: number;
  citizens: number;
  incidents: number;
}

interface Alert {
  id: number;
  level: "critical" | "warning" | "info" | "ok";
  message: string;
  source: string;
  ts: string;
}

interface ServiceRow {
  service: string;
  requests: number;
  uptime: number;
  latency: number;
  status: "online" | "degraded" | "offline";
  category: string;
  endpoint: string;
}

const OPD_DISTRIBUTION = [
  { name: "BKPSDM PPU", value: 1240, percent: "25%" },
  { name: "Diskominfo PPU", value: 890, percent: "18%" },
  { name: "Secretariat Daerah", value: 1120, percent: "23%" },
  { name: "Dinas Kesehatan", value: 950, percent: "19%" },
  { name: "Dinas Pendidikan", value: 740, percent: "15%" },
];

const CHART_COLORS = ["#3B82F6", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

// ─── Sub-components ───────────────────────────────────────────────────────

function LiveBadge({ isRealtime, isDark }: { isRealtime?: boolean; isDark: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all ${
      isRealtime
        ? isDark
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          : 'text-emerald-700 bg-emerald-100 border-emerald-300 shadow-sm'
        : isDark
          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
          : 'text-amber-700 bg-amber-100 border-amber-300 shadow-sm'
    }`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRealtime ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtime ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </span>
      {isRealtime ? 'GATEWAY STREAM LIVE' : 'RECONNECTING...'}
    </div>
  );
}

function StatusPill({ status, isDark }: { status: ServiceRow["status"]; isDark: boolean }) {
  const map = {
    online: isDark
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
      : "bg-emerald-100 text-emerald-700 border-emerald-300 font-bold",
    degraded: isDark
      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
      : "bg-amber-100 text-amber-700 border-amber-300 font-bold",
    offline: isDark
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : "bg-red-100 text-red-700 border-red-300 font-bold",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${map[status]}`}>
      ● {status.toUpperCase()}
    </span>
  );
}

function AlertIcon({ level, isDark }: { level: Alert["level"]; isDark: boolean }) {
  const map = {
    critical: { Icon: XCircle, color: isDark ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-red-600 bg-red-100 border-red-200" },
    warning: { Icon: AlertCircle, color: isDark ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-600 bg-amber-100 border-amber-200" },
    info: { Icon: AlertCircle, color: isDark ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" : "text-cyan-600 bg-cyan-100 border-cyan-200" },
    ok: { Icon: CheckCircle, color: isDark ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-600 bg-emerald-100 border-emerald-200" },
  };
  const { Icon, color } = map[level];
  return (
    <div className={`p-1.5 rounded-lg border ${color}`}>
      <Icon className="w-4 h-4 shrink-0" />
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────

function KpiCard({ kpi, isDark }: { kpi: KPI; isDark: boolean }) {
  const up = kpi.change >= 0;
  const pct = Math.abs(kpi.change).toFixed(1);

  return (
    <div
      className={`relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isDark
          ? "border-white/10 hover:border-cyan-500/40 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/90"
          : "border-slate-200 bg-white/90 shadow-sm hover:border-blue-400 hover:shadow-xl"
      }`}
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15 blur-3xl group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: kpi.color }}
      />

      <div className="relative flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${kpi.color}18`,
            border: `1px solid ${kpi.color}35`,
            boxShadow: `0 0 18px ${kpi.color}25`,
          }}
        >
          <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
          up
            ? isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-300"
            : isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-300"
        }`}>
          {up ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {pct}%
        </div>
      </div>

      <p className={`text-xs mb-1 font-bold tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black tracking-tight tabular-nums ${isDark ? "text-white" : "text-slate-900"}`}>
          {fmt(kpi.value)}
        </span>
        <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.unit}</span>
      </div>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${isDark ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"}`}>
        <span className={`flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> BKPSDM Telemetry
        </span>
        <span className="text-cyan-500 font-mono font-bold">REALTIME</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Executive Dashboard", count: "Overview" },
  { icon: UserCheck, label: "Direktori & Verifikasi NIP", count: "ASN PPU" },
  { icon: Server, label: "Telemetri Layanan SIMPEG", count: "6 Service" },
  { icon: Activity, label: "Analitik Trafik API", count: "Live" },
  { icon: Code, label: "Konsol Developer API", count: "Gateway" },
];

function Sidebar({ activeSection, setActiveSection, isDark }: { activeSection: string; setActiveSection: (s: string) => void; isDark: boolean }) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-72 shrink-0 border-r relative z-20 transition-colors ${
        isDark ? "border-white/10 bg-slate-950/90" : "border-slate-200 bg-white/95 shadow-sm"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Brand Header */}
      <div className={`flex items-center gap-3.5 px-6 h-20 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
          <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDark ? "bg-slate-950" : "bg-white"}`}>
            <Globe className="w-5 h-5 text-cyan-500 animate-pulse" />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className={`text-sm font-extrabold tracking-wide leading-none truncate ${isDark ? "text-white" : "text-slate-900"}`}>BKPSDM PPU</h2>
          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mt-1 truncate">SIMPEG Executive Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Navigasi Utama</p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? isDark
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                    : "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold"
                  : isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? isDark ? "text-cyan-400" : "text-white" : isDark ? "text-slate-400" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                isActive
                  ? isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-white/20 text-white"
                  : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-600"
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Security Status Box */}
      <div className={`p-4 m-4 rounded-2xl border ${isDark ? "border-emerald-500/30 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>Gateway Server Active</p>
            <p className={`text-[10px] truncate ${isDark ? "text-emerald-400/80" : "text-emerald-600"}`}>Credentials Encrypted on Node</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl border px-4 py-3 text-xs shadow-2xl backdrop-blur-xl space-y-1 ${
      isDark ? "border-white/15 bg-slate-900/95 text-white" : "border-slate-200 bg-white/98 text-slate-900"
    }`}>
      <p className={`font-mono text-[11px] mb-1 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <Clock className="w-3.5 h-3.5 text-cyan-500" /> {label}
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

// ─── Interactive ASN & NIP Directory Component ─────────────────────────────

function AsnDirectoryModule({ samplePegawai, isDark }: { samplePegawai?: PegawaiASN[]; isDark: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpd, setSelectedOpd] = useState("Semua OPD");
  const [privacyMask, setPrivacyMask] = useState(true);

  const samples: PegawaiASN[] = samplePegawai || [
    { nip: "198501152010011002", nama: "Dr. H. Ahmad Fauzi, S.STP., M.Si", jabatan: "Kepala Dinas / Utama", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/b", status: "Aktif" },
    { nip: "199003202015022001", nama: "Siti Rahmah, S.Kom", jabatan: "Pranata Komputer Ahli Muda", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "III/c", status: "Aktif" },
    { nip: "197805102005011005", nama: "Bambang Setiawan, S.H., M.H.", jabatan: "Kabid Pengadaan & Mutasi", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
    { nip: "199407122019032008", nama: "Dewi Lestari, S.E.", jabatan: "Analis Kepegawaian Muda", unitKerja: "Secretariat Daerah PPU", gol: "III/b", status: "Aktif" },
    { nip: "198211042008011003", nama: "Ir. Hendra Wijaya", jabatan: "Pranata Komputer Ahli Madya", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
  ];

  const filteredAsn = samples.filter((asn) => {
    const matchSearch =
      asn.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.nip.includes(searchQuery) ||
      asn.jabatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchOpd = selectedOpd === "Semua OPD" || asn.unitKerja.includes(selectedOpd);
    return matchSearch && matchOpd;
  });

  return (
    <div className={`rounded-2xl border p-6 space-y-6 backdrop-blur-xl transition-all ${
      isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-lg"
    }`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Direktori & Verifikasi Data ASN Penajam Paser Utara</h3>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
              isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
            }`}>
              SIMPEG Validated
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Pencarian cepat status ASN, Golongan, Jabatan, dan Unit Kerja Perangkat Daerah PPU.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrivacyMask(!privacyMask)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              privacyMask
                ? isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                : isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-800 border-amber-300"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{privacyMask ? "Sensor Privasi: AKTIF" : "Sensor Privasi: MATI"}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NIP, Nama, atau Jabatan Pegawai..."
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs border focus:outline-none ${
              isDark
                ? "bg-slate-950 border-white/15 text-white placeholder-slate-500 focus:border-cyan-500"
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
          <select
            value={selectedOpd}
            onChange={(e) => setSelectedOpd(e.target.value)}
            className={`rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none ${
              isDark
                ? "bg-slate-950 border-white/15 text-white focus:border-cyan-500"
                : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
            }`}
          >
            <option value="Semua OPD">Semua OPD (All Units)</option>
            <option value="Diskominfo">Diskominfo PPU</option>
            <option value="BKPSDM">BKPSDM PPU</option>
            <option value="Secretariat">Secretariat Daerah</option>
          </select>
        </div>
      </div>

      {/* Cards Grid of ASN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAsn.map((asn) => (
          <div
            key={asn.nip}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between hover:shadow-lg ${
              isDark
                ? "border-white/10 bg-slate-950/60 hover:border-cyan-500/40"
                : "border-slate-200 bg-slate-50 hover:border-blue-400"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {privacyMask ? maskNip(asn.nip) : asn.nip}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-300"
                }`}>
                  Gol. {asn.gol}
                </span>
              </div>

              <h4 className={`text-sm font-bold leading-snug mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                {privacyMask ? maskNama(asn.nama) : asn.nama}
              </h4>
              <p className={`text-xs font-semibold ${isDark ? "text-cyan-400" : "text-blue-600"}`}>{asn.jabatan}</p>
              <p className={`text-[11px] mt-2 line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                🏛️ {asn.unitKerja}
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] ${
              isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"
            }`}>
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <CheckCircle className="w-3 h-3" /> SIMPEG Verified
              </span>
              <span className="font-mono">PPU Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Developer & API Gateway Console Component ───────────────────────────

function ApiDeveloperConsole({ envConfig, isDark }: { envConfig?: any; isDark: boolean }) {
  const [activeTab, setActiveTab] = useState<"architecture" | "payload" | "curl">("architecture");
  const [copied, setCopied] = useState(false);

  const targetUrl = envConfig?.targetUrl || "https://simpeg.penajamkab.go.id/";

  const sampleCurl = `curl -X POST "${targetUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-Client-Id: kominfo" \\
  -H "X-Service-Module: Bkpsdm" \\
  -d '{"nip": "198501152010011002"}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(sampleCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl border p-6 space-y-6 backdrop-blur-xl ${
      isDark ? "border-cyan-500/30 bg-slate-900/80" : "border-blue-200 bg-white/90 shadow-lg"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-500" />
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Konsol Developer API Gateway SIMPEG</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
            }`}>
              Postman Integration Ready
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Spesifikasi arsitektur integrasi sistem antarmuka SIMPEG BKPSDM Kabupaten Penajam Paser Utara.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-xl p-1 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === "architecture"
                ? isDark ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-white text-blue-700 shadow-sm"
                : isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Arsitektur Gateway
          </button>
          <button
            onClick={() => setActiveTab("payload")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === "payload"
                ? isDark ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-white text-blue-700 shadow-sm"
                : isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Payload Format
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === "curl"
                ? isDark ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "bg-white text-blue-700 shadow-sm"
                : isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            cURL Spec
          </button>
        </div>
      </div>

      {activeTab === "architecture" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
            isDark ? "bg-slate-950 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            <p className="text-cyan-500 font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Endpoint Target:
            </p>
            <p className="text-sm font-bold text-emerald-500 break-all">{targetUrl}</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Service SSL/TLS 256-bit Encrypted</p>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
            isDark ? "bg-slate-950 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            <p className="text-cyan-500 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Authentication Gateway:
            </p>
            <p className="text-sm font-bold text-cyan-400">ukey: Bkpsdm | clientId: kominfo</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>PKEY & Passcode diisolasi di Server-Side</p>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
            isDark ? "bg-slate-950 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            <p className="text-cyan-500 font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Key Selector (getCode):
            </p>
            <p className="text-sm font-bold text-amber-400">getCode: nip</p>
            <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Template JSON: send_data &#123;"nip":"..."&#125;</p>
          </div>
        </div>
      )}

      {activeTab === "payload" && (
        <div className={`p-4 rounded-xl border font-mono text-xs ${
          isDark ? "bg-slate-950 border-white/10 text-cyan-300" : "bg-slate-900 border-slate-800 text-cyan-300"
        }`}>
          <p className="text-slate-400 mb-2 font-sans text-xs">// Contoh format payload Postman send_data</p>
          <pre className="text-sm font-bold leading-relaxed">{`{
  "nip": "198501152010011002",
  "ukey": "Bkpsdm",
  "clientId": "kominfo"
}`}</pre>
        </div>
      )}

      {activeTab === "curl" && (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border font-mono text-xs relative ${
            isDark ? "bg-slate-950 border-white/10 text-emerald-400" : "bg-slate-900 border-slate-800 text-emerald-400"
          }`}>
            <pre className="whitespace-pre-wrap leading-relaxed">{sampleCurl}</pre>
            <button
              onClick={copyCurl}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans font-bold transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy cURL"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, energyChart, trafficChart, connectionStatus, environmentConfig, services: backendServices, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Executive Dashboard");
  const [searchService, setSearchService] = useState("");
  const [realtimeHistory, setRealtimeHistory] = useState<TimePoint[]>([]);

  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "dark";

  // Services State (BKPSDM SIMPEG)
  const services: ServiceRow[] = backendServices && backendServices.length > 0 ? backendServices : [
    { service: "SIMPEG - Layanan E-Kinerja ASN", requests: 16420, uptime: 99.98, latency: 42, status: "online", category: "Kinerja Pegawai", endpoint: "/api/v1/kinerja" },
    { service: "SIMPEG - Presensi & Absensi Mobile", requests: 31200, uptime: 99.95, latency: 28, status: "online", category: "Kehadiran", endpoint: "/api/v1/absensi" },
    { service: "SIMPEG - Kenaikan Pangkat (KP) Online", requests: 4890, uptime: 99.80, latency: 75, status: "online", category: "Karir ASN", endpoint: "/api/v1/kp" },
    { service: "SIMPEG - Cuti Online ASN PPU", requests: 3450, uptime: 99.90, latency: 52, status: "online", category: "Layanan Kepegawaian", endpoint: "/api/v1/cuti" },
    { service: "SIMPEG - Mutasi & Promosi Jabatan", requests: 2100, uptime: 98.60, latency: 125, status: "degraded", category: "Karir ASN", endpoint: "/api/v1/mutasi" },
    { service: "SIMPEG - Layanan Pensiun & Gaji Berkala", requests: 2680, uptime: 99.88, latency: 62, status: "online", category: "Kesejahteraan", endpoint: "/api/v1/pensiun" },
  ];

  // Alerts Feed State (BKPSDM Telemetry)
  const [alerts] = useState<Alert[]>([
    { id: 1, level: "ok", message: "Gateway Server SIMPEG PPU terhubung & terisolasi aman", source: "Gateway-GW", ts: "14:00:12" },
    { id: 2, level: "info", message: "Kredensial rahasia (PKEY & Passcode) tersimpan di .env Server", source: "Security-Vault", ts: "14:01:05" },
    { id: 3, level: "info", message: "1.480 request publik verifikasi NIP diproses dengan sensor privasi", source: "NIP-Validator", ts: "14:02:18" },
    { id: 4, level: "ok", message: "Otentikasi Server-to-Server Bkpsdm divalidasi", source: "Auth-Module", ts: "14:03:00" },
    { id: 5, level: "ok", message: "Modul Layanan SIMPEG PPU beroperasi normal", source: "Simpeg-Ops", ts: "14:04:45" },
  ]);

  // KPIs Definition for BKPSDM PPU
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "asn", label: "Total Pegawai ASN PPU", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#3B82F6", glow: "#3B82F6", category: "Data Pegawai" },
    { id: "uptime", label: "SIMPEG PPU Health", value: 99.95, unit: "%", change: 0.02, icon: Server, color: "#10B981", glow: "#10B981", category: "Layanan SIMPEG" },
    { id: "nip", label: "Verifikasi NIP Hari Ini", value: 1480, unit: "query", change: 8.4, icon: UserCheck, color: "#06B6D4", glow: "#06B6D4", category: "Direktori & Verifikasi NIP" },
    { id: "api", label: "Volume API Transaksi", value: 28400, unit: "req/jam", change: 12.5, icon: Radio, color: "#8B5CF6", glow: "#8B5CF6", category: "Analitik Trafik API" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit", change: 0.0, icon: Database, color: "#F59E0B", glow: "#F59E0B", category: "Data Pegawai" },
    { id: "modules", label: "Modul Digital Active", value: 12, unit: "modul", change: 5.0, icon: Sparkles, color: "#EC4899", glow: "#EC4899", category: "Layanan SIMPEG" },
    { id: "keys", label: "Gateway Active Params", value: 9, unit: "parameter", change: 0.0, icon: FileJson, color: "#10B981", glow: "#10B981", category: "Konsol Developer API" },
    { id: "security", label: "Status Privasi & Encrypt", value: 100, unit: "% aman", change: 0.0, icon: Shield, color: "#3B82F6", glow: "#3B82F6", category: "Konsol Developer API" },
  ]);

  // Sync metrics from socket
  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    const energy = metrics.find((m) => m.id === 'apiRequests');
    const citizens = metrics.find((m) => m.id === 'totalAsn');

    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === 'asn' && citizens) {
          return { ...k, value: citizens.numericValue };
        }
        if (k.id === 'api' && energy) {
          return { ...k, value: energy.numericValue };
        }
        return k;
      })
    );
  }, [metrics]);

  // Update clock time
  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Sync rolling timeline data
  useEffect(() => {
    if ((!energyChart || energyChart.length === 0) && (!metrics || metrics.length === 0)) return;

    const timeStr = fmtTime(new Date());
    const energyVal = metrics.find((m) => m.id === 'apiRequests')?.numericValue || 28400;
    const waterVal = metrics.find((m) => m.id === 'verifikasiNip')?.numericValue || 1480;

    const newPoint: TimePoint = {
      t: timeStr,
      energy: Math.round(energyVal / 10),
      traffic: Math.round(waterVal),
      citizens: Math.round(energyVal / 20),
      incidents: Math.round(waterVal / 50),
    };

    setRealtimeHistory((prev) => {
      if (prev.length === 0 && Array.isArray(energyChart) && energyChart.length > 0) {
        return energyChart.map((pt, i) => ({
          t: pt.time || timeStr,
          energy: Math.round((pt.value || 50) * 300),
          traffic: Math.round((trafficChart[i]?.count || 4000) / 3),
          citizens: Math.round((pt.value || 50) * 50),
          incidents: Math.round((pt.value || 50) / 10),
        }));
      }
      const exists = prev.some((p) => p.t === timeStr);
      if (exists) return prev;
      return [...prev.slice(-19), newPoint];
    });
  }, [metrics, energyChart, trafficChart]);

  const displayHistory = realtimeHistory.length > 0
    ? realtimeHistory
    : (Array.isArray(energyChart) ? energyChart : []).map((pt, i) => ({
        t: pt.time || fmtTime(new Date()),
        energy: Math.round((pt.value || 50) * 300),
        traffic: (Array.isArray(trafficChart) && trafficChart[i] ? trafficChart[i].count : 5000),
        citizens: Math.round((pt.value || 50) * 50),
        incidents: Math.round((pt.value || 50) / 10),
      }));

  const filteredServices = services.filter((s) =>
    s.service.toLowerCase().includes(searchService.toLowerCase()) ||
    s.category.toLowerCase().includes(searchService.toLowerCase())
  );

  const filteredKpis = activeSection === "Executive Dashboard"
    ? kpis.slice(0, 4)
    : kpis.filter((k) => k.category === activeSection || activeSection === "Executive Dashboard");

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 relative ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse at top, #0F172A 0%, #080C14 100%)"
          : "radial-gradient(ellipse at top, #F8FAFC 0%, #E2E8F0 100%)",
      }}
    >
      {/* Background Ambient Glow Orbs */}
      {isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isDark={isDark} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <header
          className={`flex items-center justify-between px-8 h-20 border-b shrink-0 transition-colors ${
            isDark
              ? "border-white/10 bg-slate-950/80 text-white"
              : "border-slate-200 bg-white/90 text-slate-900 shadow-sm"
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wide">Command Center Executive BKPSDM PPU</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
                }`}>
                  {activeSection.toUpperCase()}
                </span>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span className="text-cyan-500 font-mono font-semibold">https://simpeg.penajamkab.go.id/</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> API Gateway Online
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
                isDark
                  ? "bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                  : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
              }`}
              title="Toggle Light / Dark Theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Dark Theme</span>
                </>
              )}
            </button>

            <LiveBadge isRealtime={connectionStatus === 'connected'} isDark={isDark} />

            <div className={`text-right border-l pl-5 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <p className="text-base font-extrabold tabular-nums tracking-wider">{fmtTime(time)}</p>
              <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className={`relative p-2.5 rounded-xl border transition-all ${
                isDark ? "border-white/10 hover:bg-white/5 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Top Banner Executive Welcome */}
          <div className={`rounded-2xl p-5 border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
            isDark
              ? "border-cyan-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-cyan-950/40 text-white"
              : "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 text-slate-900 shadow-md"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border shrink-0 ${
                isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-blue-600 text-white border-blue-700 shadow-md"
              }`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black flex items-center gap-2">
                  <span>Executive Operations Command Center</span>
                  <span className="text-cyan-500 font-mono text-[11px] font-normal">[Kabupaten Penajam Paser Utara]</span>
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  Pemantauan terpusat layanan kepegawaian ASN, performa API Gateway SIMPEG, dan integrasi Sistem Diskominfo PPU.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection("Konsol Developer API")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  isDark
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                }`}
              >
                <Code className="w-4 h-4" /> Konsol Gateway API
              </button>
            </div>
          </div>

          {/* High Impact KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} isDark={isDark} />
            ))}
          </div>

          {/* Analytics Charts Hub */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Main Area Chart — Transaksi SIMPEG */}
            <div
              className={`xl:col-span-2 rounded-2xl p-6 border backdrop-blur-xl ${
                isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Activity className="w-4 h-4 text-cyan-500" /> Trafik Transaksi API SIMPEG PPU (Realtime Stream)
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Volume request API per interval detik ke endpoint simpeg.penajamkab.go.id</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-blue-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Total Request
                  </span>
                  <span className="flex items-center gap-2 text-cyan-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Query NIP
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={displayHistory}>
                  <defs>
                    <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="citizensGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />
                  <XAxis dataKey="t" tick={{ fill: isDark ? "#64748B" : "#475569", fontSize: 11 }} />
                  <YAxis tick={{ fill: isDark ? "#64748B" : "#475569", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip isDark={isDark} />} />
                  <Area type="monotone" dataKey="energy" name="Total Request" stroke="#3B82F6" strokeWidth={2.5} fill="url(#trafficGrad)" />
                  <Area type="monotone" dataKey="citizens" name="Query NIP" stroke="#06B6D4" strokeWidth={2.5} fill="url(#citizensGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart — Distribusi Pegawai per OPD */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-xl flex flex-col justify-between ${
                isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
              }`}
            >
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <PieChart className="w-4 h-4 text-purple-500" /> Distribusi ASN per Perangkat Daerah
                </h3>
                <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Proporsi PNS & PPPK di OPD Utama PPU</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={OPD_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={78} dataKey="value" stroke="none">
                      {OPD_DISTRIBUTION.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip isDark={isDark} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={`space-y-2 mt-4 pt-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                {OPD_DISTRIBUTION.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                    <span className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                      {d.name}
                    </span>
                    <span className="text-cyan-500 tabular-nums font-bold">{d.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ASN & NIP Verification Directory Module */}
          {(activeSection === "Executive Dashboard" || activeSection === "Direktori & Verifikasi NIP") && (
            <AsnDirectoryModule samplePegawai={samplePegawai} isDark={isDark} />
          )}

          {/* Developer API Gateway Console */}
          {(activeSection === "Executive Dashboard" || activeSection === "Konsol Developer API") && (
            <ApiDeveloperConsole envConfig={environmentConfig} isDark={isDark} />
          )}

          {/* Telemetry Services Table & Activity Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* SIMPEG Telemetry Services Table */}
            <div
              className={`xl:col-span-3 rounded-2xl border overflow-hidden backdrop-blur-xl flex flex-col ${
                isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Server className="w-4 h-4 text-cyan-500" /> Matriks Telemetri Layanan SIMPEG PPU
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status operasional, latensi, dan endpoint modul kepegawaian</p>
                </div>
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                  <input
                    type="text"
                    placeholder="Cari modul SIMPEG..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className={`pl-8 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none ${
                      isDark
                        ? "bg-slate-900/80 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-white/5 bg-slate-900/40 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                      {["Nama Modul SIMPEG", "Kategori", "Req/jam", "Uptime", "Latensi", "Status"].map((h) => (
                        <th key={h} className="text-left px-6 py-3.5 font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-200"}`}>
                    {filteredServices.map((s) => (
                      <tr key={s.service} className={`transition-colors ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                        <td className="px-6 py-4">
                          <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{s.service}</p>
                          <p className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>{s.endpoint}</p>
                        </td>
                        <td className={`px-6 py-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{s.category}</td>
                        <td className={`px-6 py-4 font-mono font-semibold ${isDark ? "text-slate-300" : "text-slate-800"}`}>{s.requests.toLocaleString()}</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-500">{s.uptime.toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono">
                          <span className={s.latency < 80 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                            {s.latency}ms
                          </span>
                        </td>
                        <td className="px-6 py-4"><StatusPill status={s.status} isDark={isDark} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Realtime Alert Stream */}
            <div
              className={`xl:col-span-2 rounded-2xl border overflow-hidden backdrop-blur-xl flex flex-col ${
                isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Shield className="w-4 h-4 text-emerald-500" /> Log Telemetri Gateway Server
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Audit Trail & Otentikasi Service</p>
                </div>
              </div>
              <div className={`flex-1 overflow-y-auto divide-y p-2 ${isDark ? "divide-white/5" : "divide-slate-200"}`}>
                {alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                    <AlertIcon level={alert.level} isDark={isDark} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>{alert.message}</p>
                      <p className={`text-[10px] mt-1 flex items-center gap-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        <span className="text-cyan-500 font-mono font-semibold">{alert.source}</span>
                        <span>•</span>
                        <span>{alert.ts}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className={`flex items-center justify-between text-xs pt-4 pb-6 border-t ${
            isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"
          }`}>
            <p>© 2026 BKPSDM Kabupaten Penajam Paser Utara — SIMPEG Executive Portal. Integrated Gateway Architecture.</p>
            <div className="flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SIMPEG Gateway Online (https://simpeg.penajamkab.go.id/)
              </span>
              <span>v5.0 Executive Command Center</span>
            </div>
          </footer>

        </main>
      </div>

      <ConnectionStatus />
    </div>
  );
}

export default function App() {
  return (
    <RealtimeProvider>
      <DashboardContent />
    </RealtimeProvider>
  );
}
