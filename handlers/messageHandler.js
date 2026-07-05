import { getHistory, addMessage } from '../ai/conversation.js';
import { generateTextResponse } from '../ai/gemini.js';
import { logger } from '../utils/logger.js';
import { escapeMd } from '../utils/formatter.js';
import { isRateLimited } from '../services/rateLimiter.js';

export default async function messageHandler(ctx) {
  // Rate limiting
  if (isRateLimited(ctx.from.id)) {
    return ctx.reply('⏳ Please wait a moment before sending another message.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  const userText = ctx.message.text;
  // Ignore empty or very long messages
  if (!userText || userText.length > 4000) {
    return ctx.reply('📝 Message too long. Please send a shorter text (max 4000 characters).');
  }

  // Send "typing..." action
  await ctx.replyWithChatAction('typing');

  const chatId = ctx.chat.id;
  const history = getHistory(chatId);

  // Add user message to conversation
  addMessage(chatId, 'user', userText);

  try {
    const aiResponse = await generateTextResponse(history, userText);
    // Add AI response to history
    addMessage(chatId, 'model', aiResponse);

    // Split long messages if needed (Telegram limit 4096)
    const maxLen = 4000;
    if (aiResponse.length <= maxLen) {
      await ctx.reply(aiResponse, {
        parse_mode: 'MarkdownV2',
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      // Split into chunks and send sequentially
      for (let i = 0; i < aiResponse.length; i += maxLen) {
        const chunk = aiResponse.substring(i, i + maxLen);
        await ctx.reply(chunk, {
          parse_mode: 'MarkdownV2',
          reply_to_message_id: i === 0 ? ctx.message.message_id : undefined,
        });
      }
    }
  } catch (error) {
    logger.error('Message handler error:', error.message);
    await ctx.reply('⚠️ Sorry, I encountered an error. Please try again later.', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
          }
