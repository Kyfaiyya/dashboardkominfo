import { useState, useEffect } from "react";
import { useRealtimeData } from "../context/RealtimeContext";
import { getDefaultKpis, syncKpisWithMetrics } from "../models/metric.model";
import type { KPI } from "../data/types";
import { ApiService } from "../services/api.service";

export function useDashboardController() {
  const { metrics, samplePegawai } = useRealtimeData();
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("Beranda Utama");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic Governance Rules
  const [pageConfigs, setPageConfigs] = useState<Record<string, boolean>>({});
  const [tabConfigs, setTabConfigs] = useState<Record<string, Record<string, boolean>>>({});

  const loadGovernanceConfigs = async () => {
    try {
      const res = await ApiService.getGovernanceNavigation();
      if (res?.pages) {
        const pagesMap: Record<string, boolean> = {};
        res.pages.forEach((p: any) => {
          pagesMap[p.page_key] = p.is_public;
        });
        setPageConfigs(pagesMap);
      }

      if (res?.tabs) {
        const tabsMap: Record<string, Record<string, boolean>> = {};
        res.tabs.forEach((t: any) => {
          if (!tabsMap[t.page_key]) tabsMap[t.page_key] = {};
          tabsMap[t.page_key][t.tab_key] = t.is_public;
        });
        setTabConfigs(tabsMap);
      }
    } catch (err) {
      console.error("Failed to load governance configs:", err);
    }
  };

  useEffect(() => {
    loadGovernanceConfigs();
  }, []);

  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const isDark = theme === "dark";

  // Sync document root class with theme for Tailwind dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
    pageConfigs,
    tabConfigs,
    reloadGovernanceConfigs: loadGovernanceConfigs,
  };
}
