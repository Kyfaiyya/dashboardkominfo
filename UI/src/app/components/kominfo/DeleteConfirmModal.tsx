import { useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { ApiService } from "../../services/api.service";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDark: boolean;
  token?: string;
  entity: string;
  itemId: number;
  itemName?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  isDark,
  token,
  entity,
  itemId,
  itemName,
}: DeleteConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    setErrorMsg("");

    try {
      await ApiService.deleteKominfoItem(entity, itemId, token);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || `Gagal menghapus data ${entity}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Trash2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className={`text-lg font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Konfirmasi Hapus Data
            </h3>
            <p className={`text-xs font-body mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Apakah Anda yakin ingin menghapus data <strong className="text-rose-500">{itemName || `#${itemId}`}</strong> dari kategori <span className="uppercase font-mono font-bold text-blue-500">{entity}</span>?
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">Tindakan ini akan menghapus data secara permanen dari database PostgreSQL.</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`px-5 py-2.5 rounded-xl text-xs font-body font-bold transition-all ${
                isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-body font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Permanen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
