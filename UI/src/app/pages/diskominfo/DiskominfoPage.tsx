import {
  Globe, ExternalLink, Radio, Camera, Wifi, AlertTriangle,
  Building2, Layers, Map, Plus, ShieldCheck
} from "lucide-react";
import { AddKominfoModal } from "../../components/kominfo/AddKominfoModal";
import { AdminAuthModal } from "../../components/kominfo/AdminAuthModal";
import { useKominfoController, type KominfoTabType } from "./useKominfoController";
import { RingkasanPetaTab } from "../../components/kominfo/tabs/RingkasanPetaTab";
import { MenaraTab } from "../../components/kominfo/tabs/MenaraTab";
import { AplikasiTab } from "../../components/kominfo/tabs/AplikasiTab";
import { CctvTab } from "../../components/kominfo/tabs/CctvTab";
import { WifiTab } from "../../components/kominfo/tabs/WifiTab";
import { BlankspotTab } from "../../components/kominfo/tabs/BlankspotTab";
import { DirektoriTab } from "../../components/kominfo/tabs/DirektoriTab";

// ─── Navigation Config ────────────────────────────────────────────────────────

const KOMINFO_TABS: { id: KominfoTabType; label: string; icon: any }[] = [
  { id: "summary", label: "Ringkasan & Peta Geografis", icon: Map },
  { id: "menara", label: "Menara BTS", icon: Radio },
  { id: "aplikasi", label: "Aplikasi & Portal", icon: Layers },
  { id: "cctv", label: "Titik CCTV", icon: Camera },
  { id: "wifi", label: "WiFi Publik", icon: Wifi },
  { id: "blankspot", label: "Area Blankspot", icon: AlertTriangle },
  { id: "directory", label: "Direktori Website", icon: Building2 },
];

// ─── Presentational Component ──────────────────────────────────────────────────

