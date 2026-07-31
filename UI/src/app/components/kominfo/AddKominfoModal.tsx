import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Edit2, CheckCircle2, AlertCircle, Loader2, Radio, Camera, Wifi, Layers, Building2, AlertTriangle, Globe } from "lucide-react";
import { ApiService } from "../../services/api.service";

interface AddKominfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedRecord?: any) => void;
  isDark: boolean;
  token?: string;
  mode?: "add" | "edit";
  initialEntity?: "menara" | "aplikasi" | "cctv" | "wifi" | "blankspot" | "website-opd" | "website-desa";
  initialData?: any;
}

export function AddKominfoModal({
  isOpen,
  onClose,
  onSuccess,
  isDark,
  token,
  mode = "add",
  initialEntity = "menara",
  initialData = null,
}: AddKominfoModalProps) {
  const [entityType, setEntityType] = useState<"menara" | "aplikasi" | "cctv" | "wifi" | "blankspot" | "website-opd" | "website-desa">("menara");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State per Entity
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setEntityType(initialEntity);
        setFormData({ ...initialData });
      } else {
        setEntityType(initialEntity);
        setFormData({});
      }
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, mode, initialEntity, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let payload: Record<string, any> = { ...formData };

      // Field transformations
      if (entityType === "menara") {
        if (payload.tinggi) payload.tinggi = Number(payload.tinggi);
      } else if (entityType === "cctv") {
        payload.jumlah_titik = Number(payload.jumlah_titik) || 1;
        payload.status = payload.status || "Aktif";
      } else if (entityType === "wifi") {
        if (payload.bandwidth_mbps) payload.bandwidth_mbps = Number(payload.bandwidth_mbps);
      } else if (entityType === "blankspot") {
        payload.has_bts = payload.has_bts === "true" || payload.has_bts === true;
      } else if (entityType === "aplikasi") {
        payload.status = payload.status || "Aktif";
      }

      let savedRecord: any = null;
      if (mode === "edit" && initialData?.id) {
        const { id, created_at, updated_at, ...updateFields } = payload;
        const res = await ApiService.updateKominfoItem(entityType, initialData.id, updateFields, token);
        savedRecord = res?.data || { id: initialData.id, ...updateFields };
        setSuccessMsg(`Data ${entityType.toUpperCase()} berhasil diperbarui!`);
      } else {
        const res = await ApiService.createKominfoItem(entityType, payload, token);
        savedRecord = res?.data || payload;
        setSuccessMsg(`Data ${entityType.toUpperCase()} berhasil disimpan ke database!`);
      }

      // Reset form
      setTimeout(() => {
        setSuccessMsg("");
        onSuccess(savedRecord);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan data ke database.");
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = mode === "edit";

  return createPortal(
    <div className="fixed inset-0 z-[9999] p-4 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in">
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-3xl border overflow-hidden shadow-2xl flex flex-col transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Header (Fixed Top) */}
        <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
          isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-md ${
              isEdit ? "bg-amber-600 shadow-amber-500/20" : "bg-blue-600 shadow-blue-500/20"
            }`}>
              {isEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                {isEdit ? `Edit Data ${entityType.toUpperCase()}` : "Tambah Data Layanan Kominfo"}
              </h3>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isEdit ? "Perbarui data langsung di PostgreSQL Database PPU" : "Input data baru langsung ke PostgreSQL Database PPU"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all ${
              isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Entity Type Selector */}
          <div>
            <label className={`block text-xs font-mono font-bold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Pilih Jenis Data / Kategori:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "menara", label: "Menara BTS", icon: Radio },
                { id: "aplikasi", label: "Aplikasi/Web", icon: Layers },
                { id: "cctv", label: "Titik CCTV", icon: Camera },
                { id: "wifi", label: "WiFi Publik", icon: Wifi },
                { id: "blankspot", label: "Blankspot", icon: AlertTriangle },
                { id: "website-opd", label: "Web OPD", icon: Building2 },
                { id: "website-desa", label: "Web Desa", icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = entityType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isEdit}
                    onClick={() => {
                      if (!isEdit) {
                        setEntityType(item.id as any);
                        setFormData({});
                      }
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-body font-bold transition-all ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : isDark
                          ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    } ${isEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
            {/* Dynamic Form per Entity */}

            {/* 1. MENARA BTS FORM */}
            {entityType === "menara" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Alamat / Lokasi Menara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Petung Rt 07"
                    value={formData.alamat || ""}
                    onChange={(e) => handleChange("alamat", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Kecamatan *</label>
                    <select
                      value={formData.kecamatan || ""}
                      onChange={(e) => handleChange("kecamatan", e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="" disabled>Pilih Kecamatan</option>
                      <option value="Penajam">Penajam</option>
                      <option value="Sepaku">Sepaku</option>
                      <option value="Babulu">Babulu</option>
                      <option value="Waru">Waru</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Kelurahan / Desa</label>
                    <input
                      type="text"
                      placeholder="Contoh: Petung"
                      value={formData.kelurahan || ""}
                      onChange={(e) => handleChange("kelurahan", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Pemilik Menara</label>
                    <input
                      type="text"
                      placeholder="Contoh: Telkomsel / Mitratel"
                      value={formData.pemilik_menara || ""}
                      onChange={(e) => handleChange("pemilik_menara", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Operator Aktif</label>
                    <input
                      type="text"
                      placeholder="Contoh: Telkomsel, Indosat"
                      value={formData.operator || ""}
                      onChange={(e) => handleChange("operator", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Tinggi (Meter)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 72"
                      value={formData.tinggi || ""}
                      onChange={(e) => handleChange("tinggi", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Tahun Pendirian</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2021"
                      value={formData.tahun || ""}
                      onChange={(e) => handleChange("tahun", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Latitude (GPS)</label>
                    <input
                      type="text"
                      placeholder="Contoh: -1.3100278"
                      value={formData.latitude || ""}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Longitude (GPS)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 116.7276056"
                      value={formData.longitude || ""}
                      onChange={(e) => handleChange("longitude", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-slate-500 italic">
                  * Koordinat GPS opsional. Jika dikosongkan, posisi marker peta mengikuti area kecamatan.
                </p>
              </>
            )}

            {/* 2. APLIKASI FORM */}
            {entityType === "aplikasi" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Nama Portal / Aplikasi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SIMPEG PPU Digital"
                    value={formData.nama || ""}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">URL Domain / Link Access</label>
                  <input
                    type="text"
                    placeholder="Contoh: simpeg.penajamkab.go.id"
                    value={formData.url || ""}
                    onChange={(e) => handleChange("url", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Jenis Kategori</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sistem Informasi / Portal OPD"
                      value={formData.jenis || ""}
                      onChange={(e) => handleChange("jenis", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Status Operasional</label>
                    <select
                      value={formData.status || "Aktif"}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* 3. CCTV FORM */}
            {entityType === "cctv" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Nama Lokasi CCTV *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Alun-Alun Pemkab PPU"
                    value={formData.lokasi || ""}
                    onChange={(e) => handleChange("lokasi", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Jumlah Titik Kamera</label>
                    <input
                      type="number"
                      placeholder="Contoh: 8"
                      value={formData.jumlah_titik ?? 1}
                      onChange={(e) => handleChange("jumlah_titik", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Sektor / Area</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sektor Fasilitas Publik"
                      value={formData.area || ""}
                      onChange={(e) => handleChange("area", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Koordinat GPS (Latitude, Longitude)</label>
                  <input
                    type="text"
                    placeholder="Contoh: -1.3093286, 116.7283245"
                    value={formData.koordinat || ""}
                    onChange={(e) => handleChange("koordinat", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                  <p className="text-[10px] font-mono text-slate-500 italic mt-1">
                    * Opsional. Jika dikosongkan, koordinat disesuaikan dengan pencocokan nama lokasi landmark PPU.
                  </p>
                </div>
              </>
            )}

            {/* 4. WIFI FORM */}
            {entityType === "wifi" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Lokasi WiFi Publik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pelabuhan Speedboat Penajam"
                    value={formData.lokasi || ""}
                    onChange={(e) => handleChange("lokasi", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Nama Layanan / SSID</label>
                    <input
                      type="text"
                      placeholder="Contoh: WiFi ID Diskominfo"
                      value={formData.layanan || ""}
                      onChange={(e) => handleChange("layanan", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Bandwidth (Mbps)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 50"
                      value={formData.bandwidth_mbps || 50}
                      onChange={(e) => handleChange("bandwidth_mbps", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Koordinat GPS (Latitude, Longitude)</label>
                  <input
                    type="text"
                    placeholder="Contoh: -1.2423597, 116.7775959"
                    value={formData.koordinat || ""}
                    onChange={(e) => handleChange("koordinat", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                  <p className="text-[10px] font-mono text-slate-500 italic mt-1">
                    * Opsional. Jika dikosongkan, koordinat disesuaikan dengan pencocokan nama lokasi landmark PPU.
                  </p>
                </div>
              </>
            )}

            {/* 5. WEBSITE OPD FORM */}
            {entityType === "website-opd" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Nama Perangkat Daerah (OPD) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dinas Kesehatan PPU"
                    value={formData.nama || ""}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">URL Website Resmi</label>
                  <input
                    type="text"
                    placeholder="Contoh: dinkes.penajamkab.go.id"
                    value={formData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </>
            )}

            {/* 6. WEBSITE DESA FORM */}
            {entityType === "website-desa" && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Nama Desa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Desa Sidorejo"
                    value={formData.nama || ""}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">URL Domain (.desa.id)</label>
                    <input
                      type="text"
                      placeholder="Contoh: sidorejo.desa.id"
                      value={formData.url || ""}
                      onChange={(e) => handleChange("url", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Kecamatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Penajam"
                      value={formData.kecamatan || ""}
                      onChange={(e) => handleChange("kecamatan", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 7. BLANKSPOT FORM */}
            {entityType === "blankspot" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Kecamatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Sepaku"
                      value={formData.kecamatan || ""}
                      onChange={(e) => handleChange("kecamatan", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Desa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Karang Jinawi"
                      value={formData.desa || ""}
                      onChange={(e) => handleChange("desa", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Ketersediaan BTS</label>
                    <select
                      value={formData.has_bts ?? "false"}
                      onChange={(e) => handleChange("has_bts", e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="false">Tanpa BTS</option>
                      <option value="true">Ada BTS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Kualitas Sinyal</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sinyal Lemah / Edge"
                      value={formData.kualitas_sinyal || ""}
                      onChange={(e) => handleChange("kualitas_sinyal", e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
                        isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          </div>

          {/* Action Buttons (Fixed Bottom) */}
          <div className={`p-4 sm:p-5 border-t shrink-0 flex items-center justify-end gap-3 ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-body font-bold transition-all ${
                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 bg-gradient-to-r text-white font-body font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95 ${
                isEdit
                  ? "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                  : "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEdit ? "Memperbarui..." : "Menyimpan..."}</span>
                </>
              ) : (
                <>
                  {isEdit ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isEdit ? "Simpan Perubahan" : "Simpan ke Database"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
