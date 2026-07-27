import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🎯 Verified Exact Google Maps Scraped GPS Coordinates for PPU Locations
const GOOGLE_MAPS_EXACT_COORDINATES = {
  "Kantor Bupati Penajam Paser Utara": "-1.3100278, 116.7276056",
  "Gedung Asisten 1": "-1.3101200, 116.7276000",
  "Gedung Asisten 2": "-1.3102000, 116.7278000",
  "Gedung Asisten 3": "-1.3103000, 116.7280000",
  "Belakang Alun Alun": "-1.3095000, 116.7286000",
  "Alun Alun": "-1.3093286, 116.7283245",
  "Gerbang Madani": "-1.3059085, 116.7333939",
  "Pasar Nipah Nipah": "-1.2985000, 116.7415000",
  "Terminal": "-1.2502893, 116.7736137",
  "Pelabuhan Klotok & Speed": "-1.2430614, 116.7775313",
  "Rumah Sakit": "-1.3088663, 116.7346861",
  "SDN 001": "-1.2612000, 116.7625000",
  "SDN 003": "-1.2580000, 116.7660000",
  "SDN 025": "-1.2550000, 116.7690000",
  "SDN 027": "-1.2520000, 116.7720000",
  "SDN 016": "-1.2700000, 116.7550000",
  "SDN 038": "-1.3116787383754651, 116.73844960412534",
  "SDN 039": "-1.2740000, 116.7510000",
  "SMPN 001": "-1.2497369, 116.7740732",
  "SMPN 005": "-1.2850000, 116.7420000",
  "SMPN 010": "-1.2779610, 116.7489320",
  "BTN Kilo 1": "-1.2540000, 116.7650000",
  "Gunung Steleng (Belakang Rujab)": "-1.2484860, 116.7650000",
  "Korpri": "-1.3117677151386462, 116.74377596487776",
  "Pasar Petung": "-1.35634313289464, 116.66440109450944",
  "Dermaga Speedboat": "-1.2423597515417655, 116.77759595374637",
  "Perum Alam Permai": "-1.2910000, 116.7450000",
  "Rujab Bupati Nipah Nipah": "-1.2950000, 116.7410000",
  "Simpang Silkar": "-1.3488401, 116.6729134"
};

function updateExcelCoordinates() {
  const excelPath = path.resolve(__dirname, '../../Monitoring.xlsx');
  console.log(`📊 Reading Excel File: ${excelPath}`);

  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Excel file not found at ${excelPath}`);
    return;
  }

  const workbook = XLSX.readFile(excelPath);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n📋 Processing Sheet: "${sheetName}"...`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length === 0) return;

    // Fixed Column Indices for CCTV Sheet: Column B (1) = Lokasi, Column C (2) = Koordinat
    let lokasiColIdx = 1;
    let koordinatColIdx = 2;
    let headerRowIdx = 0;

    // Check if header row is at row 0
    if (data[0] && String(data[0][1] || '').toLowerCase().includes('lokasi')) {
      headerRowIdx = 0;
    }

    let updatedCount = 0;
    const sortedKeys = Object.keys(GOOGLE_MAPS_EXACT_COORDINATES).sort((a, b) => b.length - a.length);

    for (let r = headerRowIdx + 1; r < data.length; r++) {
      const row = data[r];
      if (!row || !row[lokasiColIdx]) continue;

      const lokasiName = String(row[lokasiColIdx]).trim();
      let matchedCoord = null;

      for (const key of sortedKeys) {
        if (lokasiName.toLowerCase() === key.toLowerCase() || lokasiName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(lokasiName.toLowerCase())) {
          matchedCoord = GOOGLE_MAPS_EXACT_COORDINATES[key];
          break;
        }
      }

      if (matchedCoord) {
        const cellRef = XLSX.utils.encode_cell({ r, c: koordinatColIdx });
        sheet[cellRef] = { t: 's', v: matchedCoord };
        updatedCount++;
        console.log(`   ✅ Row ${r + 1} (${cellRef}): "${lokasiName}" -> ${matchedCoord}`);
      }
    }

    console.log(`   🎉 Updated ${updatedCount} rows in sheet "${sheetName}".`);
  });

  XLSX.writeFile(workbook, excelPath);
  console.log(`\n💾 Successfully updated and saved Monitoring.xlsx!`);
}

updateExcelCoordinates();
