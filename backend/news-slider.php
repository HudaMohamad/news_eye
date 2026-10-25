<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ================== Headers ==================
require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================== إعداد الاتصال بقاعدة البيانات ==================
$servername = "127.0.0.1";
$username   = "root";
$password   = "";
$dbname     = "sstnews_webdb";

try {
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=utf8",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات"]);
    exit;
}

// ================== استعلام الموحد لجميع الجداول ==================
$tables = [
    'post1' => 1,
    'post2' => 2,
    'post5' => 5,
    'post6' => 6,
    'post7' => 7,
    'post8' => 8,
    'post9' => 9,
    'post10' => 10,
    'post11' => 11,
    'post16' => 16,
    'post19' => 19,
    'post20' => 20
];

// بناء الاستعلام
$queries = [];
foreach ($tables as $table => $part) {
    $queries[] = "
        SELECT 
            post_id AS id,
            post_title,
            post_body,
            post_image,
            post_date,
            post_author,
            '$part' AS part,  -- تحديد الـ part بناءً على اسم الجدول
            post_tags,
            post_visits_num,
            category_icon
        FROM $table
        WHERE inLast = 1 AND published = 1
    ";
}

$sql = implode(" UNION ALL ", $queries) . " ORDER BY post_date DESC, id DESC LIMIT 7";

// ================== تنفيذ الاستعلام ومعالجة النتائج ==================
try {
    $stmt = $pdo->query($sql);
    $posts = $stmt->fetchAll();

    foreach ($posts as &$post) {
        // ربط الصور إذا لم تكن رابط كامل
        if (!empty($post['post_image']) && !str_starts_with($post['post_image'], 'http')) {
            $post['post_image'] = 'http://localhost/news/backend/upload/' . $post['post_image'];
        }

        // فك HTML
        array_walk_recursive($post, function (&$value) {
            if (is_string($value)) {
                $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            }
        });
    }

    // إرسال النتائج بصيغة JSON
    echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "خطأ في الاستعلام",
        "details" => $e->getMessage()
    ]);
}
?>
