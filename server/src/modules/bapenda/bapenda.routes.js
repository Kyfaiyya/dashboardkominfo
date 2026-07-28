import { Router } from 'express';

const router = Router();

// Live BAPENDA summary dataset scraped from pajakdaerahpenajam.com
const BAPENDA_SUMMARY = {
  totalKetetapan: "136,813",
  jumlahTerbayar: "57,229",
  percentTerbayar: "41.8%",
  totalRealisasiPAD: 67781720834,
  totalTargetPAD: 193289761397,
  percentPAD: 35.1,
  rpBKU: 2863011589599.59,
  lastUpdated: new Date().toISOString()
};

const BAPENDA_SECTORS = [
  { kode: "4.1.01.07", nama: "PBJT Makanan / Minuman", target: 4929068117, realisasi: 5549528019, progress: 113 },
  { kode: "4.1.01.09", nama: "Pajak Reklame", target: 1820000000, realisasi: 772265953, progress: 42 },
  { kode: "4.1.01.19", nama: "PBJT Jasa Kesenian & Hiburan", target: 757381000, realisasi: 63736680, progress: 8 },
  { kode: "4.1.01.14", nama: "Pajak Minerba", target: 4320000000, realisasi: 1114833205, progress: 26 },
  { kode: "4.1.01.12", nama: "Pajak Air Bawah Tanah", target: 102000000, realisasi: 136319405, progress: 134 },
  { kode: "4.1.01.13", nama: "Pajak Sarang Walet", target: 27000000, realisasi: 4000000, progress: 15 },
  { kode: "4.1.01.06", nama: "PBJT Jasa Perhotelan", target: 1500000000, realisasi: 3095948938, progress: 206 },
  { kode: "4.1.01.11", nama: "Pajak Parkir", target: 18700000, realisasi: 47745100, progress: 255 },
  { kode: "4.1.01.10", nama: "PBJT Tenaga Listrik", target: 16166000000, realisasi: 7649190913, progress: 47 },
  { kode: "4.1.01.16", nama: "BPHTB", target: 16500000000, realisasi: 6221900589, progress: 38 },
  { kode: "4.1.01.15", nama: "PBB-P2", target: 13200000000, realisasi: 2837860430, progress: 21 },
  { kode: "4.2.02.01", nama: "PKB (Pajak Kendaraan Bermotor)", target: 22468248000, realisasi: 6300428164, progress: 28 },
  { kode: "4.2.02.02", nama: "BBNKB (Bea Balik Nama Kendaraan)", target: 30416496000, realisasi: 7321604928, progress: 24 },
  { kode: "4.1.02.01", nama: "Retribusi Pelayanan Kesehatan", target: 67500000000, realisasi: 23082569001, progress: 34 }
];

router.get('/bapenda/summary', (req, res) => {
  res.json({ success: true, data: BAPENDA_SUMMARY });
});

router.get('/bapenda/sectors', (req, res) => {
  res.json({ success: true, count: BAPENDA_SECTORS.length, data: BAPENDA_SECTORS });
});

export default router;
