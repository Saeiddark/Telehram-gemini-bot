import { InlineKeyboard } from 'grammy';

export function mainMenuKeyboard() {
  return new InlineKeyboard()
    .text('💬 گفتگوی جدید', 'cmd_new')
    .text('🖼 تحلیل تصویر', 'cmd_image')
    .row()
    .text('🌍 ترجمه', 'cmd_translate')
    .text('📝 نویسندگی', 'cmd_writing')
    .row()
    .text('💻 برنامه‌نویسی', 'cmd_programming')
    .text('📄 خلاصه‌سازی', 'cmd_summarize')
    .row()
    .text('🔍 جستجوی وب', 'cmd_search')
    .text('⚽ نتایج امروز', 'cmd_results')
    .row()
    .text('📊 جدول گروه‌ها', 'cmd_table')
    .text('📅 بازی‌های آینده', 'cmd_predict')
    .row()
    .text('🏆 گلزنان', 'cmd_scorers')
    .row()
    .text('⚙ تنظیمات', 'cmd_settings')
    .text('❓ راهنما', 'cmd_help');
}
