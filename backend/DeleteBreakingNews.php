<?php
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$text = $data['text'] ?? '';

if ($text) {
    $stmt = $conn->prepare("DELETE FROM breakingnews WHERE text = ?");
    $stmt->bind_param("s", $text);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "تم حذف الخبر"]);
    } else {
        echo json_encode(["status" => "error", "message" => "فشل الحذف"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "لم يتم تحديد الخبر"]);
}

$conn->close();
