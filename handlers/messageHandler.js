import { getHistory, addMessage } from '../ai/conversation.js';
import { generateTextResponse } from '../ai/gemini.js';
import { logger } from '../utils/logger.js';
import { isRateLimited } from '../services/rateLimiter.js';

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

  // نمایش "در حال نوشتن..."
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
