import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Heart,
  Wallet,
  Building2,
  MapPin,
  ExternalLink,
  BookOpen,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  Filter,
  FileText,
  Layers,
  Activity,
  Globe,
  Home,
  Percent,
  Scale,
  Download,
  Lock,
  ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useAuth } from "../../context/AuthContext";

interface BpsPageProps {
  isDark: boolean;
  tabConfigs?: Record<string, Record<string, boolean>>;
}

export function BpsPage({ isDark, tabConfigs }: BpsPageProps) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const bpsRules = tabConfigs?.["BPS PPU"] || {};

  const isUtamaLocked = !isLoggedIn && bpsRules["utama"] === false;
  const isDemografiLocked = !isLoggedIn && bpsRules["demografi"] === false;
  const isEkonomiLocked = !isLoggedIn && bpsRules["ekonomi"] === false;

  const [brsFilter, setBrsFilter] = useState("Semua");
  const [searchBrs, setSearchBrs] = useState("");

const INDIKATOR_STRATEGIS = {
  ipm: { value: 73.90, prev: 73.30, year: 2024, delta: 0.60, unit: "", category: "Tinggi" },
  uhh: { value: 74.27, prev: 74.03, year: 2024, delta: 0.24, unit: "Tahun" },
  rataLamaSekolah: { value: 8.57, prev: 8.44, year: 2024, delta: 0.13, unit: "Tahun" },
  pengeluaranPerKapita: { value: 13100, prev: 12800, year: 2024, delta: 300, unit: "Ribu Rp/Kapita" },
  pertumbuhanEkonomi: { value: 30.68, prev: 19.9, year: 2024, delta: 10.78, unit: "%" },
  penduduk: { value: 202067, prev: 181377, year: 2024, delta: 20690, unit: "Jiwa" },
  lajuPenduduk: { value: 11.38, prev: 3.2, year: 2024, delta: 8.18, unit: "%" },
  kemiskinan: { value: 6.69, prev: 6.97, year: 2024, delta: -0.28, unit: "%" },
  tpt: { value: 2.05, prev: 2.5, year: 2024, delta: -0.45, unit: "%" },
  giniRatio: { value: 0.258, prev: 0.299, year: 2024, delta: -0.041, unit: "" },
  pdrb: { value: 17.25, prev: 14.1, year: 2023, delta: 3.15, unit: "Triliun Rp" },
};

// IPM Trend Series (BPS Data 2019-2024)
const IPM_TREND = [
  { year: "2019", ipm: 71.50 },
  { year: "2020", ipm: 71.23 },
  { year: "2021", ipm: 71.83 },
  { year: "2022", ipm: 72.56 },
  { year: "2023", ipm: 73.30 },
  { year: "2024", ipm: 73.90 },
];

// Kemiskinan Trend
const KEMISKINAN_TREND = [
  { year: "2019", persen: 7.92 },
  { year: "2020", persen: 7.60 },
  { year: "2021", persen: 7.44 },
  { year: "2022", persen: 7.18 },
  { year: "2023", persen: 6.97 },
  { year: "2024", persen: 6.69 },
];

// Pertumbuhan Ekonomi Trend
const PERTUMBUHAN_EKONOMI_TREND = [
  { year: "2019", growth: 3.84 },
  { year: "2020", growth: -1.45 },
  { year: "2021", growth: 2.15 },
  { year: "2022", growth: 7.32 },
  { year: "2023", growth: 19.90 },
  { year: "2024", growth: 30.68 },
];

// Penduduk per Kecamatan 2024
const PENDUDUK_KECAMATAN = [
  { kecamatan: "Penajam", jumlah: 101222, lk: 52234, pr: 48988, luas: 432.05, kepadatan: 234 },
  { kecamatan: "Sepaku", jumlah: 41677, lk: 21865, pr: 19812, luas: 591.95, kepadatan: 70 },
  { kecamatan: "Babulu", jumlah: 39848, lk: 20734, pr: 19114, luas: 286.20, kepadatan: 139 },
  { kecamatan: "Waru", jumlah: 19320, lk: 10172, pr: 9148, luas: 892.56, kepadatan: 22 },
];

