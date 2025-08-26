import pool from '../utils/db';
import { QuizResult } from '../types';

export class QuizResultModel {
  static async create(resultData: Omit<QuizResult, 'id' | 'created_at'>): Promise<QuizResult> {
    const query = `
      INSERT INTO quiz_results (user_id, score, total_questions, time_taken, correct_answers)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      resultData.user_id,
      resultData.score,
      resultData.total_questions,
      resultData.time_taken,
      resultData.correct_answers
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: number): Promise<QuizResult[]> {
    const query = `
      SELECT * FROM quiz_results 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findUserBestScore(userId: number): Promise<QuizResult | null> {
    const query = `
      SELECT * FROM quiz_results 
      WHERE user_id = $1 
      ORDER BY score DESC, time_taken ASC 
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }
}