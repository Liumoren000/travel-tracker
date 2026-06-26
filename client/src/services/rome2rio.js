// Rome2Rio API 服务 - 获取真实交通费用
// API 文档: https://www.rome2rio.com/documentation/

const ROME2RIO_API_KEY = import.meta.env.VITE_ROME2RIO_API_KEY || '';
const ROME2RIO_API_URL = 'https://api.rome2rio.com/api/1.4';

// 费用缓存
const COST_CACHE_KEY = 'travel-tracker-cost-cache';
const COST_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时

// 加载缓存
function loadCache() {
  try {
    const saved = localStorage.getItem(COST_CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const cleaned = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value.timestamp && now - value.timestamp < COST_CACHE_EXPIRY) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
  } catch (e) {
    console.error('Failed to load cost cache:', e);
  }
  return {};
}

// 保存缓存
function saveCache(cache) {
  try {
    localStorage.setItem(COST_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save cost cache:', e);
  }
}

// 查询两地之间的交通费用
export async function getRouteCost(fromLat, fromLng, toLat, toLng, fromName, toName) {
  // 检查 API Key
  if (!ROME2RIO_API_KEY) {
    console.warn('Rome2Rio API Key not configured');
    return null;
  }

  const cache = loadCache();
  const cacheKey = `${fromLat.toFixed(2)},${fromLng.toFixed(2)}_${toLat.toFixed(2)},${toLng.toFixed(2)}`;
  
  // 检查缓存
  if (cache[cacheKey]) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch(
      `${ROME2RIO_API_URL}/Search?key=${ROME2RIO_API_KEY}&oName=${encodeURIComponent(fromName)}&dName=${encodeURIComponent(toName)}&currencyCode=CNY`,
      { 
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Rome2Rio API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    // 解析路线信息
    const routes = data.routes.map(route => ({
      name: route.name,
      distance: route.distance, // 公里
      duration: route.duration, // 分钟
      price: route.indicativePrices?.[0]?.priceLow || 0,
      priceHigh: route.indicativePrices?.[0]?.priceHigh || 0,
      currency: route.indicativePrices?.[0]?.currency || 'CNY',
      mode: mapTransportMode(route.name)
    }));

    // 找到最便宜的路线
    const cheapest = routes.reduce((min, r) => 
      (r.price > 0 && r.price < min.price) || min.price === 0 ? r : min
    , routes[0]);

    const result = {
      routes: routes,
      cheapest: cheapest,
      source: 'rome2rio'
    };

    // 保存到缓存
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    saveCache(cache);

    return result;
  } catch (error) {
    console.error('Rome2Rio API error:', error.message);
    return null;
  }
}

// 映射交通方式
function mapTransportMode(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('fly') || lowerName.includes('flight')) return 'flight';
  if (lowerName.includes('train') || lowerName.includes('rail')) return 'train';
  if (lowerName.includes('bus')) return 'bus';
  if (lowerName.includes('ferry')) return 'ferry';
  return 'driving';
}

// 批量查询费用
export async function getRouteCostsBatch(segments) {
  const results = [];
  
  for (const segment of segments) {
    const cost = await getRouteCost(
      segment.fromLat, segment.fromLng,
      segment.toLat, segment.toLng,
      segment.fromName, segment.toName
    );
    results.push(cost);
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

export default { getRouteCost, getRouteCostsBatch };
