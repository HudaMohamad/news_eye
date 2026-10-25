<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ===== Headers لـ CORS =====
require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// ===== التعامل مع طلب OPTIONS =====
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ===== Database Connection ===== */
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

/* ===== الحصول على Parameters ===== */
$post_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;

/* ===== Tables Mapping ===== */
$allowedTables = [
    1  => 'post1',
    2  => 'post2',
    5  => 'post5',
    6  => 'post6',
    7  => 'post7',
    8  => 'post8',
    9  => 'post9',
    10 => 'post10',
    11 => 'post11',
    16 => 'post16',
    19 => 'post19',
    20 => 'post20',
];

if ($category_id <= 0 || !isset($allowedTables[$category_id])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid category"]);
    exit;
}

$table_name = $allowedTables[$category_id];

/* ===== حذف الخبر إذا تم تمرير id ===== */
if ($post_id > 0) {
    $sql_delete = "DELETE FROM `$table_name` WHERE post_id = $post_id";
    if ($conn->query($sql_delete)) {
        echo json_encode(["success" => true, "message" => "Post deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error deleting post"]);
    }
    $conn->close();
    exit;
}

/* ===== جلب الأخبار إذا لم يتم تمرير id ===== */
$sql = "SELECT 
            post_id, post_author, post_date, post_body, post_title, 
            post_update, post_tags, published, main, topmain, 
            photographer, block, post_visits_num, inLast, post_image, category_icon
        FROM `$table_name`
        ORDER BY post_id DESC";

$result = $conn->query($sql);

$posts = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // معالجة التواريخ لتجنب خطأ DatePipe في Angular
        $row['post_date'] = ($row['post_date'] && $row['post_date'] !== '0000-00-00 00:00:00') ? $row['post_date'] : null;
        $row['post_update'] = ($row['post_update'] && $row['post_update'] !== '0000-00-00 00:00:00') ? $row['post_update'] : null;
        $posts[] = $row;
    }
}

echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$conn->close();
?>
