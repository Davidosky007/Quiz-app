import { Pool, PoolConfig } from 'pg';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

// Build Pool config with either DATABASE_URL or discrete env vars
const connectionString = process.env.DATABASE_URL;

const baseConfig: PoolConfig = {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: Number(process.env.PG_POOL_MAX ?? 20),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 30000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS ?? 5000),
};

const config: PoolConfig = connectionString
  ? { ...baseConfig, connectionString }
  : {
      ...baseConfig,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'quiz_app',
      user: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || undefined,
    };

const pool = new Pool(config);

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Database connection error:', err);
  process.exit(-1);
});

// One-time connectivity self-test with safe logging
(async () => {
  try {
    await pool.query('SELECT 1');
  logger.info('PostgreSQL connection verified');
  } catch (err: any) {
    const isUsingUrl = Boolean(connectionString);
    const masked = isUsingUrl
      ? maskConnectionString(connectionString!)
      : `${config.user}@${config.host}:${config.port}/${config.database}`;
  logger.error('Failed to verify PostgreSQL connection');
  logger.error('Config summary:', {
      usingConnectionString: isUsingUrl,
      target: masked,
      ssl: config.ssl,
      max: config.max,
      idleTimeoutMillis: config.idleTimeoutMillis,
      connectionTimeoutMillis: config.connectionTimeoutMillis,
      nodeEnv: process.env.NODE_ENV,
    });
  logger.error('Error:', err?.message || err);
  }
})();

function maskConnectionString(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    if (u.username) u.username = '***';
    return u.toString();
  } catch {
    // Fallback basic masking
    return url.replace(/:\/\/[\w%]+:[^@]+@/i, '://***:***@');
  }
}

export default pool;