// 费用估算服务
// 基于距离和交通方式估算旅行费用

// 各交通方式的费用参数（人民币）
const TRANSPORT_COSTS = {
  driving: {
    name: '驾车',
    icon: '🚗',
    // 每公里费用（油费+过路费）
    perKm: 0.8,
    // 基础费用
    baseFee: 0,
    // 最高费用上限
    maxFee: 5000
  },
  train: {
    name: '火车',
    icon: '🚂',
    // 高铁每公里约0.4元
    perKm: 0.4,
    // 基础费用
    baseFee: 30,
    // 最高费用上限
    maxFee: 2000
  },
  flight: {
    name: '飞机',
    icon: '✈️',
    // 飞机费用不是线性的，使用阶梯价格
    perKm: 0, // 不使用
    baseFee: 0,
    // 距离-价格阶梯
    tiers: [
      { maxKm: 500, price: 500 },
      { maxKm: 1000, price: 800 },
      { maxKm: 1500, price: 1200 },
      { maxKm: 2000, price: 1500 },
      { maxKm: 3000, price: 2000 },
      { maxKm: 5000, price: 3000 },
      { maxKm: 10000, price: 5000 },
      { maxKm: Infinity, price: 8000 }
    ]
  },
  walking: {
    name: '步行',
    icon: '🚶',
    // 步行免费
    perKm: 0,
    baseFee: 0,
    maxFee: 0
  }
};

// 估算单段费用
export function estimateSegmentCost(distanceKm, mode) {
  const transport = TRANSPORT_COSTS[mode];
  if (!transport) return 0;

  if (mode === 'flight') {
    // 飞机使用阶梯价格
    for (const tier of transport.tiers) {
      if (distanceKm <= tier.maxKm) {
        return tier.price;
      }
    }
    return transport.tiers[transport.tiers.length - 1].price;
  }

  if (mode === 'walking') {
    return 0;
  }

  // 其他交通方式使用线性计算
  const cost = transport.baseFee + (distanceKm * transport.perKm);
  return Math.min(cost, transport.maxFee);
}

// 估算整条路线费用
export function estimateRouteCost(cities) {
  if (!cities || cities.length < 2) {
    return { total: 0, segments: [] };
  }

  let totalCost = 0;
  const segments = [];

  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i];
    const to = cities[i + 1];
    const mode = to.mode || 'driving';
    
    // 计算距离
    const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
    
    // 估算费用
    const cost = estimateSegmentCost(distance, mode);
    totalCost += cost;

    segments.push({
      from: from.name,
      to: to.name,
      mode: mode,
      distance: Math.round(distance),
      cost: Math.round(cost)
    });
  }

  return {
    total: Math.round(totalCost),
    segments: segments
  };
}

// 估算多条路线费用
export function estimateTotalCost(routes) {
  if (!routes || routes.length === 0) return 0;

  let totalCost = 0;
  routes.forEach(route => {
    if (route.cities && route.cities.length >= 2) {
      const routeCost = estimateRouteCost(route.cities);
      totalCost += routeCost.total;
    }
  });

  return Math.round(totalCost);
}

// 计算两点之间的距离（Haversine 公式）
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 地球半径（公里）
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// 格式化费用显示
export function formatCost(cost) {
  if (cost === 0) return '免费';
  if (cost < 100) return `¥${cost}`;
  if (cost < 1000) return `¥${cost}`;
  return `¥${cost.toLocaleString()}`;
}

// 获取交通方式的费用说明
export function getCostDescription(mode) {
  const transport = TRANSPORT_COSTS[mode];
  if (!transport) return '';
  
  if (mode === 'walking') return '免费';
  if (mode === 'flight') return '国内航班估算';
  return `约 ¥${transport.perKm}/公里`;
}

export default {
  estimateSegmentCost,
  estimateRouteCost,
  estimateTotalCost,
  formatCost,
  getCostDescription,
  TRANSPORT_COSTS
};
