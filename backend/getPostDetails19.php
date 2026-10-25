<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
header("Content-Type: application/json; charset=UTF-8");

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

try {
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "فشل الاتصال بقاعدة البيانات"]);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "معرف الخبر غير صالح"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM post19 WHERE post_id = :id LIMIT 1");
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();

$post = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$post) {
    http_response_code(404);
    echo json_encode(["error" => "الخبر غير موجود"]);
    exit;
}

echo json_encode($post);
