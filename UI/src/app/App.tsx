import { useState, useEffect } from "react";
import { RealtimeProvider, useRealtimeData } from "./context/RealtimeContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { BerandaUtama } from "./pages/BerandaUtama";
import { BkpsdmPage } from "./pages/BkpsdmPage";
import { GenericOpdPage } from "./pages/GenericOpdPage";
import { KatalogDokumentasi } from "./pages/KatalogDokumentasi";
import { Users, Building2, HeartHandshake, Server } from "lucide-react";
import type { KPI } from "./data/types";

// ─── Dashboard Shell & Router ──────────────────────────────────────────────────

function DashboardContent() {
  const { metrics, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Beranda Utama");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // KPIs Definition for Public View
  const [kpis, setKpis] = useState<KPI[]>([
    { id: "asn", label: "Total Pegawai ASN & PPPK", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#2563EB" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit OPD", change: 0.0, icon: Building2, color: "#F59E0B" },
    { id: "services", label: "Layanan Publik Digital", value: 6, unit: "layanan", change: 5.0, icon: HeartHandshake, color: "#10B981" },
    { id: "status", label: "Status Portal BKPSDM", value: 100, unit: "% aktif", change: 0.0, icon: Server, color: "#06B6D4" },
  ]);

  // Sync metrics from realtime context
  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    const citizens = metrics.find((m) => m.id === "totalAsn");

    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === "asn" && citizens) {
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

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 relative ${
        isDark ? "bg-[#090D16] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDark={isDark}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header */}
        <Header isDark={isDark} toggleTheme={toggleTheme} time={time} />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl">
          {/* PAGE: BKPSDM PPU */}
          {activeSection === "BKPSDM PPU" && (
            <BkpsdmPage samplePegawai={samplePegawai} isDark={isDark} />
          )}

          {/* PAGE: DISKOMINFO PPU */}
          {activeSection === "Diskominfo PPU" && (
            <GenericOpdPage
              title="Layanan Digital Diskominfo Penajam Paser Utara"
              endpoint="diskominfo.penajamkab.go.id"
              opd="Dinas Komunikasi dan Informatika PPU"
              isDark={isDark}
              services={[
                { category: "SPBE Digital", method: "spbe/status", name: "Status Layanan SPBE PPU", description: "Monitoring kesehatan layanan Sistem Pemerintahan Berbasis Elektronik." },
                { category: "Domain OPD", method: "subdomain/list", name: "Kelola Subdomain .penajamkab.go.id", description: "Daftar subdomain aktif seluruh Perangkat Daerah Kabupaten PPU." },
                { category: "Keamanan Sertifikat", method: "bsre/ttd-verify", name: "Sertifikat Elektronik BSRE", description: "Verifikasi keabsahan Tanda Tangan Digital (TTD) dokumen resmi PPU." },
                { category: "Infrastruktur", method: "network/bandwidth", name: "Monitoring Jaringan Internet OPD", description: "Status ketersediaan bandwidth dan fiber optic kantor Pemkab PPU." },
              ]}
            />
          )}

          {/* PAGE: DISDUKCAPIL PPU */}
          {activeSection === "Disdukcapil PPU" && (
            <GenericOpdPage
              title="Layanan Kependudukan Disdukcapil Penajam Paser Utara"
              endpoint="dukcapil.penajamkab.go.id"
              opd="Dinas Kependudukan dan Pencatatan Sipil PPU"
              isDark={isDark}
              services={[
                { category: "Kependudukan", method: "nik/verify", name: "Verifikasi NIK Kependudukan", description: "Pengecekan keabsahan NIK penduduk Kabupaten Penajam Paser Utara." },
                { category: "Agregat Data", method: "penduduk/agregat", name: "Agregat Penduduk per Kecamatan", description: "Data statistik kependudukan di Penajam, Waru, Babulu, dan Sepaku." },
                { category: "Kartu Keluarga", method: "kk/details", name: "Integrasi Data Kartu Keluarga", description: "Validasi struktur data keluarga untuk bantuan & fasilitas publik PPU." },
              ]}
            />
          )}

          {/* PAGE: BKAD PPU */}
          {activeSection === "BKAD PPU" && (
            <GenericOpdPage
              title="Layanan Keuangan BKAD Penajam Paser Utara"
              endpoint="bkad.penajamkab.go.id"
              opd="Badan Keuangan dan Aset Daerah PPU"
              isDark={isDark}
              services={[
                { category: "Keuangan APBD", method: "anggaran/realisasi", name: "Realisasi Anggaran OPD PPU", description: "Pemantauan realisasi fisik & keuangan APBD Penajam Paser Utara." },
                { category: "Gaji & TPP", method: "tpp/asn-payout", name: "Integrasi TPP & Gaji ASN", description: "Status pembayaran Tambahan Penghasilan Pegawai & Gaji ASN PPU." },
                { category: "Aset Daerah", method: "aset/inventory", name: "Inventarisasi Aset Pemkab PPU", description: "Pencatatan aset barang milik daerah di lingkungan Pemkab PPU." },
              ]}
            />
          )}

          {/* PAGE: DPMPTSP PPU */}
          {activeSection === "DPMPTSP PPU" && (
            <GenericOpdPage
              title="Layanan Perizinan DPMPTSP Penajam Paser Utara"
              endpoint="perizinan.penajamkab.go.id"
              opd="Dinas PMPTSP Kabupaten Penajam Paser Utara"
              isDark={isDark}
              services={[
                { category: "Perizinan Digital", method: "izin/tracking", name: "Tracking Izin Publik PPU", description: "Lacak status pengurusan surat izin usaha & perizinan daerah." },
                { category: "OSS RBA", method: "oss/umkm-data", name: "Integrasi Data OSS RBA UMKM", description: "Pendaftaran dan data pelaku usaha UMKM di Kabupaten PPU." },
              ]}
            />
          )}

          {/* PAGE: KATALOG DOKUMENTASI */}
          {activeSection === "Katalog Dokumentasi" && (
            <KatalogDokumentasi isDark={isDark} />
          )}

          {/* PAGE: BERANDA UTAMA */}
          {activeSection === "Beranda Utama" && (
            <BerandaUtama kpis={kpis} isDark={isDark} setActiveSection={setActiveSection} />
          )}

          {/* Footer */}
          <footer
            className={`pt-6 pb-6 border-t flex items-center justify-between text-xs font-body ${
              isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"
            }`}
          >
            <p>© 2026 Diskominfo & Badan Kepegawaian Kabupaten Penajam Paser Utara.</p>
            <p className="font-bold text-blue-600 dark:text-blue-400">simpeg.penajamkab.go.id</p>
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
