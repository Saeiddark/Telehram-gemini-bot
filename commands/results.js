import { getTodaysMatches } from '../services/worldcupApi.js';
import { InlineKeyboard } from 'grammy';

export default async function resultsCommand(ctx) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const matches = await getTodaysMatches(today, today);
    if (!matches || matches.length === 0) {
      return ctx.reply('امروز هیچ بازی‌ای در جام جهانی نیست.');
    }

    const finished = matches.filter(m => m.status === 'FINISHED');
    const scheduled = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');

    let text = `📅 بازی‌های امروز (${today})\n\n`;
    if (finished.length > 0) {
      text += `✅ نتایج نهایی:\n`;
      finished.forEach(m => {
        text += `${m.homeTeam.name} ${m.score.fullTime.home} - ${m.score.fullTime.away} ${m.awayTeam.name}\n`;
      });
      text += '\n';
    }
    if (scheduled.length > 0) {
      text += `⏳ بازی‌های در پیش رو:\n`;
      scheduled.forEach(m => {
        const time = new Date(m.utcDate).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        text += `${m.homeTeam.name} 🆚 ${m.awayTeam.name} | ${time}\n`;
      });
    }

    // ساخت کیبورد با دکمه‌های جزئیات برای هر بازی تمام‌شده
    const keyboard = new InlineKeyboard();
    finished.forEach((m, index) => {
      keyboard.text(`🔍 جزئیات ${m.homeTeam.name} vs ${m.awayTeam.name}`, `match_details_${m.id}`);
      if (index < finished.length - 1) keyboard.row();
    });

    await ctx.reply(text, { reply_markup: keyboard });
  } catch (err) {
    await ctx.reply('خطا در دریافت نتایج.');
  }
    }
