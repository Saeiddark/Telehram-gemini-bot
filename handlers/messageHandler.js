import { getHistory, addMessage } from '../ai/conversation.js';
import { generateTextResponse, generateCustomResponse } from '../ai/gemini.js';
import { logger } from '../utils/logger.js';
import { isRateLimited } from '../services/rateLimiter.js';
import { userStates } from './callbackHandler.js'; // وضعیت خلاصه‌سازی

export default async function messageHandler(ctx) {
  // محدودیت نرخ
  if (isRateLimited(ctx.from.id)) {
    return ctx.reply('⏳ لطفاً کمی صبر کن و دوباره پیام بده.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  const userText = ctx.message.text;
  if (!userText || userText.length > 4000) {
    return ctx.reply('📝 پیام خیلی طولانی است. لطفاً متن کوتاه‌تری بفرست (حداکثر ۴۰۰۰ کاراکتر).');
  }

  // بررسی حالت خلاصه‌سازی
  if (userStates[ctx.from.id] === 'waiting_for_summarize') {
    delete userStates[ctx.from.id]; // یک بار مصرف
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = userText.match(urlRegex);
    if (!match) {
      return ctx.reply('⚠️ لطفاً یک لینک معتبر بفرست.');
    }
    const url = match[0];
    await ctx.replyWithChatAction('typing');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      let text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!text || text.length < 50) {
        return ctx.reply('نتوانستم متن قابل قبولی از این صفحه استخراج کنم.');
      }
      const maxLen = 15000;
      if (text.length > maxLen) text = text.substring(0, maxLen) + '...';
      const prompt = `متن زیر از یک صفحه وب استخراج شده است. لطفاً یک خلاصه مفید و روان به فارسی از آن ارائه بده:\n\n${text}`;
      const summary = await generateCustomResponse(prompt);
      await ctx.reply(summary, { reply_to_message_id: ctx.message.message_id });
    } catch (err) {
      logger.error('Auto-summarize error:', err.message);
      await ctx.reply('خطا در دریافت یا خلاصه‌سازی لینک.', {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    return;
  }

  // چت معمولی (با جستجوی وب فعال در مدل)
  await ctx.replyWithChatAction('typing');
  const chatId = ctx.chat.id;
  const history = getHistory(chatId);
  addMessage(chatId, 'user', userText);

  try {
    const aiResponse = await generateTextResponse(history, userText);
    addMessage(chatId, 'model', aiResponse);
    const maxLen = 4000;
    if (aiResponse.length <= maxLen) {
      await ctx.reply(aiResponse, {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      for (let i = 0; i < aiResponse.length; i += maxLen) {
        const chunk = aiResponse.substring(i, i + maxLen);
        await ctx.reply(chunk, {
          reply_to_message_id: i === 0 ? ctx.message.message_id : undefined,
        });
      }
    }
  } catch (error) {
    logger.error('Message handler error:', error.message);
    await ctx.reply('⚠️ متأسفانه خطایی رخ داد. لطفاً بعداً امتحان کن.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
        }
