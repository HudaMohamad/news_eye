-- Security migration script for sstnews_webdb
-- Run this SQL in phpMyAdmin or MySQL CLI

-- Login rate limiting table
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    attempt_time DATETIME NOT NULL,
    INDEX idx_ip_time (ip_address, attempt_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Clean up old login attempts (run periodically or via cron)
-- DELETE FROM login_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 1 DAY);
