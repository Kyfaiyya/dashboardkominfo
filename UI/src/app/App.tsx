import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, AlertTriangle, Bell, ChevronUp, ChevronDown,
  Cpu, Database, Globe, LayoutDashboard, Map, Radio,
  Server, Shield, Users, Wifi, Zap,
  Clock, CheckCircle, XCircle, AlertCircle, Eye, Settings,
  Search, RefreshCw, Layers, Sparkles, Filter, Check, TrendingUp
} from "lucide-react";
import { RealtimeProvider, useRealtimeData } from "./context/RealtimeContext";
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

const DISTRICT_DATA = [
  { name: "Pusat", value: 2341, percent: "28%" },
  { name: "Utara", value: 1892, percent: "23%" },
  { name: "Selatan", value: 2105, percent: "25%" },
  { name: "Timur", value: 1643, percent: "19%" },
  { name: "Barat", value: 1788, percent: "21%" },
];

const CHART_COLORS = ["#3B82F6", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

// ─── Sub-components ───────────────────────────────────────────────────────

function LiveBadge({ isRealtime }: { isRealtime?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md transition-all ${
      isRealtime
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        : 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
    }`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRealtime ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtime ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </span>
      {isRealtime ? 'REALTIME STREAM ACTIVE' : 'RECONNECTING...'}
    </div>
  );
}

function AlertIcon({ level }: { level: Alert["level"] }) {
  const map = {
    critical: { Icon: XCircle, color: "text-red-400 bg-red-500/10 border-red-500/20" },
    warning: { Icon: AlertCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    info: { Icon: AlertCircle, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    ok: { Icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  };
  const { Icon, color } = map[level];
  return (
    <div className={`p-1.5 rounded-lg border ${color}`}>
      <Icon className="w-4 h-4 shrink-0" />
    </div>
  );
}

function StatusPill({ status }: { status: ServiceRow["status"] }) {
  const map = {
    online: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
    degraded: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    offline: "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${map[status]}`}>
      ● {status.toUpperCase()}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KPI }) {
  const up = kpi.change >= 0;
  const pct = Math.abs(kpi.change).toFixed(1);

  return (
    <div
      className="relative rounded-2xl p-5 border overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-500/30"
      style={{
        background: "linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(11, 15, 25, 0.9) 100%)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Ambient glowing spotlight */}
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
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {pct}%
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-1 font-semibold tracking-wider uppercase">{kpi.label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
          {fmt(kpi.value)}
        </span>
        <span className="text-xs font-medium text-slate-400">{kpi.unit}</span>
      </div>

      {/* Decorative Sparkline Line */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Sensor Stream
        </span>
        <span className="text-cyan-400/80 font-mono font-semibold">LIVE</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", count: "8" },
  { icon: Activity, label: "Lalu Lintas", count: "Live" },
  { icon: Zap, label: "Energi", count: "MWh" },
  { icon: Users, label: "Kependudukan", count: "2.1M" },
  { icon: Shield, label: "Keamanan", count: "OK" },
  { icon: Server, label: "Infrastruktur", count: "99.9%" },
];

function Sidebar({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (s: string) => void }) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 relative z-20"
      style={{
        background: "linear-gradient(180deg, rgba(13, 21, 37, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 px-6 h-20 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white tracking-wide leading-none">SmartCity</h2>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-1">AI Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Main Navigation</p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-500"
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 m-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin Pusat</p>
            <p className="text-[10px] text-slate-400 truncate">admin@smartcity.go.id</p>
          </div>
          <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </aside>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 px-4 py-3 text-xs shadow-2xl backdrop-blur-xl bg-slate-900/90 space-y-1">
      <p className="text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1">
        <Clock className="w-3 h-3 text-cyan-400" /> {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}:
          </span>
          <span className="font-bold text-white tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, energyChart, trafficChart, connectionStatus } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Overview");
  const [searchService, setSearchService] = useState("");
  const [realtimeHistory, setRealtimeHistory] = useState<TimePoint[]>([]);

  // Services State (Dynamic & Searchable)
  const [services] = useState<ServiceRow[]>([
    { service: "Sistem KTP Digital", requests: 12430, uptime: 99.97, latency: 42, status: "online", category: "Kependudukan" },
    { service: "Portal Izin Usaha", requests: 8761, uptime: 99.82, latency: 67, status: "online", category: "Infrastruktur" },
    { service: "e-Kesehatan Kota", requests: 23100, uptime: 99.55, latency: 88, status: "online", category: "Kependudukan" },
    { service: "BPHTB Online", requests: 4320, uptime: 98.41, latency: 112, status: "degraded", category: "Energi" },
    { service: "Sistem Lapor Warga", requests: 6540, uptime: 99.91, latency: 55, status: "online", category: "Keamanan" },
    { service: "e-Pengadaan Barang", requests: 2110, uptime: 97.30, latency: 143, status: "degraded", category: "Infrastruktur" },
  ]);

  // Alerts Feed State
  const [alerts] = useState<Alert[]>([
    { id: 1, level: "ok", message: "Backup database TimescaleDB berhasil diselesaikan", source: "DataCenter-01", ts: "14:00:12" },
    { id: 2, level: "info", message: "Stream data Socket.IO pub/sub aktif berkecepatan 30s", source: "Redis-PubSub", ts: "14:01:05" },
    { id: 3, level: "warning", message: "Lonjakan beban jaringan terdeteksi di Zona Pusat", source: "Network-Ops", ts: "14:02:18" },
    { id: 4, level: "ok", message: "Sertifikat TLS/SSL diperbarui otomatis", source: "Security-GW", ts: "14:03:00" },
    { id: 5, level: "info", message: "2.840 verifikasi warga baru selesai diproses", source: "Portal-KTP", ts: "14:04:45" },
  ]);

  // Initial KPIs Definition
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "citizens", label: "Warga Aktif Online", value: 0, unit: "warga", change: 3.2, icon: Users, color: "#3B82F6", glow: "#3B82F6", category: "Kependudukan" },
    { id: "traffic", label: "Lalu Lintas Kendaraan", value: 0, unit: "kend/jam", change: -1.8, icon: Activity, color: "#06B6D4", glow: "#06B6D4", category: "Lalu Lintas" },
    { id: "energy", label: "Konsumsi Energi", value: 0, unit: "MWh", change: 2.1, icon: Zap, color: "#F59E0B", glow: "#F59E0B", category: "Energi" },
    { id: "incidents", label: "Insiden Aktif", value: 0, unit: "kasus", change: -12.5, icon: AlertTriangle, color: "#EF4444", glow: "#EF4444", category: "Keamanan" },
    { id: "uptime", label: "Uptime Layanan", value: 99.94, unit: "%", change: 0.02, icon: Server, color: "#10B981", glow: "#10B981", category: "Infrastruktur" },
    { id: "requests", label: "API Requests", value: 0, unit: "req/hr", change: 8.7, icon: Radio, color: "#8B5CF6", glow: "#8B5CF6", category: "Infrastruktur" },
    { id: "wifi", label: "Titik WiFi Publik", value: 0, unit: "aktif", change: 0.4, icon: Wifi, color: "#EC4899", glow: "#EC4899", category: "Infrastruktur" },
    { id: "cpu", label: "Beban Server", value: 0, unit: "%", change: 5.1, icon: Cpu, color: "#F97316", glow: "#F97316", category: "Infrastruktur" },
  ]);

  // Sync realtime metrics from Socket.IO backend into KPI state
  useEffect(() => {
    if (!metrics || metrics.length === 0) return;

    const energy = metrics.find((m) => m.id === 'energy');
    const water = metrics.find((m) => m.id === 'water');
    const air = metrics.find((m) => m.id === 'air');
    const citizens = metrics.find((m) => m.id === 'citizens');

    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === 'energy' && energy) {
          return { ...k, value: Math.round(energy.numericValue * 8), change: parseFloat(energy.trend) || 2.5 };
        }
        if (k.id === 'citizens' && citizens) {
          return { ...k, value: Math.round(citizens.numericValue / 40), change: parseFloat(citizens.trend) || 3.1 };
        }
        if (k.id === 'incidents' && air) {
          return { ...k, value: Math.round(air.numericValue / 6) };
        }
        if (k.id === 'traffic' && water) {
          return { ...k, value: Math.round(water.numericValue * 300) };
        }
        if (k.id === 'requests' && energy) {
          return { ...k, value: Math.round(energy.numericValue * 15000) };
        }
        if (k.id === 'wifi' && citizens) {
          return { ...k, value: Math.round(citizens.numericValue / 1700) };
        }
        if (k.id === 'cpu' && air) {
          return { ...k, value: Math.round(air.numericValue * 1.2) };
        }
        return k;
      })
    );
  }, [metrics]);

  // Update clock time every second
  useEffect(() => {
    const clock = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  // Sync rolling realtime timeline for charts
  useEffect(() => {
    if ((!energyChart || energyChart.length === 0) && (!metrics || metrics.length === 0)) return;

    const timeStr = fmtTime(new Date());
    const energyVal = metrics.find((m) => m.id === 'energy')?.numericValue || 50;
    const waterVal = metrics.find((m) => m.id === 'water')?.numericValue || 80;
    const citizensVal = metrics.find((m) => m.id === 'citizens')?.numericValue || 2100000;
    const airVal = metrics.find((m) => m.id === 'air')?.numericValue || 40;

    const newPoint: TimePoint = {
      t: timeStr,
      energy: Math.round(energyVal * 8),
      traffic: Math.round(waterVal * 300),
      citizens: Math.round(citizensVal / 400),
      incidents: Math.round(airVal / 6),
    };

    setRealtimeHistory((prev) => {
      if (prev.length === 0 && Array.isArray(energyChart) && energyChart.length > 0) {
        return energyChart.map((pt, i) => ({
          t: pt.time || timeStr,
          energy: Math.round((pt.value || 50) * 8),
          traffic: Math.round((trafficChart[i]?.count || 400) * 50),
          citizens: Math.round((pt.value || 50) * 120),
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
        energy: Math.round((pt.value || 0) * 8),
        traffic: (Array.isArray(trafficChart) && trafficChart[i] ? trafficChart[i].count * 50 : (pt.value || 0) * 500),
        citizens: Math.round((pt.value || 0) * 120),
        incidents: Math.round((pt.value || 0) / 10),
      }));

  // Filtered Services based on search
  const filteredServices = services.filter((s) =>
    s.service.toLowerCase().includes(searchService.toLowerCase()) ||
    s.category.toLowerCase().includes(searchService.toLowerCase())
  );

  // Filtered KPIs based on active section
  const filteredKpis = activeSection === "Overview"
    ? kpis
    : kpis.filter((k) => k.category === activeSection || activeSection === "Overview");

  return (
    <div
      className="flex h-screen overflow-hidden text-slate-100 relative"
      style={{ background: "radial-gradient(ellipse at top, #0F172A 0%, #080C14 100%)" }}
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <header
          className="flex items-center justify-between px-8 h-20 border-b border-white/10 shrink-0"
          style={{
            background: "rgba(11, 15, 25, 0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-wide">Command Center Operations</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {activeSection.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Pemantauan Real-Time Telemetri Kota</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Redis + TimescaleDB Synced
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <LiveBadge isRealtime={connectionStatus === 'connected'} />

            <div className="text-right border-l border-white/10 pl-6">
              <p className="text-base font-extrabold text-white tabular-nums tracking-wider">{fmtTime(time)}</p>
              <p className="text-[11px] text-slate-400">
                {time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-4 bg-red-500 rounded-full animate-ping" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Banner Live Ticker */}
          <div className="rounded-2xl p-4 border border-cyan-500/30 bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-cyan-900/30 backdrop-blur-xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <span>AI Telemetry Engine — System Operating Normally</span>
                  <span className="text-cyan-400 font-mono text-[10px]">[POLL CRON: 30s]</span>
                </p>
                <p className="text-[11px] text-slate-400">Pembaruan otomatis dari Socket.IO Server & TimescaleDB Hypertable.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('/api/trigger', '_blank')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trigger Test Stream
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredKpis.slice(0, 8).map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Main Area Chart — Lalu Lintas & Warga */}
            <div
              className="xl:col-span-2 rounded-2xl p-6 border border-white/10 backdrop-blur-xl"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Lalu Lintas Kendaraan & Aktivitas Warga
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Realtime rolling timeline (diperbarui otomatis dari Socket.IO)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-2 text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Kendaraan
                  </span>
                  <span className="flex items-center gap-2 text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Warga
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="t" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="traffic" name="Kendaraan" stroke="#3B82F6" strokeWidth={2.5} fill="url(#trafficGrad)" />
                  <Area type="monotone" dataKey="citizens" name="Warga" stroke="#06B6D4" strokeWidth={2.5} fill="url(#citizensGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart — Distribusi Wilayah */}
            <div
              className="rounded-2xl p-6 border border-white/10 backdrop-blur-xl flex flex-col justify-between"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                  <PieChart className="w-4 h-4 text-purple-400" /> Distribusi Wilayah
                </h3>
                <p className="text-xs text-slate-400 mb-4">Persentase aktivitas per zona kota</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={DISTRICT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={78} dataKey="value" stroke="none">
                      {DISTRICT_DATA.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                {DISTRICT_DATA.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                      {d.name}
                    </span>
                    <span className="text-cyan-400 tabular-nums">{d.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart & Line Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Energy Bar Chart */}
            <div
              className="rounded-2xl p-6 border border-white/10 backdrop-blur-xl"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-400" /> Konsumsi Energi (MWh)
              </h3>
              <p className="text-xs text-slate-400 mb-6">Beban energi kota per interval waktu</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={displayHistory} barSize={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="energy" name="Energi" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Incidents Line Chart */}
            <div
              className="rounded-2xl p-6 border border-white/10 backdrop-blur-xl"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Insiden & Keamanan Kota
              </h3>
              <p className="text-xs text-slate-400 mb-6">Jumlah insiden aktif terpantau sensor</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={displayHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="t" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="incidents" name="Insiden" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table & Alert Stream */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* Digital Services Table */}
            <div
              className="xl:col-span-3 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" /> Telemetri Layanan Digital
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Status dan latensi server publik</p>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari layanan..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className="pl-8 pr-4 py-1.5 rounded-xl text-xs bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40">
                      {["Layanan", "Category", "Req/jam", "Uptime", "Latensi", "Status"].map((h) => (
                        <th key={h} className="text-left px-6 py-3.5 text-slate-400 font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredServices.map((s) => (
                      <tr key={s.service} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4 text-white font-bold">{s.service}</td>
                        <td className="px-6 py-4 text-slate-400">{s.category}</td>
                        <td className="px-6 py-4 text-slate-300 font-mono font-semibold">{s.requests.toLocaleString()}</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">{s.uptime.toFixed(2)}%</td>
                        <td className="px-6 py-4 font-mono">
                          <span className={s.latency < 80 ? "text-emerald-400" : "text-amber-400"}>
                            {s.latency}ms
                          </span>
                        </td>
                        <td className="px-6 py-4"><StatusPill status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Realtime Alert Stream */}
            <div
              className="xl:col-span-2 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> Feed Notifikasi Realtime
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sistem & Keamanan Cyber</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                    <AlertIcon level={alert.level} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 font-semibold leading-tight">{alert.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        <span className="text-cyan-400 font-mono">{alert.source}</span>
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
          <footer className="flex items-center justify-between text-xs text-slate-500 pt-4 pb-6 border-t border-white/5">
            <p>© 2026 Pemerintah Kota — SmartCity Command Center. Integrated via Socket.IO & TimescaleDB.</p>
            <div className="flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
              </span>
              <span>v4.0 CyberGlass</span>
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
