import { generateVisionResponse } from '../ai/gemini.js';
import { logger } from '../utils/logger.js';
import { isRateLimited } from '../services/rateLimiter.js';

export default async function photoHandler(ctx) {
  if (isRateLimited(ctx.from.id)) {
    return ctx.reply('⏳ لطفاً کمی صبر کن و دوباره عکس بفرست.');
  }

  const file = await ctx.getFile();
  const filePath = file.file_path;
  if (!filePath) {
    return ctx.reply('❌ نتوانستم تصویر را دریافت کنم. دوباره تلاش کن.');
  }

  const fileUrl = `https://api.telegram.org/file/bot${ctx.api.token}/${filePath}`;

  let imageBase64;
  try {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString('base64');
  } catch (err) {
    logger.error('Photo download error:', err);
    return ctx.reply('❌ دانلود تصویر ناموفق بود.');
  }

  const caption = ctx.message.caption || 'این تصویر را با جزئیات توصیف کن.';
  const mimeType = file.mime_type || 'image/jpeg';

  await ctx.replyWithChatAction('typing');

  try {
    const visionResponse = await generateVisionResponse(imageBase64, caption, mimeType);
    const maxLen = 4000;
    if (visionResponse.length <= maxLen) {
      await ctx.reply(visionResponse, {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      for (let i = 0; i < visionResponse.length; i += maxLen) {
        const chunk = visionResponse.substring(i, i + maxLen);
        await ctx.reply(chunk, {
          reply_to_message_id: i === 0 ? ctx.message.message_id : undefined,
        });
      }
    }
  } catch (error) {
    logger.error('Vision handler error:', error.message);
    await ctx.reply('⚠️ متأسفم، نتوانستم این تصویر را تحلیل کنم.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
        }
