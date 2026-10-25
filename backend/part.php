<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
// cors_config.php handles Origin, Headers, and OPTIONS preflight.



// إعداد الاتصال بقاعدة البيانات`
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $conn->connect_error]);
    exit;
}

// تنفيذ استعلام جلب الأقسام
$sql = "SELECT * FROM part ORDER BY part_id ASC";
$result = $conn->query($sql);

$parts = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // توليد الرابط التلقائي
        if (empty($row['lnk']) || $row['lnk'] === '1') {
            $row['lnk'] = 'part-' . $row['part_id'];
        }

        $parts[] = $row;
    }
}

echo json_encode($parts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$conn->close();
?>
