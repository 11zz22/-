<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$productId = $_GET['productId'] ?? '';

if (empty($productId)) {
    http_response_code(400);
    echo json_encode(['error' => '产品ID不能为空']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT r.*, u.username 
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$productId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $reviews
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => '获取评论失败']);
}
?> 