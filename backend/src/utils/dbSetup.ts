import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'quiz_app';

async function ensureDatabase(): Promise<void> {
  // If using DATABASE_URL (e.g., Render managed DB), we assume the DB exists.
  if (connectionString) {
    console.log('DATABASE_URL detected; skipping database creation');
    return;
  }
  const adminClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });
  await adminClient.connect();
  try {
    const exists = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (exists.rowCount === 0) {
      console.log(`Database ${DB_NAME} does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database ${DB_NAME} created.`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } finally {
    await adminClient.end();
  }
}

async function runSchema(): Promise<void> {
  const client = connectionString
    ? new Client({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
    : new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      });
  await client.connect();
  try {
    const schemaPath = path.resolve(__dirname, './schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(sql);
    console.log('Schema applied successfully.');
  } finally {
    await client.end();
  }
}

(async () => {
  try {
    console.log('Ensuring database exists...');
    await ensureDatabase();
    console.log('Applying schema...');
    await runSchema();
    console.log('Database setup complete.');
    process.exit(0);
  } catch (err: any) {
    console.error('Database setup failed:', err?.message || err);
    process.exit(1);
  }
})();
