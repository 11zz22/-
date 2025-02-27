document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.product-image-container');
  const mainImage = container.querySelector('.main-image');
  const previewImage = container.querySelector('.preview-image');

  // 鼠标进入主图区域
  mainImage.addEventListener('mouseenter', function () {
    previewImage.style.display = 'block';
  });

  // 鼠标离开容器
  container.addEventListener('mouseleave', function () {
    previewImage.style.display = 'none';
  });
}); 