// Struktur Umur Penduduk
const STRUKTUR_UMUR = [
  { kelompok: "0-14 Tahun (Anak-anak)", persen: 25.71, color: "#3B82F6" },
  { kelompok: "15-59 Tahun (Produktif)", persen: 65.81, color: "#10B981" },
  { kelompok: "60+ Tahun (Lansia)", persen: 8.48, color: "#F59E0B" },
];

// Sektor PDRB PPU
const SEKTOR_PDRB = [
  { sektor: "Konstruksi", kontribusi: 73.83, color: "#2563EB" },
  { sektor: "Pertambangan & Penggalian", kontribusi: 8.5, color: "#10B981" },
  { sektor: "Pertanian, Kehutanan, Perikanan", kontribusi: 5.2, color: "#F59E0B" },
  { sektor: "Perdagangan Besar & Eceran", kontribusi: 3.8, color: "#8B5CF6" },
  { sektor: "Transportasi & Pergudangan", kontribusi: 2.9, color: "#EF4444" },
  { sektor: "Akomodasi & Makan Minum", kontribusi: 2.1, color: "#EC4899" },
  { sektor: "Jasa Lainnya", kontribusi: 3.67, color: "#6B7280" },
];

// Radar IPM Dimensions
const IPM_RADAR = [
  { dimension: "UHH (74.27 th)", value: 74.27, fullMark: 85 },
  { dimension: "HLS (13.2 th)", value: 73, fullMark: 100 },
  { dimension: "RLS (8.57 th)", value: 57, fullMark: 100 },
  { dimension: "Pengeluaran/Kap", value: 69, fullMark: 100 },
];

// Berita Resmi Statistik Terbaru
const BRS_TERBARU = [
  {
    judul: "Perkembangan Indeks Harga Konsumen (IHK) Kabupaten Penajam Paser Utara Januari 2025",
    nomor: "No. 02/02/6409/Th. II",
    tanggal: "Februari 2025",
    kategori: "Inflasi & IHK",
  },
  {
    judul: "Indeks Pembangunan Manusia (IPM) Kab. Penajam Paser Utara 2024",
    nomor: "No. 01/01/6409/Th. II",
    tanggal: "Januari 2025",
    kategori: "Sosial & Kependudukan",
  },
  {
    judul: "Profil Kemiskinan Kabupaten Penajam Paser Utara September 2024",
    nomor: "No. 12/12/6409/Th. I",
    tanggal: "Desember 2024",
    kategori: "Kemiskinan",
  },
  {
    judul: "Keadaan Ketenagakerjaan Kabupaten Penajam Paser Utara Agustus 2024",
    nomor: "No. 11/11/6409/Th. I",
    tanggal: "November 2024",
    kategori: "Ketenagakerjaan",
  },
  {
    judul: "Pertumbuhan Ekonomi Kabupaten Penajam Paser Utara Triwulan III 2024",
    nomor: "No. 10/11/6409/Th. I",
    tanggal: "November 2024",
    kategori: "Ekonomi & PDRB",
  },
  {
    judul: "Perkembangan Pariwisata Kabupaten Penajam Paser Utara 2024",
    nomor: "No. 09/10/6409/Th. I",
    tanggal: "Oktober 2024",
    kategori: "Pariwisata",
  },
];

