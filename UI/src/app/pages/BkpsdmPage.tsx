import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Search, Clock, User, Briefcase, Award, TrendingUp,
  Calendar, GraduationCap, ShieldCheck, MapPin, Download,
  ChevronRight, Database, BarChart2,
} from "lucide-react";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { maskNip, maskNama } from "../utils/formatters";
import {
  PUBLIC_SERVICES, PUBLIC_DATASETS,
  BKPSDM_ATTENDANCE_TREND, GOLONGAN_DISTRIBUTION,
  JABATAN_COMPOSITION, PENDIDIKAN_DISTRIBUTION,
  CHART_COLORS,
} from "../data/constants";
import type { PegawaiASN } from "../context/RealtimeContext";

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const TAB_ITEMS = [
  { id: "presensi", label: "Presensi Mobile", icon: Clock },
  { id: "profil", label: "Profil Diri", icon: User },
  { id: "jabatan", label: "Jabatan & OPD", icon: Briefcase },
  { id: "karir", label: "Karir & KGB", icon: Award },
  { id: "kinerja", label: "Kinerja & SKP", icon: TrendingUp },
  { id: "cuti", label: "Cuti Online", icon: Calendar },
  { id: "pendidikan", label: "Pendidikan & Diklat", icon: GraduationCap },
  { id: "pensiun", label: "Pensiun & Disiplin", icon: ShieldCheck },
];

// ─── Sample Database ──────────────────────────────────────────────────────────

const SAMPLE_DATABASE: Record<string, any> = {};

// ─── Component ────────────────────────────────────────────────────────────────

