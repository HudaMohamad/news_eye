<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';

$uploadDir = __DIR__ . '/upload/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$tmp  = $_FILES['image']['tmp_name'];
$size = $_FILES['image']['size'];

if ($size > 5 * 1024 * 1024) {
    echo json_encode(['error' => 'Image too large']);
    exit;
}

$type    = mime_content_type($tmp);
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($type, $allowed)) {
    echo json_encode(['error' => 'Invalid image type']);
    exit;
}

if (!getimagesize($tmp)) {
    echo json_encode(['error' => 'Invalid image file']);
    exit;
}

// Generate safe filename — strip original name to prevent path traversal
$ext = match($type) {
    'image/jpeg' => '.jpg',
    'image/png'  => '.png',
    'image/gif'  => '.gif',
    'image/webp' => '.webp',
    default      => '.jpg'
};
$filename = uniqid('img_', true) . $ext;
$target   = $uploadDir . $filename;

if (!move_uploaded_file($tmp, $target)) {
    echo json_encode(['error' => 'Upload failed']);
    exit;
}

echo json_encode([
    'imageUrl' => UPLOAD_BASE_URL . '/' . $filename
]);
