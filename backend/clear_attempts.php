<?php
require_once __DIR__ . '/db.php';
$conn->query("DELETE FROM login_attempts");
echo "Done";
?>
