<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/cors_config.php';
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "127.0.0.1";
$username   = "root";
$password   = "";
$dbname     = "sstnews_webdb";

// الاتصال بقاعدة البيانات
$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// استعلام لجلب آخر سجل (الأحدث) حسب أكبر id مع android
$query = "SELECT facebook, twitter, youtube, telegram, android
          FROM options 
          ORDER BY id DESC 
          LIMIT 1";

$result = mysqli_query($conn, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    echo json_encode($row); // إرسال البيانات كـ JSON
} else {
    echo json_encode(["error" => "Query failed"]);
}

mysqli_close($conn);
?>
