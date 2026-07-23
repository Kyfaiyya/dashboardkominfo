import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, AlertTriangle, Bell, ChevronUp, ChevronDown,
  Globe, LayoutDashboard, Radio, Sun, Moon,
  Server, Shield, Users,
  Clock, CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Settings,
  Search, RefreshCw, Sparkles, Check, FileJson, Key,
  Send, Database, UserCheck, Terminal, Copy
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
    <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md transition-all ${
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
      {isRealtime ? 'SIMPEG STREAM ACTIVE' : 'RECONNECTING...'}
    </div>
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

function StatusPill({ status, isDark }: { status: ServiceRow["status"]; isDark: boolean }) {
  const map = {
    online: isDark
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
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

// ─── KPI Card ─────────────────────────────────────────────────────────────

function KpiCard({ kpi, isDark }: { kpi: KPI; isDark: boolean }) {
  const up = kpi.change >= 0;
  const pct = Math.abs(kpi.change).toFixed(1);

  return (
    <div
      className={`relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isDark
          ? "border-white/10 hover:border-cyan-500/40"
          : "border-slate-200 bg-white/90 shadow-md hover:border-blue-400 hover:shadow-xl"
      }`}
      style={{
        background: isDark
          ? "linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(11, 15, 25, 0.9) 100%)"
          : undefined,
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"
        style={{ backgroundColor: kpi.color }}
      />

      <div className="relative flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${kpi.color}15`,
            border: `1px solid ${kpi.color}35`,
            boxShadow: `0 0 15px ${kpi.color}20`,
          }}
        >
          <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
          up
            ? isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-300"
            : isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-300"
        }`}>
          {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {pct}%
        </div>
      </div>

      <p className={`text-xs mb-1 font-semibold tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${isDark ? "text-white" : "text-slate-900"}`}>
          {fmt(kpi.value)}
        </span>
        <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.unit}</span>
      </div>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${isDark ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"}`}>
        <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <Sparkles className="w-3 h-3 text-cyan-500" /> SIMPEG PPU Stream
        </span>
        <span className="text-cyan-500 font-mono font-semibold">LIVE</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", count: "8" },
  { icon: FileJson, label: "Parameter API (JSON)", count: "9 Key" },
  { icon: UserCheck, label: "Pencarian NIP ASN", count: "SIMPEG" },
  { icon: Server, label: "Layanan SIMPEG", count: "6 Service" },
  { icon: Activity, label: "Lalu Lintas API", count: "Live" },
  { icon: Shield, label: "Keamanan & Token", count: "OK" },
];

function Sidebar({ activeSection, setActiveSection, isDark }: { activeSection: string; setActiveSection: (s: string) => void; isDark: boolean }) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-72 shrink-0 border-r relative z-20 ${
        isDark ? "border-white/10 bg-slate-950/90" : "border-slate-200 bg-white/95"
      }`}
      style={{ backdropFilter: "blur(20px)" }}
    >
      {/* Brand Header */}
      <div className={`flex items-center gap-3.5 px-6 h-20 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
          <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDark ? "bg-slate-950" : "bg-white"}`}>
            <Globe className="w-5 h-5 text-cyan-500 animate-pulse" />
          </div>
        </div>
        <div className="min-w-0">
          <h2 className={`text-sm font-extrabold tracking-wide leading-none truncate ${isDark ? "text-white" : "text-slate-900"}`}>BKPSDM PPU</h2>
          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mt-1 truncate">Layanan SIMPEG Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Main Navigation</p>
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
                    : "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-bold"
                  : isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? "text-cyan-500" : isDark ? "text-slate-400" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                isActive
                  ? isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-blue-200 text-blue-800"
                  : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-600"
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Admin Profile */}
      <div className={`p-4 m-4 rounded-xl border ${isDark ? "border-white/10 bg-slate-900/60" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            PPU
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>BKPSDM Admin</p>
            <p className={`text-[10px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>simpeg.penajamkab.go.id</p>
          </div>
          <Settings className={`w-4 h-4 cursor-pointer transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`} />
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
      isDark ? "border-white/15 bg-slate-900/90 text-white" : "border-slate-200 bg-white/95 text-slate-900"
    }`}>
      <p className={`font-mono text-[11px] mb-1 flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <Clock className="w-3 h-3 text-cyan-500" /> {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className={`flex items-center gap-1.5 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
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

// ─── Postman Environment Data Panel Component ─────────────────────────────

function PostmanEnvironmentPanel({ envConfig, isDark }: { envConfig?: any; isDark: boolean }) {
  const [showPkey, setShowPkey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const variables: EnvironmentVariable[] = envConfig?.values || [
    { key: "uri_service", value: "https://simpeg.penajamkab.go.id/", type: "default", enabled: true },
    { key: "ukey", value: "Bkpsdm", type: "default", enabled: true },
    { key: "pkey", value: "p3n4j4m", type: "default", enabled: true },
    { key: "token", value: "token", enabled: true },
    { key: "send_data", value: '{"nip":"--isiNIP--"}', enabled: true },
    { key: "passcode", value: "passcode", enabled: true },
    { key: "account", value: "account", enabled: true },
    { key: "clientId", value: "kominfo", enabled: true },
    { key: "getCode", value: "nip", enabled: true }
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-2xl space-y-6 backdrop-blur-xl ${
      isDark ? "border-cyan-500/30 bg-slate-900/80" : "border-blue-200 bg-white/90 shadow-lg"
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div>
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-cyan-500" />
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Source Data Environment: BKPSDPPU</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
            }`}>
              Postman JSON Loaded
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Environment ID: <code className="text-cyan-500 font-mono">001ca844-f012-4e15-bedc-7ae4164dedb7</code> • Postman v11.32.2
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://simpeg.penajamkab.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" /> Buka SIMPEG PPU
          </a>
        </div>
      </div>

      {/* Grid of Environment Keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variables.map((item) => {
          const isSecret = item.key === "pkey" || item.key === "passcode";
          const displayVal = isSecret && !showPkey ? "••••••••" : item.value;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDark
                  ? "border-white/10 bg-slate-950/60 hover:border-cyan-500/40"
                  : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-500 font-mono flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-cyan-500" /> {item.key}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-300"
                  }`}>
                    Active
                  </span>
                </div>
                <div className={`px-3 py-2 rounded-lg border font-mono text-xs break-all min-h-[36px] flex items-center justify-between ${
                  isDark ? "bg-slate-900/90 border-white/5 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <span>{displayVal}</span>
                  {isSecret && (
                    <button
                      onClick={() => setShowPkey(!showPkey)}
                      className={`ml-2 shrink-0 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      {showPkey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] ${isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"}`}>
                <span>Type: {item.type || "default"}</span>
                <button
                  onClick={() => handleCopy(item.key, item.value)}
                  className={`flex items-center gap-1 font-semibold transition-colors ${isDark ? "text-slate-400 hover:text-cyan-300" : "text-slate-600 hover:text-blue-600"}`}
                >
                  {copiedKey === item.key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === item.key ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NIP Lookup Tester Component ─────────────────────────────────────────

function NipLookupTester({ samplePegawai, isDark }: { samplePegawai?: PegawaiASN[]; isDark: boolean }) {
  const [nipInput, setNipInput] = useState("198501152010011002");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PegawaiASN | null>(null);
  const [apiPayload, setApiPayload] = useState<string>("");

  const samples: PegawaiASN[] = samplePegawai || [
    { nip: "198501152010011002", nama: "Dr. H. Ahmad Fauzi, S.STP., M.Si", jabatan: "Kepala Dinas / Utama", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/b", status: "Aktif" },
    { nip: "199003202015022001", nama: "Siti Rahmah, S.Kom", jabatan: "Pranata Komputer Ahli Muda", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "III/c", status: "Aktif" },
    { nip: "197805102005011005", nama: "Bambang Setiawan, S.H., M.H.", jabatan: "Kabid Pengadaan & Mutasi", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
  ];

  const handleTestLookup = (selectedNip?: string) => {
    const targetNip = selectedNip || nipInput;
    setNipInput(targetNip);
    setLoading(true);

    const payload = JSON.stringify({ nip: targetNip }, null, 2);
    setApiPayload(payload);

    setTimeout(() => {
      const match = samples.find((p) => p.nip === targetNip) || {
        nip: targetNip,
        nama: "Pegawai Negeri Sipil ASN PPU",
        jabatan: "Analis Kepegawaian Ahli",
        unitKerja: "Pemerintah Kabupaten Penajam Paser Utara",
        gol: "III/c",
        status: "Terverifikasi (SIMPEG PPU)"
      };
      setResult(match);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    handleTestLookup("198501152010011002");
  }, []);

  return (
    <div className={`rounded-2xl border p-6 space-y-6 backdrop-blur-xl ${
      isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-lg"
    }`}>
      <div>
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" />
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>SIMPEG NIP Query Tester (send_data)</h3>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
            isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
          }`}>
            POST /api/v1/pegawai
          </span>
        </div>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Pengujian payload <code className="text-cyan-500 font-mono">&#123;"nip":"--isiNIP--"&#125;</code> sesuai variabel Postman <code className="text-cyan-500 font-mono">send_data</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input & Controls */}
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold mb-1.5 block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Masukkan Nomor Induk Pegawai (NIP):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nipInput}
                onChange={(e) => setNipInput(e.target.value)}
                placeholder="Contoh: 198501152010011002"
                className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-mono border focus:outline-none ${
                  isDark
                    ? "bg-slate-950 border-white/15 text-white placeholder-slate-500 focus:border-cyan-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                }`}
              />
              <button
                onClick={() => handleTestLookup()}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Testing..." : "Kirim Request"}
              </button>
            </div>
          </div>

          <div>
            <p className={`text-[11px] font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Pilih NIP Sample Pegawai PPU:</p>
            <div className="flex flex-wrap gap-2">
              {samples.map((p) => (
                <button
                  key={p.nip}
                  onClick={() => handleTestLookup(p.nip)}
                  className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    nipInput === p.nip
                      ? isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "bg-blue-100 text-blue-800 border-blue-400 font-bold"
                      : isDark ? "bg-slate-950/60 text-slate-400 border-white/10 hover:text-white" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {p.nip} ({p.nama.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Request Header Summary */}
          <div className={`p-4 rounded-xl border font-mono text-[11px] space-y-1.5 ${
            isDark ? "bg-slate-950/80 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <p className="text-cyan-500 font-bold flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Request Headers (SIMPEG PPU):
            </p>
            <p><span className={isDark ? "text-slate-500" : "text-slate-400"}>Target URL:</span> https://simpeg.penajamkab.go.id/</p>
            <p><span className={isDark ? "text-slate-500" : "text-slate-400"}>ukey:</span> Bkpsdm</p>
            <p><span className={isDark ? "text-slate-500" : "text-slate-400"}>clientId:</span> kominfo</p>
            <p><span className={isDark ? "text-slate-500" : "text-slate-400"}>getCode:</span> nip</p>
            <p><span className={isDark ? "text-slate-500" : "text-slate-400"}>Body Payload:</span> {apiPayload}</p>
          </div>
        </div>

        {/* Right: Response Output */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          isDark ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-200"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> SIMPEG API Response (200 OK)
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>Latency: 38ms</span>
            </div>

            {loading ? (
              <div className={`py-12 flex flex-col items-center justify-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-500" />
                <span className="text-xs">Mengirim query NIP ke https://simpeg.penajamkab.go.id/...</span>
              </div>
            ) : result ? (
              <div className="space-y-3">
                <div>
                  <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Nama Pegawai / ASN</p>
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{result.nama}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>NIP</p>
                    <p className="text-xs font-mono font-bold text-cyan-500">{result.nip}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Golongan</p>
                    <p className="text-xs font-semibold text-emerald-500">{result.gol}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Jabatan</p>
                    <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.jabatan}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Unit Kerja</p>
                    <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.unitKerja}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"}`}>
            <span>Status Verifikasi: <strong className="text-emerald-500">Valid (BKPSDM PPU)</strong></span>
            <span>Data Origin: SIMPEG PPU</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, energyChart, trafficChart, connectionStatus, environmentConfig, services: backendServices, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Overview");
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
    { service: "SIMPEG - Layanan E-Kinerja ASN", requests: 16420, uptime: 99.98, latency: 42, status: "online", category: "Kinerja Pegawai" },
    { service: "SIMPEG - Presensi & Absensi Mobile", requests: 31200, uptime: 99.95, latency: 28, status: "online", category: "Kehadiran" },
    { service: "SIMPEG - Kenaikan Pangkat (KP) Online", requests: 4890, uptime: 99.80, latency: 75, status: "online", category: "Karir ASN" },
    { service: "SIMPEG - Cuti Online ASN PPU", requests: 3450, uptime: 99.90, latency: 52, status: "online", category: "Layanan Kepegawaian" },
    { service: "SIMPEG - Mutasi & Promosi Jabatan", requests: 2100, uptime: 98.60, latency: 125, status: "degraded", category: "Karir ASN" },
    { service: "SIMPEG - Layanan Pensiun & Gaji Berkala", requests: 2680, uptime: 99.88, latency: 62, status: "online", category: "Kesejahteraan" },
  ];

  // Alerts Feed State (BKPSDM Telemetry)
  const [alerts] = useState<Alert[]>([
    { id: 1, level: "ok", message: "Koneksi SIMPEG PPU (simpeg.penajamkab.go.id) aktif & terverifikasi", source: "SIMPEG-GW", ts: "14:00:12" },
    { id: 2, level: "info", message: "Environment Postman BKPSDPPU berhasil disinkronkan", source: "Postman-Sync", ts: "14:01:05" },
    { id: 3, level: "info", message: "1.480 request verifikasi NIP ASN diproses hari ini", source: "NIP-Validator", ts: "14:02:18" },
    { id: 4, level: "ok", message: "Token & Passcode ukey: Bkpsdm divalidasi", source: "Auth-Module", ts: "14:03:00" },
    { id: 5, level: "ok", message: "Presensi mobile ASN PPU beroperasi normal", source: "Absensi-PPU", ts: "14:04:45" },
  ]);

  // KPIs Definition for BKPSDM PPU
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "asn", label: "Total Pegawai ASN PPU", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#3B82F6", glow: "#3B82F6", category: "Data Pegawai" },
    { id: "uptime", label: "SIMPEG PPU Health", value: 99.95, unit: "%", change: 0.02, icon: Server, color: "#10B981", glow: "#10B981", category: "Layanan SIMPEG" },
    { id: "nip", label: "Verifikasi NIP Hari Ini", value: 1480, unit: "query", change: 8.4, icon: UserCheck, color: "#06B6D4", glow: "#06B6D4", category: "Pencarian NIP ASN" },
    { id: "api", label: "Volume API Transaksi", value: 28400, unit: "req/jam", change: 12.5, icon: Radio, color: "#8B5CF6", glow: "#8B5CF6", category: "Lalu Lintas API" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit", change: 0.0, icon: Database, color: "#F59E0B", glow: "#F59E0B", category: "Data Pegawai" },
    { id: "modules", label: "Modul Digital Active", value: 12, unit: "modul", change: 5.0, icon: Sparkles, color: "#EC4899", glow: "#EC4899", category: "Layanan SIMPEG" },
    { id: "keys", label: "Postman Config Keys", value: 9, unit: "active key", change: 0.0, icon: FileJson, color: "#10B981", glow: "#10B981", category: "Parameter API (JSON)" },
    { id: "security", label: "Status Passcode & Token", value: 100, unit: "% valid", change: 0.0, icon: Shield, color: "#3B82F6", glow: "#3B82F6", category: "Keamanan & Token" },
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

  const filteredKpis = activeSection === "Overview"
    ? kpis
    : kpis.filter((k) => k.category === activeSection || activeSection === "Overview");

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
                <h1 className="text-lg font-black tracking-wide">BKPSDM Penajam Paser Utara</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
                }`}>
                  {activeSection.toUpperCase()}
                </span>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span className="text-cyan-500 font-mono font-semibold">https://simpeg.penajamkab.go.id/</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Postman Environment Active (BKPSDPPU)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
                isDark
                  ? "bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                  : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
              }`}
              title="Toggle Light / Dark Theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Dark Mode</span>
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

          {/* Banner Live Ticker */}
          <div className={`rounded-2xl p-4 border backdrop-blur-xl flex items-center justify-between shadow-xl ${
            isDark
              ? "border-cyan-500/30 bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-cyan-900/30 text-white"
              : "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 text-slate-900 shadow-md"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${
                isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-blue-100 text-blue-700 border-blue-300"
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold flex items-center gap-2">
                  <span>BKPSDM PPU SIMPEG Telemetry Engine</span>
                  <span className="text-cyan-500 font-mono text-[10px]">[SOURCE: bkpsdmppu_layanan.postman_environment.json]</span>
                </p>
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Target Service: <code className="text-cyan-500 font-semibold">https://simpeg.penajamkab.go.id/</code> • Header: <code className="text-cyan-500 font-semibold">ukey=Bkpsdm</code>, <code className="text-cyan-500 font-semibold">clientId=kominfo</code>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('/api/trigger', '_blank')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                  isDark
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30"
                    : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-sm"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sinkronkan Stream SIMPEG
              </button>
            </div>
          </div>

          {/* Postman Environment JSON Panel */}
          {(activeSection === "Overview" || activeSection === "Parameter API (JSON)") && (
            <PostmanEnvironmentPanel envConfig={environmentConfig} isDark={isDark} />
          )}

          {/* NIP Query Lookup Tester */}
          {(activeSection === "Overview" || activeSection === "Pencarian NIP ASN") && (
            <NipLookupTester samplePegawai={samplePegawai} isDark={isDark} />
          )}

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} isDark={isDark} />
            ))}
          </div>

          {/* Charts Row */}
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
                    <Activity className="w-4 h-4 text-cyan-500" /> Trafik Transaksi API SIMPEG PPU
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Request volume per interval waktu (https://simpeg.penajamkab.go.id/)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-blue-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Request API
                  </span>
                  <span className="flex items-center gap-2 text-cyan-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Query NIP
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
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
                  <PieChart className="w-4 h-4 text-purple-500" /> Distribusi ASN per OPD PPU
                </h3>
                <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Persentase Pegawai Negeri Sipil & PPPK</p>
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

          {/* Table & Alert Stream */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* Digital Services Table */}
            <div
              className={`xl:col-span-3 rounded-2xl border overflow-hidden backdrop-blur-xl flex flex-col ${
                isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Server className="w-4 h-4 text-cyan-500" /> Telemetri Layanan SIMPEG PPU
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Status dan latensi modul kepegawaian</p>
                </div>
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                  <input
                    type="text"
                    placeholder="Cari layanan SIMPEG..."
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
                        <td className={`px-6 py-4 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{s.service}</td>
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
                    <Shield className="w-4 h-4 text-emerald-500" /> Feed Log Telemetri SIMPEG
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Audit Trail & Validasi Header</p>
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
            <p>© 2026 BKPSDM Kabupaten Penajam Paser Utara — SIMPEG Portal. Source: Postman Environment Specification.</p>
            <div className="flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Service Online (https://simpeg.penajamkab.go.id/)
              </span>
              <span>v4.3 BKPSDM-PPU</span>
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
