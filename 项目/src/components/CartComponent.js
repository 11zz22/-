import Cart from '../cart.js';

class CartComponent {
  constructor() {
    this.cart = new Cart();
    this.cartContainer = document.getElementById('cart-container');
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // 绑定购物车图标点击事件
    document.getElementById('cart-icon').addEventListener('click', () => {
      this.toggleCartDisplay();
    });

    // 绑定关闭购物车事件
    document.getElementById('close-cart').addEventListener('click', () => {
      this.hideCart();
    });
  }

  render() {
    if (!this.cartContainer) return;

    const items = this.cart.items;
    const cartContent = `
            <div class="cart-header">
                <h2>购物车</h2>
                <button id="close-cart">×</button>
            </div>
            <div class="cart-items">
                ${items.length ? this.renderItems() : '<p>购物车是空的</p>'}
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    总计: ¥${this.cart.getTotalPrice().toFixed(2)}
                </div>
                <button class="checkout-button" ${items.length ? '' : 'disabled'}>
                    结算
                </button>
            </div>
        `;

    this.cartContainer.innerHTML = cartContent;
    this.updateCartBadge();
  }

  renderItems() {
    return this.cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>¥${item.price}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity">+</button>
                    </div>
                </div>
                <button class="remove-item">删除</button>
            </div>
        `).join('');
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const totalItems = this.cart.getTotalItems();
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  toggleCartDisplay() {
    this.cartContainer.classList.toggle('active');
  }

  hideCart() {
    this.cartContainer.classList.remove('active');
  }
}

export default CartComponent; 