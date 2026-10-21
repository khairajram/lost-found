import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://findlost:findlost_password@localhost:5434/findlost?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-findlost-token-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'gemma3:4b',
  UPLOAD_DIR: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  CLIENT_URL: process.env.CLIENT_URL || '*',
  MATCH_THRESHOLD: parseInt(process.env.MATCH_THRESHOLD || '65', 10),
  HIGH_CONFIDENCE_THRESHOLD: parseInt(process.env.HIGH_CONFIDENCE_THRESHOLD || '85', 10),
};
