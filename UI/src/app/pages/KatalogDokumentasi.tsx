import { Terminal } from "lucide-react";

export function KatalogDokumentasi({ isDark }: { isDark: boolean }) {
  return (
    <div className={`p-6 rounded-3xl border space-y-6 ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/80 shadow-sm"}`}>
      <div>
        <h2 className={`text-lg font-heading font-extrabold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          <Terminal className="w-5 h-5 text-blue-500" /> Katalog & Environment Integrasi PPU
        </h2>
        <p className={`text-xs font-body mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Spesifikasi Postman Environment & cURL request untuk pengembang aplikasi Pemkab PPU.
        </p>
      </div>

      <div className={`p-4 rounded-2xl font-mono text-xs border ${isDark ? "bg-slate-950 border-slate-800 text-emerald-400" : "bg-slate-900 text-emerald-400"}`}>
        <p className="text-slate-500">// Environment File: bkpsdmppu_layanan.postman_environment.json</p>
        <p className="mt-2">curl -X POST https://simpeg.penajamkab.go.id/api/v1/pegawai \</p>
        <p className="pl-4">-H "Content-Type: application/json" \</p>
        <p className="pl-4">-H "X-Ukey: Bkpsdm" \</p>
        <p className="pl-4">-H "X-Client-Id: kominfo" \</p>
        <p className="pl-4">-d '{"{"}"nip": "198501152010011002"{"}"}'</p>
      </div>
    </div>
  );
}
