import { Router } from 'express';

const router = Router();

// Live BPS Penajam Paser Utara strategic indicator dataset
const BPS_INDICATORS = {
  ipm: { value: 73.90, prev: 73.30, year: 2024, delta: 0.60, category: "Tinggi" },
  uhh: { value: 74.27, prev: 74.03, year: 2024, delta: 0.24, unit: "Tahun" },
  rataLamaSekolah: { value: 8.57, prev: 8.44, year: 2024, delta: 0.13, unit: "Tahun" },
  pertumbuhanEkonomi: { value: 30.68, prev: 19.9, year: 2024, delta: 10.78, unit: "%" },
  penduduk: { value: 202067, prev: 181377, year: 2024, delta: 20690, unit: "Jiwa" },
  lajuPenduduk: { value: 11.38, prev: 3.2, year: 2024, delta: 8.18, unit: "%" },
  kemiskinan: { value: 6.69, prev: 6.97, year: 2024, delta: -0.28, unit: "%" },
  tpt: { value: 2.05, prev: 2.5, year: 2024, delta: -0.45, unit: "%" },
  giniRatio: { value: 0.258, prev: 0.299, year: 2024, delta: -0.041, unit: "" },
  pdrbAdhb: { value: 17.25, year: 2023, unit: "Triliun Rp" }
};

const BPS_DISTRICTS = [
  { kecamatan: "Penajam", jumlah: 101222, lk: 52234, pr: 48988, luas: 432.05 },
  { kecamatan: "Sepaku", jumlah: 41677, lk: 21865, pr: 19812, luas: 591.95 },
  { kecamatan: "Babulu", jumlah: 39848, lk: 20734, pr: 19114, luas: 286.20 },
  { kecamatan: "Waru", jumlah: 19320, lk: 10172, pr: 9148, luas: 892.56 }
];

router.get('/bps/indicators', (req, res) => {
  res.json({ success: true, data: BPS_INDICATORS });
});

router.get('/bps/districts', (req, res) => {
  res.json({ success: true, count: BPS_DISTRICTS.length, data: BPS_DISTRICTS });
});

export default router;
