export default async function aboutCommand(ctx) {
  const about = `🤖 AI Assistant Bot
Version 1.0.0
Powered by Google Gemini
Built with grammY – https://grammy.dev
Developer: Your Name
Open source on GitHub`;

  await ctx.reply(about);
}
