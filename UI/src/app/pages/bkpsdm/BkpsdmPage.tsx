import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Search, Clock, User, Briefcase, Award, TrendingUp,
  Calendar, GraduationCap, ShieldCheck,
  ChevronRight, Database, BarChart2,
} from "lucide-react";
import { ChartTooltip } from "../../components/charts/ChartTooltip";
import { maskNip, maskNama } from "../../utils/formatters";
import {
  PUBLIC_SERVICES, PUBLIC_DATASETS,
  BKPSDM_ATTENDANCE_TREND, GOLONGAN_DISTRIBUTION,
  JABATAN_COMPOSITION, PENDIDIKAN_DISTRIBUTION,
  CHART_COLORS,
} from "../../data/constants";
import type { PegawaiASN } from "../../context/RealtimeContext";
import { useBkpsdmController, type BkpsdmTabType } from "./useBkpsdmController";
import { PresensiTab } from "../../components/bkpsdm/tabs/PresensiTab";
import { ProfilTab } from "../../components/bkpsdm/tabs/ProfilTab";
import { JabatanTab } from "../../components/bkpsdm/tabs/JabatanTab";
import { KarirTab } from "../../components/bkpsdm/tabs/KarirTab";
import { KinerjaTab } from "../../components/bkpsdm/tabs/KinerjaTab";
import { CutiTab } from "../../components/bkpsdm/tabs/CutiTab";
import { PendidikanTab } from "../../components/bkpsdm/tabs/PendidikanTab";
import { PensiunTab } from "../../components/bkpsdm/tabs/PensiunTab";

// ─── Tab Navigation Config ───────────────────────────────────────────────────

const TAB_ITEMS: { id: BkpsdmTabType; label: string; icon: any }[] = [
  { id: "presensi", label: "Presensi Mobile", icon: Clock },
  { id: "profil", label: "Profil Diri", icon: User },
  { id: "jabatan", label: "Jabatan & OPD", icon: Briefcase },
  { id: "karir", label: "Karir & KGB", icon: Award },
  { id: "kinerja", label: "Kinerja & SKP", icon: TrendingUp },
  { id: "cuti", label: "Cuti Online", icon: Calendar },
  { id: "pendidikan", label: "Pendidikan & Diklat", icon: GraduationCap },
  { id: "pensiun", label: "Pensiun & Disiplin", icon: ShieldCheck },
];

// ─── Presentational View Component ──────────────────────────────────────────

