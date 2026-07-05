import startCommand from './start.js';
import helpCommand from './help.js';
import newCommand from './new.js';
import aboutCommand from './about.js';
import settingsCommand from './settings.js';

export function registerCommands(bot) {
  bot.command('start', startCommand);
  bot.command('help', helpCommand);
  bot.command('new', newCommand);
  bot.command('about', aboutCommand);
  bot.command('settings', settingsCommand);
}
