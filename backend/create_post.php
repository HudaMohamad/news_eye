<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php';

// Database connection
require_once __DIR__ . '/db.php';
// $conn is already provided by db.php

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

// Read JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "بيانات JSON غير صالحة: " . json_last_error_msg()
    ]);
    exit();
}

// Extract data (no more real_escape_string — using prepared statements)
$title = $data['title'] ?? '';
$content = $data['content'] ?? '';
$author = $data['author'] ?? 'سيريا ستار تايمز - syriastartimes';
$tags = $data['tags'] ?? '';
$categories = $data['categories'] ?? [];
$options = $data['options'] ?? [];

$published = isset($options['published']) && $options['published'] ? 1 : 0;
$main = isset($options['main']) && $options['main'] ? 1 : 0;
$photographer = isset($options['photographer']) && $options['photographer'] ? 1 : 0;
$block = isset($options['block']) && $options['block'] ? 1 : 0;
$inLast = isset($options['inLast']) && $options['inLast'] ? 1 : 0;
$topmain = isset($options['topmain']) && $options['topmain'] ? 1 : 0;

$post_update = isset($options['post_update']) ? $options['post_update'] : date('Y-m-d H:i:s');
$post_visits_num = isset($options['post_visits_num']) ? (int)$options['post_visits_num'] : 0;

// Image URL sent from Angular
$post_image = $data['imageUrl'] ?? '';
// Extra images (JSON string)
$extra_images = $data['extra_images'] ?? '';

// Validate required fields
if (empty(trim($title)) || empty(trim($content))) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "العنوان والمحتوى مطلوبان"]);
    exit();
}

// Validate at least one category selected
if (empty($categories) || !is_array($categories) || count($categories) == 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "يجب اختيار قسم واحد على الأقل"]);
    exit();
}

// Allowed tables mapping (whitelist)
$allowedTables = [
    1  => ['table' => 'post1',  'icon' => 'fa fa-star-half-alt'],
    2  => ['table' => 'post2',  'icon' => 'fa-solid fa-money-bill-wave'],
    5  => ['table' => 'post5',  'icon' => 'fa-solid fa-futbol'],
    6  => ['table' => 'post6',  'icon' => 'fa fa-book'],
    7  => ['table' => 'post7',  'icon' => 'fa fa-balance-scale'],
    8  => ['table' => 'post8',  'icon' => 'fa-solid fa-pencil-alt'],
    9  => ['table' => 'post9',  'icon' => 'fa-solid fa-robot'],
    10 => ['table' => 'post10', 'icon' => 'fa-solid fa-leaf'],
    11 => ['table' => 'post11', 'icon' => 'fa fa-car'],
    16 => ['table' => 'post16', 'icon' => 'fa fa-heartbeat'],
    19 => ['table' => 'post19', 'icon' => 'fa fa-globe'],
    20 => ['table' => 'post20', 'icon' => 'fa fa-rocket'],
];

$results = [];
$errors = [];

try {
    $conn->begin_transaction();

    // ✅ 1. Insert into unified 'post' table ONCE
    $sql_central = "INSERT INTO `post` (
        post_title, post_body, post_author, post_tags, post_date, post_update, 
        post_image, published, main, photographer, block, inLast, topmain, post_visits_num
    ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt_central = $conn->prepare($sql_central);
    if (!$stmt_central) {
        throw new Exception("Prepare unified failed: " . $conn->error);
    }

    $post_visits_num_new = 0;
    $stmt_central->bind_param(
        "ssssssiiiiiii",
        $title, $content, $author, $tags, $post_update, $post_image, 
        $published, $main, $photographer, $block, $inLast, $topmain, $post_visits_num_new
    );
    
    if (!$stmt_central->execute()) {
        throw new Exception("خطأ في إدخال المنشور الموحد: " . $stmt_central->error);
    }
    
    $global_post_id = $conn->insert_id;
    $stmt_central->close();

    // ✅ 2. Insert into category tables and relations
    foreach ($categories as $category_id) {
        $category_id = (int)$category_id;
        
        if (!isset($allowedTables[$category_id])) {
            $errors[] = ['category_id' => $category_id, 'error' => 'Invalid category ID'];
            continue;
        }
        
        $table_name = $allowedTables[$category_id]['table'];
        $category_icon = $allowedTables[$category_id]['icon'];

        $sql = "INSERT INTO `$table_name` (
            post_title, post_body, post_author, post_tags, post_date, post_update, post_image, 
            extra_images, published, main, photographer, block, inLast, topmain, post_visits_num, category_icon
        ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare category failed: " . $conn->error);
        }

        $stmt->bind_param(
            "sssssssiiiiiiis", // 7 's', 7 'i', 1 's'
            $title, $content, $author, $tags, $post_update, $post_image, $extra_images,
            $published, $main, $photographer, $block, $inLast, $topmain, $post_visits_num_new, $category_icon
        );

        if (!$stmt->execute()) {
            throw new Exception("خطأ في إدخال المنشور في الجدول $table_name: " . $stmt->error);
        }
        
        $stmt->close();

        // Relations table linking to Global Post ID
        $sql_relation = "INSERT INTO post_category_relations (post_id, category_id, table_name) VALUES (?, ?, ?)";
        $stmt_rel = $conn->prepare($sql_relation);
        $stmt_rel->bind_param("iis", $global_post_id, $category_id, $table_name);
        $stmt_rel->execute();
        $stmt_rel->close();

        $results[] = [
            'category_id' => $category_id,
            'table' => $table_name,
            'message' => 'تم الحفظ بنجاح'
        ];
    }

    $conn->commit();

} catch (Exception $e) {
    if ($conn) { $conn->rollback(); }
    $errors[] = ['error' => $e->getMessage()];
}

$conn->close();

// Return results
if (!empty($results)) {
    if (!empty($errors)) {
        http_response_code(207);
        echo json_encode([
            "status" => "partial",
            "message" => "تم حفظ بعض المقالات بنجاح مع وجود أخطاء",
            "successful" => $results,
            "errors" => $errors,
            "total_saved" => count($results),
            "total_errors" => count($errors)
        ]);
    } else {
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "تم حفظ الخبر بنجاح في جميع الجداول المختارة ✅",
            "results" => $results,
            "total_saved" => count($results)
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "فشل في حفظ المقال في أي جدول",
        "errors" => $errors
    ]);
}