export function BkpsdmPage({ samplePegawai, isDark }: { samplePegawai?: PegawaiASN[]; isDark: boolean }) {
  const {
    nipInput,
    setNipInput,
    activeTab,
    setActiveTab,
    loading,
    currentData,
    handleLookup,
  } = useBkpsdmController(samplePegawai);

  return (
    <div className="space-y-8">
      {/* SECTION 1: BKPSDM Header Bar & NIP Data Explorer */}
      <div className={`p-7 rounded-3xl border space-y-6 transition-all shadow-xl backdrop-blur-xl ${
        isDark ? "border-slate-800/80 bg-slate-900/80" : "border-slate-200/80 bg-white shadow-blue-500/5"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b pb-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className={`text-lg font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Layanan Kepegawaian BKPSDM Penajam Paser Utara
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Layanan Online
                </span>
              </div>
              <p className={`text-xs font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Sistem Informasi Kepegawaian Terpadu (SIMPEG PPU) | Penajam Paser Utara
              </p>
            </div>
          </div>

          {/* Search NIP Input Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                value={nipInput}
                onChange={(e) => setNipInput(e.target.value)}
                placeholder="Cari NIP Pegawai..."
                className={`w-56 rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono border focus:outline-none transition-all ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                }`}
              />
            </div>
            <button
              onClick={() => handleLookup()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              Cari Data
            </button>
          </div>
        </div>

        {/* ASN Employee Summary Banner */}
        {currentData ? (
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50/80 border-slate-200/80"
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-heading font-bold text-sm shrink-0 border border-blue-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {maskNama(currentData.profil.nama)}
                </h4>
                <p className={`text-xs font-body ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {currentData.jabatan.namaJabatan} — <span className="font-semibold">{currentData.profil.unitKerja}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                NIP: {maskNip(currentData.profil.nip)}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-stat font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Gol. {currentData.karir.golongan}
              </span>
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-2xl border text-center space-y-2 ${
            isDark ? "bg-slate-950/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
          }`}>
            <p className="text-sm font-heading font-bold">Data Pegawai Belum Ada / Belum Dimuat</p>
            <p className="text-xs font-body">Silakan masukkan NIP Pegawai PPU pada kolom pencarian di atas untuk mengambil data pegawai.</p>
          </div>
        )}

        {/* Segmented Control Tabs Bar */}
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1 overflow-x-auto">
          {TAB_ITEMS.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-body font-semibold shrink-0 flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm font-bold"
                      : "bg-white text-blue-700 shadow-sm border border-slate-200/80 font-bold"
                    : isDark
                      ? "text-slate-400 hover:text-white hover:bg-slate-900/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? isDark ? "text-blue-400" : "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Container */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">Memuat data dari SIMPEG PPU...</div>
        ) : currentData ? (
          <div className="space-y-4">
            {activeTab === "presensi" && <PresensiTab currentData={currentData} isDark={isDark} />}
            {activeTab === "profil" && <ProfilTab currentData={currentData} isDark={isDark} />}
            {activeTab === "jabatan" && <JabatanTab currentData={currentData} isDark={isDark} />}
            {activeTab === "karir" && <KarirTab currentData={currentData} isDark={isDark} />}
            {activeTab === "kinerja" && <KinerjaTab currentData={currentData} isDark={isDark} />}
            {activeTab === "cuti" && <CutiTab currentData={currentData} isDark={isDark} />}
            {activeTab === "pendidikan" && <PendidikanTab currentData={currentData} isDark={isDark} />}
            {activeTab === "pensiun" && <PensiunTab currentData={currentData} isDark={isDark} />}
          </div>
        ) : null}
      </div>

      {/* SECTION 2: STATISTIK & ANALITIK KEPEGAWAIAN BKPSDM */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Statistik & Analitik Kepegawaian BKPSDM Penajam Paser Utara
          </h3>
        </div>
        <p className={`text-xs font-body -mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Visualisasi data agregat kehadiran, distribusi golongan PNS/PPPK, komposisi jabatan, dan tingkat pendidikan.
        </p>

        {/* 4 Interactive Statistics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Presensi Harian */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-sm"}`}>
            <h4 className={`text-sm font-heading font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Presensi Harian ASN PPU — 7 Hari Terakhir
            </h4>
            <p className={`text-xs font-body mb-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Rekap kehadiran harian: tepat waktu, terlambat & izin/dinas luar</p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={BKPSDM_ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="hari" tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip isDark={isDark} />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="tepatWaktu" name="Tepat Waktu" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="terlambat" name="Terlambat" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="izinDinas" name="Dinas Luar / Izin" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Distribusi Golongan PNS & PPPK */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-sm"}`}>
            <h4 className={`text-sm font-heading font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Distribusi Golongan PNS & PPPK PPU
            </h4>
            <p className={`text-xs font-body mb-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Perbandingan jumlah PNS dan PPPK per Golongan</p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={GOLONGAN_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="golongan" tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
                <YAxis tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip isDark={isDark} />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="pns" name="PNS Aktif" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pppk" name="PPPK Aktif" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Komposisi Jenis Jabatan */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-sm"}`}>
            <div>
              <h4 className={`text-sm font-heading font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                Komposisi Jenis Jabatan ASN PPU
              </h4>
              <p className={`text-xs font-body mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Persentase Jabatan Struktural vs Fungsional</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={JABATAN_COMPOSITION} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                    {JABATAN_COMPOSITION.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip isDark={isDark} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              {JABATAN_COMPOSITION.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs font-body font-semibold">
                  <span className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                    {d.name}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-stat font-bold">{d.percent} ({d.value} pegawai)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 4: Tingkat Pendidikan Terakhir */}
          <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-sm"}`}>
            <h4 className={`text-sm font-heading font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
              Tingkat Pendidikan Terakhir ASN PPU
            </h4>
            <p className={`text-xs font-body mb-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Jumlah pegawai berdasarkan jenjang pendidikan</p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={PENDIDIKAN_DISTRIBUTION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis type="number" tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
                <YAxis dataKey="jenjang" type="category" tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 10 }} width={100} />
                <Tooltip content={<ChartTooltip isDark={isDark} />} />
                <Bar dataKey="count" name="Jumlah Pegawai" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: Digital Services Grid */}
      <div className="space-y-4">
        <div>
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Daftar Layanan Kepegawaian Digital BKPSDM PPU
          </h3>
          <p className={`text-xs font-body mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Aplikasi resmi yang dikelola oleh BKPSDM Kabupaten Penajam Paser Utara.
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
                <span className={`text-[10px] font-body font-bold px-2.5 py-1 rounded-full ${
                  isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700 font-bold"
                }`}>
                  {item.category}
                </span>

                <h4 className={`text-sm font-heading font-bold mt-3 mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</h4>
                <p className={`text-xs font-body leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <a
                  href={item.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-body font-bold hover:underline flex items-center gap-1 text-xs"
                >
                  Akses Layanan <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
