import pool from '../utils/db';
import { Question, CreateQuestionRequest } from '../types';

export class QuestionModel {
  static async create(questionData: CreateQuestionRequest, userId: number): Promise<Question> {
    const query = `
      INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      questionData.question_text,
      questionData.option_a,
      questionData.option_b,
      questionData.option_c,
      questionData.option_d,
      questionData.correct_answer,
      userId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Question[]> {
    const query = 'SELECT * FROM questions ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findAllForQuiz(): Promise<Omit<Question, 'correct_answer'>[]> {
    const query = `
      SELECT id, question_text, option_a, option_b, option_c, option_d, created_by, created_at 
      FROM questions 
      ORDER BY RANDOM()
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Question | null> {
    const query = 'SELECT * FROM questions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, questionData: Partial<CreateQuestionRequest>): Promise<Question | null> {
  const fields: string[] = [];
  const values: any[] = [];
    let paramCount = 1;

    Object.entries(questionData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE questions 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
  const query = 'DELETE FROM questions WHERE id = $1';
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
  }

  static async getCorrectAnswers(questionIds: number[]): Promise<{ id: number; correct_answer: 'A' | 'B' | 'C' | 'D' }[]> {
    const query = 'SELECT id, correct_answer FROM questions WHERE id = ANY($1)';
    const result = await pool.query(query, [questionIds]);
    return result.rows;
  }
}