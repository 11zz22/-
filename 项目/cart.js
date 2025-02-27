// 从localStorage获取购物车数据
function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// 更新购物车显示
function updateCartDisplay() {
  const cartContainer = document.getElementById('cart-container');
  const cartItems = getCartItems();
  let totalAmount = 0;

  cartContainer.innerHTML = '';

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>单价: ¥${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <p>小计: ¥${itemTotal}</p>
                <button onclick="removeItem(${index})">删除</button>
            </div>
        `;
    cartContainer.appendChild(itemElement);
  });

  document.getElementById('total-amount').textContent = totalAmount;
}

// 更新商品数量
function updateQuantity(index, change) {
  const cartItems = getCartItems();
  cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartDisplay();
}

// 删除商品
function removeItem(index) {
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartDisplay();
}

// 页面加载时显示购物车内容
window.onload = updateCartDisplay; 