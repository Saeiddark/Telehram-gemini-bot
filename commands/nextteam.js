import { getStandings } from '../services/worldcupApi.js';

export default async function tableCommand(ctx) {
  try {
    const standings = await getStandings();
    if (!standings || standings.length === 0) return ctx.reply('جدول در دسترس نیست.');
    let text = '';
    for (const group of standings) {
      text += `📌 گروه ${group.group}\n`;
      for (const team of group.table) {
        text += `${team.position}. ${team.team.name} | ${team.playedGames} بازی | ${team.points} امتیاز\n`;
      }
      text += '\n';
    }
    await ctx.reply(text);
  } catch (err) {
    await ctx.reply('خطا در دریافت جدول.');
  }
}
