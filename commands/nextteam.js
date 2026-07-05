import { getTeamNextMatches } from '../services/worldcupApi.js';

export default async function nextteamCommand(ctx) {
  const teamName = ctx.message.text.replace('/nextteam', '').trim();
  if (!teamName) return ctx.reply('اسم تیم رو بگو. مثال: /nextteam ایران');
  try {
    const data = await getTeamNextMatches(teamName);
    if (!data || data.matches.length === 0) {
      return ctx.reply(`بازی آینده‌ای برای ${teamName} پیدا نشد.`);
    }
    const match = data.matches[0];
    const date = new Date(match.utcDate).toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' });
    const time = new Date(match.utcDate).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    await ctx.reply(`بازی بعدی ${data.team}:\n${match.homeTeam.name} 🆚 ${match.awayTeam.name}\n📅 ${date} ساعت ${time}`);
  } catch (err) {
    await ctx.reply('خطا در جستجوی تیم.');
  }
    }
