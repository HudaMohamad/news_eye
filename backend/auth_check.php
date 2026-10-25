<?php
/**
 * auth_check.php — Centralized authentication middleware
 * Include this file at the top of every admin-only endpoint.
 * 
 * Usage:
 *   require_once __DIR__ . '/auth_check.php';
 * 
 * This will:
 *  1. Start a session
 *  2. Check if the admin is logged in
 *  3. Return 401 Unauthorized if not
 */

require_once __DIR__ . '/cors_config.php';
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "غير مصرح - يرجى تسجيل الدخول" // Unauthorized — please log in
    ]);
    exit;
}
