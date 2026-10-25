<?php
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data    = json_decode(file_get_contents('php://input'), true);
$videoId = $data['id'] ?? null;

if (!$videoId) {
    echo json_encode(["status" => "error", "message" => "معرّف الفيديو غير موجود"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM video WHERE id = ?");
$stmt->bind_param("i", $videoId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "تم حذف الفيديو بنجاح"]);
} else {
    echo json_encode(["status" => "error", "message" => "فشل حذف الفيديو"]);
}

$stmt->close();
$conn->close();
