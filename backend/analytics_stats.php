<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php'; // Ensure admin is logged in

// Database connection
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "sstnews_webdb";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "فشل الاتصال بقاعدة البيانات"]);
    exit;
}

$response = [
    "totalVisits" => 0,
    "todayVisits" => 0,
    "topSection"  => "N/A",
    "topPostId"   => 0
];

try {
    // 1. Total Visits
    $res = $conn->query("SELECT COUNT(*) as total FROM statistics");
    if ($row = $res->fetch_assoc()) {
        $response["totalVisits"] = (int)$row['total'];
    }

    // 2. Today's Visits
    $res = $conn->query("SELECT COUNT(*) as today FROM statistics WHERE DATE(visit_date) = CURDATE()");
    if ($row = $res->fetch_assoc()) {
        $response["todayVisits"] = (int)$row['today'];
    }

    // 3. Most Visited Section
    $res = $conn->query("SELECT section_name, COUNT(*) as count FROM statistics GROUP BY section_name ORDER BY count DESC LIMIT 1");
    if ($row = $res->fetch_assoc()) {
        $response["topSection"] = $row['section_name'] ?? "N/A";
    }

    // 4. Most Visited Post
    $res = $conn->query("SELECT post_id, COUNT(*) as count FROM statistics GROUP BY post_id ORDER BY count DESC LIMIT 1");
    if ($row = $res->fetch_assoc()) {
        $response["topPostId"] = (int)$row['post_id'];
    }

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "حدث خطأ أثناء جلب الإحصائيات"]);
}

$conn->close();
?>
