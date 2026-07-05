import { generateVisionResponse } from '../ai/gemini.js';
import { logger } from '../utils/logger.js';
import { isRateLimited } from '../services/rateLimiter.js';

export default async function photoHandler(ctx) {
  if (isRateLimited(ctx.from.id)) {
    return ctx.reply('⏳ Please wait a moment before sending another image.');
  }

  const file = await ctx.getFile();
  const filePath = file.file_path;
  if (!filePath) {
    return ctx.reply('❌ Could not retrieve the image. Please try again.');
  }

  // Telegram file URL
  const fileUrl = `https://api.telegram.org/file/bot${ctx.api.token}/${filePath}`;

  // Download the image as base64
  let imageBase64;
  try {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    imageBase64 = Buffer.from(buffer).toString('base64');
  } catch (err) {
    logger.error('Photo download error:', err);
    return ctx.reply('❌ Failed to download image.');
  }

  const caption = ctx.message.caption || 'Describe this image in detail.';
  const mimeType = file.mime_type || 'image/jpeg';

  await ctx.replyWithChatAction('typing');

  try {
    const visionResponse = await generateVisionResponse(imageBase64, caption, mimeType);
    if (visionResponse.length > 4000) {
      // split
      const maxLen = 4000;
      for (let i = 0; i < visionResponse.length; i += maxLen) {
        const chunk = visionResponse.substring(i, i + maxLen);
        await ctx.reply(chunk, {
          parse_mode: 'MarkdownV2',
          reply_to_message_id: i === 0 ? ctx.message.message_id : undefined,
        });
      }
    } else {
      await ctx.reply(visionResponse, {
        parse_mode: 'MarkdownV2',
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } catch (error) {
    logger.error('Vision handler error:', error.message);
    await ctx.reply('⚠️ Sorry, I couldn’t analyze this image.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
    }
