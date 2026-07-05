import { Bot } from 'grammy';
import { BOT_TOKEN } from './config.js';
import { registerCommands } from './commands/index.js';
import { registerHandlers } from './handlers/index.js';
import loggingMiddleware from './middlewares/loggingMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';

const bot = new Bot(BOT_TOKEN);

// Middlewares
bot.use(loggingMiddleware);

// Register commands and handlers
registerCommands(bot);
registerHandlers(bot);

// Global error handler (grammY catches errors in middleware)
bot.catch(errorHandler);

// Start the bot
bot.start({
  onStart(botInfo) {
    logger.info(`Bot @${botInfo.username} started successfully.`);
  },
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
