class ProductSearch {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchResultsGrid = document.getElementById('searchResultsGrid');
    this.products = window.products;

    this.initSearch();
    this.handleUrlParams();
  }

  initSearch() {
    // 实时搜索功能
    this.searchInput.addEventListener('input', () => {
      const searchTerm = this.searchInput.value.trim();
      if (searchTerm.length >= 1) {
        this.performSearch(searchTerm);
      } else {
        this.clearResults();
      }
    });

    // 回车跳转到搜索结果页
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = this.searchInput.value.trim();
        if (searchTerm) {
          // 如果已经在搜索结果页面，直接搜索
          if (window.location.pathname.includes('search-results.html')) {
            this.performSearch(searchTerm);
          } else {
            // 否则跳转到搜索结果页面
            window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
          }
        }
      }
    });
  }

  handleUrlParams() {
    // 处理URL参数中的搜索词
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    if (searchTerm) {
      this.searchInput.value = searchTerm;
      this.performSearch(searchTerm);
    }
  }

  performSearch(searchTerm) {
    const results = this.searchProducts(searchTerm);
    this.displayResults(results);
  }

  searchProducts(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return Object.values(this.products).filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    });
  }

  displayResults(results) {
    this.searchResultsGrid.innerHTML = '';

    if (results.length === 0) {
      this.searchResultsGrid.innerHTML = `
                <div class="no-results">
                    <p>未找到相关商品</p>
                </div>
            `;
      return;
    }

    results.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">¥${product.price}</p>
                <p class="description">${product.description}</p>
            `;

      // 添加点击事件，跳转到商品详情页
      productCard.addEventListener('click', () => {
        window.location.href = `product/${product.id}.html`;
      });

      this.searchResultsGrid.appendChild(productCard);
    });
  }

  clearResults() {
    this.searchResultsGrid.innerHTML = '';
  }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
  new ProductSearch();
});

document.addEventListener('DOMContentLoaded', function () {
  // 获取URL中的搜索关键词
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q');

  if (searchQuery) {
    // 这里可以根据实际需求修改搜索逻辑
    searchProducts(searchQuery);
  }
});

function searchProducts(query) {
  // 获取当前页面的基础路径
  const isProductPage = window.location.pathname.includes('/product/');
  const isMainPage = !window.location.pathname.includes('/');
  const basePath = isProductPage ? '../' : (isMainPage ? '' : './');

  // 模拟搜索结果数据
  const products = [
    {
      name: '章丘款铁锅无涂层炒菜不粘锅家用铸铁锅',
      price: '￥299',
      image: basePath + 'images/guojv.jpg',
      link: basePath + 'product/guojv.html',
      category: '厨房用品'
    },
    {
      name: '戴尔灵越5000 15.6英寸笔记本电脑',
      price: '￥4999',
      image: basePath + 'images/del.jpg',
      link: basePath + 'product/del.html',
      category: '电脑'
    },
    {
      name: '美的电压力锅家用智能5L高压锅',
      price: '￥399',
      image: basePath + 'images/yaliguo.jpg',
      link: basePath + 'product/yaliguo.html',
      category: '厨房用品'
    },
    {
      name: '不锈钢保温杯便携水杯',
      price: '￥89',
      image: basePath + 'images/ping.jpg',
      link: basePath + 'product/pingbei.html',
      category: '厨房用品'
    },
    {
      name: '玻璃密封罐储物罐',
      price: '￥49',
      image: basePath + 'images/guanzi.jpg',
      link: basePath + 'product/guanzi.html',
      category: '厨房用品'
    },
    {
      name: '高档不锈钢餐具套装',
      price: '￥199',
      image: basePath + 'images/canjv.jpg',
      link: basePath + 'product/canjv.html',
      category: '厨房用品'
    },
    {
      name: '调味料收纳盒套装',
      price: '￥79',
      image: basePath + 'images/tiaowei.jpg',
      link: basePath + 'product/tiaowei.html',
      category: '厨房用品'
    },
    {
      name: '多功能红酒开瓶器',
      price: '￥39',
      image: basePath + 'images/kaipingqi.jpg',
      link: basePath + 'product/kaipingqi.html',
      category: '厨房用品'
    },
    {
      name: '不锈钢酒壶随身便携',
      price: '￥69',
      image: basePath + 'images/jiuchu.jpg',
      link: basePath + 'product/jiuchu.html',
      category: '厨房用品'
    },
    {
      name: '惠普星14英寸轻薄本',
      price: '￥4599',
      image: basePath + 'images/huipei.jpg',
      link: basePath + 'product/huipei.html',
      category: '电脑'
    },
    {
      name: '联想YOGA Pro 14s',
      price: '￥4799',
      image: basePath + 'images/lianxiang.jpg',
      link: basePath + 'product/lianxiang.html',
      category: '电脑'
    }
  ];

  const searchResults = document.getElementById('searchResults');

  // 如果不在搜索结果页面，跳转到搜索结果页
  if (!window.location.pathname.includes('search-results.html')) {
    const searchPath = isProductPage ? '../search-results.html' : 'search-results.html';
    window.location.href = searchPath + '?q=' + encodeURIComponent(query);
    return;
  }

  const filteredProducts = products.filter(product => {
    const searchTerm = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );
  });

  if (filteredProducts.length === 0) {
    searchResults.innerHTML = '<p class="no-results">未找到相关商品</p>';
    return;
  }

  // 添加搜索结果标题
  searchResults.innerHTML = `
    <h3 class="search-title">找到 ${filteredProducts.length} 个相关商品</h3>
  `;

  const resultsHTML = filteredProducts.map(product => `
    <div class="search-item">
      <img src="${product.image}" alt="${product.name}">
      <div class="search-item-info">
        <h3>${product.name}</h3>
        <div class="category">${product.category}</div>
        <div class="price">${product.price}</div>
        <div class="view-details">
          <a href="${product.link}">查看详情</a>
        </div>
      </div>
    </div>
  `).join('');

  searchResults.innerHTML += resultsHTML;
} 