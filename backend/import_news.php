<?php
/**
 * import_news.php — Import real news from open RSS feeds
 *
 * Pulls the latest headlines from public Arabic news feeds, sorts each
 * item into one of the site's sections (post1 … post20), and stores the
 * source name + a link to the original article for attribution.
 * Only the headline, a short summary and the image link are stored;
 * readers are sent to the source for the full article.
 *
 * Usage (CLI):   php import_news.php
 * Usage (web):   admin only (requires a valid admin token)
 */

if (PHP_SAPI !== 'cli') {
    require_once __DIR__ . '/cors_config.php';
    require_once __DIR__ . '/auth_check.php';
}
require_once __DIR__ . '/db.php';

$conn->query("SET SESSION sql_mode = ''");

// ================== المصادر ==================
$FEEDS = [
    ['key' => 'indy',  'name' => 'اندبندنت عربية',      'url' => 'https://www.independentarabia.com/rss.xml'],
    ['key' => 'sky',   'name' => 'سكاي نيوز عربية',     'url' => 'https://www.skynewsarabia.com/web/rss'],
    ['key' => 'f24',   'name' => 'فرانس 24',             'url' => 'https://www.france24.com/ar/rss'],
    ['key' => 'bbc',   'name' => 'بي بي سي عربي',        'url' => 'https://feeds.bbci.co.uk/arabic/rss.xml'],
    // موقع سيارات: كل أخباره لقسم عالم السيارات، والصورة من صفحة المقال لأن الـ RSS ما فيه صور
    // علوم الشرق الأوسط: الفضاء بالكلمات المفتاحية، والصحة لقسمها، والباقي للتكنولوجيا والعلوم
    ['key' => 'aawsat', 'name' => 'الشرق الأوسط',        'url' => 'https://aawsat.com/feed/science'],
    ['key' => 'arabgt', 'name' => 'عرب جي تي',           'url' => 'https://www.arabgt.com/feed', 'section' => 11, 'og_image' => true],
];

// ================== أخبار مستبعدة ==================
// جزء من رابط الخبر (رقم المقال مثلاً) لأخبار منشيلها يدوياً، لحتى ما ترجع مع الاستيراد الجاي
$EXCLUDED_URLS = [
    'skynewsarabia.com/middle-east/1900506-', // السعودية.. إصابة شخصين: صورة طولية بأطراف سودا
];

// ================== الأقسام ==================
// part => table
$SECTIONS = [1, 2, 5, 6, 7, 8, 9, 10, 11, 16, 19, 20];

// كلمات بتحدد القسم بغض النظر عن المصدر
$KEYWORD_RULES = [
    // بدون "صاروخ" (بتلقط أخبار الصواريخ الحربية) وبدون "المريخ" لحالها (بتلقط نادي المريخ السوداني)
    20 => '/فضاء|ناسا|كوكب|مجرة|الفلك|رائد فضاء|قمر صناعي|تلسكوب|مسبار|سطح المريخ|كوكب المريخ|برسيفيرانس/u',
    11 => '/سيارة|سيارات|تسلا|مركبات كهربائية|محرك|فورمولا/u',
];

// تصنيفات اندبندنت عربية => القسم
$INDY_CATEGORIES = [
    2  => '/اقتصاد|أعمال|مال/u',   // قبل "تقارير" لأن في تصنيف "أخبار وتقارير اقتصادية"
    5  => '/رياضة/u',
    8  => '/آراء|رأي/u',
    16 => '/صحة/u',
    7  => '/تقارير|تحليل|تحلیل|متابعات|تحقيق/u',
    9  => '/علوم|بيئة|تكنولوجيا|تقنية/u',
    10 => '/منوعات|مجتمع|سفر/u',
    6  => '/سينما|ثقافة|فنون|كتب|موسيقى|مسرح/u',
];

// إذا الخبر عن بلد عربي بيروح للأخبار العربية، وإلا للعالمية
$ARAB_PATTERN = '/سوري|لبنان|العراق|الأردن|فلسطين|غزة|الضفة|مصر|السعودي|الإمارات|قطر|الكويت|البحرين|عُمان|سلطنة عمان|اليمن|ليبيا|تونس|الجزائر|المغرب|موريتانيا|السودان|الصومال|جيبوتي|جزر القمر|الخليج|الحوثي|حزب الله|حماس/u';

