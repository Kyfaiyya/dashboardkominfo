import type { PegawaiASN } from "../context/RealtimeContext";

export interface PegawaiProfile {
  nip: string;
  nama: string;
  status: string;
  kedudukanHukum: string;
  unitKerja: string;
  alamatInstansi: string;
}

export interface PresensiLog {
  tanggal: string;
  masuk: string;
  pulang: string;
  status: string;
  lokasi: string;
}

export interface PresensiData {
  statusToday: string;
  jamMasuk: string;
  jamPulang: string;
  gpsLocation: string;
  persentaseBulan: string;
  totalHariKerja: string;
  masukTepatWaktu: string;
  logHarian: PresensiLog[];
}

export interface JabatanData {
  namaJabatan: string;
  jenisJabatan: string;
  unitKerja: string;
  tmtJabatan: string;
  atasanLangsung: string;
}

export interface KarirData {
  golongan: string;
  pangkat: string;
  mkg: string;
  tmtPangkat: string;
  jadwalKgb: string;
  jadwalKp: string;
}

export interface KinerjaData {
  predikatSkp2025: string;
  nilaiCapaian: string;
  totalLkhVerified: string;
  catatanAtasan: string;
}

export interface CutiData {
  kuotaTahunan: string;
  sisaKuota: string;
  terpakai: string;
  statusPengajuanTerakhir: string;
}

export interface PendidikanData {
  jenjangTerakhir: string;
  institusi: string;
  tahunLulus: string;
  diklatTerakhir: string;
}

export interface PensiunData {
  bupUsia: string;
  proyeksiPensiun: string;
  satyalancana: string;
  catatanDisiplin: string;
}

export interface CompletePegawaiData {
  profil: PegawaiProfile;
  presensi: PresensiData;
  jabatan: JabatanData;
  karir: KarirData;
  kinerja: KinerjaData;
  cuti: CutiData;
  pendidikan: PendidikanData;
  pensiun: PensiunData;
}

// ─── Sample Database Repository ──────────────────────────────────────────────

const SAMPLE_DATABASE: Record<string, CompletePegawaiData> = {};

/**
 * Model helper: Lookup Pegawai data by NIP or build fallback from sampleProp
 */
export function getPegawaiDataByNip(
  nip: string,
  samplePegawai?: PegawaiASN[]
): CompletePegawaiData | null {
  if (SAMPLE_DATABASE[nip]) {
    return SAMPLE_DATABASE[nip];
  }

  const currentPegawaiFromProp =
    samplePegawai?.find((p) => p.nip === nip) || samplePegawai?.[0] || null;

  if (!currentPegawaiFromProp) return null;

  return {
    profil: {
      nip: currentPegawaiFromProp.nip,
      nama: currentPegawaiFromProp.nama,
      status: currentPegawaiFromProp.status || "Aktif",
      kedudukanHukum: "Aktif Bekerja",
      unitKerja: currentPegawaiFromProp.unitKerja,
      alamatInstansi: "Pemerintah Kabupaten Penajam Paser Utara",
    },
    presensi: {
      statusToday: "Hadir (Masuk Kerja)",
      jamMasuk: "07:30 WITA",
      jamPulang: "16:30 WITA",
      gpsLocation: "GPS Valid",
      persentaseBulan: "100%",
      totalHariKerja: "22 Hari",
      masukTepatWaktu: "22 Hari",
      logHarian: [],
    },
    jabatan: {
      namaJabatan: currentPegawaiFromProp.jabatan,
      jenisJabatan: "Jabatan ASN",
      unitKerja: currentPegawaiFromProp.unitKerja,
      tmtJabatan: "-",
      atasanLangsung: "-",
    },
    karir: {
      golongan: currentPegawaiFromProp.gol || "-",
      pangkat: "-",
      mkg: "-",
      tmtPangkat: "-",
      jadwalKgb: "-",
      jadwalKp: "-",
    },
    kinerja: {
      predikatSkp2025: "Baik",
      nilaiCapaian: "90.0 / 100",
      totalLkhVerified: "-",
      catatanAtasan: "-",
    },
    cuti: {
      kuotaTahunan: "12 Hari",
      sisaKuota: "12 Hari",
      terpakai: "0 Hari",
      statusPengajuanTerakhir: "-",
    },
    pendidikan: {
      jenjangTerakhir: "-",
      institusi: "-",
      tahunLulus: "-",
      diklatTerakhir: "-",
    },
    pensiun: {
      bupUsia: "58 Tahun",
      proyeksiPensiun: "-",
      satyalancana: "-",
      catatanDisiplin: "Bersih",
    },
  };
}
