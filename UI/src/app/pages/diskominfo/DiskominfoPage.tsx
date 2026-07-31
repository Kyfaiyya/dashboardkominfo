import React, { useEffect } from "react";
import {
  Globe, ExternalLink, Radio, Camera, Wifi, AlertTriangle,
  Building2, Layers, Map, Plus, ShieldCheck, Lock
} from "lucide-react";
import { AddKominfoModal } from "../../components/kominfo/AddKominfoModal";
import { DeleteConfirmModal } from "../../components/kominfo/DeleteConfirmModal";
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

interface DiskominfoPageProps {
  isDark: boolean;
  tabConfigs?: Record<string, Record<string, boolean>>;
}

// ─── Presentational Component ──────────────────────────────────────────────────

export function DiskominfoPage({ isDark, tabConfigs }: DiskominfoPageProps) {
  const {
    activeTab,
    setActiveTab,
    token,
    isLoggedIn,
    isAuthModalOpen,
    openAuthModal,
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
    modalMode,
    editingEntity,
    editingItem,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deletingItem,
    searchQuery,
    setSearchQuery,
    selectedKecamatan,
    setSelectedKecamatan,
    selectedStatus,
    setSelectedStatus,
    loading,
    loadData,
    updateLocalItem,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleAuthSuccess,
    setPendingAddIntent,
  } = useKominfoController();

  const diskominfoRules = tabConfigs?.["Diskominfo PPU"] || {};

  // Dynamic Tab Governance Filtering
  const visibleTabs = KOMINFO_TABS.filter((t) => {
    if (isLoggedIn) return true; // Admin can see all tabs
    if (diskominfoRules[t.id] === false) return false; // Hide if set to Khusus Admin
    return true;
  });

  // Auto fallback if active tab is restricted for public visitor
  useEffect(() => {
    if (!isLoggedIn && diskominfoRules[activeTab] === false) {
      if (visibleTabs.length > 0) {
        setActiveTab(visibleTabs[0].id);
      }
    }
  }, [isLoggedIn, diskominfoRules, activeTab, visibleTabs]);

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

      {/* Add & Edit Kominfo Data Modal */}
      <AddKominfoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(savedRecord) => {
          if (savedRecord) {
            updateLocalItem(editingEntity, savedRecord);
          }
          loadData(false);
        }}
        isDark={isDark}
        token={token || undefined}
        mode={modalMode}
        initialEntity={editingEntity}
        initialData={editingItem}
      />

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => loadData(false)}
          isDark={isDark}
          token={token || undefined}
          entity={deletingItem.entity}
          itemId={deletingItem.id}
          itemName={deletingItem.name}
        />
      )}

      {/* Elegant Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-blue-950/40"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-blue-50/50 shadow-blue-500/5"
      }`}>
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
                    <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 shadow-sm animate-in fade-in">
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
            {isLoggedIn && (
              <button
                onClick={handleAddClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Data Kominfo</span>
              </button>
            )}

            <a
              href="https://diskominfo.penajamkab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg active:scale-95"
            >
              <span>Portal Diskominfo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Modern KPI Stats Cards Grid (Dynamically Governed) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Menara BTS */}
        {(isLoggedIn || diskominfoRules["menara"] !== false) && (
          <div
            onClick={() => setActiveTab("menara")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "menara"
                ? isDark ? "bg-slate-900 border-blue-500/80 ring-1 ring-blue-500/30" : "bg-white border-blue-500/80 ring-1 ring-blue-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-blue-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-blue-300"
            }`}
          >
            <div className="h-1 w-full bg-blue-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Menara BTS</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Radio className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {summary?.totalMenara ?? menaraList.length}
            </p>
            <p className="text-[11px] text-blue-500 font-body font-medium mt-0.5">
              {summary?.menaraPerKecamatan?.length ?? 4} Kecamatan PPU
            </p>
          </div>
        )}

        {/* Titik CCTV */}
        {(isLoggedIn || diskominfoRules["cctv"] !== false) && (
          <div
            onClick={() => setActiveTab("cctv")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "cctv"
                ? isDark ? "bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/30" : "bg-white border-emerald-500/80 ring-1 ring-emerald-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-emerald-300"
            }`}
          >
            <div className="h-1 w-full bg-emerald-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Titik CCTV</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {summary?.totalCctvTitik ?? cctvList.reduce((acc, curr) => acc + (curr.jumlah_titik || 0), 0)}
            </p>
            <p className="text-[11px] text-emerald-500 font-body font-medium mt-0.5">
              {summary?.totalCctvLokasi ?? cctvList.length} Lokasi Kamera
            </p>
          </div>
        )}

        {/* Aplikasi / Portal */}
        {(isLoggedIn || diskominfoRules["aplikasi"] !== false) && (
          <div
            onClick={() => setActiveTab("aplikasi")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "aplikasi"
                ? isDark ? "bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/30" : "bg-white border-indigo-500/80 ring-1 ring-indigo-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-indigo-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-indigo-300"
            }`}
          >
            <div className="h-1 w-full bg-indigo-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Aplikasi/Portal</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {summary?.totalAplikasi ?? aplikasiList.length}
            </p>
            <p className="text-[11px] text-indigo-500 font-body font-medium mt-0.5">
              {summary?.aplikasiAktif ?? aplikasiList.filter((a) => a.status?.toLowerCase() === "aktif").length} Aktif Online
            </p>
          </div>
        )}

        {/* WiFi Publik */}
        {(isLoggedIn || diskominfoRules["wifi"] !== false) && (
          <div
            onClick={() => setActiveTab("wifi")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "wifi"
                ? isDark ? "bg-slate-900 border-sky-500/80 ring-1 ring-sky-500/30" : "bg-white border-sky-500/80 ring-1 ring-sky-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-sky-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-sky-300"
            }`}
          >
            <div className="h-1 w-full bg-sky-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>WiFi Publik</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Wifi className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {summary?.totalWifiPublik ?? wifiList.length}
            </p>
            <p className="text-[11px] text-sky-500 font-body font-medium mt-0.5">
              Spot WiFi Gratis
            </p>
          </div>
        )}

        {/* Website OPD & Desa */}
        {(isLoggedIn || diskominfoRules["directory"] !== false) && (
          <div
            onClick={() => setActiveTab("directory")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "directory"
                ? isDark ? "bg-slate-900 border-purple-500/80 ring-1 ring-purple-500/30" : "bg-white border-purple-500/80 ring-1 ring-purple-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-purple-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-purple-300"
            }`}
          >
            <div className="h-1 w-full bg-purple-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Web OPD & Desa</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {(summary?.totalWebsiteOpd ?? websiteOpdList.length) + (summary?.totalWebsiteDesa ?? websiteDesaList.length)}
            </p>
            <p className="text-[11px] text-purple-500 font-body font-medium mt-0.5">
              OPD & Kelurahan
            </p>
          </div>
        )}

        {/* Blankspot */}
        {(isLoggedIn || diskominfoRules["blankspot"] !== false) && (
          <div
            onClick={() => setActiveTab("blankspot")}
            className={`p-4 rounded-2xl border transition-all duration-300 ease-out relative overflow-hidden hover:-translate-y-1 hover:shadow-md cursor-pointer ${
              activeTab === "blankspot"
                ? isDark ? "bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/30" : "bg-white border-amber-500/80 ring-1 ring-amber-500/20"
                : isDark ? "bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40" : "bg-white border-slate-200/80 shadow-sm hover:border-amber-300"
            }`}
          >
            <div className="h-1 w-full bg-amber-500 absolute top-0 left-0" />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-body font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Area Blankspot</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-2xl font-heading font-extrabold mt-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {summary?.totalBlankspot ?? blankspotList.length}
            </p>
            <p className="text-[11px] text-amber-500 font-body font-medium mt-0.5">
              Sinyal Terbatas
            </p>
          </div>
        )}
      </div>

      {/* Clean Minimalist Enterprise Underline Tab Bar */}
      <div className={`border-b transition-colors ${
        isDark ? "border-slate-800" : "border-slate-200"
      }`}>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            const isRestrictedForPublic = diskominfoRules[t.id] === false;

            let countVal: number | null = null;
            if (t.id === "menara") countVal = menaraList.length;
            if (t.id === "aplikasi") countVal = aplikasiList.length;
            if (t.id === "cctv") countVal = cctvList.length;
            if (t.id === "wifi") countVal = wifiList.length;
            if (t.id === "blankspot") countVal = blankspotList.length;
            if (t.id === "directory") countVal = websiteOpdList.length + websiteDesaList.length;

            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setSearchQuery("");
                }}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-body font-semibold transition-all shrink-0 cursor-pointer border-b-2 -mb-[1px] ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5 dark:bg-blue-500/10 rounded-t-xl"
                    : isDark
                      ? "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-xl"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-t-xl"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                <span className="whitespace-nowrap">{t.label}</span>

                {countVal !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : isDark
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-200 text-slate-600"
                  }`}>
                    {countVal}
                  </span>
                )}

                {isLoggedIn && isRestrictedForPublic && (
                  <span
                    title="Tab diset Khusus Admin oleh Governance"
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span>Admin</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Container with Animation */}
      <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">Memuat data Diskominfo PPU...</div>
        ) : !isLoggedIn && diskominfoRules[activeTab] === false ? (
          <div className={`p-12 rounded-3xl border text-center space-y-5 max-w-2xl mx-auto my-8 ${
            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-xl"
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className={`text-xl font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                Modul Data Ini Di-set Khusus Admin 🔒
              </h3>
              <p className={`text-xs font-body max-w-md mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Akses ke modul data ini saat ini dibatasi oleh Administrator melalui fitur Tata Kelola (Page Governance). Silakan login untuk membuka akses.
              </p>
            </div>
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-body font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Login Administrator</span>
            </button>
          </div>
        ) : (
          <>
            {activeTab === "summary" && (
              <RingkasanPetaTab
                menaraList={menaraList}
                cctvList={cctvList}
                wifiList={wifiList}
                summary={summary}
                isDark={isDark}
                tabConfigs={tabConfigs}
                isLoggedIn={isLoggedIn}
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
                isLoggedIn={isLoggedIn}
                onEdit={(item) => handleEditClick("menara", item)}
                onDelete={(id, name) => handleDeleteClick("menara", id, name)}
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
                isLoggedIn={isLoggedIn}
                onEdit={(item) => handleEditClick("aplikasi", item)}
                onDelete={(id, name) => handleDeleteClick("aplikasi", id, name)}
              />
            )}
            {activeTab === "cctv" && (
              <CctvTab
                filteredCctv={filteredCctv}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                onEdit={(item) => handleEditClick("cctv", item)}
                onDelete={(id, name) => handleDeleteClick("cctv", id, name)}
              />
            )}
            {activeTab === "wifi" && (
              <WifiTab
                wifiList={wifiList}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                onEdit={(item) => handleEditClick("wifi", item)}
                onDelete={(id, name) => handleDeleteClick("wifi", id, name)}
              />
            )}
            {activeTab === "blankspot" && (
              <BlankspotTab
                blankspotList={blankspotList}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                onEdit={(item) => handleEditClick("blankspot", item)}
                onDelete={(id, name) => handleDeleteClick("blankspot", id, name)}
              />
            )}
            {activeTab === "directory" && (
              <DirektoriTab
                websiteOpdList={websiteOpdList}
                websiteDesaList={websiteDesaList}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                onEditOpd={(item) => handleEditClick("website-opd", item)}
                onDeleteOpd={(id, name) => handleDeleteClick("website-opd", id, name)}
                onEditDesa={(item) => handleEditClick("website-desa", item)}
                onDeleteDesa={(id, name) => handleDeleteClick("website-desa", id, name)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
