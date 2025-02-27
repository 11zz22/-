<?php
header('Content-Type: application/json');
require_once '../config/database.php';

session_start();

// 检查用户是否登录
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => '请先登录']);
    exit;
}

// 获取POST数据
$data = json_decode(file_get_contents('php://input'), true);

// 验证数据
if (empty($data['productId']) || 
    !isset($data['priceRating']) || 
    !isset($data['qualityRating']) || 
    empty($data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => '请提供完整的评论信息']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO reviews 
        (product_id, user_id, content, price_rating, quality_rating) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['productId'],
        $_SESSION['user_id'],
        $data['content'],
        $data['priceRating'],
        $data['qualityRating']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => '评论提交成功'
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => '评论提交失败']);
}
?> 