// 添加商品到购物车
function handleAddToCart(product) {
  console.log('检查登录状态...');
  console.log('当前用户:', getCurrentUser());
  if (!checkLoginStatus()) {
    console.log('用户未登录，准备跳转到登录页面');
    redirectToLogin();
    return;
  }
  console.log('用户已登录，继续添加商品到购物车');

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // 检查商品是否已在购物车中
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += parseInt(product.quantity) || 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: parseInt(product.quantity) || 1
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  // 直接跳转到购物车页面
  window.location.href = '../cart.html';
}

// 更新商品数量
function updateQuantity(index, change) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartDisplay();
}

// 删除商品
function removeItem(index) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.splice(index, 1);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartDisplay();
}

// 显示模态框
function showModal(message, confirmCallback) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const confirmButton = document.getElementById('modal-confirm');

  modalMessage.textContent = message;
  modal.style.display = 'flex';

  // 移除之前的事件监听器
  confirmButton.replaceWith(confirmButton.cloneNode(true));
  const newConfirmButton = document.getElementById('modal-confirm');

  // 添加新的确认事件
  newConfirmButton.addEventListener('click', () => {
    confirmCallback();
    closeModal();
  });
}

// 关闭模态框
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// 删除选中的商品
function removeSelectedItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const selectedIndexes = Array.from(document.querySelectorAll('.item-select:checked'))
    .map(checkbox => parseInt(checkbox.dataset.index))
    .sort((a, b) => b - a);

  if (selectedIndexes.length === 0) {
    showModal('请先选择要删除的商品');
    return;
  }

  showModal('确定要删除选中的商品吗？', () => {
    selectedIndexes.forEach(index => {
      cartItems.splice(index, 1);
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
  });
}

// 清空购物车
function clearCart() {
  showModal('确定要清空购物车吗？', () => {
    localStorage.setItem('cartItems', JSON.stringify([]));
    updateCartDisplay();
  });
}

// 更新购物车显示
function updateCartDisplay() {
  const cartContainer = document.getElementById('cart-container');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let totalAmount = 0;

  // 如果购物车为空，显示提示信息
  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<div class="empty-cart">购物车是空的</div>';
    document.getElementById('total-amount').textContent = '0';
    return;
  }

  cartContainer.innerHTML = '';

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <div class="cart-item-content">
        <div class="item-checkbox">
          <input type="checkbox" class="item-select" data-index="${index}">
        </div>
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="price">单价: ¥${item.price}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)">+</button>
          </div>
          <p class="subtotal">小计: ¥${itemTotal}</p>
          <button class="remove-btn" onclick="removeItem(${index})">删除</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(itemElement);
  });

  document.getElementById('total-amount').textContent = totalAmount;

  // 添加全选和单选功能
  const selectAll = document.getElementById('select-all');
  const itemCheckboxes = document.querySelectorAll('.item-select');

  selectAll.addEventListener('change', (e) => {
    itemCheckboxes.forEach(checkbox => {
      checkbox.checked = e.target.checked;
    });
    updateSelectedInfo();
  });

  itemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
      selectAll.checked = allChecked;
      updateSelectedInfo();
    });
  });

  function updateSelectedInfo() {
    const selectedCount = document.querySelectorAll('.item-select:checked').length;
    document.getElementById('selected-count').textContent = selectedCount;

    let selectedTotal = 0;
    document.querySelectorAll('.item-select:checked').forEach(checkbox => {
      const index = checkbox.dataset.index;
      const item = cartItems[index];
      selectedTotal += item.price * item.quantity;
    });
    document.getElementById('total-amount').textContent = selectedTotal;
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查用户登录状态
  const user = getCurrentUser();
  if (user && user.username) {
    updateUserDisplay(user.username);
  }

  // 更新购物车显示
  updateCartDisplay();
});

// 去结算功能
function goToCheckout() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const selectedItems = [];

  // 获取选中的商品
  document.querySelectorAll('.item-select:checked').forEach(checkbox => {
    const index = parseInt(checkbox.dataset.index);
    selectedItems.push(cartItems[index]);
  });

  if (selectedItems.length === 0) {
    showModal('请先选择要结算的商品');
    return;
  }

  // 保存选中的商品到localStorage
  localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));

  // 跳转到订单页面
  window.location.href = 'order.html';
}

// 导出函数
window.handleAddToCart = handleAddToCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.removeSelectedItems = removeSelectedItems;
window.clearCart = clearCart;
window.showModal = showModal;
window.closeModal = closeModal;
window.goToCheckout = goToCheckout;
window.updateCartDisplay = updateCartDisplay; 