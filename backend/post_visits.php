<?php
/**
 * post_visits.php — Fetch most viewed posts for the current year
 */

require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// The centralized cors_config.php handles Origin, Methods, Headers, and OPTIONS.
// The centralized db.php provides the $conn (mysqli) connection.

// Limit of results
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 4;

// Current Year
$currentYear = date("Y");

// Map of tables to their respective part IDs
$tables = [
    'post1' => 1,
    'post2' => 2,
    'post5' => 5,
    'post6' => 6,
    'post7' => 7,
    'post8' => 8,
    'post9' => 9,
    'post10' => 10,
    'post11' => 11,
    'post16' => 16,
    'post19' => 19,
    'post20' => 20
];

$unionQueries = [];
foreach ($tables as $table => $part) {
    // We only select published posts from the current year
    $unionQueries[] = "SELECT post_id, post_title, post_image, post_visits_num, post_author, post_date, $part AS part
                       FROM $table 
                       WHERE published=1 AND YEAR(post_date) = $currentYear";
}

// Final Union Query
$sql = implode(" UNION ALL ", $unionQueries) . " 
        ORDER BY post_visits_num DESC 
        LIMIT $limit";

$result = $conn->query($sql);

$posts = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Construct full image URL if it's a relative path
        if (!empty($row['post_image']) && !str_starts_with($row['post_image'], 'http')) {
            $row['post_image'] = UPLOAD_BASE_URL . '/' . $row['post_image'];
        }
        $posts[] = $row;
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query failed: " . $conn->error]);
    exit;
}

echo json_encode($posts);

$conn->close();
