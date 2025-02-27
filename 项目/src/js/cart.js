class Cart {
  constructor() {
    this.items = this.loadFromStorage();
    this.init();
  }

  init() {
    this.renderCart();
    this.bindEvents();
    this.updateCartBadge();
  }

  loadFromStorage() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  }

  saveToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    this.updateCartBadge();
  }

  renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <p>购物车是空的</p>
          <a href="index.html" class="continue-btn">去购物</a>
        </div>`;
      this.updateSummary();
      return;
    }

    const itemsHtml = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p class="item-price">¥${item.price}</p>
          <div class="item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="item-total">
          ¥${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" data-id="${item.id}">删除</button>
      </div>
    `).join('');

    cartContainer.innerHTML = itemsHtml;
    this.updateSummary();
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  updateSummary() {
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');

    if (!totalItems || !totalPrice) return;

    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    totalItems.textContent = itemCount;
    totalPrice.textContent = `¥${total.toFixed(2)}`;

    // 更新结算按钮状态
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = itemCount === 0;
    }
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      const id = target.dataset.id;

      if (target.classList.contains('minus')) {
        this.updateQuantity(id, -1);
      } else if (target.classList.contains('plus')) {
        this.updateQuantity(id, 1);
      } else if (target.classList.contains('remove-btn')) {
        this.removeItem(id);
      }
    });

    document.getElementById('continue-shopping')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      this.checkout();
    });
  }

  updateQuantity(id, change) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.saveToStorage();
        this.renderCart();
      }
    }
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveToStorage();
    this.renderCart();
  }

  checkout() {
    if (this.items.length === 0) {
      alert('购物车是空的');
      return;
    }
    // 这里添加结算逻辑
    alert('结算功能开发中...');
  }
}

// 初始化购物车
new Cart(); 