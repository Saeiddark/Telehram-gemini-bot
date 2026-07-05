import { InlineKeyboard } from 'grammy';

export function mainMenuKeyboard() {
  return new InlineKeyboard()
    .text('💬 New Chat', 'cmd_new')
    .text('🖼 Analyze Image', 'cmd_image')
    .row()
    .text('🌍 Translate', 'cmd_translate')
    .text('📝 Writing', 'cmd_writing')
    .row()
    .text('💻 Programming', 'cmd_programming')
    .text('📚 Summarize', 'cmd_summarize')
    .row()
    .text('⚙ Settings', 'cmd_settings')
    .text('❓ Help', 'cmd_help');
}
