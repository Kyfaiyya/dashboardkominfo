/**
 * Mock data generator — simulates the external API response
 * when USE_MOCK_API=true. Produces realistic, slightly varying
 * data so the dashboard feels alive during development.
 */

export function generateMockData() {
  const now = new Date();

  return {
    metrics: {
      energyUsage: randomBetween(55, 85),
      energyChange: randomBetween(-3, 8),
      waterQuality: randomBetween(88, 99),
      waterChange: randomBetween(-1, 5),
      airQuality: randomBetween(25, 70),
      airTrend: pickRandom(['Stable', 'Improving', 'Declining']),
      activeCitizens: randomBetween(1_900_000, 2_300_000),
      citizensChange: randomBetween(5, 18),
    },
    energy: generateTimeSeriesData(now),
    traffic: generateTrafficData(),
    stats: {
      smartBuildings: randomBetween(480, 530),
      happyCitizens: +(randomBetween(19, 24) / 10).toFixed(1),
      carbonReduction: randomBetween(30, 42),
      awardsWon: randomBetween(14, 20),
    },
    projects: [
      {
        title: 'Smart Transportation Hub',
        description: 'Multi-modal transit center integrating bus, rail, and bike-sharing with real-time tracking.',
        status: 'In Progress',
        completion: randomBetween(60, 75),
        location: 'Downtown District',
        deadline: 'Dec 2026',
        image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800',
      },
      {
        title: 'Green Energy Initiative',
        description: 'Solar panel installation across government buildings to reduce carbon footprint by 40%.',
        status: 'Completed',
        completion: 100,
        location: 'Citywide',
        deadline: 'Jan 2026',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      },
      {
        title: 'Community Digital Centers',
        description: 'Network of accessible tech hubs providing free internet and digital literacy training.',
        status: 'Planning',
        completion: randomBetween(20, 35),
        location: 'All Districts',
        deadline: 'Mar 2027',
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
      },
    ],
    datasets: [
      {
        title: 'Population Demographics',
        description: 'Comprehensive census data and population statistics updated quarterly',
        downloads: randomBetween(12000, 13000),
        updated: pickRandom(['Today', '1 day ago', '2 days ago']),
        format: ['CSV', 'JSON', 'XML'],
        category: 'Demographics',
      },
      {
        title: 'Transportation Network',
        description: 'Real-time public transit routes, schedules, and traffic flow data',
        downloads: randomBetween(8500, 9500),
        updated: 'Today',
        format: ['JSON', 'GeoJSON'],
        category: 'Transport',
      },
      {
        title: 'Environmental Monitoring',
        description: 'Air quality, water quality, and environmental sensor readings',
        downloads: randomBetween(5800, 6800),
        updated: pickRandom(['Today', '1 day ago']),
        format: ['CSV', 'API'],
        category: 'Environment',
      },
      {
        title: 'Business Registry',
        description: 'Complete database of registered businesses and licenses',
        downloads: randomBetween(14500, 16000),
        updated: pickRandom(['2 days ago', '3 days ago']),
        format: ['CSV', 'JSON'],
        category: 'Business',
      },
    ],
  };
}

function generateTimeSeriesData(now = new Date()) {
  const points = [];
  const nowMs = now.getTime();
  for (let i = 10; i >= 0; i--) {
    const t = new Date(nowMs - i * 30 * 1000);
    const timeStr = t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    points.push({
      time: timeStr,
      value: randomBetween(25, 90),
    });
  }
  return points;
}

function generateTrafficData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    count: day === 'Sat' || day === 'Sun'
      ? randomBetween(200, 350)
      : randomBetween(350, 550),
  }));
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
