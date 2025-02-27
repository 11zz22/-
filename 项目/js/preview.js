document.addEventListener('DOMContentLoaded', function () {
  // 星级评分功能
  const ratingGroups = document.querySelectorAll('.stars');

  ratingGroups.forEach(group => {
    const stars = group.querySelectorAll('.star');

    stars.forEach(star => {
      // 鼠标悬停效果
      star.addEventListener('mouseover', () => {
        const rating = star.dataset.value;
        highlightStars(stars, rating);
      });

      // 鼠标离开效果
      star.addEventListener('mouseleave', () => {
        const currentRating = group.dataset.rating || 0;
        highlightStars(stars, currentRating);
      });

      // 点击选择评分
      star.addEventListener('click', () => {
        const rating = star.dataset.value;
        group.dataset.rating = rating;
        highlightStars(stars, rating);
      });
    });
  });

  // 高亮星星
  function highlightStars(stars, rating) {
    stars.forEach(star => {
      star.classList.toggle('active', star.dataset.value <= rating);
    });
  }

  // 处理评价表单提交
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // 获取评分
      const priceRating = document.querySelector('.rating-row:nth-child(1) .stars').dataset.rating;
      const qualityRating = document.querySelector('.rating-row:nth-child(2) .stars').dataset.rating;
      const content = document.getElementById('reviewContent').value;

      // 验证
      if (!priceRating || !qualityRating) {
        alert('请为商品评分');
        return;
      }

      if (!content.trim()) {
        alert('请输入评价内容');
        return;
      }

      // 创建评价
      addReview({
        priceRating,
        qualityRating,
        content,
        date: new Date()
      });

      // 重置表单
      reviewForm.reset();
      document.querySelectorAll('.stars').forEach(group => {
        group.dataset.rating = '0';
        highlightStars(group.querySelectorAll('.star'), 0);
      });
    });
  }

  // 添加评价到列表
  function addReview(review) {
    const reviewList = document.querySelector('.review-list');
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';

    reviewItem.innerHTML = `
      <div class="rating-info">
        <div class="rating-row">
          <span class="rating-label">性价比：</span>
          <div class="stars">
            ${createStars(review.priceRating)}
          </div>
        </div>
        <div class="rating-row">
          <span class="rating-label">质量：</span>
          <div class="stars">
            ${createStars(review.qualityRating)}
          </div>
        </div>
        <div class="review-date">${formatDate(review.date)}</div>
      </div>
      <div class="review-content">${review.content}</div>
    `;

    reviewList.insertBefore(reviewItem, reviewList.firstChild);
  }

  // 创建星星HTML
  function createStars(rating) {
    return Array(5).fill(0).map((_, i) =>
      `<span class="star ${i < rating ? 'active' : ''}" data-value="${i + 1}">★</span>`
    ).join('');
  }

  // 格式化日期
  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}); 