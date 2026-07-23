import { useState, useEffect } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, Sun, Moon, LayoutDashboard,
  Server, Users,
  Clock, CheckCircle, Search,
  UserCheck, Database, FileText, Download,
  ExternalLink, Building2, HeartHandshake,
  ArrowUpRight, ArrowDownRight, ChevronRight, Lock
} from "lucide-react";
import { RealtimeProvider, useRealtimeData, PegawaiASN } from "./context/RealtimeContext";

// ─── Utilities ──────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
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

// ─── Data Interfaces & Constants ─────────────────────────────────────────────

interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface ServiceItem {
  name: string;
  description: string;
  category: string;
  accessUrl: string;
}

const PUBLIC_SERVICES: ServiceItem[] = [
  {
    name: "SIMPEG Portal Utama PPU",
    description: "Sistem Informasi Kepegawaian Terpadu Kabupaten Penajam Paser Utara.",
    category: "Portal Utama",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan E-Kinerja ASN",
    description: "Pengisian dan pemantauan Sasaran Kinerja Pegawai (SKP) harian ASN PPU.",
    category: "Kinerja Pegawai",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Presensi Mobile ASN PPU",
    description: "Sistem absensi berbasis lokasi GPS dan pencatatan kehadiran pegawai.",
    category: "Kehadiran",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Kenaikan Pangkat (KP) Online",
    description: "Pengusulan Kenaikan Pangkat digital tanpa berkas fisik terintegrasi BKN.",
    category: "Karir & Pangkat",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Cuti Online ASN",
    description: "Pengajuan dan verifikasi cuti tahunan dan cuti alasan penting ASN PPU.",
    category: "Kepegawaian",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Pensiun & Gaji Berkala",
    description: "Pemrosesan penetapan pensiun dan Kenaikan Gaji Berkala (KGB) ASN PPU.",
    category: "Kesejahteraan",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
];

const OPD_DISTRIBUTION = [
  { name: "BKPSDM PPU", value: 1240, percent: "25%" },
  { name: "Diskominfo PPU", value: 890, percent: "18%" },
  { name: "Secretariat Daerah", value: 1120, percent: "23%" },
  { name: "Dinas Kesehatan", value: 950, percent: "19%" },
  { name: "Dinas Pendidikan", value: 740, percent: "15%" },
];

const CHART_COLORS = ["#2563EB", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

const PUBLIC_DATASETS = [
  {
    title: "Statistik Rekapitulasi ASN Penajam Paser Utara 2026",
    description: "Rekapitulasi jumlah PNS & PPPK berdasarkan Perangkat Daerah, Pendidikan, dan Golongan.",
    updated: "Juli 2026",
    fileSize: "2.4 MB",
  },
  {
    title: "Peta Jabatan & Bezetting Formasi ASN PPU",
    description: "Informasi peta jabatan dan ketersediaan formasi pegawai di Perangkat Daerah PPU.",
    updated: "Juni 2026",
    fileSize: "1.8 MB",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────

function KpiCard({ kpi, isDark }: { kpi: KPI; isDark: boolean }) {
  const up = kpi.change >= 0;

  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isDark
          ? "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
          : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${kpi.color}15` }}
        >
          <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          up
            ? isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
            : isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-700"
        }`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(kpi.change).toFixed(1)}%
        </div>
      </div>

      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {kpi.label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {fmt(kpi.value)}
        </span>
        <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{kpi.unit}</span>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Beranda Informasi" },
  { icon: HeartHandshake, label: "Layanan Kepegawaian" },
  { icon: UserCheck, label: "Verifikasi Status NIP" },
  { icon: Building2, label: "Statistik ASN PPU" },
  { icon: FileText, label: "Unduhan & Dataset" },
];

function Sidebar({ activeSection, setActiveSection, isDark }: { activeSection: string; setActiveSection: (s: string) => void; isDark: boolean }) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-64 shrink-0 border-r transition-colors ${
        isDark ? "border-slate-800/80 bg-slate-950" : "border-slate-200/80 bg-white"
      }`}
    >
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-6 h-20 border-b ${isDark ? "border-slate-800/80" : "border-slate-200/80"}`}>
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className={`text-sm font-extrabold tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>BKPSDM PPU</h2>
          <p className={`text-[11px] font-medium truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>Portal Kepegawaian</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.label)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? isDark
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                  : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? isDark ? "text-blue-400" : "text-blue-600" : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className={`p-4 m-3 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200/80 bg-slate-50"}`}>
        <p className={`text-xs font-bold truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>BKPSDM Kab. PPU</p>
        <p className={`text-[11px] mt-0.5 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>Penajam Paser Utara</p>
      </div>
    </aside>
  );
}

// ─── Public Verifikasi NIP Component ─────────────────────────────────────────

function PublicNipVerifier({ samplePegawai, isDark }: { samplePegawai?: PegawaiASN[]; isDark: boolean }) {
  const [nipInput, setNipInput] = useState("198501152010011002");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PegawaiASN | null>(null);

  const samples: PegawaiASN[] = samplePegawai || [
    { nip: "198501152010011002", nama: "Dr. H. Ahmad Fauzi, S.STP., M.Si", jabatan: "Kepala Dinas / Utama", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/b", status: "Aktif" },
    { nip: "199003202015022001", nama: "Siti Rahmah, S.Kom", jabatan: "Pranata Komputer Ahli Muda", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "III/c", status: "Aktif" },
    { nip: "197805102005011005", nama: "Bambang Setiawan, S.H., M.H.", jabatan: "Kabid Pengadaan & Mutasi", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
  ];

  const handleTestLookup = (selectedNip?: string) => {
    const targetNip = selectedNip || nipInput;
    setNipInput(targetNip);
    setLoading(true);

    setTimeout(() => {
      const match = samples.find((p) => p.nip === targetNip) || {
        nip: targetNip,
        nama: "Pegawai Negeri Sipil ASN PPU",
        jabatan: "Analis Kepegawaian Ahli",
        unitKerja: "Pemerintah Kabupaten Penajam Paser Utara",
        gol: "III/c",
        status: "Terverifikasi (PPU)"
      };
      setResult(match);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    handleTestLookup("198501152010011002");
  }, []);

  return (
    <div className={`rounded-2xl border p-6 space-y-5 transition-all ${
      isDark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200/80 bg-white shadow-sm"
    }`}>
      <div>
        <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <UserCheck className="w-5 h-5 text-blue-600" /> Cek Status NIP ASN Publik
        </h3>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Cek keabsahan status ASN di Kabupaten Penajam Paser Utara. Karakter sensitif disensor untuk melindungi privasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={nipInput}
              onChange={(e) => setNipInput(e.target.value)}
              placeholder="Masukkan NIP (Contoh: 198501152010011002)"
              className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-mono border focus:outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
              }`}
            />
            <button
              onClick={() => handleTestLookup()}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Cek..." : "Cek NIP"}
            </button>
          </div>

          <div>
            <p className={`text-[11px] font-medium mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Contoh NIP Pegawai PPU:</p>
            <div className="flex flex-wrap gap-2">
              {samples.map((p) => (
                <button
                  key={p.nip}
                  onClick={() => handleTestLookup(p.nip)}
                  className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    nipInput === p.nip
                      ? isDark ? "bg-blue-600/20 text-blue-400 border-blue-500/40 font-bold" : "bg-blue-50 text-blue-700 border-blue-300 font-bold"
                      : isDark ? "bg-slate-950 text-slate-400 border-slate-800 hover:text-white" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {maskNip(p.nip)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"
        }`}>
          {result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Terverifikasi ASN PPU
                </span>
                <span className={`text-[11px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>BKPSDM</span>
              </div>

              <div>
                <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Nama Pegawai (Sensored)</p>
                <p className={`text-sm font-bold mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>{maskNama(result.nama)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>NIP (Sensored)</p>
                  <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">{maskNip(result.nip)}</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Golongan</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{result.gol}</p>
                </div>
                <div className="col-span-2">
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Jabatan & Perangkat Daerah</p>
                  <p className={`text-xs mt-0.5 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {result.jabatan} — {result.unitKerja}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, energyChart, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Beranda Informasi");

  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "dark";

  // KPIs Definition for Clean Public View
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "asn", label: "Total Pegawai ASN & PPPK", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#2563EB" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit OPD", change: 0.0, icon: Building2, color: "#F59E0B" },
    { id: "services", label: "Layanan Publik Digital", value: 6, unit: "layanan", change: 5.0, icon: HeartHandshake, color: "#10B981" },
    { id: "status", label: "Status Portal BKPSDM", value: 100, unit: "% aktif", change: 0.0, icon: Server, color: "#06B6D4" },
  ]);

  // Sync metrics
  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    const citizens = metrics.find((m) => m.id === 'totalAsn');

    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === 'asn' && citizens) {
          return { ...k, value: citizens.numericValue };
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

  const displayHistory = (Array.isArray(energyChart) ? energyChart : []).map((pt) => ({
    t: pt.time || fmtTime(new Date()),
    energy: Math.round((pt.value || 50) * 300),
  }));

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 relative ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isDark={isDark} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top Header */}
        <header
          className={`flex items-center justify-between px-8 h-20 border-b shrink-0 transition-colors ${
            isDark
              ? "border-slate-800/80 bg-slate-950/90 text-white"
              : "border-slate-200/80 bg-white text-slate-900 shadow-sm"
          }`}
        >
          <div>
            <h1 className="text-base font-extrabold tracking-tight">BKPSDM Kabupaten Penajam Paser Utara</h1>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Portal Kepegawaian & Informasi Layanan Publik ASN
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Portal Aktif</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                isDark
                  ? "bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Gelap</span>
                </>
              )}
            </button>

            <div className={`text-right border-l pl-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <p className="text-sm font-extrabold tabular-nums">{fmtTime(time)}</p>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl">

          {/* Hero Banner */}
          <div className={`rounded-2xl p-6 border transition-all ${
            isDark
              ? "border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950 text-white"
              : "border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Portal Layanan & Informasi Kepegawaian PPU
                </h2>
                <p className={`text-xs leading-relaxed max-w-2xl ${isDark ? "text-slate-300" : "text-blue-100"}`}>
                  Akses resmi layanan Sistem Informasi Kepegawaian (SIMPEG), e-Kinerja, presensi mobile, serta verifikasi status ASN Kabupaten Penajam Paser Utara.
                </p>
              </div>

              <a
                href="https://simpeg.penajamkab.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm active:scale-95 ${
                  isDark
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-white text-blue-700 hover:bg-blue-50"
                }`}
              >
                <span>Akses SIMPEG PPU</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} isDark={isDark} />
            ))}
          </div>

          {/* Section 1: Layanan Kepegawaian */}
          {(activeSection === "Beranda Informasi" || activeSection === "Layanan Kepegawaian") && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Layanan Kepegawaian Digital PPU
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Modul layanan resmi bagi ASN Kabupaten Penajam Paser Utara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PUBLIC_SERVICES.map((item) => (
                  <div
                    key={item.name}
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-lg ${
                      isDark
                        ? "border-slate-800/80 bg-slate-900/60 hover:border-slate-700"
                        : "border-slate-200/80 bg-white hover:border-blue-300 shadow-sm"
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700 font-bold"
                      }`}>
                        {item.category}
                      </span>

                      <h4 className={`text-sm font-bold mt-3 mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</h4>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.description}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <a
                        href={item.accessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 text-xs"
                      >
                        Akses Layanan <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Cek Status NIP */}
          {(activeSection === "Beranda Informasi" || activeSection === "Verifikasi Status NIP") && (
            <PublicNipVerifier samplePegawai={samplePegawai} isDark={isDark} />
          )}

          {/* Section 3: Statistik ASN */}
          {(activeSection === "Beranda Informasi" || activeSection === "Statistik ASN PPU") && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div
                className={`xl:col-span-2 rounded-2xl p-6 border ${
                  isDark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200/80 bg-white shadow-sm"
                }`}
              >
                <h3 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Aktivitas Penggunaan Layanan PPU
                </h3>
                <p className={`text-xs mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Grafik aktivitas layanan harian pegawai</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={displayHistory}>
                    <defs>
                      <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="t" tick={{ fill: isDark ? "#64748B" : "#64748B", fontSize: 11 }} />
                    <YAxis tick={{ fill: isDark ? "#64748B" : "#64748B", fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip isDark={isDark} />} />
                    <Area type="monotone" dataKey="energy" name="Aktivitas" stroke="#2563EB" strokeWidth={2.5} fill="url(#trafficGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div
                className={`rounded-2xl p-6 border flex flex-col justify-between ${
                  isDark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200/80 bg-white shadow-sm"
                }`}
              >
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    Komposisi ASN per OPD PPU
                  </h3>
                  <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Persentase di OPD Utama</p>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie data={OPD_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                        {OPD_DISTRIBUTION.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip isDark={isDark} />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {OPD_DISTRIBUTION.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                      <span className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                        {d.name}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{d.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Dataset Unduhan */}
          {(activeSection === "Beranda Informasi" || activeSection === "Unduhan & Dataset") && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Unduhan & Dataset Publik
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Dokumen informasi statistik resmi kepegawaian Kabupaten Penajam Paser Utara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PUBLIC_DATASETS.map((ds) => (
                  <div
                    key={ds.title}
                    className={`p-6 rounded-2xl border flex flex-col justify-between ${
                      isDark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200/80 bg-white shadow-sm"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        {ds.fileSize}
                      </span>
                      <h4 className={`text-sm font-bold mt-3 mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{ds.title}</h4>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{ds.description}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Diperbarui: {ds.updated}</span>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Unduh PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className={`pt-6 pb-6 border-t flex items-center justify-between text-xs ${
            isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"
          }`}>
            <p>© 2026 Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Penajam Paser Utara.</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">simpeg.penajamkab.go.id</p>
          </footer>

        </main>
      </div>
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
