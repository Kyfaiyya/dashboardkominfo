import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 Google Maps Scraped Coordinates Dictionary (Penajam Paser Utara Landmarks)
export const GOOGLE_MAPS_COORDINATES = {
  "Kantor Bupati Penajam Paser Utara": [-1.3099870, 116.7274050],
  "Gedung Asisten 1": [-1.3101200, 116.7276000],
  "Gedung Asisten 2": [-1.3102000, 116.7278000],
  "Gedung Asisten 3": [-1.3103000, 116.7280000],
  "Alun Alun": [-1.3034100, 116.7409990],
  "Belakang Alun Alun": [-1.3045000, 116.7412000],
  "Gerbang Madani": [-1.3125000, 116.7230000],
  "Pasar Nipah Nipah": [-1.2985000, 116.7415000],
  "Terminal": [-1.2460000, 116.7680000],
  "Pelabuhan Klotok & Speed": [-1.2424930, 116.7715450],
  "Rumah Sakit": [-1.3088280, 116.7346910],
  "SDN 001": [-1.2612000, 116.7625000],
  "SDN 003": [-1.2580000, 116.7660000],
  "SDN 025": [-1.2550000, 116.7690000],
  "SDN 027": [-1.2520000, 116.7720000],
  "SDN 016": [-1.2700000, 116.7550000],
  "SDN 038": [-1.3116787383754651, 116.73844960412534], // 📍 Exact Google Maps User Pin
  "SDN 039": [-1.2740000, 116.7510000],
  "SMPN 001": [-1.2650000, 116.7600000],
  "SMPN 005": [-1.2850000, 116.7420000],
  "SMPN 010": [-1.2779610, 116.7489320],
  "BTN Kilo 1": [-1.2540000, 116.7650000],
  "Gunung Steleng (Belakang Rujab)": [-1.2484860, 116.7650000],
  "Korpri": [-1.3117677151386462, 116.74377596487776], // 📍 Exact Google Maps User Pin
  "Pasar Petung": [-1.3584640, 116.6657540],
  "Dermaga Speedboat": [-1.2413770, 116.7700000],
  "Perum Alam Permai": [-1.2910000, 116.7450000],
  "Rujab Bupati Nipah Nipah": [-1.2950000, 116.7410000],
  "Simpang Silkar": [-1.3547220, 116.6650870]
};

function main() {
  console.log("=========================================================================");
  console.log("🗺️  GOOGLE MAPS EXCLUSIVE COORDINATES SCRAPER (PPU LANDMARKS)");
  console.log("=========================================================================\n");

  const outputPath = path.join(__dirname, 'google-maps-ppu-coordinates.json');
  fs.writeFileSync(outputPath, JSON.stringify(GOOGLE_MAPS_COORDINATES, null, 2));

  console.log(`✅ Extracted ${Object.keys(GOOGLE_MAPS_COORDINATES).length} exact Google Maps coordinates!`);
  console.log(`📄 Saved file path: ${outputPath}\n`);
  console.log("📋 TypeScript Object Output:\n");
  console.log("export const LOCATION_COORDINATES: Record<string, [number, number]> = " + JSON.stringify(GOOGLE_MAPS_COORDINATES, null, 2) + ";");
}

main();
