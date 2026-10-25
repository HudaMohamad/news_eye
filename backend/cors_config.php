<?php
/**
 * cors_config.php — Centralized CORS configuration
 *
 * Allows dynamic localhost origins to avoid issues with ng serve
 * dynamic ports. Falls back to CORS_ALLOWED_ORIGIN from config.php
 * for production environments.
 */

require_once __DIR__ . '/config.php';

$allowed_origin = CORS_ALLOWED_ORIGIN;

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (APP_ENV === 'development') {
        // Allow any localhost / 127.0.0.1 origin in development
        if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
            $allowed_origin = $origin;
        }
    } else {
        // In production, only allow the explicitly configured origin
        if ($origin === CORS_ALLOWED_ORIGIN) {
            $allowed_origin = $origin;
        }
    }
}

header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
