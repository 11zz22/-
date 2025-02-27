// 购物车数据，存储在 localStorage 中
let cart = JSON.parse(localStorage.getItem('cart')) || [];

let currentDeleteId = null;

// 添加商品到购物车
function addToCart(productId, quantity, address) {
  const product = getProductById(productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
        address: address,
        image: product.image
      });
    }
    updateCart();
  }
}

// 根据产品ID获取产品信息（模拟数据）
function getProductById(productId) {
  const products = {
    '001': { id: '001', name: '筷子 餐具学生304不锈钢叉勺套装', price: 49, image: '../images/canjv.jpg' },
    // 添加更多产品信息
  };
  return products[productId];
}

// 更新购物车显示
function updateCart() {
  const cartContainer = document.getElementById('cart-container');
  const totalAmountElement = document.getElementById('total-amount');
  let totalAmount = 0;

  cartContainer.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="product-info">
                <h3>${item.name}</h3>
                <p>单价: ¥${item.price}</p>
                <p>数量: ${item.quantity}</p>
                <p>配送地址: ${item.address}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="showDeleteModal('${item.id}')">删除</button>
        `;
    cartContainer.appendChild(cartItem);
  });

  totalAmountElement.textContent = totalAmount.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 更新商品数量
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, newQuantity);
    updateCart();
  }
}

// 显示删除确认模态框
function showDeleteModal(productId) {
  currentDeleteId = productId;
  const modal = document.getElementById('delete-modal');
  modal.style.display = 'flex';
}

// 关闭删除确认模态框
function closeDeleteModal() {
  const modal = document.getElementById('delete-modal');
  modal.style.display = 'none';
  currentDeleteId = null;
}

// 确认删除商品
function confirmDelete() {
  if (currentDeleteId) {
    removeFromCart(currentDeleteId);
    closeDeleteModal();
  }
}

// 从购物车中删除商品
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// 清空购物车
function clearCart() {
  cart = [];
  updateCart();
}

// 初始化购物车显示
document.addEventListener('DOMContentLoaded', () => {
  updateCart();
});

// 暴露函数到全局作用域
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.showDeleteModal = showDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;