import { searchTeam, getTeamRecentMatches } from '../services/worldcupApi.js';
import { generateCustomResponse } from '../ai/gemini.js';

export default async function predictCommand(ctx) {
  const input = ctx.message.text.replace('/predict', '').trim();
  const teams = input.split(/\s+vs\s+/i);
  if (teams.length !== 2) {
    return ctx.reply('فرمت صحیح: /predict تیم اول vs تیم دوم');
  }
  const team1Name = teams[0].trim();
  const team2Name = teams[1].trim();

  try {
    const team1 = await searchTeam(team1Name);
    const team2 = await searchTeam(team2Name);
    if (!team1 || !team2) {
      return ctx.reply('یکی از تیم‌ها در جام جهانی یافت نشد. نام را بررسی کن.');
    }

    await ctx.replyWithChatAction('typing');

    const [recent1, recent2] = await Promise.all([
      getTeamRecentMatches(team1.id),
      getTeamRecentMatches(team2.id)
    ]);

    const formatRecent = (team, matches) => {
      if (!matches || matches.length === 0) return `${team} بازی اخیری ثبت نشده.`;
      let result = `${team} (${matches.length} بازی آخر):\n`;
      matches.forEach(m => {
        const home = m.homeTeam.name;
        const away = m.awayTeam.name;
        const score = `${m.score.fullTime.home} - ${m.score.fullTime.away}`;
        const outcome = home === team
          ? (m.score.winner === 'HOME_TEAM' ? 'برد' : m.score.winner === 'AWAY_TEAM' ? 'باخت' : 'مساوی')
          : (m.score.winner === 'AWAY_TEAM' ? 'برد' : m.score.winner === 'HOME_TEAM' ? 'باخت' : 'مساوی');
        result += `- ${home} ${score} ${away} (${outcome})\n`;
      });
      return result;
    };

    const prompt = `تو یک تحلیل‌گر حرفه‌ای فوتبال هستی.
بر اساس آخرین عملکرد دو تیم در جام جهانی ۲۰۲۶، یک تحلیل کوتاه و یک پیش‌بینی برای بازی ${team1.name} vs ${team2.name} ارائه بده.
وضعیت تیم‌ها:
${formatRecent(team1.name, recent1)}

${formatRecent(team2.name, recent2)}

لطفاً تحلیل و پیش‌بینی خود را به فارسی و در قالب زیر بنویس:
- تحلیل کوتاه (نقاط قوت و ضعف)
- پیش‌بینی نتیجه (با ذکر دلیل)
- گلزنان احتمالی (اگر قابل حدس باشد)`;

    const analysis = await generateCustomResponse(prompt);
    // ارسال متن ساده، بدون parse_mode
    await ctx.reply(analysis);
  } catch (err) {
    console.error(err);
    await ctx.reply('خطا در انجام پیش‌بینی. لطفاً بعداً تلاش کن.');
  }
             }
