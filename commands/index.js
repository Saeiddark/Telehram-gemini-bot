import startCommand from './start.js';
import helpCommand from './help.js';
import newCommand from './new.js';
import aboutCommand from './about.js';
import settingsCommand from './settings.js';
import tableCommand from './table.js';
import nextteamCommand from './nextteam.js';
import resultsCommand from './results.js';
import scorersCommand from './scorers.js';
import predictCommand from './predict.js';

export function registerCommands(bot) {
  bot.command('start', startCommand);
  bot.command('help', helpCommand);
  bot.command('new', newCommand);
  bot.command('about', aboutCommand);
  bot.command('settings', settingsCommand);
  bot.command('table', tableCommand);
  bot.command('nextteam', nextteamCommand);
  bot.command('results', resultsCommand);
  bot.command('scorers', scorersCommand);
  bot.command('predict', predictCommand);
}
