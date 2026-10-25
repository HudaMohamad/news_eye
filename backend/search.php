<?php
/**
 * search.php — Search published news titles across all sections
 *
 * GET ?query=...  →  JSON array (empty array when nothing matches)
 */

require_once __DIR__ . '/cors_config.php';
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$searchTerm = trim($_GET['query'] ?? '');

// أقل من حرفين ما منبحث
if (mb_strlen($searchTerm) < 2) {
    echo json_encode([]);
    exit;
}

$tables = ['post1', 'post2', 'post5', 'post6', 'post7', 'post8', 'post9', 'post10', 'post11', 'post16', 'post19', 'post20'];

$unionQueries = [];
foreach ($tables as $i => $table) {
    $unionQueries[] = "
        SELECT
            post_id AS id,
            post_title,
            post_image,
            post_date,
            post_author,
            category_icon,
            '$table' AS part
        FROM $table
        WHERE published = 1 AND post_title LIKE :term$i
    ";
}

$sql = implode(" UNION ALL ", $unionQueries) . " ORDER BY post_date DESC LIMIT 20";

$stmt = $pdo->prepare($sql);
$like = '%' . $searchTerm . '%';
foreach ($tables as $i => $table) {
    $stmt->bindValue(":term$i", $like);
}
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