// ================== أدوات ==================
function fetchFeed(string $url): ?string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (AinAlHadath news importer)',
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    return ($body !== false && $code === 200) ? $body : null;
}

function cleanText(string $html): string
{
    $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim(preg_replace('/\s+/u', ' ', $text));
}

/** First image URL found in the item (media tags, enclosure, or <img> in HTML). */
function findImage(SimpleXMLElement $item): ?string
{
    $media = $item->children('http://search.yahoo.com/mrss/');
    foreach (['content', 'thumbnail'] as $tag) {
        if (isset($media->$tag)) {
            $url = (string) $media->$tag->attributes()->url;
            if ($url) return $url;
        }
    }
    if (isset($item->enclosure)) {
        $url = (string) $item->enclosure->attributes()->url;
        if ($url) return $url;
        // اندبندنت عربية بتحط وسم <img> كامل جوّا enclosure
        if (preg_match('/src="([^"]+)"/', html_entity_decode((string) $item->enclosure), $m)) return $m[1];
    }
    if (preg_match('/<img[^>]+src="([^"]+)"/', html_entity_decode((string) $item->description), $m)) return $m[1];
    return null;
}

/** Main image of an article page (og:image), for feeds that don't include images. */
function fetchOgImage(string $url): ?string
{
    $html = fetchFeed($url);
    if ($html && preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
        return html_entity_decode($m[1]);
    }
    return null;
}

/** Larger versions of the source thumbnails, where the URL pattern allows it. */
function upscaleImage(string $url): string
{
    // سكاي نيوز: /95/53/ => /1200/675/
    $url = preg_replace('#(images\.skynewsarabia\.com/images/v1/\d+/\d+/\d+/\d+)/\d+/\d+/#', '$1/1200/675/', $url);
    // بي بي سي: /ace/ws/240/ => /ace/ws/800/
    $url = preg_replace('#(ichef\.bbci\.co\.uk/ace/ws)/\d+/#', '$1/800/', $url);
    // فيديو يوتيوب بدل صورة: منستخدم الصورة المصغّرة للفيديو
    $url = preg_replace('#^https?://(?:www\.)?youtube\.com/embed/([\w-]+).*$#', 'https://img.youtube.com/vi/$1/hqdefault.jpg', $url);
    return $url;
}

function pickSection(string $feedKey, string $title, string $summary, array $categories): ?int
{
    global $KEYWORD_RULES, $INDY_CATEGORIES, $ARAB_PATTERN;

    foreach ($KEYWORD_RULES as $part => $re) {
        if (preg_match($re, $title)) return $part;
    }

    $cats = implode(' ', $categories);

    if ($feedKey === 'indy') {
        foreach ($INDY_CATEGORIES as $part => $re) {
            if (preg_match($re, $cats)) return $part;
        }
        return preg_match($ARAB_PATTERN, $title . ' ' . $summary) ? 1 : 19;
    }

    if ($feedKey === 'f24' && preg_match('/رياضة/u', $cats)) return 5;

    if ($feedKey === 'aawsat') {
        return preg_match('/صحة|مرض|سرطان|لقاح|القلب|علاج|طبي|الأمعاء|باركنسون/u', $title . ' ' . $summary) ? 16 : 9;
    }

    return preg_match($ARAB_PATTERN, $title . ' ' . $summary) ? 1 : 19;
}

// ================== الاستيراد ==================
$icons = [];
$res = $conn->query("SELECT part_id, TRIM(part_icon) AS icon FROM part");
while ($row = $res->fetch_assoc()) {
    $icons[(int) $row['part_id']] = trim(str_replace('\n', '', $row['icon']));
}

$stats = ['added' => 0, 'skipped' => 0, 'failed_feeds' => []];

// php import_news.php --reflag  =>  بس إعادة توزيع أخبار الصفحة الرئيسية، بدون جلب أخبار جديدة
$reflagOnly = PHP_SAPI === 'cli' && in_array('--reflag', $argv ?? [], true);

