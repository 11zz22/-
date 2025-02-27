// 检查用户登录状态
function checkLoginStatus() {
  const user = getCurrentUser();
  return !!user && !!user.username;
}

// 获取当前用户信息
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    console.log('当前用户信息:', userStr);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('获取用户信息出错:', error);
    return null;
  }
}

// 更新用户显示
function updateUserDisplay(username) {
  console.log('正在更新用户显示:', username);

  const guestLinks = document.getElementById('guest-links');
  const userInfo = document.getElementById('user-info');
  const usernameDisplay = document.getElementById('username-display');

  console.log('DOM 元素:', {
    guestLinks: !!guestLinks,
    userInfo: !!userInfo,
    usernameDisplay: !!usernameDisplay
  });

  if (!guestLinks || !userInfo || !usernameDisplay) {
    console.log('等待 DOM 元素加载...');
    setTimeout(() => updateUserDisplay(username), 100);
    return;
  }

  if (username) {
    console.log('显示用户信息:', username);
    guestLinks.style.display = 'none';
    userInfo.style.display = 'inline-block';
    usernameDisplay.textContent = username;
  } else {
    console.log('显示游客界面');
    guestLinks.style.display = 'block';
    userInfo.style.display = 'none';
  }
}

// 处理退出登录
function handleLogout() {
  console.log('执行退出登录');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// 检查是否已登录
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// 初始化用户状态
function initUserStatus() {
  console.log('初始化用户状态');
  const user = getCurrentUser();
  if (user && user.username) {
    console.log('发现用户:', user.username);
    updateUserDisplay(user.username);
  } else {
    console.log('未找到用户信息');
    updateUserDisplay(null);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 加载完成');
  initUserStatus();
});

// 导出函数
window.getCurrentUser = getCurrentUser;
window.updateUserDisplay = updateUserDisplay;
window.handleLogout = handleLogout;
window.initUserStatus = initUserStatus;
window.checkLoginStatus = checkLoginStatus;

// 记住当前页面URL并跳转到登录页
function redirectToLogin() {
  localStorage.setItem('redirectUrl', window.location.href);
  window.location.href = '/login.html';
}

function handleLoginSuccess(response) {
  // 保存完整的用户信息
  const user = {
    username: response.username,
    token: response.token
  };
  localStorage.setItem('user', JSON.stringify(user));

  // 检查是否有重定向URL
  const redirectUrl = localStorage.getItem('redirectUrl');
  if (redirectUrl) {
    localStorage.removeItem('redirectUrl');
    window.location.href = redirectUrl;
  } else {
    window.location.href = 'index.html';
  }
} 