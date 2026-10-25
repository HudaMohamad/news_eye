<?php
/**
 * db.php — Centralized database connection
 *
 * Provides a shared $conn (mysqli) instance.
 * All other PHP files should require this file instead of
 * creating their own database connections.
 *
 * Usage:
 *   require_once __DIR__ . '/db.php';
 *   // $conn is now available
 */

require_once __DIR__ . '/config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, (int) DB_PORT);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'فشل الاتصال بقاعدة البيانات']));
}
