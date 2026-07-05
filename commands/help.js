import { mainMenuKeyboard } from '../keyboards/mainMenu.js';

export default async function helpCommand(ctx) {
  const helpText = `دستورات موجود:
/start – پیام خوش‌آمد و منوی اصلی
/help – نمایش این راهنما
/new – شروع یک مکالمه تازه
/about – درباره این ربات
/settings – تنظیمات (به زودی)

همچنین می‌توانید:
• هر متنی بفرستید – پاسخ می‌دهم، ترجمه می‌کنم، کد می‌نویسم و ...
• عکس بفرستید – با Gemini Vision تحلیل می‌کنم.
• از منوی inline برای اقدامات سریع استفاده کنید.

ساخته شده با grammY و Google Gemini.`;

  await ctx.reply(helpText, {
    reply_markup: mainMenuKeyboard(),
  });
}
