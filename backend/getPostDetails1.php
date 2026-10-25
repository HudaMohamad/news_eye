<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $e->getMessage()]);
    exit;
}

// قراءة معرف الخبر
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
   
    $stmt = $pdo->prepare("SELECT * FROM post1 WHERE post_id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    try {
        $stmt->execute();
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            // معالجة الصورة إذا كانت موجودة
            if (!empty($post['post_image']) && !str_starts_with($post['post_image'], 'http')) {
                $post['post_image'] = UPLOAD_BASE_URL . '/' . $post['post_image'];
            }
            
            // تنظيف النصوص
            array_walk_recursive($post, function (&$value) {
                if (is_string($value)) {
                    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                }
            });
            
            echo json_encode($post, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "الخبر غير موجود في جدول post1"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "خطأ في الاستعلام: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "معرف الخبر غير صالح"]);
}
?>