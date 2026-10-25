// أسماء الأقسام لعرضها فوق العناوين (نفس جدول part بقاعدة البيانات)
const SECTION_NAMES: Record<number, string> = {
  1: 'الأخبار العربية',
  2: 'مال وأعمال',
  5: 'رياضة',
  6: 'فن وفنانين',
  7: 'تحقيقات',
  8: 'مقالات الرأي',
  9: 'تكنولوجيا وعلوم',
  10: 'منوعات',
  11: 'سيارات',
  16: 'صحة',
  19: 'الأخبار العالمية',
  20: 'فضاء'
};

/** يقبل رقم القسم (5) أو اسم الجدول ("post5"). */
export function sectionName(part: number | string): string {
  const n = Number(String(part).replace('post', ''));
  return SECTION_NAMES[n] ?? 'أخبار';
}
