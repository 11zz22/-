// 商品数据
const products = {
  '001': {
    id: '001',
    name: '章丘款铁锅无涂层炒菜不粘锅家用铸铁锅',
    description: '优质不锈钢材质，导热均匀，不粘不锈，易清洗。人体工学手柄设计，握感舒适。适用于各种炉具，包括电磁炉。',
    price: 299,
    image: '../images/guojv.jpg',
    specs: {
      材质: '优质不锈钢',
      尺寸: '32cm',
      适用炉具: '燃气灶、电磁炉、电陶炉',
      锅体厚度: '3.0mm',
      产品重量: '2.5kg',
      包装清单: '锅具×1、锅盖×1、铲勺套装×1'
    }
  },
  '002': {
    id: '002',
    name: '美的电压力锅家用智能5L高压锅',
    description: '智能预约，多功能烹饪，安全保护，一锅双胆。',
    price: 399,
    image: '../images/yaliguo.jpg',
    specs: {
      容量: '5L',
      材质: '食品级304不锈钢',
      功率: '900W',
      压力档位: '0-70kPa可调',
      功能模式: '煲汤、焖煮、蒸煮、煮饭',
      安全保护: '九重安全保护'
    }
  },
  '003': {
    id: '003',
    name: '不锈钢保温杯便携水杯',
    description: '304不锈钢，12小时保温，防漏设计。',
    price: 89,
    image: '../images/ping.jpg'
  },
  '004': {
    id: '004',
    name: '玻璃密封罐储物罐',
    description: '食品级玻璃，密封防潮，透明美观。',
    price: 49,
    image: '../images/guanzi.jpg'
  },
  '005': {
    id: '005',
    name: '筷子 餐具学生304不锈钢叉勺套装',
    category: '餐具和餐桌用品',
    subCategory: '餐具',
    price: 49,
    description: '304不锈钢健康材质，内置卡扣不易晃动；一筷一勺一叉，小巧便携，健康随行',
    image: '../images/canjv.jpg',
    specs: {
      '筷头材质': '不锈钢',
      '风格': '北欧风',
      '是否便携': '便携',
      '类别': '普通筷子',
      '套装内容': '一筷一勺一叉',
      '适用场景': '上班族、学生便携',
      '产品重量': '120g',
      '包装尺寸': '23cm×5cm×2cm'
    }
  }
};

// 获取商品信息
function getProductById(id) {
  return products[id];
}

// 根据分类获取产品列表
function getProductsByCategory(category) {
  return Object.values(products).filter(product => product.category === category);
}

// 根据子分类获取产品列表
function getProductsBySubCategory(subCategory) {
  return Object.values(products).filter(product => product.subCategory === subCategory);
} 