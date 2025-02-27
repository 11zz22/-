// 省市区数据（示例数据）
const addressData = {
  provinces: ['广东省', '北京市', '上海市'],
  cities: {
    '广东省': ['广州市', '深圳市', '东莞市'],
    '北京市': ['北京市'],
    '上海市': ['上海市']
  },
  districts: {
    '广州市': ['天河区', '海珠区', '越秀区'],
    '深圳市': ['南山区', '福田区', '罗湖区'],
    '东莞市': ['南城区', '东城区', '万江区'],
    '北京市': ['朝阳区', '海淀区', '东城区'],
    '上海市': ['浦东新区', '黄浦区', '徐汇区']
  }
};

// 初始化订单页面
document.addEventListener('DOMContentLoaded', () => {
  // 检查用户登录状态
  if (!checkLoginStatus()) {
    redirectToLogin();
    return;
  }

  // 获取来源参数
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from');

  let orderItems;

  // 根据来源获取商品信息
  if (from === 'buyNow') {
    // 来自立即购买
    orderItems = JSON.parse(localStorage.getItem('buyNowItem')) || [];
    if (orderItems.length === 0) {
      window.location.href = 'index.html';
      return;
    }
  } else {
    // 来自购物车
    orderItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    if (orderItems.length === 0) {
      window.location.href = 'cart.html';
      return;
    }
  }

  // 显示商品列表
  displayOrderItems(orderItems);

  // 计算总金额
  calculateTotal(orderItems);

  // 加载已保存的地址
  loadSavedAddress();

  // 添加地址相关事件监听
  initAddressEvents();

  // 初始化省份选择器
  initProvinceSelect();
});

