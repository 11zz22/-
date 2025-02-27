const { Sequelize } = require('sequelize');

// 从环境变量获取数据库配置
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'shopping',
  username: 'postgres',  // PostgreSQL 默认用户名
  password: '123456',  // 替换为你的实际密码
  logging: console.log,  // 设置为 false 可以关闭 SQL 查询日志
  pool: {
    max: 5,             // 连接池最大连接数
    min: 0,             // 连接池最小连接数
    acquire: 30000,     // 获取连接最大等待时间
    idle: 10000         // 连接最大空闲时间
  }
});

const connectDB = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功！');

    // 同步所有模型（创建表）
    // force: true 会删除现有表并重新创建
    // alter: true 会根据模型更新表结构
    await sequelize.sync({ alter: true });
    console.log('数据库表同步完成！');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; 