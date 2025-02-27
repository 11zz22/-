// 用户管理类
class UserManager {
  constructor() {
    // 从 localStorage 获取用户列表，如果没有则初始化为空数组
    this.users = JSON.parse(localStorage.getItem('users')) || [];

    // 初始化一些测试账号
    if (this.users.length === 0) {
      this.users = [
        {
          username: 'admin',
          password: '123456',
          email: 'admin@example.com',
          registerTime: new Date().toISOString()
        }
      ];
      this.saveUsers();
    }
  }

  // 保存用户列表到 localStorage
  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // 检查用户名是否存在
  checkUsername(username) {
    return this.users.some(user => user.username === username);
  }

  // 检查邮箱是否存在
  checkEmail(email) {
    return this.users.some(user => user.email === email);
  }

  // 注册新用户
  register(username, email, password) {
    // 检查用户名是否已存在
    if (this.checkUsername(username)) {
      return {
        success: false,
        error: 'username_exists',
        message: '该用户名已被注册'
      };
    }

    // 检查邮箱是否已存在
    if (this.checkEmail(email)) {
      return {
        success: false,
        error: 'email_exists',
        message: '该邮箱已被注册'
      };
    }

    // 创建新用户
    const newUser = {
      username,
      email,
      password,
      registerTime: new Date().toISOString()
    };

    // 添加到用户列表
    this.users.push(newUser);
    this.saveUsers();

    return {
      success: true,
      message: '注册成功'
    };
  }

  // 用户登录
  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);

    if (user) {
      // 生成模拟的 token
      const token = btoa(username + ':' + new Date().getTime());

      // 保存登录状态
      localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        email: user.email,
        token: token
      }));

      return {
        success: true,
        token: token,
        username: user.username
      };
    }

    return {
      success: false,
      error: 'invalid_credentials',
      message: '用户名或密码错误'
    };
  }

  // 获取当前登录用户
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  // 退出登录
  logout() {
    localStorage.removeItem('currentUser');
  }
}

// 创建全局实例
window.userManager = new UserManager(); 