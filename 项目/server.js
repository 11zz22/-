const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true
}));

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopping_db'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 获取评论列表
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
            SELECT r.*, u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.productId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({
      success: false,
      error: '获取评论失败'
    });
  }
});

// 提交评论
app.post('/api/reviews', async (req, res) => {
  // 检查用户是否登录
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: '请先登录'
    });
  }

  const { productId, content, priceRating, qualityRating } = req.body;

  // 验证数据
  if (!productId || !content || !priceRating || !qualityRating) {
    return res.status(400).json({
      success: false,
      error: '请提供完整的评论信息'
    });
  }

  try {
    await pool.execute(`
            INSERT INTO reviews 
            (product_id, user_id, content, price_rating, quality_rating)
            VALUES (?, ?, ?, ?, ?)
        `, [productId, req.session.userId, content, priceRating, qualityRating]);

    res.json({
      success: true,
      message: '评论提交成功'
    });
  } catch (error) {
    console.error('提交评论失败:', error);
    res.status(500).json({
      success: false,
      error: '评论提交失败'
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 