document.addEventListener('DOMContentLoaded', function () {
  // 标签页切换功能
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 移除所有活动状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => {
        content.style.display = 'none';
      });

      // 添加当前活动状态
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).style.display = 'block';
    });
  });

  // 评价功能
  const stars = document.querySelectorAll('.star');
  const reviewForm = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');

  // 星级评分功能
  stars.forEach(star => {
    star.addEventListener('click', function () {
      const ratingContainer = this.closest('.star-rating');
      const value = this.getAttribute('data-value');
      const stars = ratingContainer.querySelectorAll('.star');

      stars.forEach(s => {
        s.classList.remove('active');
        if (s.getAttribute('data-value') <= value) {
          s.classList.add('active');
        }
      });

      ratingContainer.setAttribute('data-rating', value);
    });
  });

  // 提交评价
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // 检查用户是否登录
    const user = getCurrentUser();
    if (!user || !user.username) {
      alert('请先登录后再发表评价');
      return;
    }

    // 获取评分
    const priceRating = document.querySelector('.price-rating').getAttribute('data-rating');
    const qualityRating = document.querySelector('.quality-rating').getAttribute('data-rating');
    const content = document.getElementById('reviewContent').value.trim();

    // 验证
    if (!priceRating || !qualityRating) {
      alert('请给出星级评分');
      return;
    }
    if (!content) {
      alert('请填写评价内容');
      return;
    }

    // 创建评价项
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    reviewItem.innerHTML = `
      <div class="review-header">
        <span class="review-username">${user.username}</span>
        <span class="review-date">${new Date().toLocaleDateString()}</span>
      </div>
      <div class="review-ratings">
        <div class="rating-item">
          <span class="rating-label">性价比：</span>
          ${createStars(priceRating)}
        </div>
        <div class="rating-item">
          <span class="rating-label">质量：</span>
          ${createStars(qualityRating)}
        </div>
      </div>
      <div class="review-content">${content}</div>
    `;

    // 添加到评价列表
    reviewList.insertBefore(reviewItem, reviewList.firstChild);

    // 重置表单
    reviewForm.reset();
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('active');
    });
    document.querySelectorAll('.star-rating').forEach(container => {
      container.removeAttribute('data-rating');
    });
  });

  // 当用户开始输入时隐藏错误信息
  document.getElementById('reviewContent').addEventListener('input', function () {
    errorMessage.style.display = 'none';
  });
});

// 创建星星显示
function createStars(rating) {
  return Array(5).fill(0).map((_, i) =>
    `<span class="star ${i < rating ? 'active' : ''}"">★</span>`
  ).join('');
}

// 获取评论列表
async function fetchReviews(productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/reviews/${productId}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      console.error('获取评论失败:', result.error);
      return [];
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    return [];
  }
}

// 渲染评论列表
function renderReviews(reviews) {
  const reviewList = document.getElementById('reviewList');
  if (!reviewList) return;

  if (!reviews.length) {
    reviewList.innerHTML = '<p class="no-reviews">暂无评论</p>';
    return;
  }

  const html = reviews.map(review => `
    <div class="review-item">
      <div class="review-header">
        <span class="review-username">${review.username}</span>
        <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
      </div>
      <div class="review-ratings">
        <div class="rating-display">
          <span class="rating-label">性价比：</span>
          <span class="stars">${'★'.repeat(review.price_rating)}${'☆'.repeat(5 - review.price_rating)}</span>
        </div>
        <div class="rating-display">
          <span class="rating-label">质量：</span>
          <span class="stars">${'★'.repeat(review.quality_rating)}${'☆'.repeat(5 - review.quality_rating)}</span>
        </div>
      </div>
      <div class="review-content">${review.content}</div>
    </div>
  `).join('');

  reviewList.innerHTML = html;
}

// 提交评论
async function submitReview(event) {
  event.preventDefault();

  const form = event.target;
  const priceRating = document.querySelector('.price-rating .star.selected')?.dataset.value || 0;
  const qualityRating = document.querySelector('.quality-rating .star.selected')?.dataset.value || 0;
  const content = document.getElementById('reviewContent').value;

  if (!priceRating || !qualityRating || !content.trim()) {
    alert('请完整填写评价内容');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: getCurrentProductId(),
        priceRating: parseInt(priceRating),
        qualityRating: parseInt(qualityRating),
        content: content
      }),
      credentials: 'include' // 包含cookie以支持session
    });

    const result = await response.json();

    if (result.success) {
      alert('评价提交成功！');
      form.reset();
      document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
      await loadReviews();
    } else {
      alert(result.error || '评价提交失败，请稍后重试');
    }
  } catch (error) {
    console.error('提交评论失败:', error);
    alert('评价提交失败，请稍后重试');
  }
}

// 获取当前产品ID
function getCurrentProductId() {
  // 从URL中获取产品ID
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  const productType = filename.replace('.html', '').toUpperCase();

  // 根据文件名映射到产品ID
  const productIdMap = {
    'DEL': 'DEL001',
    'LIANXIANG': 'LX001',
    'HUIPEI': 'HP001',
    'JIUCHU': 'JC001',
    'KAIPINGQI': 'KPQ001',
    'TIAOWEI': 'TW001',
    'CANJV': 'CJ001',
    'GUANZI': 'GZ001',
    'YALIGUO': 'YLG001',
    'PINGBEI': 'PB001'
  };

  return productIdMap[productType] || '';
}

// 初始化评论功能
function initReviews() {
  // 绑定评分星级点击事件
  document.querySelectorAll('.star-rating .star').forEach(star => {
    star.addEventListener('click', function () {
      const rating = this.parentElement;
      rating.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // 绑定表单提交事件
  const form = document.getElementById('reviewForm');
  if (form) {
    form.addEventListener('submit', submitReview);
  }

  // 加载评论列表
  loadReviews();
}

// 加载评论列表
async function loadReviews() {
  const productId = getCurrentProductId();
  if (productId) {
    const reviews = await fetchReviews(productId);
    renderReviews(reviews);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initReviews);