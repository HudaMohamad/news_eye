<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php';

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

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;

if ($post_id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid post ID"]);
    exit;
}

// Delete from post_part table first (foreign key constraint)
$sql1 = "DELETE FROM post_part WHERE post_id = ?";
$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("i", $post_id);
$stmt1->execute();

// Delete comments
$sql2 = "DELETE FROM comments WHERE comment_post_ID = ?";
$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $post_id);
$stmt2->execute();

// Delete the post
$sql3 = "DELETE FROM post WHERE post_id = ?";
$stmt3 = $conn->prepare($sql3);
$stmt3->bind_param("i", $post_id);

if ($stmt3->execute()) {
    echo json_encode(["success" => true, "message" => "Post deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete post"]);
}

$stmt1->close();
$stmt2->close();
$stmt3->close();
$conn->close();
?>