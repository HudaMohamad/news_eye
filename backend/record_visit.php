<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// Read data
$data = json_decode(file_get_contents("php://input"), true);

$section_name = $data['section_name'] ?? 'Home';
$post_id      = isset($data['post_id']) ? (int) $data['post_id'] : null;
$visitor_ip   = $_SERVER['REMOTE_ADDR'];

// Insert into statistics table
$stmt = $conn->prepare("INSERT INTO statistics (visit_date, visitor_ip, section_name, post_id) VALUES (NOW(), ?, ?, ?)");
$stmt->bind_param("ssi", $visitor_ip, $section_name, $post_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
