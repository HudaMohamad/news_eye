<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$servername = "127.0.0.1";
$username = "root";      
$password = "";          
$dbname = "sstnews_webdb"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

// Get filter parameters
$part_id = isset($_GET['part_id']) ? $_GET['part_id'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// 🔥 SQL بعد التعديل — يتناسب مع بنية الجداول الحالية
$sql = "SELECT 
    p.post_id,
    p.post_title,
    p.post_body,
    p.post_image,
    p.post_author,
    p.post_date,
    p.post_visits_num,
    GROUP_CONCAT(DISTINCT pt.category_id) AS part_ids,
    COUNT(DISTINCT c.comment_ID) AS comment_count
FROM post p
LEFT JOIN post_category_relations pt ON p.post_id = pt.post_id
LEFT JOIN comments c ON p.post_id = c.comment_post_ID
WHERE 1
";

// إذا كان طلب قسم معيّن أضف الشرط
if ($part_id) {
    $sql .= " AND pt.category_id = " . (int)$part_id;
}

// ترتيب + حدود
$sql .= " GROUP BY p.post_id
ORDER BY p.post_date DESC
LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);

$posts = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // 🕒 حساب "منذ" الوقت
        $post_date = strtotime($row['post_date']);
        $now = time();
        $diff = $now - $post_date;
        
        if ($diff < 3600) {
            $time_ago = "منذ " . round($diff / 60) . " دقيقة";
        } elseif ($diff < 86400) {
            $hours = round($diff / 3600);
            $time_ago = "منذ " . $hours . " ساعة";
        } else {
            $days = round($diff / 86400);
            $time_ago = "منذ " . $days . " يوم";
        }
        
        $row['time_ago'] = $time_ago;
        $posts[] = $row;
    }
}

// 🔥 جلب العدد الكلي
$count_sql = "SELECT COUNT(DISTINCT p.post_id) as total 
FROM post p 
LEFT JOIN post_category_relations pt ON p.post_id = pt.post_id
WHERE 1";

if ($part_id) {
    $count_sql .= " AND pt.category_id = " . (int)$part_id;
}

$count_result = $conn->query($count_sql);
$total = 0;
if ($count_result) {
    $count_row = $count_result->fetch_assoc();
    $total = (int)$count_row['total'];
}

// إرسال النتيجة كـ JSON
echo json_encode([
    'posts' => $posts,
    'total' => $total
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>
