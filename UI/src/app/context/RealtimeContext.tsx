import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useSocket, type ConnectionStatus } from '../hooks/useSocket';

export interface Metric {
  id: string;
  label: string;
  value: string;
  trend: string;
  numericValue: number;
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface BarPoint {
  day: string;
  count: number;
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  status: string;
  completion: string;
  completionNumeric: number;
  location: string;
  deadline: string;
  image: string;
}

export interface Dataset {
  title: string;
  description: string;
  downloads: string;
  downloadsNumeric: number;
  updated: string;
  format: string[];
  category: string;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  type?: string;
  enabled?: boolean;
}

export interface EnvironmentConfig {
  id: string;
  name: string;
  targetUrl: string;
  values: EnvironmentVariable[];
  exportedAt: string;
}

export interface SimpegService {
  service: string;
  requests: number;
  uptime: number;
  latency: number;
  status: "online" | "degraded" | "offline";
  category: string;
}

export interface PegawaiASN {
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  gol: string;
  status: string;
}

export interface DashboardData {
  environmentConfig?: EnvironmentConfig | null;
  services?: SimpegService[];
  samplePegawai?: PegawaiASN[];
  metrics: Metric[];
  energyChart: ChartPoint[];
  trafficChart: BarPoint[];
  stats: Stat[];
  projects: Project[];
  datasets: Dataset[];
  timestamp: string | null;
}

interface RealtimeContextValue extends DashboardData {
  connectionStatus: ConnectionStatus;
  lastUpdate: string | null;
  requestRefresh: () => void;
}

const DEFAULT_DATA: DashboardData = {
  environmentConfig: null,
  services: [],
  samplePegawai: [],
  metrics: [],
  energyChart: [],
  trafficChart: [],
  stats: [],
  projects: [],
  datasets: [],
  timestamp: null,
};

const CACHE_KEY = 'dashboard:cached-data';

function loadCachedData(): DashboardData {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return { ...DEFAULT_DATA, ...JSON.parse(cached) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_DATA;
}

function saveCachedData(data: DashboardData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { status, lastUpdate, subscribe, requestRefresh } = useSocket();
  const [data, setData] = useState<DashboardData>(loadCachedData);

  const updateData = useCallback((newData: Partial<DashboardData>) => {
    setData((prev) => {
      const merged = { ...prev, ...newData };
      saveCachedData(merged);
      return merged;
    });
  }, []);

  // Listen for initial data (on connect)
  useEffect(() => {
    const unsubInitial = subscribe('data:initial', (payload: DashboardData) => {
      console.log('📡 [Socket.IO] Data Awal Diterima dari Backend:', payload);
      updateData(payload);
    });

    return unsubInitial;
  }, [subscribe, updateData]);

  // Listen for realtime updates
  useEffect(() => {
    const unsubUpdate = subscribe('data:update', (payload: DashboardData) => {
      console.log('📡 [Socket.IO] Data Update Realtime Diterima:', payload);
      updateData(payload);
    });

    return unsubUpdate;
  }, [subscribe, updateData]);

  const value: RealtimeContextValue = {
    ...data,
    connectionStatus: status,
    lastUpdate: data.timestamp || lastUpdate,
    requestRefresh,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeData(): RealtimeContextValue {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeData must be used within a RealtimeProvider');
  }
  return context;
}
