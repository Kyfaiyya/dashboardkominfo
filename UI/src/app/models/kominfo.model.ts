export interface KominfoSummary {
  totalMenara: number;
  totalBlankspot: number;
  totalAplikasi: number;
  totalWifiPublik: number;
  totalWebsiteDesa: number;
  totalWebsiteOpd: number;
  totalCctvLokasi: number;
  totalCctvTitik: number;
  aplikasiAktif: number;
  menaraPerKecamatan: { kecamatan: string; count: number }[];
}

export interface MenaraRecord {
  id: number;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  pemilik_menara: string;
  operator: string;
  latitude: string;
  longitude: string;
  tinggi: number;
  tahun: string;
}

export interface BlankspotRecord {
  id: number;
  kecamatan: string;
  desa: string;
  has_bts: boolean;
  provider: string;
  kualitas_sinyal: string;
}

export interface AplikasiRecord {
  id: number;
  url: string;
  nama: string;
  jenis: string;
  platform: string;
  keterangan: string;
  status: string;
}

export interface WifiRecord {
  id: number;
  lokasi: string;
  keterangan: string;
  layanan: string;
  bandwidth_mbps: number;
  periode_bulan: number;
  pic_kominfo: string;
  pic_lokasi: string;
  koordinat: string;
}

export interface WebsiteDesaRecord {
  id: number;
  nama: string;
  url: string;
  kecamatan: string;
}

export interface WebsiteOpdRecord {
  id: number;
  nama: string;
  website: string;
  instagram: string;
}

export interface CctvRecord {
  id: number;
  lokasi: string;
  jumlah_titik: number;
  area: string;
  status: string;
}
