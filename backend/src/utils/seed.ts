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
      question_text: 'What does HTTP stand for?',
      option_a: 'HyperText Transfer Protocol',
      option_b: 'High Transfer Text Process',
      option_c: 'Hyperlink Transfer Protocol',
      option_d: 'Hyper Transfer Text Protocol',
      correct_answer: 'A',
    },
    {
      question_text: 'What is the capital of Japan?',
      option_a: 'Tokyo',
      option_b: 'Beijing',
      option_c: 'Seoul',
      option_d: 'Bangkok',
      correct_answer: 'A',
    },
    {
      question_text: 'What is 2 + 2 * 3?',
      option_a: '8',
      option_b: '12',
      option_c: '6',
      option_d: '10',
      correct_answer: 'A',
    },
    {
      question_text: 'Which of the following is a JavaScript library?',
      option_a: 'Laravel',
      option_b: 'Django',
      option_c: 'React',
      option_d: 'Rails',
      correct_answer: 'C',
    },
    {
      question_text: 'CSS stands for?',
      option_a: 'Cascading Style Sheets',
      option_b: 'Computer Style Sheets',
      option_c: 'Creative Style System',
      option_d: 'Colorful Style Sheets',
      correct_answer: 'A',
    },
    {
      question_text: "Which gas makes up most of Earth's atmosphere?",
      option_a: 'Oxygen',
      option_b: 'Nitrogen',
      option_c: 'Carbon Dioxide',
      option_d: 'Hydrogen',
      correct_answer: 'B',
    },
    {
      question_text: 'Who painted the Mona Lisa?',
      option_a: 'Vincent van Gogh',
      option_b: 'Pablo Picasso',
      option_c: 'Leonardo da Vinci',
      option_d: 'Michelangelo',
      correct_answer: 'C',
    },
    {
      question_text: 'Which file extension is primarily used for TypeScript?',
      option_a: '.js',
      option_b: '.ts',
      option_c: '.tsx',
      option_d: '.ty',
      correct_answer: 'B',
    },
    {
      question_text: 'Which Git command is used to create a local copy of a remote repository?',
      option_a: 'git copy',
      option_b: 'git clone',
      option_c: 'git pull',
      option_d: 'git fetch',
      correct_answer: 'B',
    },
    {
      question_text: 'Which HTTP status code indicates a resource was successfully created?',
      option_a: '200 OK',
      option_b: '201 Created',
      option_c: '204 No Content',
      option_d: '400 Bad Request',
      correct_answer: 'B',
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
