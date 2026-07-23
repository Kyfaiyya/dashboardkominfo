import type React from "react";

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  category: string;
  accessUrl: string;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  category: "DASHBOARD" | "PERANGKAT DAERAH (OPD)" | "DOKUMENTASI";
  badge?: string;
}

export interface SidebarProps {
  activeSection: string;
  setActiveSection: (s: string) => void;
  isDark: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
