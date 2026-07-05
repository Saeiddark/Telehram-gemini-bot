export default async function aboutCommand(ctx) {
  const about = `🤖 *AI Assistant Bot*
Version 1.0.0
Powered by Google Gemini (gemini-1.5-flash)
Built with grammY – https://grammy.dev
Developer: Your Name
Open source on GitHub (link)`;
  await ctx.reply(about, { parse_mode: 'MarkdownV2' });
}
