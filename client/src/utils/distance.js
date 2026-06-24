// 计算两点之间的距离（Haversine 公式，单位：公里）
export function calculateDistance(lat1, lng1, lat2, lng2) {
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

// 计算路线总距离
export function calculateRouteDistance(cities) {
  if (!cities || cities.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i];
    const to = cities[i + 1];
    totalDistance += calculateDistance(from.lat, from.lng, to.lat, to.lng);
  }
  
  return totalDistance;
}

// 计算多条路线的总距离
export function calculateTotalDistance(routes) {
  if (!routes || routes.length === 0) return 0;
  
  let totalDistance = 0;
  for (const route of routes) {
    if (route.cities && route.cities.length >= 2) {
      totalDistance += calculateRouteDistance(route.cities);
    }
  }
  
  return totalDistance;
}

// 格式化距离显示
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} 米`;
  } else if (distanceKm < 100) {
    return `${distanceKm.toFixed(1)} 公里`;
  } else {
    return `${Math.round(distanceKm)} 公里`;
  }
}

// 计算各段距离明细
export function calculateSegmentDistances(cities) {
  if (!cities || cities.length < 2) return [];
  
  const segments = [];
  for (let i = 0; i < cities.length - 1; i++) {
    const from = cities[i];
    const to = cities[i + 1];
    const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
    segments.push({
      from: from.name,
      to: to.name,
      distance: distance,
      formatted: formatDistance(distance)
    });
  }
  
  return segments;
}
