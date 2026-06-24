const express = require('express');
const router = express.Router();
const https = require('https');

const CHINESE_CITIES = [
  // 直辖市
  { name: '北京', lat: 39.9042, lng: 116.4074, nameEn: 'Beijing' },
  { name: '上海', lat: 31.2304, lng: 121.4737, nameEn: 'Shanghai' },
  { name: '天津', lat: 39.3434, lng: 117.3616, nameEn: 'Tianjin' },
  { name: '重庆', lat: 29.4316, lng: 106.9123, nameEn: 'Chongqing' },
  
  // 广东省
  { name: '广州', lat: 23.1291, lng: 113.2644, nameEn: 'Guangzhou' },
  { name: '深圳', lat: 22.5431, lng: 114.0579, nameEn: 'Shenzhen' },
  { name: '东莞', lat: 23.0430, lng: 113.7633, nameEn: 'Dongguan' },
  { name: '佛山', lat: 23.0218, lng: 113.1218, nameEn: 'Foshan' },
  { name: '珠海', lat: 22.2710, lng: 113.5767, nameEn: 'Zhuhai' },
  { name: '中山', lat: 22.5170, lng: 113.3925, nameEn: 'Zhongshan' },
  { name: '惠州', lat: 23.1116, lng: 114.4162, nameEn: 'Huizhou' },
  { name: '汕头', lat: 23.3541, lng: 116.6820, nameEn: 'Shantou' },
  { name: '湛江', lat: 21.2707, lng: 110.3594, nameEn: 'Zhanjiang' },
  { name: '茂名', lat: 21.6682, lng: 110.9255, nameEn: 'Maoming' },
  { name: '江门', lat: 22.5787, lng: 113.0819, nameEn: 'Jiangmen' },
  { name: '肇庆', lat: 23.0515, lng: 112.4697, nameEn: 'Zhaoqing' },
  { name: '梅州', lat: 24.2886, lng: 116.1223, nameEn: 'Meizhou' },
  { name: '揭阳', lat: 23.5500, lng: 116.3728, nameEn: 'Jieyang' },
  { name: '清远', lat: 23.6818, lng: 113.0561, nameEn: 'Qingyuan' },
  { name: '韶关', lat: 24.8104, lng: 113.5975, nameEn: 'Shaoguan' },
  { name: '河源', lat: 23.7437, lng: 114.7007, nameEn: 'Heyuan' },
  { name: '潮州', lat: 23.6618, lng: 116.6228, nameEn: 'Chaozhou' },
  { name: '阳江', lat: 21.8575, lng: 111.9826, nameEn: 'Yangjiang' },
  { name: '云浮', lat: 22.9152, lng: 112.0445, nameEn: 'Yunfu' },
  { name: '汕尾', lat: 22.7862, lng: 115.3756, nameEn: 'Shanwei' },
  
  // 浙江省
  { name: '杭州', lat: 30.2741, lng: 120.1551, nameEn: 'Hangzhou' },
  { name: '宁波', lat: 29.8683, lng: 121.5440, nameEn: 'Ningbo' },
  { name: '温州', lat: 27.9938, lng: 120.6993, nameEn: 'Wenzhou' },
  { name: '绍兴', lat: 30.0302, lng: 120.5803, nameEn: 'Shaoxing' },
  { name: '台州', lat: 28.6568, lng: 121.4208, nameEn: 'Taizhou' },
  { name: '嘉兴', lat: 30.7539, lng: 120.7585, nameEn: 'Jiaxing' },
  { name: '湖州', lat: 30.8926, lng: 120.0967, nameEn: 'Huzhou' },
  { name: '金华', lat: 29.0788, lng: 119.6497, nameEn: 'Jinhua' },
  { name: '衢州', lat: 28.9417, lng: 118.8744, nameEn: 'Quzhou' },
  { name: '丽水', lat: 28.4672, lng: 119.9117, nameEn: 'Lishui' },
  { name: '舟山', lat: 30.0160, lng: 122.1067, nameEn: 'Zhoushan' },
  
  // 江苏省
  { name: '南京', lat: 32.0603, lng: 118.7969, nameEn: 'Nanjing' },
  { name: '苏州', lat: 31.2990, lng: 120.5853, nameEn: 'Suzhou' },
  { name: '无锡', lat: 31.4912, lng: 120.3119, nameEn: 'Wuxi' },
  { name: '常州', lat: 31.8107, lng: 119.9742, nameEn: 'Changzhou' },
  { name: '徐州', lat: 34.2610, lng: 117.1949, nameEn: 'Xuzhou' },
  { name: '南通', lat: 32.0603, lng: 120.8647, nameEn: 'Nantong' },
  { name: '连云港', lat: 34.5966, lng: 119.2216, nameEn: 'Lianyungang' },
  { name: '淮安', lat: 33.6102, lng: 119.0153, nameEn: 'Huai\'an' },
  { name: '盐城', lat: 33.3477, lng: 120.1614, nameEn: 'Yancheng' },
  { name: '扬州', lat: 32.3936, lng: 119.4127, nameEn: 'Yangzhou' },
  { name: '镇江', lat: 32.1878, lng: 119.4250, nameEn: 'Zhenjiang' },
  { name: '泰州', lat: 32.4558, lng: 119.9231, nameEn: 'Taizhou' },
  { name: '宿迁', lat: 33.9632, lng: 118.2752, nameEn: 'Suqian' },
  
  // 山东省
  { name: '济南', lat: 36.6512, lng: 116.9972, nameEn: 'Jinan' },
  { name: '青岛', lat: 36.0671, lng: 120.3826, nameEn: 'Qingdao' },
  { name: '烟台', lat: 37.4638, lng: 121.4479, nameEn: 'Yantai' },
  { name: '潍坊', lat: 36.7068, lng: 119.1618, nameEn: 'Weifang' },
  { name: '临沂', lat: 35.1046, lng: 118.3563, nameEn: 'Linyi' },
  { name: '济宁', lat: 35.4150, lng: 116.5873, nameEn: 'Jining' },
  { name: '淄博', lat: 36.8131, lng: 118.0548, nameEn: 'Zibo' },
  { name: '威海', lat: 37.5131, lng: 122.1203, nameEn: 'Weihai' },
  { name: '德州', lat: 37.4346, lng: 116.3590, nameEn: 'Dezhou' },
  { name: '泰安', lat: 36.1954, lng: 117.0875, nameEn: 'Tai\'an' },
  { name: '聊城', lat: 36.4560, lng: 115.9854, nameEn: 'Liaocheng' },
  { name: '滨州', lat: 37.3819, lng: 117.9727, nameEn: 'Binzhou' },
  { name: '菏泽', lat: 35.2336, lng: 115.4810, nameEn: 'Heze' },
  { name: '枣庄', lat: 34.8564, lng: 117.3283, nameEn: 'Zaozhuang' },
  { name: '日照', lat: 35.3813, lng: 119.5269, nameEn: 'Rizhao' },
  { name: '东营', lat: 37.4616, lng: 118.6742, nameEn: 'Dongying' },
];

