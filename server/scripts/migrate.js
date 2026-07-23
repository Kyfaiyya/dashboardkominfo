import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { logger } from '../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'src', 'models', 'migrations');

async function migrate() {
  try {
    await connectDatabase();
    logger.info('Running migrations...');

    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      logger.info(`Executing migration: ${file}`);
      await db.raw(sql);
      logger.info(`✅ Migration complete: ${file}`);
    }

    logger.info('All migrations complete!');
  } catch (err) {
    logger.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

migrate();
