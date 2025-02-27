<?php
$host = 'localhost';
$dbname = 'shopping_db';
$username = 'root';  // 修改为您的数据库用户名
$password = '';      // 修改为您的数据库密码

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => '数据库连接失败: ' . $e->getMessage()]);
    die();
}
?> 