foreach ($reflagOnly ? [] : $FEEDS as $feed) {
    $xmlText = fetchFeed($feed['url']);
    if (!$xmlText) { $stats['failed_feeds'][] = $feed['name']; continue; }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($xmlText);
    if (!$xml || !isset($xml->channel->item)) { $stats['failed_feeds'][] = $feed['name']; continue; }

    foreach ($xml->channel->item as $item) {
        $title   = cleanText((string) $item->title);
        $summary = cleanText((string) $item->description);
        // ووردبريس بيزيد سطر "The post ... appeared first on" بآخر الملخص
        $summary = trim(preg_replace('/The post .*$/su', '', $summary));
        $image   = findImage($item);

        // اندبندنت عربية أحياناً بتربط على المقال الإنجليزي الأصلي: منستخدم رابط النسخة العربية
        $link = trim((string) $item->link);
        if ($feed['key'] === 'indy' && !str_contains($link, 'independentarabia.com')) {
            $link = 'https://www.independentarabia.com/node/' . trim((string) $item->guid);
        }

        // روابط عرب جي تي طويلة كتير: منستخدم الرابط القصير (?p=رقم)
        if ($feed['key'] === 'arabgt') {
            $link = trim((string) $item->guid);
        }

        if (!$image && !empty($feed['og_image'])) {
            $image = fetchOgImage($link);
        }

        foreach ($EXCLUDED_URLS as $excluded) {
            if (str_contains($link, $excluded)) { $stats['skipped']++; continue 2; }
        }

        // خبر بدون عنوان أو صورة أو ملخص ما بيناسب واجهة الموقع
        if ($title === '' || !$image || mb_strlen($summary) < 40 || !$link) { $stats['skipped']++; continue; }

        $categories = [];
        foreach ($item->category as $c) $categories[] = cleanText((string) $c);

        $part = $feed['section'] ?? pickSection($feed['key'], $title, $summary, $categories);
        $table = 'post' . $part;

        // عمود source_url طوله 500: منقصّ الرابط بنفس الطول لحتى المقارنة تزبط مع الروابط الطويلة (فرانس 24)
        $link = mb_substr($link, 0, 500);

        // تجاهل الخبر إذا كان مستورد من قبل (نفس الرابط أو نفس العنوان)
        $check = $conn->prepare("SELECT 1 FROM `$table` WHERE source_url = ? OR post_title = ? LIMIT 1");
        $check->bind_param('ss', $link, $title);
        $check->execute();
        if ($check->get_result()->num_rows) { $stats['skipped']++; continue; }

        $ts   = strtotime((string) $item->pubDate) ?: time();
        $date = date('Y-m-d H:i:s', $ts);
        $now  = date('Y-m-d H:i:s');

        if (mb_strlen($summary) > 600) $summary = mb_substr($summary, 0, 600) . '…';
        $body = '<p>' . htmlspecialchars($summary, ENT_QUOTES, 'UTF-8') . '</p>'
              . '<p class="source-note">المصدر: <a href="' . htmlspecialchars($link, ENT_QUOTES, 'UTF-8')
              . '" target="_blank" rel="noopener">' . htmlspecialchars($feed['name'], ENT_QUOTES, 'UTF-8')
              . '</a> — اقرأ الخبر كاملاً على موقع المصدر.</p>';

        $tags  = mb_substr(implode('، ', $categories), 0, 100);
        $image = mb_substr(upscaleImage($image), 0, 200);
        $icon  = $icons[$part] ?? '';
        $title = mb_substr($title, 0, 500);

        $stmt = $conn->prepare(
            "INSERT INTO `$table`
               (post_author, post_date, post_body, post_title, post_update, post_tags, published,
                post_image, category_icon, source_name, source_url)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)"
        );
        $stmt->bind_param('ssssssssss', $feed['name'], $date, $body, $title, $now, $tags,
                          $image, $icon, $feed['name'], $link);
        $stmt->execute() ? $stats['added']++ : $stats['skipped']++;
    }
}

