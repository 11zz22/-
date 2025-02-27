document.addEventListener('DOMContentLoaded', function () {
  // 切换表单
  const tabBtns = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.form-container');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有活动状态
      tabBtns.forEach(b => b.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));

      // 添加当前活动状态
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
    });
  });

  // 登录表单验证
  const loginForm = document.querySelector('#loginForm form');
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.querySelector('input[name="username"]').value;
    const password = this.querySelector('input[name="password"]').value;

    if (!username || !password) {
      showError('请填写所有必填字段');
      return;
    }

    // 这里添加登录逻辑
    console.log('登录信息:', { username, password });
  });

  // 注册表单验证
  const registerForm = document.querySelector('#registerForm form');
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = this.querySelector('input[name="username"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    const confirmPassword = this.querySelector('input[name="confirmPassword"]').value;

    // 重置错误信息
    this.querySelectorAll('.error-message').forEach(error => {
      error.style.display = 'none';
      error.textContent = '';
    });

    let hasError = false;

    // 验证用户名
    if (!username) {
      showFieldError(this, 'username', '请输入用户名');
      hasError = true;
    }

    // 验证邮箱
    if (!email || !isValidEmail(email)) {
      showFieldError(this, 'email', '请输入有效的邮箱地址');
      hasError = true;
    }

    // 验证密码
    if (!password) {
      showFieldError(this, 'password', '请输入密码');
      hasError = true;
    } else if (password.length < 6) {
      showFieldError(this, 'password', '密码长度至少为6位');
      hasError = true;
    }

    // 验证确认密码
    if (password !== confirmPassword) {
      showFieldError(this, 'confirmPassword', '两次输入的密码不一致');
      hasError = true;
    }

    if (!hasError) {
      // 这里添加注册逻辑
      console.log('注册信息:', { username, email, password });
    }
  });

  // 辅助函数
  function showFieldError(form, fieldName, message) {
    const errorElement = form.querySelector(`input[name="${fieldName}"] + .error-message`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}); 