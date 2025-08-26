import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const questionSchema = Joi.object({
  question_text: Joi.string().min(5).max(500).required(),
  option_a: Joi.string().min(1).max(200).required(),
  option_b: Joi.string().min(1).max(200).required(),
  option_c: Joi.string().min(1).max(200).required(),
  option_d: Joi.string().min(1).max(200).required(),
  correct_answer: Joi.string().valid('A', 'B', 'C', 'D').required(),
});

const quizSubmissionSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().positive().required(),
      answer: Joi.string().valid('A', 'B', 'C', 'D').required(),
    })
  ).min(1).required(),
  timeTaken: Joi.number().integer().min(1).required(),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};

export const validateQuestion = (req: Request, res: Response, next: NextFunction) => {
  const { error } = questionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};

export const validateQuizSubmission = (req: Request, res: Response, next: NextFunction) => {
  const { error } = quizSubmissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error', 
      message: error.details[0].message 
    });
  }
  next();
};