// Publikasi Unggulan
const PUBLIKASI_UNGGULAN = [
  {
    judul: "Kabupaten Penajam Paser Utara Dalam Angka 2025",
    deskripsi: "Kompilasi data statistik komprehensif seluruh sektor di Kabupaten PPU tahun data 2024.",
    tahun: "2025",
    url: "https://ppukab.bps.go.id/id/publication",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
  },
  {
    judul: "Statistik Daerah Kab. Penajam Paser Utara 2024",
    deskripsi: "Ringkasan statistik tematik mengenai kondisi sosial, ekonomi, & infrastruktur PPU.",
    tahun: "2024",
    url: "https://ppukab.bps.go.id/id/publication",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
  },
  {
    judul: "Kecamatan Sepaku Dalam Angka 2025",
    deskripsi: "Data statistik kecamatan Sepaku, wilayah inti IKN Nusantara & kawasan strategis nasional.",
    tahun: "2025",
    url: "https://ppukab.bps.go.id/id/publication",
    icon: MapPin,
    color: "from-violet-500 to-purple-600",
  },
  {
    judul: "Indikator Ekonomi Kab. Penajam Paser Utara 2024",
    deskripsi: "Data PDRB, inflasi, ekspor-impor, tenaga kerja, dan indeks ekonomi daerah PPU.",
    tahun: "2024",
    url: "https://ppukab.bps.go.id/id/publication",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
  },
];

  const exportBpsToCSV = () => {
    const headers = ["Kecamatan,Jumlah Penduduk (Jiwa),Laki-laki,Perempuan,Luas Wilayah (km2),Kepadatan (/km2)"];
    const rows = PENDUDUK_KECAMATAN.map((k) =>
      `"${k.kecamatan}",${k.jumlah},${k.lk},${k.pr},${k.luas},${k.kepadatan}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Penduduk_Kecamatan_PPU_BPS_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("id-ID").format(val);

  const renderDelta = (delta: number, inverse = false) => {
    const isPositive = inverse ? delta < 0 : delta > 0;
    const isNeutral = delta === 0;

    if (isNeutral) return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    return isPositive ? (
      <span className="inline-flex items-center gap-0.5 text-emerald-500 text-xs font-bold">
        <ArrowUpRight className="w-3.5 h-3.5" />
        {Math.abs(delta).toFixed(2)}
      </span>
    ) : (
      <span className="inline-flex items-center gap-0.5 text-red-500 text-xs font-bold">
        <ArrowDownRight className="w-3.5 h-3.5" />
        {Math.abs(delta).toFixed(2)}
      </span>
    );
  };

  const filteredBrs = BRS_TERBARU.filter((b) => {
    const matchCat = brsFilter === "Semua" || b.kategori === brsFilter;
    const matchSearch = b.judul.toLowerCase().includes(searchBrs.toLowerCase());
    return matchCat && matchSearch;
  });

  if (isUtamaLocked && isDemografiLocked && isEkonomiLocked) {
    return (
      <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-6 max-w-xl mx-auto my-12 shadow-xl ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className={`text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Akses Terbatas: BPS PPU
          </h2>
          <p className={`text-xs font-body leading-relaxed max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Seluruh sub-modul Statistik BPS (Indikator Utama, Demografi, & Ekonomi) dikonfigurasi sebagai <strong className="text-indigo-500">Khusus Admin</strong> oleh Governance. Silakan login Administrator untuk mengakses data.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={openAuthModal}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-body font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Login Administrator</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Page Header Banner ─────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-slate-900 via-teal-950/40 to-emerald-950/50 border-teal-500/20 shadow-2xl text-white"
            : "bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 border-teal-400 text-white shadow-xl shadow-teal-500/10"
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-teal-100">
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span>BPS Kabupaten Penajam Paser Utara — Statistik Resmi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight leading-tight">
              Indikator Strategis & Statistik Daerah PPU
            </h1>

            <p className="text-sm sm:text-base font-body text-teal-100/90 leading-relaxed">
              Data resmi Badan Pusat Statistik Kabupaten Penajam Paser Utara — Indeks Pembangunan Manusia, Pertumbuhan Ekonomi, Kependudukan, Kemiskinan, dan Ketenagakerjaan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://ppukab.bps.go.id/id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all border border-white/20 active:scale-95"
              >
                <span>Buka Website BPS PPU</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono bg-black/20 backdrop-blur-md text-amber-300 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sumber: ppukab.bps.go.id</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Mini Cards */}
          <div className="lg:w-80 space-y-3 shrink-0">
            <div className="bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Pertumbuhan Ekonomi 2024</p>
                  <p className="text-2xl font-heading font-black text-white">{INDIKATOR_STRATEGIS.pertumbuhanEkonomi.value}%</p>
                </div>
              </div>
              <p className="text-[10px] mt-2 text-teal-200/70">Didorong oleh sektor konstruksi IKN Nusantara</p>
            </div>

            <div className="bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Jumlah Penduduk 2024</p>
                  <p className="text-2xl font-heading font-black text-white">{formatNumber(INDIKATOR_STRATEGIS.penduduk.value)}</p>
                </div>
              </div>
              <p className="text-[10px] mt-2 text-teal-200/70">Laju pertumbuhan {INDIKATOR_STRATEGIS.lajuPenduduk.value}% (dampak IKN)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 6 KPI Strategic Indicator Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: IPM */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Indeks Pembangunan Manusia (IPM)</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-blue-600 dark:text-blue-400">{INDIKATOR_STRATEGIS.ipm.value}</div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Tahun Sebelumnya: {INDIKATOR_STRATEGIS.ipm.prev}</span>
              <div className="flex items-center gap-2">
                {renderDelta(INDIKATOR_STRATEGIS.ipm.delta)}
                <span className="px-2 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-500">Kategori {INDIKATOR_STRATEGIS.ipm.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Usia Harapan Hidup */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Usia Harapan Hidup (UHH)</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center"><Heart className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-rose-600 dark:text-rose-400">{INDIKATOR_STRATEGIS.uhh.value} <span className="text-sm font-normal text-slate-400">Tahun</span></div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Sebelumnya: {INDIKATOR_STRATEGIS.uhh.prev} Tahun</span>
              {renderDelta(INDIKATOR_STRATEGIS.uhh.delta)}
            </div>
          </div>
        </div>

        {/* Card: Rata-rata Lama Sekolah */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Rata-rata Lama Sekolah (RLS)</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-indigo-600 dark:text-indigo-400">{INDIKATOR_STRATEGIS.rataLamaSekolah.value} <span className="text-sm font-normal text-slate-400">Tahun</span></div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Sebelumnya: {INDIKATOR_STRATEGIS.rataLamaSekolah.prev} Tahun</span>
              {renderDelta(INDIKATOR_STRATEGIS.rataLamaSekolah.delta)}
            </div>
          </div>
        </div>

        {/* Card: Tingkat Kemiskinan */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Tingkat Kemiskinan</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><Home className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-amber-600 dark:text-amber-400">{INDIKATOR_STRATEGIS.kemiskinan.value}%</div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Sebelumnya: {INDIKATOR_STRATEGIS.kemiskinan.prev}%</span>
              {renderDelta(INDIKATOR_STRATEGIS.kemiskinan.delta, true)}
            </div>
          </div>
        </div>

        {/* Card: Pengangguran Terbuka */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Tingkat Pengangguran Terbuka (TPT)</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center"><Users className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-teal-600 dark:text-teal-400">{INDIKATOR_STRATEGIS.tpt.value}%</div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Sebelumnya: {INDIKATOR_STRATEGIS.tpt.prev}%</span>
              {renderDelta(INDIKATOR_STRATEGIS.tpt.delta, true)}
            </div>
          </div>
        </div>

        {/* Card: Gini Ratio */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-body font-semibold text-slate-500 dark:text-slate-400">Gini Ratio (Ketimpangan)</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center"><Scale className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-black tracking-tight text-violet-600 dark:text-violet-400">{INDIKATOR_STRATEGIS.giniRatio.value}</div>
            <div className="mt-2 flex items-center justify-between text-xs font-body">
              <span className="text-slate-400">Sebelumnya: {INDIKATOR_STRATEGIS.giniRatio.prev}</span>
              {renderDelta(INDIKATOR_STRATEGIS.giniRatio.delta, true)}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Charts Row 1: IPM Trend + Pertumbuhan Ekonomi ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: IPM Trend 2019-2024 */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
          <div className="mb-5">
            <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Tren IPM Penajam Paser Utara (2019–2024)
            </h3>
            <p className="text-xs text-slate-400 font-body mt-0.5">Indeks Pembangunan Manusia menunjukkan tren peningkatan konsisten</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={IPM_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ipmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <YAxis domain={[70, 75]} stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    borderRadius: "12px", fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="ipm" stroke="#2563EB" strokeWidth={3} fill="url(#ipmGrad)" dot={{ r: 5, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Pertumbuhan Ekonomi Trend */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
          <div className="mb-5">
            <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Pertumbuhan Ekonomi PPU (2019–2024)
            </h3>
            <p className="text-xs text-slate-400 font-body mt-0.5">Lonjakan drastis sejak 2022 karena pembangunan IKN Nusantara</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERTUMBUHAN_EKONOMI_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, "Pertumbuhan"]}
                  contentStyle={{
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    borderRadius: "12px", fontSize: "12px",
                  }}
                />
                <Bar dataKey="growth" radius={[8, 8, 0, 0]}>
                  {PERTUMBUHAN_EKONOMI_TREND.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.growth < 0 ? "#EF4444" : "#10B981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Charts Row 2: Kemiskinan Trend + Sektor PDRB Pie ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Kemiskinan Trend */}
        <div className={`lg:col-span-1 p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
          <div className="mb-5">
            <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-500" />
              Tren Kemiskinan (2019–2024)
            </h3>
            <p className="text-xs text-slate-400 font-body mt-0.5">Penurunan konsisten dari 7.92% → 6.69%</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={KEMISKINAN_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <YAxis domain={[6, 8.5]} stroke={isDark ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, "Kemiskinan"]}
                  contentStyle={{
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    borderRadius: "12px", fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="persen" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Sektor PDRB Pie */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
          <div className="mb-5">
            <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Kontribusi Sektor PDRB PPU 2024
            </h3>
            <p className="text-xs text-slate-400 font-body mt-0.5">Sektor Konstruksi mendominasi {SEKTOR_PDRB[0].kontribusi}% (IKN effect) — PDRB ADHB 2023: Rp {INDIKATOR_STRATEGIS.pdrb.value} Triliun</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SEKTOR_PDRB}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="kontribusi"
                  >
                    {SEKTOR_PDRB.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, "Kontribusi"]}
                    contentStyle={{
                      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                      borderColor: isDark ? "#334155" : "#E2E8F0",
                      borderRadius: "12px", fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2.5 text-xs font-body w-full">
              {SEKTOR_PDRB.map((s) => (
                <div key={s.sektor} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{s.sektor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(s.kontribusi, 100)}%`, backgroundColor: s.color }}></div>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 w-14 text-right">{s.kontribusi}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Table: Penduduk per Kecamatan 2024 ──────────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-500" />
              Distribusi Penduduk per Kecamatan (2024)
            </h3>
            <p className="text-xs text-slate-400 font-body mt-0.5">Total: {formatNumber(INDIKATOR_STRATEGIS.penduduk.value)} Jiwa — Laju Pertumbuhan: {INDIKATOR_STRATEGIS.lajuPenduduk.value}%</p>
          </div>

          <button
            onClick={exportBpsToCSV}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-teal-600/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? "bg-slate-800/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                <th className="py-3 px-4 font-bold">Kecamatan</th>
                <th className="py-3 px-4 font-bold text-right">Jumlah Penduduk</th>
                <th className="py-3 px-4 font-bold text-right">Laki-laki</th>
                <th className="py-3 px-4 font-bold text-right">Perempuan</th>
                <th className="py-3 px-4 font-bold text-right">Luas Wilayah (km²)</th>
                <th className="py-3 px-4 font-bold text-right">Kepadatan (/km²)</th>
                <th className="py-3 px-4 font-bold">Proporsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {PENDUDUK_KECAMATAN.map((k) => {
                const persen = ((k.jumlah / INDIKATOR_STRATEGIS.penduduk.value) * 100).toFixed(1);
                return (
                  <tr key={k.kecamatan} className={isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{k.kecamatan}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-600 dark:text-teal-400">{formatNumber(k.jumlah)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-600 dark:text-blue-400">{formatNumber(k.lk)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-600 dark:text-rose-400">{formatNumber(k.pr)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">{formatNumber(k.luas)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">{k.kepadatan}</td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${persen}%` }}></div>
                        </div>
                        <span className="font-mono font-bold text-xs">{persen}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className={`border-t-2 font-bold ${isDark ? "bg-slate-800/80 text-teal-400 border-slate-700" : "bg-teal-50 text-teal-900 border-teal-200"}`}>
                <td className="py-4 px-4 font-heading font-extrabold">TOTAL</td>
                <td className="py-4 px-4 text-right font-mono">{formatNumber(INDIKATOR_STRATEGIS.penduduk.value)}</td>
                <td className="py-4 px-4 text-right font-mono">{formatNumber(PENDUDUK_KECAMATAN.reduce((s, k) => s + k.lk, 0))}</td>
                <td className="py-4 px-4 text-right font-mono">{formatNumber(PENDUDUK_KECAMATAN.reduce((s, k) => s + k.pr, 0))}</td>
                <td className="py-4 px-4 text-right font-mono">{formatNumber(PENDUDUK_KECAMATAN.reduce((s, k) => s + k.luas, 0))}</td>
                <td className="py-4 px-4 text-right font-mono">—</td>
                <td className="py-4 px-4 font-mono">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Struktur Umur Penduduk ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STRUKTUR_UMUR.map((s) => (
          <div
            key={s.kelompok}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200/80 text-slate-900 shadow-sm"}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.color }}></div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{s.kelompok}</span>
            </div>
            <div className="text-3xl font-heading font-black" style={{ color: s.color }}>{s.persen}%</div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.persen}%`, backgroundColor: s.color }}></div>
            </div>
            <p className="text-xs text-slate-400 font-body mt-2">
              ≈ {formatNumber(Math.round(INDIKATOR_STRATEGIS.penduduk.value * s.persen / 100))} Jiwa
            </p>
          </div>
        ))}
      </div>

      {/* ─── Berita Resmi Statistik (BRS) ────────────────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"}`}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-heading font-extrabold tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" />
                Berita Resmi Statistik (BRS) Terbaru
              </h3>
              <p className="text-xs text-slate-400 font-body mt-0.5">Rilis data statistik resmi dari BPS Kabupaten Penajam Paser Utara</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchBrs}
                  onChange={(e) => setSearchBrs(e.target.value)}
                  placeholder="Cari BRS..."
                  className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {["Semua", "Inflasi & IHK", "Sosial & Kependudukan", "Kemiskinan", "Ketenagakerjaan", "Ekonomi & PDRB", "Pariwisata"].map((cat) => (
              <button
                key={cat}
                onClick={() => setBrsFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-body font-semibold transition-all ${
                  brsFilter === cat
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                    : isDark
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredBrs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada BRS yang ditemukan untuk filter ini.
            </div>
          )}
          {filteredBrs.map((brs, i) => (
            <div key={i} className={`p-5 flex items-start gap-4 transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center shrink-0 font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-heading font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {brs.judul}
                </h4>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-body text-slate-400">
                  <span className="font-mono">{brs.nomor}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{brs.tanggal}</span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-500 font-semibold">{brs.kategori}</span>
                </div>
              </div>
              <a
                href={`https://ppukab.bps.go.id/id/pressrelease`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isDark ? "bg-slate-800 text-slate-300 hover:bg-violet-600 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-violet-600 hover:text-white"
                }`}
              >
                <span>Baca</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Publikasi Unggulan BPS PPU ──────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-heading font-extrabold tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Publikasi Unggulan BPS Kabupaten Penajam Paser Utara
          </h3>
          <p className="text-xs text-slate-400 font-body mt-0.5">Dokumen statistik resmi lengkap untuk kebutuhan perencanaan & riset</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PUBLIKASI_UNGGULAN.map((pub) => (
            <a
              key={pub.judul}
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-xl flex flex-col justify-between group ${
                isDark ? "bg-slate-900/90 border-slate-800 text-white hover:border-teal-500/40" : "bg-white border-slate-200 shadow-sm text-slate-900 hover:border-teal-400"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${pub.color} text-white flex items-center justify-center font-bold shadow-md`}>
                    <pub.icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {pub.tahun}
                  </span>
                </div>

                <h4 className="text-sm font-heading font-bold leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {pub.judul}
                </h4>

                <p className="text-xs text-slate-400 font-body leading-relaxed">
                  {pub.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <span>Unduh / Baca</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