// 显示商品列表
function displayOrderItems(items) {
  const container = document.getElementById('order-items-container');
  container.innerHTML = '';

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">¥${item.price}</div>
        <div class="item-quantity">x${item.quantity}</div>
      </div>
    `;
    container.appendChild(itemElement);
  });
}

// 计算总金额
function calculateTotal(items) {
  const itemsTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = itemsTotal >= 99 ? 0 : 10; // 满99包邮
  const totalAmount = itemsTotal + shippingFee;

  document.getElementById('items-total').textContent = itemsTotal;
  document.getElementById('shipping-fee').textContent = shippingFee;
  document.getElementById('total-amount').textContent = totalAmount;
}

// 加载已保存的地址
function loadSavedAddress() {
  const addressInfo = JSON.parse(localStorage.getItem('shippingAddress'));
  if (addressInfo) {
    updateAddressDisplay(addressInfo);
  }
}

// 初始化地址相关事件
function initAddressEvents() {
  // 添加新地址按钮
  document.querySelector('.address-item.add-new').addEventListener('click', () => {
    // 清空表单
    document.getElementById('receiver-name').value = '';
    document.getElementById('receiver-phone').value = '';
    document.getElementById('address-detail').value = '';
    document.getElementById('set-default').checked = false;
    // 修改模态框标题
    document.querySelector('.modal-title').textContent = '添加收货地址';
    showAddressModal();
  });

  // 编辑地址按钮
  document.querySelector('.edit-address')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const addressInfo = JSON.parse(localStorage.getItem('shippingAddress'));
    if (addressInfo) {
      fillAddressForm(addressInfo);
      // 修改模态框标题
      document.querySelector('.modal-title').textContent = '编辑收货地址';
      showAddressModal();
    }
  });

  // 删除地址按钮
  document.querySelector('.delete-address')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteAddress();
  });

  // 地址卡片点击事件
  document.querySelector('.address-item:not(.add-new)')?.addEventListener('click', () => {
    const addressInfo = JSON.parse(localStorage.getItem('shippingAddress'));
    if (addressInfo) {
      fillAddressForm(addressInfo);
    }
  });
}

// 初始化省份选择器
function initProvinceSelect() {
  const provinceSelect = document.getElementById('province');
  provinceSelect.innerHTML = '<option value="">请选择省份</option>';
  addressData.provinces.forEach(province => {
    provinceSelect.innerHTML += `<option value="${province}">${province}</option>`;
  });
}

// 加载城市
function loadCities() {
  const province = document.getElementById('province').value;
  const citySelect = document.getElementById('city');
  const districtSelect = document.getElementById('district');

  citySelect.innerHTML = '<option value="">请选择城市</option>';
  districtSelect.innerHTML = '<option value="">请选择区/县</option>';

  if (province) {
    addressData.cities[province].forEach(city => {
      citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
  }
}

// 加载区县
function loadDistricts() {
  const city = document.getElementById('city').value;
  const districtSelect = document.getElementById('district');

  districtSelect.innerHTML = '<option value="">请选择区/县</option>';

  if (city) {
    addressData.districts[city].forEach(district => {
      districtSelect.innerHTML += `<option value="${district}">${district}</option>`;
    });
  }
}

// 更新地址显示
function updateAddressDisplay(addressInfo) {
  const addressItem = document.querySelector('.address-item');
  if (addressItem) {
    addressItem.innerHTML = `
      <div class="address-content">
        <div class="address-info">
          <p><span class="name">${addressInfo.name}</span><span class="phone">${addressInfo.phone}</span></p>
          <p class="address-detail">${addressInfo.address}</p>
        </div>
        <div class="address-actions">
          <a href="#" class="edit-address" onclick="showAddressModal()">编辑</a>
          <a href="#" class="delete-address" onclick="deleteAddress()">删除</a>
        </div>
      </div>
    `;
    // 重新绑定事件
    initAddressEvents();
  }
}

// 删除地址
function deleteAddress() {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const confirmButton = document.getElementById('modal-confirm');
  const cancelButton = document.querySelector('.modal-btn.cancel');

  modalMessage.textContent = '确定要删除该地址吗？';
  modal.style.display = 'flex';
  confirmButton.style.display = 'block';
  cancelButton.style.display = 'block';

  // 确认删除
  confirmButton.onclick = () => {
    localStorage.removeItem('shippingAddress');
    const addressList = document.querySelector('.address-list');
    addressList.innerHTML = `
      <div class="address-item add-new">
        <button class="add-address-btn">
          <span class="plus">+</span>
          <span>添加新地址</span>
        </button>
      </div>
    `;
    initAddressEvents();
    closeModal();
  };

  // 取消删除
  cancelButton.onclick = () => {
    closeModal();
  };
}

// 显示模态框
function showModal(message, confirmCallback) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const confirmButton = document.getElementById('modal-confirm');

  modalMessage.textContent = message;
  modal.style.display = 'flex';

  if (confirmCallback) {
    // 移除之前的事件监听器
    confirmButton.replaceWith(confirmButton.cloneNode(true));
    const newConfirmButton = document.getElementById('modal-confirm');

    // 添加新的确认事件
    newConfirmButton.addEventListener('click', () => {
      confirmCallback();
      closeModal();
    });
    confirmButton.style.display = 'block';
  } else {
    confirmButton.style.display = 'none';
  }
}

// 关闭模态框
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// 提交订单
function submitOrder() {
  const addressInfo = JSON.parse(localStorage.getItem('shippingAddress'));
  if (!addressInfo) {
    showModal('请先添加收货地址');
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from');

  showModal('确认提交订单吗？', () => {
    // 这里可以添加订单提交到服务器的逻辑

    // 清除结算商品信息
    if (from === 'buyNow') {
      localStorage.removeItem('buyNowItem');
    } else {
      localStorage.removeItem('checkoutItems');
    }

    // 显示成功提示后跳转
    showModal('订单提交成功！', () => {
      window.location.href = 'index.html';
    });
  });
}

// 编辑地址时填充表单
function fillAddressForm(addressInfo) {
  document.getElementById('receiver-name').value = addressInfo.name;
  document.getElementById('receiver-phone').value = addressInfo.phone;
  document.getElementById('province').value = addressInfo.province;
  loadCities();
  document.getElementById('city').value = addressInfo.city;
  loadDistricts();
  document.getElementById('district').value = addressInfo.district;
  document.getElementById('address-detail').value = addressInfo.address;
}

// 显示地址编辑模态框
function showAddressModal() {
  document.getElementById('address-modal').style.display = 'flex';
}

// 关闭地址编辑模态框
function closeAddressModal() {
  document.getElementById('address-modal').style.display = 'none';
}

// 保存地址
function saveAddress() {
  const name = document.getElementById('receiver-name').value;
  const phone = document.getElementById('receiver-phone').value;
  const address = document.getElementById('address-detail').value;
  const isDefault = document.getElementById('set-default').checked;

  if (!name || !phone || !address) {
    showModal('请填写完整的地址信息');
    return;
  }

  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showModal('请输入正确的手机号码');
    return;
  }

  // 保存地址信息
  const addressInfo = {
    name,
    phone,
    address,
    isDefault,
    id: Date.now()
  };

  // 获取已有地址列表
  let addressList = JSON.parse(localStorage.getItem('addressList')) || [];

  if (isDefault) {
    // 将其他地址设为非默认
    addressList = addressList.map(addr => ({ ...addr, isDefault: false }));
  }

  // 添加新地址
  addressList.push(addressInfo);

  // 保存地址列表
  localStorage.setItem('addressList', JSON.stringify(addressList));
  localStorage.setItem('shippingAddress', JSON.stringify(addressInfo));

  // 更新显示
  updateAddressDisplay(addressInfo);

  // 关闭模态框
  closeAddressModal();

  // 显示成功提示
  showModal('地址保存成功');
}

// 导出函数
window.showAddressModal = showAddressModal;
window.closeAddressModal = closeAddressModal;
window.saveAddress = saveAddress;
window.submitOrder = submitOrder;
window.loadCities = loadCities;
window.loadDistricts = loadDistricts; 