<?php
session_start();

require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php'; // Use centralized connection

$data = json_decode(file_get_contents("php://input"));
if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

$email = $data->email ?? '';
$password = $data->password ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "البريد الإلكتروني وكلمة المرور مطلوبان"]);
    exit;
}

try {
    $ip = $_SERVER['REMOTE_ADDR'];

    // Rate limiting: check for too many failed attempts
    $stmt_check = $conn->prepare("SELECT COUNT(*) as attempts FROM login_attempts WHERE ip_address = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
    if ($stmt_check) {
        $stmt_check->bind_param("s", $ip);
        $stmt_check->execute();
        $rate_result = $stmt_check->get_result()->fetch_assoc();
        if ($rate_result && $rate_result['attempts'] >= 5) {
            http_response_code(429);
            echo json_encode(["status" => "error", "message" => "محاولات كثيرة جداً. يرجى المحاولة بعد 15 دقيقة"]);
            $stmt_check->close();
            $conn->close();
            exit;
        }
        $stmt_check->close();
    }

    $stmt = $conn->prepare("SELECT * FROM admins WHERE email=?");
    if (!$stmt) {
        throw new Exception("Failed to prepare admin selection query");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        
        $password_valid = false;
        if (password_verify($password, $admin['password'])) {
            $password_valid = true;
        } elseif ($password === $admin['password']) {
            $hashed = password_hash($password, PASSWORD_BCRYPT);
            $update_stmt = $conn->prepare("UPDATE admins SET password=? WHERE id=?");
            if ($update_stmt) {
                $update_stmt->bind_param("si", $hashed, $admin['id']);
                $update_stmt->execute();
                $update_stmt->close();
            }
            $password_valid = true;
        }
        
        if ($password_valid) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_email'] = $admin['email'];
            
            $clear_stmt = $conn->prepare("DELETE FROM login_attempts WHERE ip_address = ?");
            if ($clear_stmt) {
                $clear_stmt->bind_param("s", $ip);
                $clear_stmt->execute();
                $clear_stmt->close();
            }
            
            echo json_encode(["status" => "success", "sessionId" => session_id()]);
        } else {
            $fail_stmt = $conn->prepare("INSERT INTO login_attempts (ip_address, attempt_time) VALUES (?, NOW())");
            if ($fail_stmt) {
                $fail_stmt->bind_param("s", $ip);
                $fail_stmt->execute();
                $fail_stmt->close();
            }
            echo json_encode(["status" => "error", "message" => "كلمة المرور خاطئة"]);
        }
    } else {
        $fail_stmt = $conn->prepare("INSERT INTO login_attempts (ip_address, attempt_time) VALUES (?, NOW())");
        if ($fail_stmt) {
            $fail_stmt->bind_param("s", $ip);
            $fail_stmt->execute();
            $fail_stmt->close();
        }
        echo json_encode(["status" => "error", "message" => "البريد غير موجود"]);
    }

    $stmt->close();
    $conn->close();

} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "General Error: " . $e->getMessage()]);
}
?>
