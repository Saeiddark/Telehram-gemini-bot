import { mainMenuKeyboard } from '../keyboards/mainMenu.js';

export default async function startCommand(ctx) {
  const name = ctx.from.first_name || 'کاربر';
  await ctx.reply(
    `👋 سلام ${name}! من دستیار هوش مصنوعی شما هستم که با Gemini کار می‌کنم.\n` +
    `می‌تونی هر سوالی بپرسی – من خودم منظور تو را می‌فهمم.\n` +
    `از منوی زیر استفاده کن یا مستقیماً درخواستت را تایپ کن.`,
    { reply_markup: mainMenuKeyboard() }
  );
}
