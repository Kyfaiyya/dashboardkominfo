import React, { useState, useEffect } from "react";
import {
  ShieldCheck, Lock, Globe, Layers, Search, RefreshCw, CheckCircle2,
  AlertCircle, History, ChevronRight, ChevronDown, Key
} from "lucide-react";
import { ApiService } from "../../services/api.service";

interface PageGovernancePageProps {
  isDark: boolean;
  token?: string | null;
  onConfigChange?: () => void;
}

export function PageGovernancePage({ isDark, token, onConfigChange }: PageGovernancePageProps) {
  const [activeSubTab, setActiveSubTab] = useState<"matrix" | "audit">("matrix");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [navData, logsData] = await Promise.all([
        ApiService.getGovernanceNavigation().catch(() => ({ pages: [], tabs: [] })),
        ApiService.getGovernanceAuditLogs(token || undefined).catch(() => ({ data: [] })),
      ]);

      setPages(navData.pages || []);
      setTabs(navData.tabs || []);
      setAuditLogs(logsData.data || []);
    } catch (err) {
      console.error("Failed to load governance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePageVisibility = async (pageKey: string, currentPublic: boolean) => {
    setSavingKey(`page-${pageKey}`);
    setFeedbackMsg(null);
    try {
      await ApiService.updatePageVisibility(pageKey, !currentPublic, token || undefined);
      setPages((prev) =>
        prev.map((p) => (p.page_key === pageKey ? { ...p, is_public: !currentPublic } : p))
      );
      setFeedbackMsg({
        type: "success",
        text: `Visibilitas Halaman '${pageKey}' diubah ke ${!currentPublic ? "Publik 🌐" : "Khusus Admin 🔒"}`,
      });
      onConfigChange?.();
      // Reload logs
      const logsRes = await ApiService.getGovernanceAuditLogs(token || undefined).catch(() => null);
      if (logsRes?.data) setAuditLogs(logsRes.data);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Gagal memperbarui hak akses." });
    } finally {
      setSavingKey(null);
    }
  };

  const toggleTabVisibility = async (pageKey: string, tabKey: string, currentPublic: boolean) => {
    setSavingKey(`tab-${pageKey}-${tabKey}`);
    setFeedbackMsg(null);
    try {
      await ApiService.updateTabVisibility(pageKey, tabKey, !currentPublic, token || undefined);
      setTabs((prev) => {
        const exists = prev.some((t) => t.page_key === pageKey && t.tab_key === tabKey);
        if (exists) {
          return prev.map((t) =>
            t.page_key === pageKey && t.tab_key === tabKey ? { ...t, is_public: !currentPublic } : t
          );
        } else {
          return [...prev, { page_key: pageKey, tab_key: tabKey, title: tabKey, is_public: !currentPublic }];
        }
      });
      setFeedbackMsg({
        type: "success",
        text: `Visibilitas Tab '${tabKey}' (${pageKey}) diubah ke ${!currentPublic ? "Publik 🌐" : "Khusus Admin 🔒"}`,
      });
      onConfigChange?.();
      const logsRes = await ApiService.getGovernanceAuditLogs(token || undefined).catch(() => null);
      if (logsRes?.data) setAuditLogs(logsRes.data);
    } catch (err: any) {
      setFeedbackMsg({ type: "error", text: err.message || "Gagal memperbarui hak akses tab." });
    } finally {
      setSavingKey(null);
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      {/* Banner Header */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-xl backdrop-blur-xl relative overflow-hidden ${
        isDark
          ? "border-slate-800/80 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-indigo-950/40"
          : "border-slate-200/80 bg-gradient-to-r from-white via-slate-50/80 to-blue-50/50 shadow-blue-500/5"
      }`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/25 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-heading font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Konsol Akses & Visibilitas Halaman
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  PostgreSQL Engine
                </span>
              </div>
              <p className={`text-xs font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Kelola hak akses Halaman & Tab secara terpusat (Publik vs Khusus Admin) dengan Log Keamanan Otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Rules</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between animate-in fade-in ${
          feedbackMsg.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 border-rose-500/20 text-rose-500"
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Control Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab("matrix")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-bold transition-all cursor-pointer ${
            activeSubTab === "matrix"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Matriks Visibilitas Halaman & Tab ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-bold transition-all cursor-pointer ${
            activeSubTab === "audit"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: VISIBILITY MATRIX */}
      {activeSubTab === "matrix" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className={`w-4 h-4 absolute left-3.5 top-2.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Cari halaman atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-3.5 py-2 text-xs font-mono border focus:outline-none ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <Globe className="w-3.5 h-3.5" /> Publik
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Lock className="w-3.5 h-3.5" /> Khusus Admin
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              <span>Memuat aturan visibilitas...</span>
            </div>
          ) : (
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-body">
                  <thead>
                    <tr className={`border-b font-mono text-[11px] uppercase tracking-wider ${
                      isDark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}>
                      <th className="py-3.5 px-4 w-12">Detail</th>
                      <th className="py-3.5 px-4">Nama Halaman</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Badge Navigasi</th>
                      <th className="py-3.5 px-4 text-center">Status Visibilitas Halaman</th>
                      <th className="py-3.5 px-4 text-center">Aksi Toggle Visibilitas</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-slate-800/80 text-slate-200" : "divide-slate-100 text-slate-700"}`}>
                    {filteredPages.map((p) => {
                      const pageTabs = tabs.filter((t) => t.page_key === p.page_key);
                      const isExpanded = !!expandedPages[p.page_key];
                      const isSaving = savingKey === `page-${p.page_key}`;

                      return (
                        <React.Fragment key={p.id}>
                          {/* Main Page Row */}
                          <tr className={`transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
                            <td className="py-3 px-4">
                              {pageTabs.length > 0 && (
                                <button
                                  onClick={() =>
                                    setExpandedPages((prev) => ({
                                      ...prev,
                                      [p.page_key]: !prev[p.page_key],
                                    }))
                                  }
                                  className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 cursor-pointer"
                                >
                                  {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold flex items-center gap-2">
                              <span>{p.title}</span>
                              {pageTabs.length > 0 && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400">
                                  {pageTabs.length} Tab
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400">{p.category}</td>
                            <td className="py-3 px-4 font-mono">
                              {p.badge_label ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                  {p.badge_label}
                                </span>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold inline-flex items-center gap-1.5 border ${
                                p.is_public
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              }`}>
                                {p.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                {p.is_public ? "Publik" : "Khusus Admin"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => togglePageVisibility(p.page_key, p.is_public)}
                                disabled={isSaving}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                                  p.is_public
                                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                                }`}
                              >
                                {isSaving ? "Disimpan..." : p.is_public ? "Ubah ke Admin Only" : "Ubah ke Publik"}
                              </button>
                            </td>
                          </tr>

                          {/* Sub-Tabs Accordion Rows */}
                          {isExpanded && pageTabs.length > 0 && (
                            <tr className={isDark ? "bg-slate-950/40" : "bg-slate-50/60"}>
                              <td colSpan={6} className="p-4 pl-12">
                                <div className="space-y-2 border-l-2 border-indigo-500/40 pl-4">
                                  <p className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2">
                                    Pengaturan Visibilitas Tab Halaman ({p.title}):
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {pageTabs.map((t) => {
                                      const isTabSaving = savingKey === `tab-${p.page_key}-${t.tab_key}`;
                                      return (
                                        <div
                                          key={t.tab_key}
                                          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                                          }`}
                                        >
                                          <div>
                                            <p className="font-bold">{t.title}</p>
                                            <span className={`text-[10px] font-mono ${t.is_public ? "text-emerald-500" : "text-indigo-400"}`}>
                                              {t.is_public ? "● Publik" : "🔒 Khusus Admin"}
                                            </span>
                                          </div>

                                          <button
                                            onClick={() => toggleTabVisibility(p.page_key, t.tab_key, t.is_public)}
                                            disabled={isTabSaving}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                                              t.is_public
                                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            }`}
                                          >
                                            {isTabSaving ? "..." : t.is_public ? "Admin Only" : "Make Public"}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeSubTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Catatan Log Perubahan Hak Akses Navigasi & Halaman (Security Audit Trail)
            </h3>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-body">
                <thead>
                  <tr className={`border-b font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}>
                    <th className="py-3.5 px-4">Waktu Log</th>
                    <th className="py-3.5 px-4">Admin Username</th>
                    <th className="py-3.5 px-4">Aksi</th>
                    <th className="py-3.5 px-4">Target (Halaman/Tab)</th>
                    <th className="py-3.5 px-4 text-center">Nilai Lama</th>
                    <th className="py-3.5 px-4 text-center">Nilai Baru</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-slate-800/80 text-slate-200" : "divide-slate-100 text-slate-700"}`}>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                        Belum ada catatan log perubahan visibilitas.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className={`transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {new Date(log.created_at).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5" />
                          {log.admin_username}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                            {log.action_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">{log.target_key}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-400">{log.old_value}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-500">{log.new_value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
