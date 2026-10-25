<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// السماح بالوصول من Angular (CORS)
require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// معالجة طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// إعداد الاتصال بقاعدة البيانات باستخدام PDO
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $e->getMessage()]);
    exit;
}

// الحصول على رقم الخبر
$id = isset($_GET['id']) ? $_GET['id'] : '';

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "معرف الخبر غير موجود"]);
    exit;
}

// استعلام SQL لاستخراج تفاصيل الخبر من جدول post10
$query = "SELECT * FROM post10 WHERE post_id = :id LIMIT 1";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);

try {
    $stmt->execute();
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        echo json_encode($post);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "الخبر غير موجود"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "خطأ في الاستعلام: " . $e->getMessage()]);
}
?>
