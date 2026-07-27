import { useState } from "react";
import type { PegawaiASN } from "../../context/RealtimeContext";
import { getPegawaiDataByNip, type CompletePegawaiData } from "../../models/pegawai.model";

export type BkpsdmTabType =
  | "presensi"
  | "profil"
  | "jabatan"
  | "kinerja"
  | "karir"
  | "cuti"
  | "pendidikan"
  | "pensiun";

export function useBkpsdmController(samplePegawai?: PegawaiASN[]) {
  const [nipInput, setNipInput] = useState("");
  const [activeTab, setActiveTab] = useState<BkpsdmTabType>("presensi");
  const [loading, setLoading] = useState(false);

  // Compute current pegawai data from Model repository helper
  const currentData: CompletePegawaiData | null = getPegawaiDataByNip(
    nipInput,
    samplePegawai
  );

  const handleLookup = (selectedNip?: string) => {
    const target = selectedNip || nipInput;
    setNipInput(target);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  return {
    nipInput,
    setNipInput,
    activeTab,
    setActiveTab,
    loading,
    currentData,
    handleLookup,
  };
}
