<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config.php';

// ================== Headers ==================
require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================== DB ==================
$pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
    DB_USER,
    DB_PASS,
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);

// ================== الجداول + رقم القسم ==================
$tables = [
    'post1'  => 1,
    'post2'  => 2,
    'post5'  => 5,
    'post6'  => 6,
    'post7'  => 7,
    'post8'  => 8,
    'post9'  => 9,
    'post10' => 10,
    'post11' => 11,
    'post16' => 16,
    'post19' => 19,
    'post20' => 20
];

$queries = [];
foreach ($tables as $table => $part) {
    $queries[] = "
        SELECT
            post_id AS id,
            post_title,
            post_image,
            post_date,
            post_author,
            category_icon,
            $part AS part
        FROM $table
        WHERE topmain = 1 AND published = 1
    ";
}

$sql = implode(" UNION ALL ", $queries) . "
    ORDER BY post_date DESC, id DESC
    LIMIT 1
";

$stmt = $pdo->query($sql);
$posts = $stmt->fetchAll();

foreach ($posts as &$post) {
    if (!empty($post['post_image']) && !str_starts_with($post['post_image'], 'http')) {
        $post['post_image'] = UPLOAD_BASE_URL . '/' . $post['post_image'];
    }
}

echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
