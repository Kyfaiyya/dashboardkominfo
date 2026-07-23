import { logger } from '../utils/logger.js';

/**
 * Normalize raw API response into internal dashboard format.
 * This module acts as the translation layer between the external API's
 * data structure and what our frontend components expect.
 *
 * Adjust the mapping in this file when the external API format changes.
 */

/**
 * @param {object} rawData - Raw response from external API
 * @returns {object} Normalized dashboard data
 */
export function normalizeData(rawData) {
  try {
    return {
      environmentConfig: rawData.environmentConfig || null,
      services: rawData.services || [],
      samplePegawai: rawData.samplePegawai || [],
      metrics: normalizeMetrics(rawData.metrics || rawData),
      energyChart: normalizeTimeSeries(rawData.energy || rawData.energyData || []),
      trafficChart: normalizeBarSeries(rawData.traffic || rawData.trafficData || []),
      stats: normalizeStats(rawData.stats || rawData.statistics || rawData),
      projects: normalizeProjects(rawData.projects || []),
      datasets: normalizeDatasets(rawData.datasets || rawData.openData || []),
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    logger.error('Data normalization failed:', err.message);
    throw new Error(`Normalization error: ${err.message}`);
  }
}

function normalizeMetrics(data) {
  // Maps to BKPSDM PPU Dashboard metric cards
  return [
    {
      id: 'totalAsn',
      label: 'Total Pegawai ASN PPU',
      value: formatLargeNumber(data.totalAsn ?? 4892),
      trend: formatTrend(data.asnChange ?? 2.1),
      numericValue: data.totalAsn ?? 4892,
    },
    {
      id: 'simpegUptime',
      label: 'Health Uptime SIMPEG',
      value: `${(data.simpegUptime ?? 99.95).toFixed(2)}%`,
      trend: formatTrend(data.simpegChange ?? 0.02),
      numericValue: data.simpegUptime ?? 99.95,
    },
    {
      id: 'verifikasiNip',
      label: 'Verifikasi NIP Hari Ini',
      value: formatLargeNumber(data.verifikasiNipToday ?? 1480),
      trend: formatTrend(data.verifikasiChange ?? 8.4),
      numericValue: data.verifikasiNipToday ?? 1480,
    },
    {
      id: 'apiRequests',
      label: 'Volume API SIMPEG',
      value: formatLargeNumber(data.apiRequestsPerHour ?? 28400),
      trend: formatTrend(data.requestsChange ?? 12.5),
      numericValue: data.apiRequestsPerHour ?? 28400,
    },
  ];
}

function normalizeTimeSeries(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map((point) => ({
    time: point.time || point.timestamp || point.t,
    value: Number(point.value ?? point.v ?? 0),
  }));
}

function normalizeBarSeries(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map((point) => ({
    day: point.day || point.label || point.d,
    count: Number(point.count ?? point.value ?? point.c ?? 0),
  }));
}

function normalizeStats(data) {
  return [
    {
      id: 'unitKerja',
      value: data.unitKerja ?? 34,
      suffix: ' OPD',
      label: 'Unit Kerja / OPD PPU',
    },
    {
      id: 'asnAktif',
      value: data.asnAktif ?? 4892,
      suffix: ' ASN',
      label: 'ASN & PPPK Aktif',
    },
    {
      id: 'layananDigital',
      value: data.layananDigital ?? 12,
      suffix: ' Modul',
      label: 'Layanan Digital SIMPEG',
    },
    {
      id: 'integrasiSistem',
      value: data.integrasiSistem ?? 8,
      suffix: ' Endpoint',
      label: 'Terintegrasi BKN & Kominfo',
    },
  ];
}

function normalizeProjects(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map((project) => ({
    title: project.title || project.name,
    description: project.description || project.desc || '',
    status: project.status || 'Planning',
    completion: typeof project.completion === 'number'
      ? `${project.completion}%`
      : project.completion || '0%',
    completionNumeric: typeof project.completion === 'number'
      ? project.completion
      : parseInt(project.completion, 10) || 0,
    location: project.location || project.area || '',
    deadline: project.deadline || project.targetDate || '',
    image: project.image || project.imageUrl || '',
  }));
}

function normalizeDatasets(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map((dataset) => ({
    title: dataset.title || dataset.name,
    description: dataset.description || '',
    downloads: formatLargeNumber(dataset.downloads ?? 0),
    downloadsNumeric: dataset.downloads ?? 0,
    updated: dataset.updated || dataset.lastUpdated || 'Unknown',
    format: dataset.format || dataset.formats || [],
    category: dataset.category || 'General',
  }));
}

// --- Helper functions ---

function formatValue(num, suffix = '') {
  return `${Math.round(num)}${suffix}`;
}

function formatTrend(value) {
  if (typeof value === 'string') return value;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
}

function formatLargeNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function getAirQualityLabel(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (SG)';
  if (aqi <= 200) return 'Unhealthy';
  return 'Hazardous';
}
