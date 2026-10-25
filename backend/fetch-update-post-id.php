<?php
require_once __DIR__ . '/auth_check.php';

require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// اتصال قاعدة البيانات
// $conn is already provided by db.php

/* ===============================
   رفع صورة إضافية منفصلة (extra_image)
   قبل أي معالجة أخرى
================================= */
if (!empty($_FILES['extra_image']['tmp_name']) && is_uploaded_file($_FILES['extra_image']['tmp_name'])) {

    $extraDir = __DIR__ . "/upload/extra/";
    $webExtraPath = "http://localhost/news/backend/upload/extra/";

    if (!is_dir($extraDir)) mkdir($extraDir, 0755, true);

    // Validate extra image upload
    $tmp = $_FILES['extra_image']['tmp_name'];
    $size = $_FILES['extra_image']['size'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $type = mime_content_type($tmp);

    if ($size > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["error" => "Image too large (max 5MB)"]);
        exit;
    }
    if (!in_array($type, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid image type"]);
        exit;
    }
    if (!getimagesize($tmp)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid image file"]);
        exit;
    }

    $ext = match($type) {
        'image/jpeg' => '.jpg',
        'image/png'  => '.png',
        'image/gif'  => '.gif',
        'image/webp' => '.webp',
        default      => '.jpg'
    };
    $filename = uniqid('extra_', true) . $ext;
    $targetPath = $extraDir . $filename;

    if (move_uploaded_file($tmp, $targetPath)) {
        echo json_encode([
            "success" => true,
            "url" => $webExtraPath . $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to move uploaded extra image"]);
    }
    exit;
}

// الحصول على معرف التصنيف والبوست
$category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
$post_id     = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;

// جدول مسموح
$allowedTables = [
    1=>'post1',2=>'post2',5=>'post5',6=>'post6',7=>'post7',
    8=>'post8',9=>'post9',10=>'post10',11=>'post11',
    16=>'post16',19=>'post19',20=>'post20'
];

if (!isset($allowedTables[$category_id])) {
    echo json_encode(["error" => "Invalid category"]);
    exit;
}

$table = $allowedTables[$category_id];

// جلب البيانات الحالية
$stmt = $conn->prepare("SELECT * FROM `$table` WHERE post_id = ?");
$stmt->bind_param('i', $post_id);
$stmt->execute();
$result = $stmt->get_result();
$current_post = $result->fetch_assoc();

if (!$current_post) {
    echo json_encode(["error" => "Post not found"]);
    exit;
}

/* ===============================
   تجهيز الحقول
================================= */
$fields = [
    'post_title'   => $_POST['post_title'] ?? $current_post['post_title'],
    'post_body'    => $_POST['post_body'] ?? $current_post['post_body'],
    'published'    => isset($_POST['published']) ? (int)$_POST['published'] : $current_post['published'],
    'main'         => isset($_POST['main']) ? (int)$_POST['main'] : $current_post['main'],
    'photographer' => isset($_POST['photographer']) ? (int)$_POST['photographer'] : $current_post['photographer'],
    'block'        => isset($_POST['block']) ? (int)$_POST['block'] : $current_post['block'],
    'inLast'       => isset($_POST['inLast']) ? (int)$_POST['inLast'] : $current_post['inLast'],
    'topmain'      => isset($_POST['topmain']) ? (int)$_POST['topmain'] : $current_post['topmain'],
];

/* ===============================
   رفع الصورة الرئيسية
================================= */
$uploadDir = __DIR__ . "/upload/";
$webUploadPath = "http://localhost/news/backend/upload/"; // رابط للمتصفح

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!empty($_FILES['post_image']['tmp_name']) && is_uploaded_file($_FILES['post_image']['tmp_name'])) {

    // حذف الصورة القديمة
    if (!empty($current_post['post_image'])) {
        $oldPath = __DIR__ . "/" . str_replace("http://localhost/news/backend/", "", $current_post['post_image']);
        if (file_exists($oldPath)) unlink($oldPath);
    }

    $filename   = uniqid() . "_" . basename($_FILES['post_image']['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['post_image']['tmp_name'], $targetPath)) {
        $fields['post_image'] = $webUploadPath . $filename;
    } else {
        echo json_encode(["error" => "Failed to move uploaded main image"]);
        exit;
    }
}

/* ===============================
   رفع الصور الإضافية
================================= */
$extraDir = __DIR__ . "/upload/extra/";
$webExtraPath = "http://localhost/news/backend/upload/extra/";

if (!is_dir($extraDir)) mkdir($extraDir, 0755, true);

$extraFilenames = [];
if (!empty($_FILES['extra_images']['name']) && is_array($_FILES['extra_images']['name'])) {

    // حذف الصور القديمة
    $existingExtraImages = !empty($current_post['extra_images']) ? explode(',', $current_post['extra_images']) : [];
    foreach ($existingExtraImages as $oldImage) {
        $oldPath = __DIR__ . "/" . str_replace("http://localhost/news/backend/", "", $oldImage);
        if (file_exists($oldPath)) unlink($oldPath);
    }

    // رفع الصور الجديدة
    for ($i = 0; $i < count($_FILES['extra_images']['name']); $i++) {
        if ($_FILES['extra_images']['error'][$i] === 0) {
            $filename = uniqid() . "_" . basename($_FILES['extra_images']['name'][$i]);
            $fullPath = $extraDir . $filename;
            if (move_uploaded_file($_FILES['extra_images']['tmp_name'][$i], $fullPath)) {
                $extraFilenames[] = $webExtraPath . $filename;
            }
        }
    }

    $fields['extra_images'] = implode(',', $extraFilenames);
}

/* ===============================
   بناء استعلام التحديث
================================= */
$setParts = [];
$params   = [];
$types    = '';

foreach ($fields as $key => $value) {
    $setParts[] = "`$key` = ?";
    $params[]   = $value;
    $types     .= is_int($value) ? 'i' : 's';
}

$setParts[] = "post_update = NOW()";

$sql = "UPDATE `$table` SET " . implode(", ", $setParts) . " WHERE post_id = ?";
$params[] = $post_id;
$types   .= 'i';

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

// ربط المعلمات بطريقة آمنة
$bindParams = [];
$bindParams[] = &$types;
foreach ($params as $key => $value) {
    $bindParams[] = &$params[$key];
}
call_user_func_array([$stmt, 'bind_param'], $bindParams);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
    exit;
}

echo json_encode([
    "success" => true,
    "post_image" => $fields['post_image'] ?? $current_post['post_image'],
    "extra_images" => $fields['extra_images'] ?? $current_post['extra_images']
]);
?>
