import { Response } from 'express';
import { QuestionModel } from '../models/Question';
import { AuthRequest, CreateQuestionRequest, UpdateQuestionRequest } from '../types';

export class QuestionsController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const questions = await QuestionModel.findAll();
      res.json({
        message: 'Questions retrieved successfully',
        questions
      });
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve questions'
      });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          error: 'Invalid payload',
          message: 'Request body is required with all question fields'
        });
      }
      const questionData = req.body as CreateQuestionRequest;
      const userId = req.user!.id;

      const question = await QuestionModel.create(questionData, userId);

      res.status(201).json({
        message: 'Question created successfully',
        question
      });
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create question'
      });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const questionId = parseInt(req.params.id);
      const questionData = req.body;

      if (isNaN(questionId)) {
        return res.status(400).json({
          error: 'Invalid question ID',
          message: 'Question ID must be a valid number'
        });
      }

      const question = await QuestionModel.update(questionId, questionData);

      if (!question) {
        return res.status(404).json({
          error: 'Question not found',
          message: 'The specified question does not exist'
        });
      }

      res.json({
        message: 'Question updated successfully',
        question
      });
    } catch (error) {
      console.error('Update question error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update question'
      });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const questionId = parseInt(req.params.id);

      if (isNaN(questionId)) {
        return res.status(400).json({
          error: 'Invalid question ID',
          message: 'Question ID must be a valid number'
        });
      }

      const deleted = await QuestionModel.delete(questionId);

      if (!deleted) {
        return res.status(404).json({
          error: 'Question not found',
          message: 'The specified question does not exist'
        });
      }

      res.json({
        message: 'Question deleted successfully'
      });
    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete question'
      });
    }
  }
}