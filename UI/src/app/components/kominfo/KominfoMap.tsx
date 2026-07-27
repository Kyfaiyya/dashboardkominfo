import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Radio, Camera, Wifi, Layers } from "lucide-react";
import type { MenaraRecord, CctvRecord, WifiRecord } from "../../models/kominfo.model";

interface KominfoMapProps {
  menaraList: MenaraRecord[];
  cctvList: CctvRecord[];
  wifiList: WifiRecord[];
  isDark: boolean;
}

// Precise GPS coordinates for CCTV locations in Penajam Paser Utara (Landmarks & Roads)
const CCTV_COORDINATES: Record<string, [number, number]> = {
  "Kantor Bupati Penajam Paser Utara": [-1.309987, 116.727405],
  "Gedung Asisten 1": [-1.310120, 116.727600],
  "Gedung Asisten 2": [-1.310200, 116.727800],
  "Gedung Asisten 3": [-1.310300, 116.728000],
  "Alun Alun": [-1.303410, 116.740999],
  "Pasar Nipah Nipah": [-1.298500, 116.741500],
  "Terminal": [-1.246000, 116.768000],
  "Pelabuhan Klotok & Speed": [-1.242493, 116.771545],
  "Rumah Sakit": [-1.308828, 116.734691],
  "SDN 001": [-1.261200, 116.762500],
  "SDN 003": [-1.258000, 116.766000],
  "SDN 025": [-1.255000, 116.769000],
  "SDN 027": [-1.252000, 116.772000],
  "SDN 016": [-1.270000, 116.755000],
  "SDN 038": [-1.272000, 116.753000],
  "SDN 039": [-1.274000, 116.751000],
  "SMPN 001": [-1.265000, 116.760000],
  "SMPN 005": [-1.285000, 116.742000],
  "SMPN 010": [-1.277961, 116.748932],
  "BTN Kilo 1": [-1.254000, 116.765000],
  "Belakang Alun Alun": [-1.304500, 116.741200],
  "Gerbang Madani": [-1.312500, 116.723000],
  "Gunung Steleng (Belakang Rujab)": [-1.248486, 116.765000],
  "Korpri": [-1.306000, 116.732000],
  "Pasar Petung": [-1.358464, 116.665754],
  "Dermaga Speedboat": [-1.241377, 116.770000],
  "Perum Alam Permai": [-1.291000, 116.745000],
  "Rujab Bupati Nipah Nipah": [-1.295000, 116.741000],
  "Simpang Silkar": [-1.354722, 116.665087],
};

// Kecamatan Land Centroids for Menara fallback
const KECAMATAN_CENTROIDS: Record<string, [number, number]> = {
  penajam: [-1.27, 116.74],
  sepaku: [-0.93, 116.80],
  babulu: [-1.50, 116.45],
  waru: [-1.40, 116.60],
};

function getValidCoordinates(
  rawLatStr: string,
  rawLngStr: string,
  kecamatan: string,
  id: number
): [number, number] {
  const kecKey = (kecamatan || "").toLowerCase().trim();
  const fallback = KECAMATAN_CENTROIDS[kecKey] || [-1.30, 116.73];

  let lat = parseFloat((rawLatStr || "").trim());
  let lng = parseFloat((rawLngStr || "").trim());

  // Check if valid latitude within PPU equator area (-0.5 to -2.0)
  if (!isNaN(lat) && Math.abs(lat) > 0.5 && Math.abs(lat) < 2.5) {
    if (lat > 0) lat = -lat; // PPU is south of equator
  } else {
    lat = NaN;
  }

  // Check if valid longitude within East Kalimantan (116.0 to 117.2)
  if (isNaN(lng) || lng < 116.0 || lng > 117.2) {
    lng = NaN;
  }

  if (!isNaN(lat) && !isNaN(lng)) {
    return [lat, lng];
  }

  // Fallback: Deterministic land spread around kecamatan centroid
  const seed1 = ((id * 17) % 100) / 100;
  const seed2 = ((id * 43) % 100) / 100;
  const offsetLat = (seed1 - 0.5) * 0.06;
  const offsetLng = (seed2 - 0.5) * 0.06;

  return [fallback[0] + offsetLat, fallback[1] + offsetLng];
}

