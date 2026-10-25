<?php
// BreakingNews.php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// استعلام لجلب الأخبار العاجلة
$sql = "SELECT id, text FROM breakingnews ORDER BY id DESC";
$result = $conn->query($sql);

$news = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $news[] = $row['text'];
    }
}

// إرجاع النتائج على شكل JSON
echo json_encode([
    "status" => "success",
    "data"   => $news
]);

$conn->close();
