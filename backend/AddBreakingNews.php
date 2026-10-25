<?php
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// AddBreakingNews.php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['text']) || empty($data['text'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "خبر عاجل فارغ!"
    ]);
    exit();
}

$text = $data['text'];

$stmt = $conn->prepare("INSERT INTO breakingnews (text) VALUES (?)");
$stmt->bind_param("s", $text);

if ($stmt->execute()) {
    echo json_encode([
        "status"  => "success",
        "message" => "تم إضافة الخبر بنجاح!"
    ]);
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "حدث خطأ أثناء الإضافة"
    ]);
}

$stmt->close();
$conn->close();
