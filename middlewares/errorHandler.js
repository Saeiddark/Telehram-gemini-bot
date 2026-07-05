import { logger } from '../utils/logger.js';

export default async function errorHandler(err, ctx) {
  logger.error(`Update error for ${ctx.update.update_id}:`, err.message);
  try {
    await ctx.reply('❌ An unexpected error occurred. Please try again.');
  } catch (e) {
    // ignore
  }
}
