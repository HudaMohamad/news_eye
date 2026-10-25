<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/auth_check.php';
require_once __DIR__ . '/db.php';

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read data from Angular
$data = json_decode(file_get_contents("php://input"));

$oldEmail    = $data->oldEmail    ?? '';
$oldPassword = $data->oldPassword ?? '';
$newEmail    = $data->newEmail    ?? '';
$newPassword = $data->password    ?? '';

if (!$oldEmail || !$oldPassword || !$newEmail || !$newPassword) {
    echo json_encode(["status" => "error", "message" => "البيانات غير مكتملة"]);
    exit;
}

// Validate new password strength
if (strlen($newPassword) < 8) {
    echo json_encode(["status" => "error", "message" => "كلمة المرور يجب أن تكون 8 أحرف على الأقل"]);
    exit;
}

// Verify admin exists
$sql  = "SELECT * FROM admins WHERE email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $oldEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "البريد الإلكتروني القديم غير موجود"]);
    exit;
}

$admin = $result->fetch_assoc();

// Check old password (supports both hashed and plain text during migration)
$password_valid = false;
if (password_verify($oldPassword, $admin['password'])) {
    $password_valid = true;
} elseif ($oldPassword === $admin['password']) {
    $password_valid = true;
}

if (!$password_valid) {
    echo json_encode(["status" => "error", "message" => "كلمة المرور القديمة غير صحيحة"]);
    exit;
}

// Hash the new password with bcrypt
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

$updateSql  = "UPDATE admins SET email=?, password=? WHERE id=?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("ssi", $newEmail, $hashedPassword, $admin['id']);

if ($updateStmt->execute()) {
    echo json_encode(["status" => "success", "message" => "تم تحديث البيانات بنجاح"]);
} else {
    echo json_encode(["status" => "error", "message" => "حدث خطأ أثناء التحديث"]);
}

$stmt->close();
$updateStmt->close();
$conn->close();
?>
