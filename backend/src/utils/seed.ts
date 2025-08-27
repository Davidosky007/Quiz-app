import { Client } from 'pg';
import dotenv from 'dotenv';
import { hashPassword } from './bcrypt';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'quiz_app';

async function getClient(): Promise<Client> {
  const client = connectionString
    ? new Client({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
    : new Client({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  await client.connect();
  return client;
}

async function upsertDefaultUser(client: Client) {
  const email = 'admin@example.com';
  const name = 'Admin';
  const password = await hashPassword('admin123');
  // Upsert based on email
  await client.query(
    `INSERT INTO users(name, email, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, email, password]
  );
}

async function upsertDemoUser(client: Client) {
  const email = 'demo@example.com';
  const name = 'Demo User';
  const password = await hashPassword('password123');
  await client.query(
    `INSERT INTO users(name, email, password)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, email, password]
  );
}

async function seedQuestions(client: Client) {
  // Get admin user id
  const { rows } = await client.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
  const userId = rows[0]?.id;
  if (!userId) throw new Error('Admin user not found after upsert');

  const questions = [
    {
      question_text: 'What is the capital of France?',
      option_a: 'Berlin',
      option_b: 'Madrid',
      option_c: 'Paris',
      option_d: 'Rome',
      correct_answer: 'C',
    },
    {
      question_text: 'Which planet is known as the Red Planet?',
      option_a: 'Earth',
      option_b: 'Mars',
      option_c: 'Jupiter',
      option_d: 'Venus',
      correct_answer: 'B',
    },
    {
      question_text: 'Who wrote "To Kill a Mockingbird"?',
      option_a: 'Harper Lee',
      option_b: 'Mark Twain',
      option_c: 'J.K. Rowling',
      option_d: 'Ernest Hemingway',
      correct_answer: 'A',
    },
  ];

  for (const q of questions) {
    await client.query(
      `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        userId,
      ]
    );
  }
}

(async () => {
  const client = await getClient();
  try {
    await upsertDefaultUser(client);
  await upsertDemoUser(client);
    await seedQuestions(client);
    console.log('Seeding complete');
    process.exit(0);
  } catch (err: any) {
    console.error('Seeding failed:', err?.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
