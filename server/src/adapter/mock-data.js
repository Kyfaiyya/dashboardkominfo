/**
 * Mock data generator for BKPSDM PPU (Penajam Paser Utara)
 * Source environment: bkpsdmppu_layanan.postman_environment.json
 * Target service: https://simpeg.penajamkab.go.id/
 */

export function generateMockData() {
  const now = new Date();

  return {
    environmentConfig: {
      id: "001ca844-f012-4e15-bedc-7ae4164dedb7",
      name: "BKPSDPPU",
      targetUrl: "https://simpeg.penajamkab.go.id/",
      values: [
        { key: "uri_service", value: "https://simpeg.penajamkab.go.id/", type: "default", enabled: true },
        { key: "ukey", value: "Bkpsdm", type: "default", enabled: true },
        { key: "pkey", value: "p3n4j4m", type: "default", enabled: true },
        { key: "token", value: "token", enabled: true },
        { key: "send_data", value: '{"nip":"--isiNIP--"}', enabled: true },
        { key: "passcode", value: "passcode", enabled: true },
        { key: "account", value: "account", enabled: true },
        { key: "clientId", value: "kominfo", enabled: true },
        { key: "getCode", value: "nip", enabled: true }
      ],
      exportedAt: "2025-02-14T03:01:33.216Z"
    },

    metrics: {
      totalAsn: randomBetween(4800, 4950),
      asnChange: randomBetween(1, 4),
      simpegUptime: 99.95,
      simpegChange: 0.02,
      verifikasiNipToday: randomBetween(1200, 1800),
      verifikasiChange: randomBetween(5, 12),
      apiRequestsPerHour: randomBetween(24000, 32000),
      requestsChange: randomBetween(8, 15),
    },

    energy: generateTimeSeriesData(now),
    traffic: generateTrafficData(),

    stats: {
      unitKerja: 34,
      asnAktif: 4892,
      layananDigital: 12,
      integrasiSistem: 8,
    },

    services: [
      { service: "SIMPEG - Layanan E-Kinerja ASN", requests: randomBetween(15000, 18000), uptime: 99.98, latency: randomBetween(35, 50), status: "online", category: "Kinerja Pegawai" },
      { service: "SIMPEG - Presensi & Absensi Mobile", requests: randomBetween(28000, 35000), uptime: 99.95, latency: randomBetween(25, 40), status: "online", category: "Kehadiran" },
      { service: "SIMPEG - Kenaikan Pangkat (KP) Online", requests: randomBetween(4200, 5100), uptime: 99.80, latency: randomBetween(65, 90), status: "online", category: "Karir ASN" },
      { service: "SIMPEG - Cuti Online ASN PPU", requests: randomBetween(3100, 3800), uptime: 99.90, latency: randomBetween(40, 60), status: "online", category: "Layanan Kepegawaian" },
      { service: "SIMPEG - Mutasi & Promosi Jabatan", requests: randomBetween(1800, 2400), uptime: 98.60, latency: randomBetween(110, 140), status: "degraded", category: "Karir ASN" },
      { service: "SIMPEG - Layanan Pensiun & Gaji Berkala", requests: randomBetween(2100, 2900), uptime: 99.88, latency: randomBetween(55, 75), status: "online", category: "Kesejahteraan" },
    ],

    samplePegawai: [
      { nip: "198501152010011002", nama: "Dr. H. Ahmad Fauzi, S.STP., M.Si", jabatan: "Kepala Dinas / Utama", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/b", status: "Aktif" },
      { nip: "199003202015022001", nama: "Siti Rahmah, S.Kom", jabatan: "Pranata Komputer Ahli Muda", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "III/c", status: "Aktif" },
      { nip: "197805102005011005", nama: "Bambang Setiawan, S.H., M.H.", jabatan: "Kabid Pengadaan & Mutasi", unitKerja: "BKPSDM Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
      { nip: "199407122019032008", nama: "Dewi Lestari, S.E.", jabatan: "Analis Kepegawaian Muda", unitKerja: "Secretariat Daerah PPU", gol: "III/b", status: "Aktif" },
      { nip: "198211042008011003", nama: "Ir. Hendra Wijaya", jabatan: "Pranata Komputer Ahli Madya", unitKerja: "Diskominfo Kab. Penajam Paser Utara", gol: "IV/a", status: "Aktif" },
    ],

    projects: [
      {
        title: "Integrasi Portal SIMPEG PPU & Diskominfo",
        description: "Integrasi endpoint SIMPEG Penajam Paser Utara dengan Service Bus Kominfo untuk SSO dan Verifikasi Data NIP.",
        status: "In Progress",
        completion: 85,
        location: "BKPSDM & Diskominfo PPU",
        deadline: "Maret 2026",
        image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=800",
      },
      {
        title: "Digitalisasi Presensi & E-Kinerja ASN",
        description: "Penerapan sistem presensi berbasis GPS & penginputan E-Kinerja Harian ASN Kabupaten Penajam Paser Utara.",
        status: "Completed",
        completion: 100,
        location: "Seluruh OPD PPU",
        deadline: "Januari 2026",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      },
      {
        title: "Layanan Kenaikan Pangkat Paperless",
        description: "Pengusulan Kenaikan Pangkat ASN secara digital tanpa berkas fisik terintegrasi dengan BKN.",
        status: "Planning",
        completion: 40,
        location: "BKPSDM PPU",
        deadline: "Juni 2026",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
      },
    ],
    datasets: [
      {
        title: "Data Statistik ASN Kabupaten Penajam Paser Utara",
        description: "Rekapitulasi jumlah Pegawai Negeri Sipil & PPPK berdasarkan Jabatan, Pendidikan, dan OPD",
        downloads: 14200,
        updated: "Hari ini",
        format: ["JSON", "CSV", "PDF"],
        category: "Kepegawaian",
      },
      {
        title: "Data Peta Jabatan & Bezetting ASN PPU",
        description: "Struktur peta jabatan dan formasi kosong di seluruh Perangkat Daerah PPU",
        downloads: 9800,
        updated: "Kemarin",
        format: ["JSON", "XLSX"],
        category: "Formasi",
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
      value: randomBetween(45, 95),
    });
  }
  return points;
}

function generateTrafficData() {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days.map((day) => ({
    day,
    count: day === 'Sabtu' || day === 'Minggu'
      ? randomBetween(1200, 1800)
      : randomBetween(4500, 6800),
  }));
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

