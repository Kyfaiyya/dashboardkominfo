import { useState, useEffect } from "react";
import { ApiService } from "../../services/api.service";
import type {
  KominfoSummary, MenaraRecord, BlankspotRecord, AplikasiRecord,
  WifiRecord, WebsiteDesaRecord, WebsiteOpdRecord, CctvRecord
} from "../../models/kominfo.model";
import { useAuth } from "../../context/AuthContext";

export type KominfoTabType = "summary" | "menara" | "aplikasi" | "cctv" | "wifi" | "blankspot" | "directory";

export function useKominfoController() {
  const [activeTab, setActiveTab] = useState<KominfoTabType>("summary");

  // Global Auth Context
  const { token, isLoggedIn, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();

  // Data states
  const [summary, setSummary] = useState<KominfoSummary | null>(null);
  const [menaraList, setMenaraList] = useState<MenaraRecord[]>([]);
  const [aplikasiList, setAplikasiList] = useState<AplikasiRecord[]>([]);
  const [cctvList, setCctvList] = useState<CctvRecord[]>([]);
  const [wifiList, setWifiList] = useState<WifiRecord[]>([]);
  const [blankspotList, setBlankspotList] = useState<BlankspotRecord[]>([]);
  const [websiteOpdList, setWebsiteOpdList] = useState<WebsiteOpdRecord[]>([]);
  const [websiteDesaList, setWebsiteDesaList] = useState<WebsiteDesaRecord[]>([]);

  // Add Data Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingAddIntent, setPendingAddIntent] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Load summary and initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, menaraRes, appRes, cctvRes, wifiRes, bsRes, opdRes, desaRes] = await Promise.all([
        ApiService.getKominfoSummary().catch(() => null),
        ApiService.getKominfoMenara().catch(() => ({ data: [] })),
        ApiService.getKominfoAplikasi().catch(() => ({ data: [] })),
        ApiService.getKominfoCctv().catch(() => ({ data: [] })),
        ApiService.getKominfoWifi().catch(() => ({ data: [] })),
        ApiService.getKominfoBlankspot().catch(() => ({ data: [] })),
        ApiService.getKominfoWebsiteOpd().catch(() => ({ data: [] })),
        ApiService.getKominfoWebsiteDesa().catch(() => ({ data: [] })),
      ]);

      if (sumRes) setSummary(sumRes);
      setMenaraList(menaraRes.data || []);
      setAplikasiList(appRes.data || []);
      setCctvList(cctvRes.data || []);
      setWifiList(wifiRes.data || []);
      setBlankspotList(bsRes.data || []);
      setWebsiteOpdList(opdRes.data || []);
      setWebsiteDesaList(desaRes.data || []);
    } catch (err) {
      console.error("Failed to load Kominfo data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddClick = () => {
    if (isLoggedIn) {
      setIsAddModalOpen(true);
    } else {
      setPendingAddIntent(true);
      openAuthModal();
    }
  };

  const handleAuthSuccess = () => {
    if (pendingAddIntent) {
      setIsAddModalOpen(true);
      setPendingAddIntent(false);
    }
  };

  // Filtered lists
  const filteredMenara = menaraList.filter((m) => {
    const matchSearch = (m.alamat || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.kelurahan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.pemilik_menara || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.operator || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchKec = selectedKecamatan === "All" || (m.kecamatan || "").toLowerCase() === selectedKecamatan.toLowerCase();
    return matchSearch && matchKec;
  });

  const filteredAplikasi = aplikasiList.filter((a) => {
    const matchSearch = (a.nama || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.url || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.jenis || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "All" || (a.status || "").toLowerCase() === selectedStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const filteredCctv = cctvList.filter((c) =>
    (c.lokasi || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.area || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
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
  };
}
