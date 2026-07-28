import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Landmark,
  BarChart3,
  Globe,
  Users,
  ShieldCheck,
  DollarSign,
  Award,
  ArrowRight,
  Command,
  Building2
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: string) => void;
  isDark: boolean;
}

const SEARCH_DATABASE = [
  { label: "BKPSDM PPU — Data Kepegawaian & SIMPEG", category: "OPD", section: "BKPSDM PPU", icon: Users, desc: "PNS, PPPK, presensi online, KGB, Pangkat" },
  { label: "Diskominfo PPU — Menara BTS & CCTV GIS Map", category: "OPD", section: "Diskominfo PPU", icon: Globe, desc: "132 Menara BTS, 29 Titik CCTV Publik, 7 WiFi" },
  { label: "Bapenda PPU — Realisasi PAD & 23 Sektor Pajak", category: "OPD", section: "Bapenda PPU", icon: Landmark, desc: "Rp 67,78 M Realisasi, tb4, Channel QRIS & Teller" },
  { label: "BPS PPU — Indikator Strategis & BRS", category: "DATA", section: "BPS PPU", icon: BarChart3, desc: "IPM 73.90, Growth 30.68%, Penduduk 202k" },
  { label: "Disdukcapil PPU — Verifikasi NIK & Agregat", category: "OPD", section: "Disdukcapil PPU", icon: ShieldCheck, desc: "Validasi NIK, Kartu Keluarga, Agregat Warga" },
  { label: "BKAD PPU — Realisasi Keuangan APBD & Aset", category: "OPD", section: "BKAD PPU", icon: DollarSign, desc: "APBD 2026, TPP ASN, Inventaris Aset Daerah" },
  { label: "DPMPTSP PPU — Tracking Perizinan & OSS RBA", category: "OPD", section: "DPMPTSP PPU", icon: Award, desc: "Tracking izin usaha & pendaftaran UMKM PPU" },
  { label: "Kalkulator BPHTB & PBB-P2 BAPENDA", category: "FITUR", section: "Bapenda PPU", icon: Landmark, desc: "Hitung estimasi Bea Perolehan Hak atas Tanah" },
  { label: "Penduduk per Kecamatan (Sepaku, Penajam, Babulu, Waru)", category: "DATA", section: "BPS PPU", icon: Building2, desc: "Statistik demografi 4 kecamatan PPU" },
];

export function GlobalSearchModal({ isOpen, onClose, onSelectSection, isDark }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open modal
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_DATABASE.filter(
    item =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.section.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari OPD, data BAPENDA, BPS, CCTV, NIK, NOP... (ESC untuk tutup)"
            className={`w-full bg-transparent border-none text-sm font-body focus:outline-none ${
              isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada hasil ditemukan untuk "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectSection(item.section);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? "hover:bg-slate-800/80" : "hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-heading font-bold truncate">{item.label}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-blue-500/10 text-blue-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Command className="w-3.5 h-3.5 text-blue-500" />
            <span>Ketik untuk mencari instansi / data</span>
          </span>
          <span>PPU Portal Hub v2.0</span>
        </div>
      </div>
    </div>
  );
}