// ================== حد أقصى لكل قسم ==================
// 20 خبر = صفحتين (كل صفحة 10 أخبار)، منحذف الأقدم من الأخبار المستوردة بس
const MAX_PER_SECTION = 20;
foreach ($SECTIONS as $part) {
    $conn->query(
        "DELETE FROM post$part
         WHERE source_url IS NOT NULL
           AND post_id NOT IN (
               SELECT post_id FROM (
                   SELECT post_id FROM post$part
                   WHERE source_url IS NOT NULL
                   ORDER BY post_date DESC
                   LIMIT " . MAX_PER_SECTION . "
               ) AS keep_rows
           )"
    );
}

// ================== توزيع الأخبار على الصفحة الرئيسية ==================
// منصفّر العلامات على الأخبار المستوردة بس، وبعدين منوزّعها من جديد على الأحدث
global $SECTIONS;
foreach ($SECTIONS as $part) {
    $conn->query("UPDATE post$part SET inLast = 0, main = 0, topmain = 0, photographer = 0, block = 0
                  WHERE source_url IS NOT NULL");
}

/** Newest imported posts across sections, optionally limited to some parts. */
function newest(mysqli $conn, array $parts, int $limit, array $exclude = []): array
{
    $q = [];
    foreach ($parts as $p) {
        $q[] = "SELECT post_id, $p AS part, post_date FROM post$p WHERE source_url IS NOT NULL AND published = 1";
    }
    $rows = $conn->query(implode(' UNION ALL ', $q) . ' ORDER BY post_date DESC LIMIT ' . ($limit + count($exclude) + 5))
                 ->fetch_all(MYSQLI_ASSOC);
    $out = [];
    foreach ($rows as $r) {
        $key = $r['part'] . ':' . $r['post_id'];
        if (in_array($key, $exclude, true)) continue;
        $out[] = $r;
        if (count($out) === $limit) break;
    }
    return $out;
}

function flag(mysqli $conn, array $rows, string $column): array
{
    $keys = [];
    foreach ($rows as $r) {
        $conn->query("UPDATE post{$r['part']} SET $column = 1 WHERE post_id = " . (int) $r['post_id']);
        $keys[] = $r['part'] . ':' . $r['post_id'];
    }
    return $keys;
}

$used = [];
$used = array_merge($used, flag($conn, newest($conn, [1, 19], 7), 'inLast'));                 // السلايدر
$used = array_merge($used, flag($conn, newest($conn, $SECTIONS, 7, $used), 'main'));           // أهم الأخبار
$used = array_merge($used, flag($conn, newest($conn, [1], 1, $used), 'topmain'));              // الخبر المميز
$used = array_merge($used, flag($conn, newest($conn, [5, 6, 10, 16, 9, 20, 11], 12, $used), 'photographer')); // المصورة
flag($conn, newest($conn, [7, 8, 2], 6, $used), 'block');                                      // مختارات المحرر

// ================== شريط الأخبار العاجلة ==================
// آخر 6 عناوين من الأخبار العربية والعالمية
$latest = $conn->query(
    "(SELECT post_title, post_date FROM post1 WHERE source_url IS NOT NULL AND published = 1)
     UNION ALL
     (SELECT post_title, post_date FROM post19 WHERE source_url IS NOT NULL AND published = 1)
     ORDER BY post_date DESC LIMIT 6"
)->fetch_all(MYSQLI_ASSOC);

if ($latest) {
    $conn->query("DELETE FROM breakingnews");
    $ins = $conn->prepare("INSERT INTO breakingnews (text) VALUES (?)");
    foreach ($latest as $row) {
        $ins->bind_param('s', $row['post_title']);
        $ins->execute();
    }
}

if (PHP_SAPI === 'cli') {
    echo "Added: {$stats['added']}, skipped: {$stats['skipped']}\n";
    if ($stats['failed_feeds']) echo 'Failed feeds: ' . implode(', ', $stats['failed_feeds']) . "\n";
} else {
    echo json_encode(['status' => 'success'] + $stats, JSON_UNESCAPED_UNICODE);
}
