import { logger } from '../utils/logger.js';

export default async function errorHandler(err, ctx) {
  const updateId = ctx?.update?.update_id || 'unknown';
  logger.error(`Update error for ${updateId}:`, err.message);

  try {
    await ctx.reply('❌ یک خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کن.');
  } catch (e) {
    logger.error('Could not send error message to user:', e.message);
  }
}
