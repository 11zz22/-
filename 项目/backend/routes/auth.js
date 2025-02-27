const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户名是否已存在
    const userExists = await User.findOne({
      where: { username }
    });

    if (userExists) {
      return res.status(400).json({
        error: 'username_exists',
        message: '该用户名已被注册'
      });
    }

    // 检查邮箱是否已存在
    const emailExists = await User.findOne({
      where: { email }
    });

    if (emailExists) {
      return res.status(400).json({
        error: 'email_exists',
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 生成 token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回成功信息，包含 token 和用户信息
    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回用户信息（不包含密码）
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 检查用户名是否存在
router.post('/check-username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username }
    });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 检查邮箱是否存在
router.post('/check-email', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 