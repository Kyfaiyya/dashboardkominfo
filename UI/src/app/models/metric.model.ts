import { Users, Building2, HeartHandshake, Server } from "lucide-react";
import type { KPI } from "../data/types";
import type { Metric } from "../context/RealtimeContext";

/**
 * Metric Model - Default public KPIs and transformation logic
 */
export function getDefaultKpis(): KPI[] {
  return [
    { id: "asn", label: "Total Pegawai ASN & PPPK", value: 4892, unit: "pegawai", change: 2.1, icon: Users, color: "#2563EB" },
    { id: "opd", label: "Perangkat Daerah (OPD)", value: 34, unit: "unit OPD", change: 0.0, icon: Building2, color: "#F59E0B" },
    { id: "services", label: "Layanan Publik Digital", value: 6, unit: "layanan", change: 5.0, icon: HeartHandshake, color: "#10B981" },
    { id: "status", label: "Status Portal BKPSDM", value: 100, unit: "% aktif", change: 0.0, icon: Server, color: "#06B6D4" },
  ];
}

/**
 * Model function to update KPIs from realtime metrics
 */
export function syncKpisWithMetrics(prevKpis: KPI[], metrics: Metric[]): KPI[] {
  if (!metrics || metrics.length === 0) return prevKpis;
  const citizens = metrics.find((m) => m.id === "totalAsn");

  return prevKpis.map((k) => {
    if (k.id === "asn" && citizens) {
      return { ...k, value: citizens.numericValue };
    }
    return k;
  });
}