export function DiskominfoPage({ isDark }: { isDark: boolean }) {
  const {
    activeTab,
    setActiveTab,
    token,
    isLoggedIn,
    isAuthModalOpen,
    closeAuthModal,
    summary,
    menaraList,
    filteredMenara,
    aplikasiList,
    filteredAplikasi,
    cctvList,
    filteredCctv,
    wifiList,
    blankspotList,
    websiteOpdList,
    websiteDesaList,
    isAddModalOpen,
    setIsAddModalOpen,
    searchQuery,
    setSearchQuery,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedStatus,
    setSelectedStatus,
    loading,
    loadData,
    handleAddClick,
    handleAuthSuccess,
    setPendingAddIntent,
  } = useKominfoController();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Admin Login Auth Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          closeAuthModal();
          setPendingAddIntent(false);
        }}
        onSuccess={handleAuthSuccess}
        isDark={isDark}
      />

      {/* Add Kominfo Data Modal */}
      <AddKominfoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
        isDark={isDark}
        token={token || undefined}
      />

      {/* Elegant Header Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-blue-950/40"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-blue-50/50 shadow-blue-500/5"
      }`}>
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left Title Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25 shrink-0 ring-4 ring-blue-500/10 transition-transform duration-300 hover:scale-105">
              <Globe className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className={`text-xl sm:text-2xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Diskominfo Pemkab PPU
                </h1>
                
                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    DB & MAPS Live
                  </span>

                  {isLoggedIn && (
                    <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shadow-sm animate-in fade-in">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Active
                    </span>
                  )}
                </div>
              </div>

              <p className={`text-xs font-mono max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Pusat Integrasi Data Menara BTS, Jaringan Fiber, CCTV Publik, Spot WiFi Gratis & Direktori Portal Digital Kabupaten Penajam Paser Utara
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Kominfo</span>
            </button>

            <a
              href="https://diskominfo.penajamkab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg active:scale-95"
            >
              <span>Portal Diskominfo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Modern KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Menara BTS */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-blue-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-blue-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Menara BTS</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {summary?.totalMenara ?? 132}
          </p>
          <p className="text-[11px] text-blue-500 font-mono font-bold mt-1">4 Kecamatan PPU</p>
        </div>

        {/* Titik CCTV */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-emerald-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Titik CCTV</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {summary?.totalCctvTitik ?? 124}
          </p>
          <p className="text-[11px] text-emerald-500 font-mono font-bold mt-1">{summary?.totalCctvLokasi ?? 29} Lokasi Publik</p>
        </div>

        {/* Aplikasi / Portal */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-indigo-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-indigo-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Aplikasi/Portal</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {summary?.totalAplikasi ?? 125}
          </p>
          <p className="text-[11px] text-indigo-500 font-mono font-bold mt-1">{summary?.aplikasiAktif ?? 98} Aktif Online</p>
        </div>

        {/* WiFi Publik */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-cyan-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>WiFi Publik</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {summary?.totalWifiPublik ?? 7}
          </p>
          <p className="text-[11px] text-cyan-500 font-mono font-bold mt-1">50 Mbps WiFi ID</p>
        </div>

        {/* Website OPD & Desa */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-purple-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-purple-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Web OPD & Desa</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {(summary?.totalWebsiteOpd ?? 35) + (summary?.totalWebsiteDesa ?? 30)}
          </p>
          <p className="text-[11px] text-purple-500 font-mono font-bold mt-1">35 OPD + 30 Desa</p>
        </div>

        {/* Blankspot */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
          isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-amber-300"
        }`}>
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Area Blankspot</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl sm:text-3xl font-heading font-extrabold mt-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {summary?.totalBlankspot ?? 9}
          </p>
          <p className="text-[11px] text-amber-500 font-mono font-bold mt-1">Desa Sinyal Terbatas</p>
        </div>
      </div>

      {/* Segmented Control Tabs Bar */}
      <div className={`p-1.5 rounded-2xl border flex flex-wrap gap-1.5 overflow-x-auto shadow-sm backdrop-blur-xl ${
        isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-200/60 border-slate-300/60"
      }`}>
        {KOMINFO_TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          let countLabel = "";
          if (t.id === "menara") countLabel = ` (${menaraList.length})`;
          if (t.id === "aplikasi") countLabel = ` (${aplikasiList.length})`;
          if (t.id === "cctv") countLabel = ` (${cctvList.length})`;
          if (t.id === "wifi") countLabel = ` (${wifiList.length})`;
          if (t.id === "blankspot") countLabel = ` (${blankspotList.length})`;

          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? isDark
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-100"
                    : "bg-white text-blue-600 shadow-md shadow-blue-500/10 scale-100"
                  : isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}{countLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Container with Animation */}
      <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">Memuat data Diskominfo PPU...</div>
        ) : (
          <>
            {activeTab === "summary" && (
              <RingkasanPetaTab
                menaraList={menaraList}
                cctvList={cctvList}
                wifiList={wifiList}
                summary={summary}
                isDark={isDark}
              />
            )}
            {activeTab === "menara" && (
              <MenaraTab
                menaraList={menaraList}
                filteredMenara={filteredMenara}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedKecamatan={selectedKecamatan}
                setSelectedKecamatan={setSelectedKecamatan}
                isDark={isDark}
              />
            )}
            {activeTab === "aplikasi" && (
              <AplikasiTab
                filteredAplikasi={filteredAplikasi}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                isDark={isDark}
              />
            )}
            {activeTab === "cctv" && (
              <CctvTab
                filteredCctv={filteredCctv}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDark={isDark}
              />
            )}
            {activeTab === "wifi" && (
              <WifiTab
                wifiList={wifiList}
                isDark={isDark}
              />
            )}
            {activeTab === "blankspot" && (
              <BlankspotTab
                blankspotList={blankspotList}
                isDark={isDark}
              />
            )}
            {activeTab === "directory" && (
              <DirektoriTab
                websiteOpdList={websiteOpdList}
                websiteDesaList={websiteDesaList}
                isDark={isDark}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
