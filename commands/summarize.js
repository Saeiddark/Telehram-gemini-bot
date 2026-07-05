import { generateCustomResponse } from '../ai/gemini.js';

export default async function summarizeCommand(ctx) {
  const input = ctx.message.text.trim();
  // پیدا کردن لینک در پیام
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = input.match(urlRegex);
  if (!match) {
    return ctx.reply('لطفاً یک لینک معتبر بفرست. مثال: /summarize https://example.com');
  }
  const url = match[0];

  try {
    await ctx.replyWithChatAction('typing');

    // دریافت محتوای صفحه
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    // استخراج متن ساده از HTML
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text || text.length < 50) {
      return ctx.reply('نتوانستم متن قابل قبولی از این صفحه استخراج کنم.');
    }

    // محدود کردن طول برای جلوگیری از خطای API
    const maxLen = 15000;
    if (text.length > maxLen) {
      text = text.substring(0, maxLen) + '...';
    }

    const prompt = `متن زیر از یک صفحه وب استخراج شده است. لطفاً یک خلاصه مفید و روان به فارسی از آن ارائه بده:\n\n${text}`;
    const summary = await generateCustomResponse(prompt);
    await ctx.reply(summary);   // ارسال بدون MarkdownV2 (متن ساده)
  } catch (err) {
    console.error('Summarize error:', err);
    await ctx.reply('خطا در دریافت یا خلاصه‌سازی لینک. لطفاً دوباره تلاش کن.');
  }
               }