const INTERNATIONAL_CITIES = [
  // 亚洲热门
  { name: '东京', lat: 35.6762, lng: 139.6503, nameEn: 'Tokyo' },
  { name: '大阪', lat: 34.6937, lng: 135.5023, nameEn: 'Osaka' },
  { name: '首尔', lat: 37.5665, lng: 126.9780, nameEn: 'Seoul' },
  { name: '曼谷', lat: 13.7563, lng: 100.5018, nameEn: 'Bangkok' },
  { name: '新加坡', lat: 1.3521, lng: 103.8198, nameEn: 'Singapore' },
  { name: '吉隆坡', lat: 3.1390, lng: 101.6869, nameEn: 'Kuala Lumpur' },
  { name: '雅加达', lat: -6.2088, lng: 106.8456, nameEn: 'Jakarta' },
  { name: '河内', lat: 21.0285, lng: 105.8542, nameEn: 'Hanoi' },
  { name: '胡志明市', lat: 10.8231, lng: 106.6297, nameEn: 'Ho Chi Minh City' },
  { name: '马尼拉', lat: 14.5995, lng: 120.9842, nameEn: 'Manila' },
  { name: '迪拜', lat: 25.2048, lng: 55.2708, nameEn: 'Dubai' },
  { name: '伊斯坦布尔', lat: 41.0082, lng: 28.9784, nameEn: 'Istanbul' },
  { name: '台北', lat: 25.0330, lng: 121.5654, nameEn: 'Taipei' },
  { name: '香港', lat: 22.3193, lng: 114.1694, nameEn: 'Hong Kong' },
  { name: '澳门', lat: 22.1987, lng: 113.5439, nameEn: 'Macau' },
  
  // 欧洲
  { name: '伦敦', lat: 51.5074, lng: -0.1278, nameEn: 'London' },
  { name: '巴黎', lat: 48.8566, lng: 2.3522, nameEn: 'Paris' },
  { name: '罗马', lat: 41.9028, lng: 12.4964, nameEn: 'Rome' },
  { name: '柏林', lat: 52.5200, lng: 13.4050, nameEn: 'Berlin' },
  { name: '马德里', lat: 40.4168, lng: -3.7038, nameEn: 'Madrid' },
  { name: '巴塞罗那', lat: 41.3851, lng: 2.1734, nameEn: 'Barcelona' },
  { name: '阿姆斯特丹', lat: 52.3676, lng: 4.9041, nameEn: 'Amsterdam' },
  { name: '维也纳', lat: 48.2082, lng: 16.3738, nameEn: 'Vienna' },
  { name: '苏黎世', lat: 47.3769, lng: 8.5417, nameEn: 'Zurich' },
  { name: '莫斯科', lat: 55.7558, lng: 37.6173, nameEn: 'Moscow' },
  { name: '雅典', lat: 37.9838, lng: 23.7275, nameEn: 'Athens' },
  { name: '布拉格', lat: 50.0755, lng: 14.4378, nameEn: 'Prague' },
  { name: '哥本哈根', lat: 55.6761, lng: 12.5683, nameEn: 'Copenhagen' },
  { name: '斯德哥尔摩', lat: 59.3293, lng: 18.0686, nameEn: 'Stockholm' },
  
  // 北美洲
  { name: '纽约', lat: 40.7128, lng: -74.0060, nameEn: 'New York' },
  { name: '洛杉矶', lat: 34.0522, lng: -118.2437, nameEn: 'Los Angeles' },
  { name: '旧金山', lat: 37.7749, lng: -122.4194, nameEn: 'San Francisco' },
  { name: '芝加哥', lat: 41.8781, lng: -87.6298, nameEn: 'Chicago' },
  { name: '华盛顿', lat: 38.9072, lng: -77.0369, nameEn: 'Washington' },
  { name: '波士顿', lat: 42.3601, lng: -71.0589, nameEn: 'Boston' },
  { name: '西雅图', lat: 47.6062, lng: -122.3321, nameEn: 'Seattle' },
  { name: '迈阿密', lat: 25.7617, lng: -80.1918, nameEn: 'Miami' },
  { name: '拉斯维加斯', lat: 36.1699, lng: -115.1398, nameEn: 'Las Vegas' },
  { name: '温哥华', lat: 49.2827, lng: -123.1207, nameEn: 'Vancouver' },
  { name: '多伦多', lat: 43.6532, lng: -79.3832, nameEn: 'Toronto' },
  { name: '墨西哥城', lat: 19.4326, lng: -99.1332, nameEn: 'Mexico City' },
  
  // 南美洲
  { name: '里约热内卢', lat: -22.9068, lng: -43.1729, nameEn: 'Rio de Janeiro' },
  { name: '圣保罗', lat: -23.5505, lng: -46.6333, nameEn: 'Sao Paulo' },
  { name: '布宜诺斯艾利斯', lat: -34.6037, lng: -58.3816, nameEn: 'Buenos Aires' },
  { name: '圣地亚哥', lat: -33.4489, lng: -70.6693, nameEn: 'Santiago' },
  { name: '利马', lat: -12.0464, lng: -77.0428, nameEn: 'Lima' },
  
  // 大洋洲
  { name: '悉尼', lat: -33.8688, lng: 151.2093, nameEn: 'Sydney' },
  { name: '墨尔本', lat: -37.8136, lng: 144.9631, nameEn: 'Melbourne' },
  { name: '奥克兰', lat: -36.8485, lng: 174.7633, nameEn: 'Auckland' },
  
  // 非洲
  { name: '开罗', lat: 30.0444, lng: 31.2357, nameEn: 'Cairo' },
  { name: '开普敦', lat: -33.9249, lng: 18.4241, nameEn: 'Cape Town' },
  { name: '内罗毕', lat: -1.2921, lng: 36.8219, nameEn: 'Nairobi' },
];

