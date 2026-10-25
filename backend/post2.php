<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
// cors_config.php handles Origin, Methods, Headers, Credentials, and OPTIONS preflight.


// إعداد الاتصال بقاعدة البيانات باستخدام config.php
require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $e->getMessage()]);
    exit;
}

// الحصول على رقم الصفحة وعدد العناصر لكل صفحة من المعاملات
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$itemsPerPage = isset($_GET['itemsPerPage']) ? $_GET['itemsPerPage'] : 10;

// تحديد بداية النتائج
$start = ($page - 1) * $itemsPerPage;

$query = "SELECT * FROM post2 WHERE published = 1 ORDER BY post_date DESC LIMIT :start, :itemsPerPage";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':start', $start, PDO::PARAM_INT);
$stmt->bindParam(':itemsPerPage', $itemsPerPage, PDO::PARAM_INT);

// تنفيذ الاستعلام
try {
    $stmt->execute();
    
    // جلب البيانات
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // استعلام للحصول على العدد الإجمالي للمنشورات
    $totalQuery = "SELECT COUNT(*) AS total FROM post2 WHERE published = 1";
    $totalResult = $pdo->query($totalQuery);
    $total = $totalResult->fetch(PDO::FETCH_ASSOC)['total'];

    // إرسال البيانات
    echo json_encode([
        'posts' => $posts,
        'total' => $total  // إجمالي عدد العناصر في قاعدة البيانات
    ]);
} catch (PDOException $e) {
    // في حال حدوث خطأ في الاستعلام
    http_response_code(500);
    echo json_encode(["error" => "خطأ في الاستعلام: " . $e->getMessage()]);
}
?>
