import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { ApiService } from "../../services/api.service";
import { useAuth } from "../../context/AuthContext";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (token: string, user: any) => void;
  isDark: boolean;
}

export function AdminAuthModal({ isOpen, onClose, onSuccess, isDark }: AdminAuthModalProps) {
  const { loginSuccess } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: prevent double-click / concurrent submissions
    if (loading) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await ApiService.loginAdmin({ username, password });
      if (res.success && res.token) {
        loginSuccess(res.token, res.user);
        if (onSuccess) onSuccess(res.token, res.user);
        onClose();
      } else {
        setErrorMsg("Login gagal. Periksa username & password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi server autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl transition-all ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                Autentikasi Admin Kominfo
              </h3>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Hanya Administrator berwenang yang dapat menambah data
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Username Admin *
            </label>
            <div className="relative">
              <User className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                required
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono border focus:outline-none ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white focus:border-blue-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono font-bold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Password Admin *
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono border focus:outline-none ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-white focus:border-blue-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-2.5 p-0.5 ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className={`p-3 rounded-xl border text-[11px] font-mono ${
            isDark ? "bg-slate-950/80 border-slate-800 text-slate-400" : "bg-blue-50/50 border-blue-200 text-slate-700"
          }`}>
            <span className="font-bold block text-blue-600 dark:text-blue-400">Kredensial Default Admin:</span>
            <span>Username: <strong className="text-emerald-500">admin</strong> | Password: <strong className="text-emerald-500">admin</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
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
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-body font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifikasi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login & Lanjutkan</span>
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
