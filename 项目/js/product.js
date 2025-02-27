// 立即购买
function buyNow() {
  const quantity = parseInt(document.querySelector('input[type="text"]').value) || 1;
  const productInfo = {
    id: '001', // 商品ID
    name: '章丘款铁锅无涂层炒菜不粘锅家用铸铁锅',
    price: 299,
    image: '../images/product1.jpg',
    quantity: quantity
  };

  // 保存到 localStorage，供订单页面使用
  localStorage.setItem('buyNowItem', JSON.stringify([productInfo]));

  // 跳转到订单页面
  window.location.href = '../order.html?from=buyNow';
} 