<?php
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$data     = json_decode(file_get_contents('php://input'), true);
$videoUrl = $data['videoId'] ?? null;

if (!$videoUrl) {
    echo json_encode(["status" => "error", "message" => "يرجى إدخال رابط فيديو"]);
    exit;
}

// Extract YouTube ID
function getYoutubeId($url) {
    preg_match("/(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/", $url, $matches);
    return $matches[1] ?? null;
}

$videoId = getYoutubeId($videoUrl);
if (!$videoId) {
    echo json_encode(["status" => "error", "message" => "رابط يوتيوب غير صالح"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO video (url) VALUES (?)");
$stmt->bind_param("s", $videoId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "تم إضافة الفيديو بنجاح"]);
} else {
    echo json_encode(["status" => "error", "message" => "حدث خطأ أثناء إضافة الفيديو"]);
}

$stmt->close();
$conn->close();
?>
