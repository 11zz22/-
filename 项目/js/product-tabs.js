document.addEventListener('DOMContentLoaded', function () {
  // 获取所有标签按钮和内容区域
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // 为每个标签按钮添加点击事件
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有标签的活动状态
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');

      // 添加当前标签的活动状态
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).style.display = 'block';
    });
  });
}); 