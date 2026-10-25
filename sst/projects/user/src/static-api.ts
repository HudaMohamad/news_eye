/**
 * static-api.ts — بيشتغل بنسخة GitHub Pages بس (environment.staticApi = true)
 *
 * GitHub Pages ما بيشغّل PHP، فأي طلب لـ http://localhost/news/backend/...
 * منحوّله لملف JSON محفوظ مسبقاً بـ assets/api/
 * (الملفات بتنعمل بـ: node scripts/export-static-api.js).
 *
 * التحويل بيصير على مستوى XMLHttpRequest، اللي بيستخدمه HttpClient تبع Angular،
 * لحتى ما نضطر نعدّل عشرات الكمبوننتات والخدمات اللي فيها روابط الـ API.
 */

const BACKEND = 'http://localhost/news/backend/';

/** اسم ملف الـ JSON لكل رابط API. لازم تضل مطابقة لـ staticApiKey() بسكربت التصدير. */
export function staticApiKey(url: string): string {
  const u = new URL(url);
  const name = u.pathname.split('/').pop()!.replace(/\.php$/, '');
  const params: [string, string][] = [];
  u.searchParams.forEach((v, k) => params.push([k, v]));
  params.sort(([a], [b]) => a.localeCompare(b));
  const key = name + (params.length ? '__' + params.map(([k, v]) => `${k}-${v}`).join('_') : '');
  return key.replace(/[^A-Za-z0-9_-]/g, '_');
}

export function installStaticApi(): void {
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, ...rest: unknown[]) {
    const target = String(url);

    if (target.startsWith(BACKEND)) {
      // القراءة من ملف الرد المحفوظ، والكتابة (تسجيل الزيارات) بترجع رد ثابت
      const file = method.toUpperCase() === 'GET' ? staticApiKey(target) : '_ok';
      return (originalOpen as Function).call(this, 'GET', `assets/api/${file}.json`, ...rest);
    }

    return (originalOpen as Function).call(this, method, url, ...rest);
  } as typeof XMLHttpRequest.prototype.open;
}