const ALL_CITIES = [...CHINESE_CITIES, ...INTERNATIONAL_CITIES];

// Search from local database first
function searchLocal(query) {
  const q = query.toLowerCase();
  return ALL_CITIES
    .filter(city => 
      city.name.toLowerCase().includes(q) || 
      (city.nameEn && city.nameEn.toLowerCase().includes(q))
    )
    .slice(0, 10)
    .map(city => ({
      display_name: city.name,
      lat: city.lat.toString(),
      lon: city.lng.toString(),
      name: city.name,
      source: 'local'
    }));
}

// Search from Nominatim API
function searchNominatim(query) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&accept-language=zh`;
    
    const req = https.get(url, {
      headers: {
        'User-Agent': 'TravelTracker/1.0'
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          const cities = results.map(item => ({
            display_name: item.display_name.split(',').slice(0, 2).join(','),
            lat: item.lat,
            lon: item.lon,
            name: item.display_name.split(',')[0],
            source: 'nominatim'
          }));
          resolve(cities);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) {
      return res.json([]);
    }

    // First search local database
    const localResults = searchLocal(q);
    
    // If we have enough local results, return them
    if (localResults.length >= 5) {
      return res.json(localResults);
    }

    // Try to search Nominatim for more results
    try {
      const nominatimResults = await searchNominatim(q);
      
      // Merge results, remove duplicates
      const allResults = [...localResults];
      const existingNames = new Set(localResults.map(r => r.name));
      
      for (const result of nominatimResults) {
        if (!existingNames.has(result.name) && allResults.length < 15) {
          allResults.push(result);
          existingNames.add(result.name);
        }
      }
      
      res.json(allResults);
    } catch (nominatimError) {
      // If Nominatim fails, just return local results
      console.log('Nominatim search failed, using local results only:', nominatimError.message);
      res.json(localResults);
    }
  } catch (error) {
    console.error('搜索城市失败:', error);
    res.status(500).json({ error: '搜索城市失败' });
  }
});

module.exports = router;
