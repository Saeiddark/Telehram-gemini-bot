import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
export const BOT_NAME = process.env.BOT_NAME || 'AI_Assistant';

if (!BOT_TOKEN || !GEMINI_API_KEY || !FOOTBALL_API_KEY) {
  throw new Error('Missing BOT_TOKEN, GEMINI_API_KEY or FOOTBALL_API_KEY in .env');
}
