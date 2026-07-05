import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const BOT_NAME = process.env.BOT_NAME || 'AI_Assistant';

if (!BOT_TOKEN || !GEMINI_API_KEY) {
  throw new Error('Missing BOT_TOKEN or GEMINI_API_KEY in .env');
}
