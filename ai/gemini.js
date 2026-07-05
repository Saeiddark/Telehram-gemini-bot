import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config.js';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// مدل‌هایی که خودت انتخاب کردی
const textModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' }); // یا می‌تونی 'gemini-3.1-flash-lite' بذاری

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
