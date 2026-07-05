import { mainMenuKeyboard } from '../keyboards/mainMenu.js';
import { escapeMd } from '../utils/formatter.js';

export default async function startCommand(ctx) {
  const name = escapeMd(ctx.from.first_name || 'there');
  await ctx.reply(
    `👋 Hello, ${name}! I'm your AI assistant powered by Gemini.\\\n` +
    `You can ask me anything – I automatically understand your intent.\\\n` +
    `Use the menu below or just type your request.`,
    { parse_mode: 'MarkdownV2', reply_markup: mainMenuKeyboard() }
  );
}
