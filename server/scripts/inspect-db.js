import db from '../src/config/database.js';

async function inspect() {
  try {
    const res = await db.raw(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
    );

    console.log("==========================================================");
    console.log("📂 INVENTARIS DATA TABEL DATABASE POSTGRESQL (dashboard_db)");
    console.log("==========================================================");

    for (const row of res.rows) {
      const tableName = row.table_name;
      const countRes = await db(tableName).count('* as total').first();
      const sample = await db(tableName).select('*').limit(2);

      console.log(`\n📌 Tabel: [ ${tableName} ] | Total: ${countRes.total} Records`);
      console.log("Columns:", sample.length > 0 ? Object.keys(sample[0]).join(', ') : 'Kosong');
      if (sample.length > 0) {
        console.log("Sample Data #1:", JSON.stringify(sample[0]));
      }
    }
  } catch (err) {
    console.error("Error inspecting database:", err.message);
  } finally {
    await db.destroy();
  }
}

inspect();
