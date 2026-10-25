/**
 * export-static-api.js
 *
 * Saves the PHP API responses as static JSON files, so the public site can run
 * on GitHub Pages (which can't run PHP).
 *
 * Needs the local backend running (XAMPP: Apache + MySQL).
 *
 *   node scripts/export-static-api.js
 *
 * Output: projects/user/src/assets/api/*.json
 * The file names come from staticApiKey(), the same function the site uses
 * at runtime (projects/user/src/static-api.ts), so the two always match.
 */
const fs = require('fs');
const path = require('path');

const BACKEND = 'http://localhost/news/backend';
const OUT_DIR = path.join(__dirname, '..', 'projects', 'user', 'src', 'assets', 'api');

const SECTIONS = [1, 2, 5, 6, 7, 8, 9, 10, 11, 16, 19, 20];

// ⚠️ لازم تضل مطابقة لـ staticApiKey() بملف static-api.ts
function staticApiKey(url) {
  const u = new URL(url);
  const name = u.pathname.split('/').pop().replace(/\.php$/, '');
  const params = [...u.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  const key = name + (params.length ? '__' + params.map(([k, v]) => `${k}-${v}`).join('_') : '');
  return key.replace(/[^A-Za-z0-9_-]/g, '_');
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function save(url) {
  const data = await getJson(url);
  fs.writeFileSync(path.join(OUT_DIR, staticApiKey(url) + '.json'), JSON.stringify(data));
  return data;
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // ---------- الصفحة الرئيسية والمكونات المشتركة ----------
  const fixed = [
    'part.php', 'BreakingNews.php', 'news-slider.php', 'main.php', 'topmain.php',
    'get_videos.php', 'photographer.php', 'block.php', 'post_visits.php?limit=4',
    'get-social-links.php'
  ];
  for (const f of fixed) await save(`${BACKEND}/${f}`);

  // ---------- الأقسام + تفاصيل كل خبر ----------
  const searchIndex = [];
  let details = 0;

  for (const n of SECTIONS) {
    const list = await save(`${BACKEND}/post${n}.php?page=1&itemsPerPage=1000`);
    const posts = list.posts || list.data || [];

    for (const post of posts) {
      // قسم السيارات بيستخدم post_details.php، والباقي getPostDetailsN.php
      const detailUrl = n === 11
        ? `${BACKEND}/post_details.php?id=${post.post_id}`
        : `${BACKEND}/getPostDetails${n}.php?id=${post.post_id}`;
      await save(detailUrl);
      details++;

      // فهرس البحث: نفس شكل نتائج search.php
      searchIndex.push({
        id: post.post_id,
        post_title: post.post_title,
        post_image: post.post_image,
        post_date: post.post_date,
        post_author: post.post_author,
        category_icon: post.category_icon,
        part: `post${n}`
      });
    }
  }

  searchIndex.sort((a, b) => String(b.post_date).localeCompare(String(a.post_date)));
  fs.writeFileSync(path.join(OUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));

  // رد ثابت لطلبات الكتابة (تسجيل الزيارات) لأنه ما في سيرفر
  fs.writeFileSync(path.join(OUT_DIR, '_ok.json'), JSON.stringify({ status: 'success' }));

  const files = fs.readdirSync(OUT_DIR).length;
  console.log(`Saved ${files} files (${details} news details, ${searchIndex.length} in search index) to ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
