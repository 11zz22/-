// 获取DOM元素
const quantityInput = document.getElementById('quantity-input');
const minusBtn = document.querySelector('.minus');
const plusBtn = document.querySelector('.plus');
const addToCartBtn = document.getElementById('add-to-cart');

// 数量控制
function updateQuantity(change) {
  let currentValue = parseInt(quantityInput.value);
  currentValue += change;
  if (currentValue < 1) currentValue = 1;
  quantityInput.value = currentValue;
}

// 绑定数量控制按钮事件
minusBtn?.addEventListener('click', () => updateQuantity(-1));
plusBtn?.addEventListener('click', () => updateQuantity(1));

// 加入购物车功能
function addToCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const quantity = parseInt(quantityInput.value);

  const product = {
    id: window.currentProductId,
    name: document.querySelector('.product-title').textContent,
    price: parseFloat(document.querySelector('.product-price').textContent.replace('¥', '')),
    image: document.querySelector('.product-image').src,
    quantity: quantity
  };

  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push(product);
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartBadge();
  showToast('商品已添加到购物车');

  // 添加延时跳转
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 1000); // 1秒后跳转到购物车页面
}

// 更新购物车图标数量
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

// 初始化时更新购物车图标
document.addEventListener('DOMContentLoaded', updateCartBadge);

// 显示提示信息
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// 绑定加入购物车按钮事件
addToCartBtn?.addEventListener('click', addToCart); 