require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../')));

// HTML 页面路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../register.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

// API 路由
app.use('/api/auth', authRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 处理 404
app.use((req, res) => {
  // 如果是 API 请求，返回 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: '页面未找到' });
  }
  // 如果是 HTML 请求，返回错误信息
  res.status(404).send(`
    <div style="text-align: center; padding: 50px;">
      <h1 style="font-size: 48px; color: #333;">404</h1>
      <p style="font-size: 24px; color: #666;">抱歉，页面未找到</p>
      <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">返回首页</a>
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 