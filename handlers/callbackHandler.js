import { mainMenuKeyboard } from '../keyboards/mainMenu.js';
import { clearHistory } from '../ai/conversation.js';

const callbackActions = {
  cmd_new: async (ctx) => {
    clearHistory(ctx.chat.id);
    await ctx.answerCallbackQuery('Conversation reset!');
    await ctx.reply('✨ Memory cleared. Start a new topic.');
  },
  cmd_image: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('🖼 Send me any photo and I’ll analyze it with Gemini Vision.');
  },
  cmd_translate: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('🌍 Type what you want translated. I’ll auto‑detect the language and translate for you.');
  },
  cmd_writing: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('📝 I can help with emails, captions, stories, poems, product descriptions… just ask!');
  },
  cmd_programming: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('💻 Ask me to write, debug, or explain code in Python, JavaScript, SQL, and more.');
  },
  cmd_summarize: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('📚 Send a long text, article, or even paste a PDF content – I’ll summarize it.');
  },
  cmd_settings: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('⚙ Settings are not yet available.');
  },
  cmd_help: async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('❓ Use /help to see all commands.');
  },
};

export default async function callbackHandler(ctx) {
  const data = ctx.callbackQuery.data;
  const action = callbackActions[data];
  if (action) {
    await action(ctx);
  } else {
    await ctx.answerCallbackQuery('Unknown action');
  }
  }
