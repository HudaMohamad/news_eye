<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

header("Content-Type: application/json; charset=UTF-8");

// قراءة معلمات الصفحة
$page        = isset($_GET['page']) ? intval($_GET['page']) : 1;
$itemsPerPage = isset($_GET['itemsPerPage']) ? intval($_GET['itemsPerPage']) : 10;
$offset      = ($page - 1) * $itemsPerPage;

// جلب إجمالي عدد الأخبار
$totalResult = $conn->query("SELECT COUNT(*) as total FROM post1 WHERE published = 1");
$totalRow    = $totalResult->fetch_assoc();
$totalItems  = $totalRow['total'];

// جلب الأخبار مع الترحيل
$sql    = "SELECT * FROM post1 WHERE published = 1 ORDER BY post_date DESC LIMIT $offset, $itemsPerPage";
$result = $conn->query($sql);

$posts = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['post_image']) && !str_starts_with($row['post_image'], 'http')) {
            $row['post_image'] = UPLOAD_BASE_URL . '/' . $row['post_image'];
        }
        $posts[] = $row;
    }
}

$conn->close();

echo json_encode([
    "status"     => "success",
    "page"       => $page,
    "itemsPerPage" => $itemsPerPage,
    "totalItems" => $totalItems,
    "totalPages" => ceil($totalItems / $itemsPerPage),
    "posts"      => $posts
], JSON_UNESCAPED_UNICODE);
?>