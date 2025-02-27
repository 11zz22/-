require('dotenv').config();
const { connectDB } = require('./config/db');
const User = require('./models/user');

async function testConnection() {
  try {
    // 测试数据库连接
    await connectDB();
    console.log('数据库连接测试成功');

    // 测试创建用户
    const testUser = await User.create({
      username: 'test',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('测试用户创建成功:', testUser.toJSON());

    // 测试查询用户
    const users = await User.findAll();
    console.log('所有用户:', users.map(user => user.toJSON()));

  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    process.exit();
  }
}

testConnection(); 