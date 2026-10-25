<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$sql    = "SELECT * FROM part";
$result = $conn->query($sql);

$parts = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $parts[] = $row;
    }
}

// إرجاع البيانات كـ JSON
echo json_encode($parts);
$conn->close();
?>