import {
  LayoutDashboard, Globe, Users, Database,
  CreditCard, FileText, Terminal,
} from "lucide-react";
import type { ServiceItem, NavItem } from "./types";

// ─── Public Services ──────────────────────────────────────────────────────────

export const PUBLIC_SERVICES: ServiceItem[] = [
  {
    name: "SIMPEG Portal Utama PPU",
    description: "Sistem Informasi Kepegawaian Terpadu Kabupaten Penajam Paser Utara.",
    category: "Portal Utama",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan E-Kinerja ASN",
    description: "Pengisian dan pemantauan Sasaran Kinerja Pegawai (SKP) harian ASN PPU.",
    category: "Kinerja Pegawai",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Presensi Mobile ASN PPU",
    description: "Sistem absensi berbasis lokasi GPS dan pencatatan kehadiran pegawai.",
    category: "Kehadiran",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Kenaikan Pangkat (KP) Online",
    description: "Pengusulan Kenaikan Pangkat digital tanpa berkas fisik terintegrasi BKN.",
    category: "Karir & Pangkat",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Cuti Online ASN",
    description: "Pengajuan dan verifikasi cuti tahunan dan cuti alasan penting ASN PPU.",
    category: "Kepegawaian",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
  {
    name: "Layanan Pensiun & Gaji Berkala",
    description: "Pemrosesan penetapan pensiun dan Kenaikan Gaji Berkala (KGB) ASN PPU.",
    category: "Kesejahteraan",
    accessUrl: "https://simpeg.penajamkab.go.id/",
  },
];

// ─── OPD Distribution (Pie Chart) ─────────────────────────────────────────────

export const OPD_DISTRIBUTION = [
  { name: "BKPSDM PPU", value: 1240, percent: "25%" },
  { name: "Diskominfo PPU", value: 890, percent: "18%" },
  { name: "Secretariat Daerah", value: 1120, percent: "23%" },
  { name: "Dinas Kesehatan", value: 950, percent: "19%" },
  { name: "Dinas Pendidikan", value: 740, percent: "15%" },
];

export const CHART_COLORS = ["#2563EB", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

// ─── Public Datasets ──────────────────────────────────────────────────────────

export const PUBLIC_DATASETS = [
  {
    title: "Statistik Rekapitulasi ASN Penajam Paser Utara 2026",
    description: "Rekapitulasi jumlah PNS & PPPK berdasarkan Perangkat Daerah, Pendidikan, dan Golongan.",
    updated: "Juli 2026",
    fileSize: "2.4 MB",
  },
  {
    title: "Peta Jabatan & Bezetting Formasi ASN PPU",
    description: "Informasi peta jabatan dan ketersediaan formasi pegawai di Perangkat Daerah PPU.",
    updated: "Juni 2026",
    fileSize: "1.8 MB",
  },
];

// ─── BKPSDM Statistics Charts Datasets ────────────────────────────────────────

export const BKPSDM_ATTENDANCE_TREND = [
  { hari: "17 Jul", tepatWaktu: 185, terlambat: 12, izinDinas: 8 },
  { hari: "18 Jul", tepatWaktu: 190, terlambat: 8, izinDinas: 7 },
  { hari: "19 Jul", tepatWaktu: 178, terlambat: 15, izinDinas: 12 },
  { hari: "20 Jul", tepatWaktu: 192, terlambat: 6, izinDinas: 7 },
  { hari: "21 Jul", tepatWaktu: 188, terlambat: 10, izinDinas: 7 },
  { hari: "22 Jul", tepatWaktu: 194, terlambat: 5, izinDinas: 6 },
  { hari: "23 Jul", tepatWaktu: 191, terlambat: 7, izinDinas: 7 },
];

export const GOLONGAN_DISTRIBUTION = [
  { golongan: "Golongan I", pns: 120, pppk: 450 },
  { golongan: "Golongan II", pns: 840, pppk: 920 },
  { golongan: "Golongan III", pns: 1680, pppk: 410 },
  { golongan: "Golongan IV", pns: 472, pppk: 0 },
];

export const JABATAN_COMPOSITION = [
  { name: "Fungsional Tertentu", value: 2150, percent: "44%" },
  { name: "Pelaksana / Admin", value: 1620, percent: "33%" },
  { name: "Struktural (Eselon)", value: 680, percent: "14%" },
  { name: "Fungsional Umum", value: 442, percent: "9%" },
];

export const PENDIDIKAN_DISTRIBUTION = [
  { jenjang: "S3 (Doktor)", count: 28 },
  { jenjang: "S2 (Magister)", count: 480 },
  { jenjang: "S1 (Sarjana)", count: 2840 },
  { jenjang: "D3 (Diploma)", count: 850 },
  { jenjang: "SMA / Sederajat", count: 694 },
];

// ─── Navigation Items ─────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Beranda Utama", category: "DASHBOARD" },
  { icon: Database, label: "BKPSDM PPU", category: "PERANGKAT DAERAH (OPD)", badge: "Live" },
  { icon: Globe, label: "Diskominfo PPU", category: "PERANGKAT DAERAH (OPD)", badge: "Ready" },
  { icon: Users, label: "Disdukcapil PPU", category: "PERANGKAT DAERAH (OPD)", badge: "Ready" },
  { icon: CreditCard, label: "BKAD PPU", category: "PERANGKAT DAERAH (OPD)", badge: "Ready" },
  { icon: FileText, label: "DPMPTSP PPU", category: "PERANGKAT DAERAH (OPD)", badge: "Beta" },
  { icon: Terminal, label: "Katalog Dokumentasi", category: "DOKUMENTASI", badge: "v1.0" },
];
