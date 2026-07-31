import React, { lazy, Suspense, useState, useEffect } from "react";
import { RealtimeProvider } from "./context/RealtimeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { BerandaUtama } from "./pages/beranda/BerandaUtama";
import { GlobalSearchModal } from "./components/search/GlobalSearchModal";
import { AdminAuthModal } from "./components/kominfo/AdminAuthModal";
import { useDashboardController } from "./controllers/useDashboardController";
import { RefreshCw, Lock, ShieldCheck } from "lucide-react";

// ─── Code Splitting & Dynamic Lazy Imports for Page Modules ──────────────────
const BkpsdmPage = lazy(() => import("./pages/bkpsdm/BkpsdmPage").then(m => ({ default: m.BkpsdmPage })));
const DiskominfoPage = lazy(() => import("./pages/diskominfo/DiskominfoPage").then(m => ({ default: m.DiskominfoPage })));
const BapendaPage = lazy(() => import("./pages/bapenda/BapendaPage").then(m => ({ default: m.BapendaPage })));
const BpsPage = lazy(() => import("./pages/bps/BpsPage").then(m => ({ default: m.BpsPage })));
const GenericOpdPage = lazy(() => import("./pages/opd-generic/GenericOpdPage").then(m => ({ default: m.GenericOpdPage })));
const KatalogDokumentasi = lazy(() => import("./pages/katalog-dokumentasi/KatalogDokumentasi").then(m => ({ default: m.KatalogDokumentasi })));
const PageGovernancePage = lazy(() => import("./pages/governance/PageGovernancePage").then(m => ({ default: m.PageGovernancePage })));

// Loading Fallback Component
function PageLoader({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      <p className={`text-xs font-mono font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        Memuat Modul Integrasi Digital PPU...
      </p>
    </div>
  );
}

// Restricted Access Fallback Component
function RestrictedPageGuard({
  sectionTitle,
  isDark,
  onOpenLogin,
}: {
  sectionTitle: string;
  isDark: boolean;
  onOpenLogin: () => void;
}) {
  return (
    <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-6 max-w-xl mx-auto my-12 shadow-xl ${
      isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
    }`}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className={`text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
          Akses Terbatas: {sectionTitle}
        </h2>
        <p className={`text-xs font-body leading-relaxed max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Halaman ini dikonfigurasi sebagai <strong className="text-indigo-500">Khusus Admin</strong> oleh pengelola sistem. Silakan login menggunakan akun Administrator Pemkab PPU untuk mengakses data & fitur lengkap.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={onOpenLogin}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-body font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Login Administrator</span>
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Shell & Presentational Router ───────────────────────────────

function DashboardContent() {
  const {
    isDark,
    toggleTheme,
    time,
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    kpis,
    samplePegawai,
    pageConfigs,
    tabConfigs,
    reloadGovernanceConfigs,
  } = useDashboardController();

  const { isLoggedIn, token, isAuthModalOpen, openAuthModal, closeAuthModal, loginSuccess } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAccessRestricted =
    activeSection !== "Beranda Utama" &&
    !isLoggedIn &&
    (activeSection === "Pengaturan Akses Halaman" || pageConfigs[activeSection] === false);

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 relative ${
        isDark ? "bg-[#090D16] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Admin Login Auth Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={(t, u) => loginSuccess(t, u)}
        isDark={isDark}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={(sec) => setActiveSection(sec)}
        isDark={isDark}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDark={isDark}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isLoggedIn={isLoggedIn}
        pageConfigs={pageConfigs}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header */}
        <Header
          isDark={isDark}
          toggleTheme={toggleTheme}
          time={time}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 w-full">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {isAccessRestricted ? (
              <RestrictedPageGuard
                sectionTitle={activeSection}
                isDark={isDark}
                onOpenLogin={openAuthModal}
              />
            ) : (
              <Suspense fallback={<PageLoader isDark={isDark} />}>
                {/* PAGE: BKPSDM PPU */}
                {activeSection === "BKPSDM PPU" && (
                  <BkpsdmPage samplePegawai={samplePegawai} isDark={isDark} tabConfigs={tabConfigs} />
                )}

                {/* PAGE: DISKOMINFO PPU */}
                {activeSection === "Diskominfo PPU" && (
                  <DiskominfoPage isDark={isDark} tabConfigs={tabConfigs} />
                )}

                {/* PAGE: BAPENDA PPU */}
                {activeSection === "Bapenda PPU" && (
                  <BapendaPage isDark={isDark} tabConfigs={tabConfigs} />
                )}

                {/* PAGE: BPS PPU */}
                {activeSection === "BPS PPU" && (
                  <BpsPage isDark={isDark} tabConfigs={tabConfigs} />
                )}

                {/* PAGE: DISDUKCAPIL PPU */}
                {activeSection === "Disdukcapil PPU" && (
                  <GenericOpdPage
                    title="Layanan Kependudukan Disdukcapil Penajam Paser Utara"
                    endpoint="dukcapil.penajamkab.go.id"
                    opd="Dinas Kependudukan dan Pencatatan Sipil PPU"
                    isDark={isDark}
                    pageKey="Disdukcapil PPU"
                    tabConfigs={tabConfigs}
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
                    pageKey="BKAD PPU"
                    tabConfigs={tabConfigs}
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
                    pageKey="DPMPTSP PPU"
                    tabConfigs={tabConfigs}
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

                {/* PAGE: PENGATURAN AKSES HALAMAN */}
                {activeSection === "Pengaturan Akses Halaman" && (
                  <PageGovernancePage
                    isDark={isDark}
                    token={token}
                    onConfigChange={reloadGovernanceConfigs}
                  />
                )}
              </Suspense>
            )}

            {/* PAGE: BERANDA UTAMA */}
            {activeSection === "Beranda Utama" && (
              <BerandaUtama
                kpis={kpis}
                isDark={isDark}
                setActiveSection={setActiveSection}
                pageConfigs={pageConfigs}
                isLoggedIn={isLoggedIn}
                onOpenLogin={openAuthModal}
              />
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <DashboardContent />
      </RealtimeProvider>
    </AuthProvider>
  );
}
