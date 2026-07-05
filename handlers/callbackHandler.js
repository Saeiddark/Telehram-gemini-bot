import { clearHistory } from '../ai/conversation.js';
import { getUpcomingMatches, getMatchById, getTeamRecentMatches } from '../services/worldcupApi.js';
import { generateCustomResponse } from '../ai/gemini.js';
import { InlineKeyboard } from 'grammy';

// یک آبجکت ساده برای نگهداری وضعیت موقت کاربر
const userStates = {};

function createFakeContext(ctx) {
  return {
    ...ctx,
    message: ctx.callbackQuery?.message || { text: '', message_id: null },
    reply: (text, options) => ctx.reply(text, { ...options, reply_to_message_id: ctx.callbackQuery?.message?.message_id }),
    replyWithChatAction: (action) => ctx.api.sendChatAction(ctx.chat.id, action),
  };
}

export default async function callbackHandler(ctx) {
  const data = ctx.callbackQuery.data;

  // ================== منوی پیش‌بینی تعاملی ==================
  if (data === 'cmd_predict') {
    // (همان کد قبلی، بدون تغییر)
    await ctx.answerCallbackQuery('در حال دریافت بازی‌های آینده...');
    try {
      const matches = await getUpcomingMatches(6);
      if (!matches || matches.length === 0) {
        return ctx.reply('⏳ در حال حاضر بازی برنامه‌ریزی شده‌ای در جام جهانی وجود ندارد.');
      }
      const keyboard = new InlineKeyboard();
      matches.forEach(match => {
        const home = match.homeTeam.name;
        const away = match.awayTeam.name;
        const date = new Date(match.utcDate).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
        const time = new Date(match.utcDate).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        keyboard.text(`${home} 🆚 ${away} (${date} ${time})`, `predict_match_${match.id}`).row();
      });
      await ctx.reply('🔮 یک بازی را برای پیش‌بینی انتخاب کن:', { reply_markup: keyboard });
    } catch (err) {
      console.error(err);
      await ctx.reply('خطا در دریافت بازی‌های آینده.');
    }
    return;
  }

  if (data.startsWith('predict_match_')) {
    // (همان کد تحلیل بازی، بدون تغییر)
    const matchId = parseInt(data.replace('predict_match_', ''));
    await ctx.answerCallbackQuery('در حال تحلیل...');
    try {
      const match = await getMatchById(matchId);
      if (!match) return ctx.reply('بازی پیدا نشد.');
      const homeTeam = match.homeTeam;
      const awayTeam = match.awayTeam;
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
      const [homeRecent, awayRecent] = await Promise.all([
        getTeamRecentMatches(homeTeam.id),
        getTeamRecentMatches(awayTeam.id)
      ]);
      const formatRecent = (teamName, matches) => {
        if (!matches || matches.length === 0) return `${teamName}: بازی اخیری ثبت نشده.`;
        let result = `${teamName} (${matches.length} بازی آخر):\n`;
        matches.forEach(m => {
          const home = m.homeTeam.name;
          const away = m.awayTeam.name;
          const score = `${m.score.fullTime.home} - ${m.score.fullTime.away}`;
          const isHome = home === teamName;
          const winner = m.score.winner;
          let outcome;
          if (winner === 'HOME_TEAM') outcome = isHome ? 'برد' : 'باخت';
          else if (winner === 'AWAY_TEAM') outcome = isHome ? 'باخت' : 'برد';
          else outcome = 'مساوی';
          result += `- ${home} ${score} ${away} (${outcome})\n`;
        });
        return result;
      };
      const prompt = `تو یک تحلیل‌گر حرفه‌ای فوتبال هستی.
بر اساس آخرین عملکرد دو تیم در جام جهانی ۲۰۲۶، یک تحلیل کوتاه و یک پیش‌بینی برای بازی ${homeTeam.name} vs ${awayTeam.name} ارائه بده.
وضعیت تیم‌ها:
${formatRecent(homeTeam.name, homeRecent)}

${formatRecent(awayTeam.name, awayRecent)}

لطفاً تحلیل و پیش‌بینی خود را به فارسی و در قالب زیر بنویس:
- تحلیل کوتاه (نقاط قوت و ضعف)
- پیش‌بینی نتیجه (با ذکر دلیل)
- گلزنان احتمالی (اگر قابل حدس باشد)`;
      const analysis = await generateCustomResponse(prompt);
      await ctx.reply(analysis);
    } catch (err) {
      console.error(err);
      await ctx.reply('خطا در انجام پیش‌بینی.');
    }
    return;
  }

  // ================== دکمه‌های جدید ==================
  if (data === 'cmd_search') {
    await ctx.answerCallbackQuery();
    await ctx.reply('🔍 هر سوالی داری بپرس. من با جستجوی اینترنت پاسخ می‌دم.');
    return;
  }

  if (data === 'cmd_summarize') {
    await ctx.answerCallbackQuery();
    // کاربر را در حالت انتظار برای دریافت لینک قرار می‌دهیم
    userStates[ctx.from.id] = 'waiting_for_summarize';
    await ctx.reply('📄 لینک صفحه‌ای را که می‌خواهی خلاصه کنم بفرست. (فقط لینک)');
    return;
  }

  // ================== سایر دکمه‌ها (همان قبل) ==================
  const fakeCtx = createFakeContext(ctx);
  switch (data) {
    case 'cmd_new':
      clearHistory(ctx.chat.id);
      await ctx.answerCallbackQuery('حافظه پاک شد');
      await ctx.reply('✨ حافظه پاک شد. یک موضوع جدید شروع کن.');
      break;
    case 'cmd_image':
      await ctx.answerCallbackQuery();
      await ctx.reply('🖼 یک عکس بفرست تا تحلیل کنم.');
      break;
    case 'cmd_translate':
      await ctx.answerCallbackQuery();
      await ctx.reply('🌍 متنی را که می‌خواهی ترجمه کنی بفرست.');
      break;
    case 'cmd_writing':
      await ctx.answerCallbackQuery();
      await ctx.reply('📝 چه چیزی بنویسم؟');
      break;
    case 'cmd_programming':
      await ctx.answerCallbackQuery();
      await ctx.reply('💻 سوال برنامه‌نویسی‌ات را بپرس.');
      break;
    case 'cmd_results':
      await ctx.answerCallbackQuery('در حال دریافت نتایج...');
      const { default: resultsCommand } = await import('../commands/results.js');
      await resultsCommand(fakeCtx);
      break;
    case 'cmd_table':
      await ctx.answerCallbackQuery('در حال دریافت جدول...');
      const { default: tableCommand } = await import('../commands/table.js');
      await tableCommand(fakeCtx);
      break;
    case 'cmd_scorers':
      await ctx.answerCallbackQuery('در حال دریافت گلزنان...');
      const { default: scorersCommand } = await import('../commands/scorers.js');
      await scorersCommand(fakeCtx);
      break;
    case 'cmd_settings':
      await ctx.answerCallbackQuery();
      await ctx.reply('⚙ تنظیمات به زودی.');
      break;
    case 'cmd_help':
      await ctx.answerCallbackQuery();
      await ctx.reply('❓ از /help استفاده کن.');
      break;
    default:
      await ctx.answerCallbackQuery('عملیات ناشناخته');
  }
}

// اکسیون کردن وضعیت‌های کاربر (برای استفاده در messageHandler)
export { userStates };
