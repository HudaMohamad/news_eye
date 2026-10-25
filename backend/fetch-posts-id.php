<?php
require_once __DIR__ . '/cors_config.php';
require_once __DIR__ . '/db.php';
// $conn is already provided by db.php

$category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;
$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;

$allowedTables = [1=>'post1',2=>'post2',5=>'post5',6=>'post6',7=>'post7',8=>'post8',9=>'post9',10=>'post10',11=>'post11',16=>'post16',19=>'post19',20=>'post20'];

if(!isset($allowedTables[$category_id])) { http_response_code(400); exit; }

$table = $allowedTables[$category_id];

$stmt = $conn->prepare("SELECT * FROM `$table` WHERE post_id=?");
$stmt->bind_param("i",$post_id);
$stmt->execute();
$result = $stmt->get_result();
$post = $result->fetch_assoc();

echo json_encode($post, JSON_UNESCAPED_UNICODE);
$stmt->close();
$conn->close();
?>
