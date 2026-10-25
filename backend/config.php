<?php
/**
 * config.php — Centralized environment configuration loader
 *
 * Reads the .env file from the backend root directory and defines
 * constants for use throughout the application.
 *
 * Usage in any PHP file:
 *   require_once __DIR__ . '/config.php';
 *   // Then use: DB_HOST, DB_NAME, DB_USER, DB_PASS, UPLOAD_BASE_URL, etc.
 */

// Prevent double-loading
if (defined('APP_ENV')) {
    return;
}

/**
 * Parse a .env file and populate $_ENV + constants.
 *
 * Rules:
 *  - Lines starting with # are comments and are ignored.
 *  - Blank lines are ignored.
 *  - Values may optionally be wrapped in single or double quotes.
 *  - Inline comments (after a #) are stripped.
 */
function _loadEnv(string $filePath): void
{
    if (!file_exists($filePath)) {
        // In production, log a warning rather than crashing.
        error_log("[config.php] WARNING: .env file not found at {$filePath}");
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        // Skip comments and blank lines
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        // Split on first '=' only
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);

        // Strip inline comments
        if (preg_match('/^(["\'])(.*)\1\s*$/', $value, $m)) {
            // Quoted value — preserve as-is (no inline comment stripping inside quotes)
            $value = $m[2];
        } else {
            // Unquoted — strip inline comments
            if (($pos = strpos($value, ' #')) !== false) {
                $value = trim(substr($value, 0, $pos));
            }
        }

        // Set in $_ENV and $_SERVER for compatibility
        $_ENV[$key]    = $value;
        $_SERVER[$key] = $value;

        // Also set via putenv for CLI / some SAPI contexts
        putenv("{$key}={$value}");
    }
}

// ── Load the .env file ──────────────────────────────────────────────────────
_loadEnv(__DIR__ . '/.env');

/**
 * Helper to safely retrieve an env value with a default fallback.
 */
function env(string $key, string $default = ''): string
{
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

// ── Define application-wide constants ───────────────────────────────────────

// Application
define('APP_ENV',  env('APP_ENV',  'production'));
define('APP_URL',  env('APP_URL',  'http://localhost'));
define('APP_NAME', env('APP_NAME', 'SSTNews'));

// Database
define('DB_HOST', env('DB_HOST', '127.0.0.1'));
define('DB_PORT', env('DB_PORT', '3306'));
define('DB_NAME', env('DB_NAME', 'sstnews_webdb'));
define('DB_USER', env('DB_USER', 'root'));
define('DB_PASS', env('DB_PASS', ''));

// Upload
// No trailing slash — append '/' yourself when building paths.
define('UPLOAD_BASE_URL',       env('UPLOAD_BASE_URL', APP_URL . '/news/backend/upload'));
define('UPLOAD_EXTRA_BASE_URL', UPLOAD_BASE_URL . '/extra');

// CORS
define('CORS_ALLOWED_ORIGIN', env('CORS_ALLOWED_ORIGIN', 'http://localhost:4200'));
