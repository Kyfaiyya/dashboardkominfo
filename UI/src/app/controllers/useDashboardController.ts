import { useState, useEffect } from "react";
import { useRealtimeData } from "../context/RealtimeContext";
import { getDefaultKpis, syncKpisWithMetrics } from "../models/metric.model";
import type { KPI } from "../data/types";

export function useDashboardController() {
  const { metrics, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Beranda Utama");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "dark";

  // KPIs State
  const [kpis, setKpis] = useState<KPI[]>(getDefaultKpis());

  // Sync metrics from realtime context via Model function
  useEffect(() => {
    setKpis((prev) => syncKpisWithMetrics(prev, metrics));
  }, [metrics]);

  // Update clock time
  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  return {
    isDark,
    theme,
    toggleTheme,
    time,
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    kpis,
    samplePegawai,
    metrics,
  };
}
