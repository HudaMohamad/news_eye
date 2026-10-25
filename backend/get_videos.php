<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php'; // Optional but good for consistency if we want to standardize

$servername = "127.0.0.1";
$username   = "root";
$password   = "";
$dbname     = "sstnews_webdb";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB Connection failed"]);
    exit;
}

$sql = "SELECT id, url, created_at FROM video ORDER BY created_at DESC";
$result = $conn->query($sql);

$videos = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {

        $originalUrl = $row['url'];

        // إذا الرابط يحتوي "http" نستخدمه مباشرة
        if (str_starts_with($originalUrl, 'http')) {
            $url = explode('?', $originalUrl)[0]; // إزالة كل شيء بعد ?
            // تحويل shorts إلى youtu.be
            $url = str_replace('https://youtube.com/shorts/', 'https://youtu.be/', $url);
        } else {
            // إذا كان مجرد ID، نصنع رابط youtu.be
            $url = 'https://youtu.be/' . $originalUrl;
        }

        $videos[] = [
            'id' => $row['id'],
            'url' => $url,
            'created_at' => $row['created_at']
        ];
    }
}

echo json_encode(["status" => "success", "videos" => $videos]);
$conn->close();
?>
