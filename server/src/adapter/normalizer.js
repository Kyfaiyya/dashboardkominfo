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
  // Maps to SmartCityDashboard metric cards
  return [
    {
      id: 'energy',
      label: 'Energy Usage',
      value: formatValue(data.energyUsage ?? data.energy ?? 68, '%'),
      trend: formatTrend(data.energyTrend ?? data.energyChange ?? 5),
      numericValue: data.energyUsage ?? data.energy ?? 68,
    },
    {
      id: 'water',
      label: 'Water Quality',
      value: formatValue(data.waterQuality ?? data.water ?? 95, '%'),
      trend: formatTrend(data.waterTrend ?? data.waterChange ?? 2),
      numericValue: data.waterQuality ?? data.water ?? 95,
    },
    {
      id: 'air',
      label: 'Air Quality',
      value: getAirQualityLabel(data.airQuality ?? data.aqi ?? 42),
      trend: data.airTrend ?? 'Stable',
      numericValue: data.airQuality ?? data.aqi ?? 42,
    },
    {
      id: 'citizens',
      label: 'Active Citizens',
      value: formatLargeNumber(data.activeCitizens ?? data.citizens ?? 2100000),
      trend: formatTrend(data.citizensTrend ?? data.citizensChange ?? 12),
      numericValue: data.activeCitizens ?? data.citizens ?? 2100000,
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
      id: 'buildings',
      value: data.smartBuildings ?? data.buildings ?? 500,
      suffix: '+',
      label: 'Smart Buildings',
    },
    {
      id: 'citizens',
      value: data.happyCitizens ?? data.totalCitizens ?? 2.1,
      suffix: 'M',
      label: 'Happy Citizens',
    },
    {
      id: 'carbon',
      value: data.carbonReduction ?? data.carbon ?? 35,
      suffix: '%',
      label: 'Carbon Reduction',
    },
    {
      id: 'awards',
      value: data.awardsWon ?? data.awards ?? 15,
      suffix: '+',
      label: 'Awards Won',
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
