<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$itemsPerPage = isset($_GET['itemsPerPage']) ? (int)$_GET['itemsPerPage'] : 10;
$offset = ($page - 1) * $itemsPerPage;

/**
 * ✅ مهم جدًا:
 * ORDER BY post_date DESC
 * حتى يظهر الخبر الجديد أولاً
 */
$stmt = $pdo->prepare("
    SELECT *
    FROM post19
    WHERE published = 1
    ORDER BY post_date DESC
    LIMIT :limit OFFSET :offset
");

// $stmt = $pdo->prepare("
//     SELECT p.*, pt.part_icon
//     FROM post19 p
//     LEFT JOIN part pt ON p.part_id = pt.part_id
//     ORDER BY p.post_date DESC
//     LIMIT :limit OFFSET :offset
// ");


$stmt->bindValue(':limit', $itemsPerPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

$totalStmt = $pdo->query("SELECT COUNT(*) FROM post19 WHERE published = 1");
$total = (int)$totalStmt->fetchColumn();

echo json_encode([
    "posts" => $posts,
    "total" => $total
]);
