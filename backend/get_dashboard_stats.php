<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "127.0.0.1";
$username = "root";      
$password = "";          
$dbname = "sstnews_webdb"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

$conn->set_charset("utf8mb4");

$stats = [];

// 1. Total posts
$sql_posts = "SELECT COUNT(*) as total_posts FROM post";
$result_posts = $conn->query($sql_posts);
if ($result_posts) {
    $row = $result_posts->fetch_assoc();
    $stats['total_posts'] = (int)$row['total_posts'];
} else {
    $stats['total_posts'] = 0;
}

// 2. Total members
$sql_members = "SELECT COUNT(DISTINCT post_author) as total_members FROM post";
$result_members = $conn->query($sql_members);
if ($result_members) {
    $row = $result_members->fetch_assoc();
    $stats['total_members'] = (int)$row['total_members'];
} else {
    $stats['total_members'] = 0;
}

// 3. Total comments
$sql_comments = "SELECT COUNT(*) as total_comments FROM comments";
$result_comments = $conn->query($sql_comments);
if ($result_comments) {
    $row = $result_comments->fetch_assoc();
    $stats['total_comments'] = (int)$row['total_comments'];
} else {
    $stats['total_comments'] = 0;
}

// 4. Total visits
$sql_visits = "SELECT SUM(post_visits_num) as total_visits FROM post";
$result_visits = $conn->query($sql_visits);
if ($result_visits) {
    $row = $result_visits->fetch_assoc();
    $stats['total_visits'] = (int)$row['total_visits'];
} else {
    $stats['total_visits'] = 0;
}

echo json_encode($stats);
$conn->close();
?>