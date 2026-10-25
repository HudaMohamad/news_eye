<?php
/**
 * extra_images.php — Handle additional image uploads
 */

// Start output buffering to catch any unexpected warnings/notices
ob_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';

// Ensure we return JSON
header('Content-Type: application/json; charset=UTF-8');

$uploadDir = __DIR__ . '/upload/extra/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

// Check if files were uploaded
if (!isset($_FILES['images'])) {
    ob_clean();
    echo json_encode(['error' => 'No images uploaded']);
    exit;
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize      = 2 * 1024 * 1024; // 2MB (matched to default PHP limit for better feedback)

$uploadedImages = [];
$errors = [];

foreach ($_FILES['images']['tmp_name'] as $index => $tmp) {
    $name = $_FILES['images']['name'][$index];
    $error = $_FILES['images']['error'][$index];

    if ($error !== UPLOAD_ERR_OK) {
        $msg = match($error) {
            UPLOAD_ERR_INI_SIZE   => "File '$name' exceeds upload_max_filesize in php.ini",
            UPLOAD_ERR_FORM_SIZE  => "File '$name' exceeds MAX_FILE_SIZE in HTML form",
            UPLOAD_ERR_PARTIAL    => "File '$name' was only partially uploaded",
            UPLOAD_ERR_NO_FILE    => "No file was uploaded for '$name'",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file '$name' to disk",
            UPLOAD_ERR_EXTENSION  => "A PHP extension stopped the file upload",
            default               => "Unknown upload error for '$name'"
        };
        $errors[] = $msg;
        continue;
    }

    if (!is_uploaded_file($tmp)) continue;

    $size = $_FILES['images']['size'][$index];
    $type = mime_content_type($tmp);

    if ($size > $maxSize) {
        $errors[] = "File '$name' is too large (max 2MB)";
        continue;
    }
    if (!in_array($type, $allowedTypes)) {
        $errors[] = "File '$name' has an invalid type ($type)";
        continue;
    }
    if (!getimagesize($tmp)) {
        $errors[] = "File '$name' is not a valid image";
        continue;
    }

    // Generate safe filename
    $ext = match($type) {
        'image/jpeg' => '.jpg',
        'image/png'  => '.png',
        'image/gif'  => '.gif',
        'image/webp' => '.webp',
        default      => '.jpg'
    };

    $filename = uniqid('extra_', true) . $ext;
    $target   = $uploadDir . $filename;

    if (@move_uploaded_file($tmp, $target)) {
        $uploadedImages[] = UPLOAD_EXTRA_BASE_URL . '/' . $filename;
    } else {
        $errors[] = "Failed to move file '$name' to destination";
    }
}

// Clear any buffered output (warnings/notices)
if (ob_get_length()) {
    ob_clean();
}

// Final JSON output
echo json_encode([
    'images' => $uploadedImages,
    'errors' => $errors,
    'status' => count($errors) === 0 ? 'success' : (count($uploadedImages) > 0 ? 'partial' : 'error')
]);