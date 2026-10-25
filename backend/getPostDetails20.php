<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// للتعامل مع OPTIONS request في CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// بيانات قاعدة البيانات
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8"); // ضبط الترميز
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $e->getMessage()]);
    exit;
}

// قراءة معرف الخبر من GET
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $stmt = $pdo->prepare("SELECT * FROM post20 WHERE post_id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    try {
        $stmt->execute();
        $post = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($post) {
            // الصورة الرئيسية
            if (!empty($post['post_image']) && !str_starts_with($post['post_image'], 'http')) {
                $post['post_image'] = 'http://localhost/news/backend/upload/' . $post['post_image'];
            }

            // الصور الإضافية
            if (!empty($post['extra_images'])) {
                $extra = json_decode($post['extra_images'], true);
                if (is_array($extra)) {
                    foreach ($extra as &$img) {
                        if (!str_starts_with($img, 'http')) {
                            $img = 'http://localhost/news/backend/upload/extra/' . $img;
                        }
                    }
                    $post['extra_images'] = $extra;
                } else {
                    $post['extra_images'] = [];
                }
            } else {
                $post['extra_images'] = [];
            }

            // تنظيف النصوص لجميع الأعمدة النصية
            array_walk_recursive($post, function (&$value) {
                if (is_string($value)) {
                    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                }
            });

            echo json_encode($post, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "الخبر غير موجود في جدول post20"]);
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