export function BkpsdmPage({ samplePegawai, isDark }: { samplePegawai?: PegawaiASN[]; isDark: boolean }) {
  const [nipInput, setNipInput] = useState("");
  const [activeTab, setActiveTab] = useState<"presensi" | "profil" | "jabatan" | "kinerja" | "karir" | "cuti" | "pendidikan" | "pensiun">("presensi");
  const [loading, setLoading] = useState(false);
  const [searchedPegawai, setSearchedPegawai] = useState<PegawaiASN | null>(null);

  // Check if searched or available from samplePegawai prop
  const currentPegawaiFromProp = samplePegawai?.find((p) => p.nip === nipInput) || samplePegawai?.[0] || null;
  const currentData = SAMPLE_DATABASE[nipInput] || (currentPegawaiFromProp ? {
    profil: {
      nip: currentPegawaiFromProp.nip,
      nama: currentPegawaiFromProp.nama,
      status: currentPegawaiFromProp.status || "Aktif",
      kedudukanHukum: "Aktif Bekerja",
      unitKerja: currentPegawaiFromProp.unitKerja,
      alamatInstansi: "Pemerintah Kabupaten Penajam Paser Utara",
    },
    presensi: {
      statusToday: "Hadir (Masuk Kerja)",
      jamMasuk: "07:30 WITA",
      jamPulang: "16:30 WITA",
      gpsLocation: "GPS Valid",
      persentaseBulan: "100%",
      totalHariKerja: "22 Hari",
      masukTepatWaktu: "22 Hari",
      logHarian: [],
    },
    jabatan: {
      namaJabatan: currentPegawaiFromProp.jabatan,
      jenisJabatan: "Jabatan ASN",
      unitKerja: currentPegawaiFromProp.unitKerja,
      tmtJabatan: "-",
      atasanLangsung: "-",
    },
    karir: {
      golongan: currentPegawaiFromProp.gol || "-",
      pangkat: "-",
      mkg: "-",
      tmtPangkat: "-",
      jadwalKgb: "-",
      jadwalKp: "-",
    },
    kinerja: {
      predikatSkp2025: "Baik",
      nilaiCapaian: "90.0 / 100",
      totalLkhVerified: "-",
      catatanAtasan: "-",
    },
    cuti: { kuotaTahunan: "12 Hari", sisaKuota: "12 Hari", terpakai: "0 Hari", statusPengajuanTerakhir: "-" },
    pendidikan: { jenjangTerakhir: "-", institusi: "-", tahunLulus: "-", diklatTerakhir: "-" },
    pensiun: { bupUsia: "58 Tahun", proyeksiPensiun: "-", satyalancana: "-", catatanDisiplin: "Bersih" },
  } : null);

  const handleLookup = (selectedNip?: string) => {
    const target = selectedNip || nipInput;
    setNipInput(target);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md active:scale-95 shrink-0"
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-body font-semibold shrink-0 flex items-center gap-2 transition-all duration-200 ${
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

            {/* TAB 1: PRESENSI MOBILE */}
            {activeTab === "presensi" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                    <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>Presensi Hari Ini</span>
                    </div>
                    <p className="text-base font-heading font-bold text-emerald-600 dark:text-emerald-400">{currentData.presensi.statusToday}</p>
                    <p className="text-[11px] font-body text-slate-500 mt-1">Status Kehadiran GPS Mobile</p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                    <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Jam Masuk — Pulang</span>
                    </div>
                    <p className={`text-base font-stat font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.presensi.jamMasuk} — {currentData.presensi.jamPulang}</p>
                    <p className="text-[11px] font-body text-slate-500 mt-1">Jadwal Shift Kerja PPU</p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                    <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
                      <TrendingUp className="w-4 h-4 text-cyan-500" />
                      <span>Rekap Bulanan</span>
                    </div>
                    <p className="text-base font-stat font-bold text-blue-600 dark:text-blue-400">{currentData.presensi.persentaseBulan}</p>
                    <p className="text-[11px] font-body text-slate-500 mt-1">{currentData.presensi.masukTepatWaktu} / {currentData.presensi.totalHariKerja} Tepat Waktu</p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                    <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-body font-semibold">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Verifikasi GPS</span>
                    </div>
                    <p className="text-xs font-body font-bold text-emerald-600 dark:text-emerald-400 truncate">{currentData.presensi.gpsLocation}</p>
                    <p className="text-[11px] font-body text-slate-500 mt-1">Radius Lokasi Disetujui</p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-heading font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Log Riwayat Presensi Harian Terakhir</h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-xs font-body">
                      <thead>
                        <tr className={`border-b ${isDark ? "border-slate-800 text-slate-400 bg-slate-950" : "border-slate-200 text-slate-600 bg-slate-50"}`}>
                          <th className="px-5 py-3 text-left font-bold">Tanggal</th>
                          <th className="px-5 py-3 text-left font-bold">Jam Masuk</th>
                          <th className="px-5 py-3 text-left font-bold">Jam Pulang</th>
                          <th className="px-5 py-3 text-left font-bold">Status</th>
                          <th className="px-5 py-3 text-left font-bold">Lokasi Absen</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-200/60"}`}>
                        {currentData.presensi.logHarian.map((log: any, idx: number) => (
                          <tr key={idx} className={isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-50"}>
                            <td className="px-5 py-3 font-bold">{log.tanggal}</td>
                            <td className="px-5 py-3 font-stat font-semibold">{log.masuk}</td>
                            <td className="px-5 py-3 font-stat font-semibold">{log.pulang}</td>
                            <td className="px-5 py-3 font-semibold">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {log.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500">{log.lokasi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFIL DIRI */}
            {activeTab === "profil" && (
              <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Identitas Resmi Pegawai</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nama Lengkap & Gelar</p>
                    <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{maskNama(currentData.profil.nama)}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nomor Induk Pegawai (NIP)</p>
                    <p className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 mt-1">{maskNip(currentData.profil.nip)}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Status Kepegawaian</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.profil.status}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Kedudukan Hukum</p>
                    <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.kedudukanHukum}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Agama</p>
                    <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.agama}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Alamat Unit Kerja</p>
                    <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.profil.alamatInstansi}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: JABATAN & OPD */}
            {activeTab === "jabatan" && (
              <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Informasi Jabatan & Unit Kerja</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nama Jabatan</p>
                    <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.jabatan.namaJabatan}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jenis Jabatan / Jenjang</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">{currentData.jabatan.jenisJabatan}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Perangkat Daerah (OPD)</p>
                    <p className={`font-semibold mt-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{currentData.jabatan.unitKerja}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">TMT Jabatan</p>
                    <p className={`font-mono font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.jabatan.tmtJabatan}</p>
                  </div>
                  <div className={`col-span-2 p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Atasan Langsung</p>
                    <p className={`font-medium mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.jabatan.atasanLangsung}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: KARIR, PANGKAT & KGB */}
            {activeTab === "karir" && (
              <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Riwayat Pangkat, Golongan & KGB</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-body">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Golongan / Ruang</p>
                    <p className="font-stat font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-1">{currentData.karir.golongan}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Pangkat</p>
                    <p className={`font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.karir.pangkat}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Masa Kerja Golongan (MKG)</p>
                    <p className={`font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.karir.mkg}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">TMT Pangkat Terakhir</p>
                    <p className={`font-mono mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.karir.tmtPangkat}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jadwal KGB Berikutnya</p>
                    <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">{currentData.karir.jadwalKgb}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jadwal Kenaikan Pangkat berikutnya</p>
                    <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{currentData.karir.jadwalKp}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: KINERJA & SKP */}
            {activeTab === "kinerja" && (
              <div className={`p-6 rounded-2xl border space-y-5 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Capaian Kinerja Pegawai (E-Kinerja & SKP)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Predikat Kinerja SKP 2025</p>
                    <p className="font-heading font-bold text-emerald-600 dark:text-emerald-400 text-base mt-1.5">{currentData.kinerja.predikatSkp2025}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Nilai Capaian Kinerja</p>
                    <p className="font-stat font-bold text-blue-600 dark:text-blue-400 text-xl mt-1.5">{currentData.kinerja.nilaiCapaian}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Laporan Kinerja Harian (LKH)</p>
                    <p className={`font-semibold text-sm mt-1.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>{currentData.kinerja.totalLkhVerified}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Catatan Evaluasi Atasan</p>
                    <p className={`font-medium italic mt-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>"{currentData.kinerja.catatanAtasan}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CUTI ONLINE */}
            {activeTab === "cuti" && (
              <div className={`p-6 rounded-2xl border space-y-5 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Informasi Kuota Cuti & Pengajuan Online</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-body">
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Total Kuota Cuti Tahunan</p>
                    <p className={`font-stat font-bold text-2xl mt-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.cuti.kuotaTahunan}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Sisa Kuota Cuti Aktif</p>
                    <p className="font-stat font-bold text-emerald-600 dark:text-emerald-400 text-2xl mt-1.5">{currentData.cuti.sisaKuota}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Cuti Terpakai Tahun Ini</p>
                    <p className={`font-stat font-bold text-2xl mt-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.cuti.terpakai}</p>
                  </div>
                  <div className={`col-span-3 p-5 rounded-2xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Status Pengajuan Cuti Terakhir</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm mt-1">{currentData.cuti.statusPengajuanTerakhir}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PENDIDIKAN & DIKLAT */}
            {activeTab === "pendidikan" && (
              <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Riwayat Pendidikan & Diklat SDM</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Jenjang & Jurusan Pendidikan</p>
                    <p className={`font-heading font-bold text-sm mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.pendidikan.jenjangTerakhir}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Institusi Perguruan Tinggi / Sekolah</p>
                    <p className={`font-semibold mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.pendidikan.institusi}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Tahun Lulus</p>
                    <p className={`font-mono mt-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{currentData.pendidikan.tahunLulus}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Diklat Kepemimpinan / Teknis Terakhir</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">{currentData.pendidikan.diklatTerakhir}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: PENSIUN, PENGHARGAAN & DISIPLIN */}
            {activeTab === "pensiun" && (
              <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50/70 border-slate-200/80"}`}>
                <h4 className={`text-base font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Proyeksi Pensiun (BUP), Satyalancana & Disiplin</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-body">
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Batas Usia Pensiun (BUP)</p>
                    <p className={`font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{currentData.pensiun.bupUsia}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Proyeksi TMT Pensiun</p>
                    <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">{currentData.pensiun.proyeksiPensiun}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Tanda Penghargaan</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.pensiun.satyalancana}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200/80"}`}>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Catatan Hukuman Disiplin</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{currentData.pensiun.catatanDisiplin}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : null}
      </div>

      {/* SECTION 2: STATISTIK & ANALITIK KEPEGAWAIAN BKPSDM (Charts Below) */}
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

      {/* SECTION 4: Unduhan & Dataset Publik */}
      <div className="space-y-4">
        <div>
          <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Unduhan Dokumen & Dataset Kepegawaian BKPSDM
          </h3>
          <p className={`text-xs font-body mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Dokumen statistik dan laporan resmi kepegawaian Kabupaten Penajam Paser Utara.
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
                <span className="text-[10px] font-body font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  {ds.fileSize}
                </span>
                <h4 className={`text-sm font-heading font-bold mt-3 mb-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>{ds.title}</h4>
                <p className={`text-xs font-body leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{ds.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-[11px] font-body ${isDark ? "text-slate-500" : "text-slate-400"}`}>Diperbarui: {ds.updated}</span>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-body font-bold text-xs transition-all shadow-sm">
                  <Download className="w-3.5 h-3.5" /> Unduh PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
