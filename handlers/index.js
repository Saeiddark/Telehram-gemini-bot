import messageHandler from './messageHandler.js';
import photoHandler from './photoHandler.js';
import callbackHandler from './callbackHandler.js';

export function registerHandlers(bot) {
  // Non-command text messages
  bot.on('message:text', messageHandler);
  // Photos
  bot.on('message:photo', photoHandler);
  // Callback queries from inline keyboards
  bot.on('callback_query:data', callbackHandler);
}