export function KominfoMap({
  menaraList,
  cctvList,
  wifiList,
  isDark,
}: KominfoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | "menara" | "cctv" | "wifi">("all");

  const DEFAULT_CENTER: [number, number] = [-1.30, 116.73];
  const DEFAULT_ZOOM = 11;

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const attribution = isDark
      ? '&copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    leafletMap.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. CCTV Markers (Emerald)
    if (activeFilter === "all" || activeFilter === "cctv") {
      cctvList.forEach((cctv) => {
        const coords = CCTV_COORDINATES[cctv.lokasi] || [-1.30, 116.73];
        
        const cctvIcon = L.divIcon({
          className: "custom-leaflet-icon",
          html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(coords, { icon: cctvIcon });
        marker.bindPopup(`
          <div style="padding: 4px; max-width: 220px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${cctv.lokasi}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Area: ${cctv.area || 'Perkantoran PPU'}</div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 8px; border-radius: 12px; font-size: 10px;">${cctv.jumlah_titik} Titik Kamera</span>
              <span style="color: #10b981; font-weight: 700; font-size: 10px;">● Status ${cctv.status}</span>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 2. WiFi Publik Markers (Cyan)
    if (activeFilter === "all" || activeFilter === "wifi") {
      wifiList.forEach((wifi) => {
        let coords: [number, number] = DEFAULT_CENTER;
        if (wifi.koordinat) {
          const parts = wifi.koordinat.split(",");
          if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) coords = [lat, lng];
          }
        }

        const wifiIcon = L.divIcon({
          className: "custom-leaflet-icon",
          html: `<div style="background-color: #06b6d4; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4); cursor: pointer;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/></svg>
          </div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker(coords, { icon: wifiIcon });
        marker.bindPopup(`
          <div style="padding: 4px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${wifi.lokasi}</div>
            <div style="font-size: 11px; color: #0891b2; font-weight: 700;">${wifi.layanan} (${wifi.bandwidth_mbps} Mbps)</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Status: ${wifi.keterangan || 'OK'}</div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 3. Menara BTS Markers (Blue)
    if (activeFilter === "all" || activeFilter === "menara") {
      menaraList.slice(0, 60).forEach((menara) => {
        const coords = getValidCoordinates(menara.latitude, menara.longitude, menara.kecamatan, menara.id);

        const menaraIcon = L.divIcon({
          className: "custom-leaflet-icon",
          html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4); cursor: pointer;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2"/></svg>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon: menaraIcon });
        marker.bindPopup(`
          <div style="padding: 4px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${menara.alamat}</div>
            <div style="font-size: 11px; color: #3b82f6; font-weight: 700; margin-top: 2px;">Pemilik: ${menara.pemilik_menara || '-'}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Kecamatan: ${menara.kecamatan} | Operator: ${menara.operator || '-'}</div>
          </div>
        `);
        group.addLayer(marker);
      });
    }
  }, [menaraList, cctvList, wifiList, activeFilter]);

  return (
    <div className={`p-5 rounded-3xl border space-y-4 shadow-xl backdrop-blur-xl ${
      isDark ? "border-slate-800/80 bg-slate-900/80" : "border-slate-200/80 bg-white shadow-blue-500/5"
    }`}>
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-heading font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              Peta Pemantauan Digital Kabupaten Penajam Paser Utara
            </h3>
            <p className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Sebaran Lokasi CCTV Publik, Menara BTS & Spot WiFi Gratis PPU
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {[
            { id: "all", label: "Tampilkan Semua", icon: Layers },
            { id: "cctv", label: `CCTV (${cctvList.length})`, icon: Camera, color: "text-emerald-500" },
            { id: "wifi", label: `WiFi (${wifiList.length})`, icon: Wifi, color: "text-cyan-500" },
            { id: "menara", label: `Menara BTS (${menaraList.length})`, icon: Radio, color: "text-blue-500" },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? isDark
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${f.color || ""}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[450px]">
        <div ref={mapRef} className="w-full h-full z-0" />
      </div>
    </div>
  );
}
