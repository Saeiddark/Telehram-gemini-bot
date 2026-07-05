import { getScorers } from '../services/worldcupApi.js';

export default async function scorersCommand(ctx) {
  try {
    const scorers = await getScorers();
    if (!scorers || scorers.length === 0) {
      return ctx.reply('جدول گلزنان در دسترس نیست.');
    }
    let text = '⚽ برترین گلزنان جام جهانی:\n\n';
    scorers.forEach((s, index) => {
      text += `${index + 1}. ${s.player.name} (${s.team.name}) - ${s.goals} گل\n`;
    });
    await ctx.reply(text);
  } catch (err) {
    await ctx.reply('خطا در دریافت جدول گلزنان.');
  }
}
