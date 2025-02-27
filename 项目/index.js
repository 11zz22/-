function addToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // 检查商品是否已在购物车中
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  alert('商品已添加到购物车！');
}

// 在显示商品时添加"加入购物车"按钮
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>¥${product.price}</p>
            <button onclick="addToCart(${JSON.stringify(product)})">加入购物车</button>
        </div>
    `).join('');
} 