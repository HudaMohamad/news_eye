<?php
/**
 * save-options.php — Save site settings/options
 */

require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

// Read POST data from Angular
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON data"]);
    exit;
}

$facebook = $data['facebook'] ?? '';
$twitter  = $data['x'] ?? '';
$youtube  = $data['youtube'] ?? '';
$telegram = $data['telegram'] ?? '';
$android  = $data['android'] ?? '';
$site_name = $data['site_name'] ?? '';
$site_description = $data['site_description'] ?? '';

// Use prepared statement instead of string interpolation
$query = "UPDATE options SET
    site_name = ?,
    site_description = ?,
    facebook = ?,
    twitter = ?,
    youtube = ?,
    telegram = ?,
    android = ?
WHERE id = 1";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "PDO Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssssss", $site_name, $site_description, $facebook, $twitter, $youtube, $telegram, $android);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Settings updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "No changes detected (same data)"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "error" => "Update failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
