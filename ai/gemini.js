import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config.js';
import { logger } from '../utils/logger.js';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function getCurrentDate() {
  const now = new Date();
  return new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);
}

const finalSystemInstruction = `${SYSTEM_PROMPT}\n\nToday's date is ${getCurrentDate()} (Gregorian). When asked about the date, use this exact date.`;

// مدل‌هایی که خودت انتخاب کردی
const textModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',          // ← این رو خواستی
  systemInstruction: finalSystemInstruction,
});

const visionModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',          // ← اینجا هم
  systemInstruction: finalSystemInstruction,
});

export async function generateTextResponse(history, userMessage) {
  try {
    const chat = textModel.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini text generation error:', error.message);
    throw new Error('AI failed to generate a response. Please try again.');
  }
}

export async function generateVisionResponse(imageBase64, prompt, mimeType) {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };
    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini vision error:', error.message);
    throw new Error('AI failed to analyze the image.');
  }
}

// تابع تحلیل فوتبال – از همون مدل استفاده می‌کنه
export async function generateCustomResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' }); // ← اینجا هم یکسان باشه
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini custom response error:', error.message);
    throw new Error('AI failed to generate a custom response.');
  }
}
