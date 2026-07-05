import { clearHistory } from '../ai/conversation.js';
import { escapeMd } from '../utils/formatter.js';

export default async function newCommand(ctx) {
  clearHistory(ctx.chat.id);
  await ctx.reply('✨ Conversation memory cleared. What would you like to talk about?', {
    parse_mode: 'MarkdownV2',
  });
}
