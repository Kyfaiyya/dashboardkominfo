import { useState, useEffect } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, Bell, ChevronUp, ChevronDown,
  Globe, LayoutDashboard, Sun, Moon,
  Server, Shield, Users, Lock,
  Clock, CheckCircle, Search, Sparkles, Check,
  UserCheck, Database, FileText, Download,
  ExternalLink, Building2, Award, HeartHandshake
} from "lucide-react";
import { RealtimeProvider, useRealtimeData, PegawaiASN } from "./context/RealtimeContext";
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

interface ServiceItem {
  name: string;
  description: string;
  category: string;
  status: "Beroperasi Normal" | "Pemeliharaan";
  accessUrl: string;
}

const PUBLIC_SERVICES: ServiceItem[] = [
  {
    name: "SIMPEG Portal Utama PPU",
    description: "Sistem Informasi Kepegawaian Terpadu Kabupaten Penajam Paser Utara untuk pengelolaan data ASN.",
    category: "Layanan Utama",
    status: "Beroperasi Normal",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan E-Kinerja ASN",
    description: "Pengisian dan pemantauan Sasaran Kinerja Pegawai (SKP) serta capaian harian ASN PPU.",
    category: "Kinerja Pegawai",
    status: "Beroperasi Normal",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Presensi Mobile ASN PPU",
    description: "Sistem absensi berbasis lokasi GPS dan pemantauan kehadiran harian pegawai.",
    category: "Kehadiran",
    status: "Beroperasi Normal",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Kenaikan Pangkat (KP) Online",
    description: "Layanan pengusulan Kenaikan Pangkat digital tanpa berkas fisik terintegrasi BKN.",
    category: "Karir & Pangkat",
    status: "Beroperasi Normal",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Cuti Online ASN",
    description: "Pengajuan dan verifikasi cuti tahunan, sakit, dan alasan penting bagi ASN PPU.",
    category: "Kepegawaian",
    status: "Beroperasi Normal",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Pensiun & Gaji Berkala",
    description: "Pemrosesan penetapan pensiun dan Kenaikan Gaji Berkala (KGB) pegawai.",
    category: "Kesejahteraan",
    status: "Beroperasi Normal",
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

const CHART_COLORS = ["#3B82F6", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

const PUBLIC_DATASETS = [
  {
    title: "Statistik Rekapitulasi ASN Kabupaten Penajam Paser Utara 2026",
    description: "Data rekapitulasi jumlah PNS dan PPPK berdasarkan OPD, Tingkat Pendidikan, dan Golongan.",
    updated: "Juli 2026",
    fileSize: "2.4 MB",
    format: "PDF / Excel",
  },
  {
    title: "Peta Jabatan & Bezetting Formasi Pegawai PPU",
    description: "Informasi peta jabatan, ketersediaan formasi, dan kebutuhan ASN di Perangkat Daerah PPU.",
    updated: "Juni 2026",
    fileSize: "1.8 MB",
    format: "PDF",
  },
];

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
      {isRealtime ? 'PORTAL PUBLIK AKTIF' : 'PEMELIHARAAN...'}
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
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Informasi Resmi PPU
        </span>
        <span className="text-cyan-500 font-mono font-bold">TERKINI</span>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Beranda Informasi", count: "Utama" },
  { icon: HeartHandshake, label: "Layanan Kepegawaian", count: "6 Layanan" },
  { icon: UserCheck, label: "Verifikasi Status NIP", count: "Publik" },
  { icon: Building2, label: "Statistik ASN PPU", count: "34 OPD" },
  { icon: FileText, label: "Unduhan & Dataset", count: "Publik" },
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
          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mt-1 truncate">Portal Publik Resmi</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Menu Informasi Publik</p>
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

      {/* Official Contact Box */}
      <div className={`p-4 m-4 rounded-2xl border ${isDark ? "border-cyan-500/30 bg-cyan-950/20" : "border-blue-200 bg-blue-50"}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${isDark ? "text-cyan-300" : "text-blue-900"}`}>BKPSDM Kab. Penajam Paser Utara</p>
            <p className={`text-[10px] truncate ${isDark ? "text-cyan-400/80" : "text-blue-700"}`}>Pemerintah Kabupaten PPU</p>
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
    }, 500);
  };

  useEffect(() => {
    handleTestLookup("198501152010011002");
  }, []);

  return (
    <div className={`rounded-2xl border p-6 space-y-6 backdrop-blur-xl transition-all ${
      isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-lg"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Pengecekan Status Keabsahan NIP ASN Publik</h3>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
              isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border-emerald-300"
            }`}>
              🔒 Data Disensor untuk Privasi
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Masukkan NIP Pegawai untuk memverifikasi keaktifan status ASN di Pemerintah Kabupaten Penajam Paser Utara.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold mb-1.5 block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Ketik Nomor Induk Pegawai (NIP):
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
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Cek Keabsahan NIP"}
              </button>
            </div>
          </div>

          <div>
            <p className={`text-[11px] font-semibold mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Contoh NIP Pegawai PPU:</p>
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
                  {maskNip(p.nip)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Public Response Output */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          isDark ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-200"
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Hasil Verifikasi Status NIP
              </span>
              <span className={`text-[10px] font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>Portal Publik PPU</span>
            </div>

            {result ? (
              <div className="space-y-3">
                <div>
                  <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Nama Pegawai (Sensored)</p>
                  <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {maskNama(result.nama)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>NIP (Sensored)</p>
                    <p className="text-xs font-mono font-bold text-cyan-500">
                      {maskNip(result.nip)}
                    </p>
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
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>Perangkat Daerah (OPD)</p>
                    <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.unitKerja}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"}`}>
            <span>Status Verifikasi: <strong className="text-emerald-500">PNS / PPPK Aktif Pemkab PPU</strong></span>
            <span>BKPSDM PPU</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, energyChart, trafficChart, connectionStatus, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Beranda Informasi");
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

  // KPIs Definition for Public View
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "asn", label: "Total Pegawai ASN & PPPK", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#3B82F6", glow: "#3B82F6", category: "Statistik ASN PPU" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit OPD", change: 0.0, icon: Building2, color: "#F59E0B", glow: "#F59E0B", category: "Statistik ASN PPU" },
    { id: "services", label: "Layanan Publik Digital", value: 6, unit: "layanan", change: 5.0, icon: HeartHandshake, color: "#10B981", glow: "#10B981", category: "Layanan Kepegawaian" },
    { id: "status", label: "Status Portal BKPSDM", value: 100, unit: "% aktif", change: 0.0, icon: Server, color: "#06B6D4", glow: "#06B6D4", category: "Beranda Informasi" },
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

  // Sync rolling timeline data for charts
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

  const filteredKpis = activeSection === "Beranda Informasi"
    ? kpis
    : kpis.filter((k) => k.category === activeSection || activeSection === "Beranda Informasi");

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
                <h1 className="text-lg font-black tracking-wide">Portal Informasi Publik BKPSDM PPU</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
                }`}>
                  {activeSection.toUpperCase()}
                </span>
              </div>
              <p className={`text-xs mt-0.5 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <span>Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Penajam Paser Utara</span>
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
              title="Pilih Mode Terang / Gelap"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Mode Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span>Mode Gelap</span>
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
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Public Hero Banner */}
          <div className={`rounded-3xl p-6 border backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl ${
            isDark
              ? "border-cyan-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900/90 to-cyan-950/50 text-white"
              : "border-blue-200 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white shadow-lg"
          }`}>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl border shrink-0 ${
                isDark ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-white/20 text-white border-white/30"
              }`}>
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-wide">
                  Pusat Layanan & Informasi Kepegawaian PPU
                </h2>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? "text-slate-300" : "text-blue-100"}`}>
                  Portal resmi publik Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Penajam Paser Utara. Menyediakan akses layanan SIMPEG, statistik ASN, dan verifikasi status pegawai.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://simpeg.penajamkab.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isDark
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    : "bg-white text-blue-700 hover:bg-blue-50"
                }`}
              >
                <span>Akses SIMPEG PPU</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Public KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} isDark={isDark} />
            ))}
          </div>

          {/* Section: Layanan Kepegawaian Publik */}
          {(activeSection === "Beranda Informasi" || activeSection === "Layanan Kepegawaian") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-extrabold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <HeartHandshake className="w-5 h-5 text-cyan-500" /> Layanan Kepegawaian Digital PPU
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Modul layanan resmi bagi Pegawai Negeri Sipil dan PPPK Kabupaten Penajam Paser Utara.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PUBLIC_SERVICES.map((item) => (
                  <div
                    key={item.name}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xl ${
                      isDark
                        ? "border-white/10 bg-slate-900/70 hover:border-cyan-500/40"
                        : "border-slate-200 bg-white/90 shadow-sm hover:border-blue-400"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDark ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-blue-100 text-blue-800 border-blue-300"
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {item.status}
                        </span>
                      </div>

                      <h4 className={`text-sm font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</h4>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.description}</p>
                    </div>

                    <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
                      isDark ? "border-white/5" : "border-slate-100"
                    }`}>
                      <a
                        href={item.accessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 font-bold hover:underline flex items-center gap-1 text-xs"
                      >
                        Buka Layanan <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Verifikasi NIP Publik */}
          {(activeSection === "Beranda Informasi" || activeSection === "Verifikasi Status NIP") && (
            <PublicNipVerifier samplePegawai={samplePegawai} isDark={isDark} />
          )}

          {/* Section: Statistik ASN & OPD PPU */}
          {(activeSection === "Beranda Informasi" || activeSection === "Statistik ASN PPU") && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Chart Aktivitas Layanan Publik */}
              <div
                className={`xl:col-span-2 rounded-2xl p-6 border backdrop-blur-xl ${
                  isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      <Activity className="w-4 h-4 text-cyan-500" /> Tren Penggunaan Layanan Kepegawaian PPU
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Aktivitas pengisian E-Kinerja, Presensi, dan Pengusulan Berkas ASN</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={displayHistory}>
                    <defs>
                      <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"} />
                    <XAxis dataKey="t" tick={{ fill: isDark ? "#64748B" : "#475569", fontSize: 11 }} />
                    <YAxis tick={{ fill: isDark ? "#64748B" : "#475569", fontSize: 11 }} />
                    <Tooltip content={<ChartTooltip isDark={isDark} />} />
                    <Area type="monotone" dataKey="energy" name="Aktivitas Pegawai" stroke="#3B82F6" strokeWidth={2.5} fill="url(#trafficGrad)" />
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
                    <PieChart className="w-4 h-4 text-purple-500" /> Komposisi ASN per Perangkat Daerah
                  </h3>
                  <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Proporsi Pegawai Negeri Sipil & PPPK</p>
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
          )}

          {/* Section: Dataset Publik & Unduhan */}
          {(activeSection === "Beranda Informasi" || activeSection === "Unduhan & Dataset") && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <FileText className="w-5 h-5 text-cyan-500" /> Unduhan Publik & Dataset Rekapitulasi ASN
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Dokumen informasi publik dan statistik resmi kepegawaian Kabupaten Penajam Paser Utara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PUBLIC_DATASETS.map((ds) => (
                  <div
                    key={ds.title}
                    className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col justify-between ${
                      isDark ? "border-white/10 bg-slate-900/70" : "border-slate-200 bg-white/90 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}>
                          {ds.format}
                        </span>
                        <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Terakhir diperbarui: {ds.updated}</span>
                      </div>

                      <h4 className={`text-sm font-bold mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{ds.title}</h4>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{ds.description}</p>
                    </div>

                    <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
                      isDark ? "border-white/5" : "border-slate-100"
                    }`}>
                      <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Ukuran File: {ds.fileSize}</span>
                      <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className={`flex items-center justify-between text-xs pt-4 pb-6 border-t ${
            isDark ? "border-white/5 text-slate-500" : "border-slate-200 text-slate-500"
          }`}>
            <p>© 2026 Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Penajam Paser Utara.</p>
            <div className="flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Portal Publik Resmi PPU
              </span>
              <span>v5.1 BKPSDM-Public</span>
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
