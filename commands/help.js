import { mainMenuKeyboard } from '../keyboards/mainMenu.js';
import { escapeMd } from '../utils/formatter.js';

export default async function helpCommand(ctx) {
  const helpText = `
*Available commands:*
/start – Welcome message and main menu
/help – Show this help
/new – Start a fresh conversation
/about – About this bot
/settings – Configure your preferences (coming soon)

*You can also:*
• Send any text – I'll answer, translate, write code, etc.
• Send a photo – I'll analyze it with Gemini Vision.
• Use the inline menu for quick actions.

Built with grammY and Google Gemini.`;
  await ctx.reply(helpText, {
    parse_mode: 'MarkdownV2',
    reply_markup: mainMenuKeyboard(),
  });
}
