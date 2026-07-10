// 路线分享工具 - 通过 URL hash 编码/解码路线数据
// 压缩格式: lz-string + 紧凑字段名 + 坐标精度限制
// 单条: #route=<lz>
// 多条: #routes=<lz>

import LZString from 'lz-string';

const COORD_PRECISION = 4; // 约 11 米精度, 适合旅行路线

// 紧凑字段:
// n = name
// c = color
// ci = cities array (each: [name, lat, lng, mode])
function compactRoute(route) {
  if (!route || !Array.isArray(route.cities)) return null;

  const cities = route.cities
    .filter(c => c && typeof c.lat === 'number' && typeof c.lng === 'number')
    .map((city, i) => {
      const mode = i === 0
        ? null
        : (city.mode || route.mode || 'driving');
      return [
        city.name || '',
        Math.round(city.lat * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION,
        Math.round(city.lng * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION,
        mode
      ];
    });

  if (cities.length < 2) return null;

  return {
    n: route.name || '',
    c: route.color || '',
    ci: cities
  };
}

function expandRoute(compact) {
  if (!compact || !Array.isArray(compact.ci) || compact.ci.length < 2) return null;

  const cities = compact.ci.map(([name, lat, lng, mode]) => ({
    name,
    lat,
    lng,
    mode: mode || null
  }));

  const defaultMode = compact.ci[1]?.[3] || 'driving';

  return {
    name: compact.n || `${cities[0].name} → ${cities[cities.length - 1].name}`,
    color: compact.c || null,
    cities,
    mode: defaultMode
  };
}

export function encodeRoute(route) {
  const compact = compactRoute(route);
  if (!compact) return null;
  return LZString.compressToEncodedURIComponent(JSON.stringify(compact));
}

export function decodeRoute(encoded) {
  if (!encoded) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return expandRoute(JSON.parse(json));
  } catch (err) {
    console.warn('[routeShare] decode route failed:', err);
    return null;
  }
}

// 多线路编解码 (用于分享所有路线)
export function encodeRoutes(routes) {
  if (!Array.isArray(routes) || routes.length === 0) return null;
  const compacts = routes.map(compactRoute).filter(Boolean);
  if (compacts.length === 0) return null;
  return LZString.compressToEncodedURIComponent(JSON.stringify(compacts));
}

export function decodeRoutes(encoded) {
  if (!encoded) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const compacts = JSON.parse(json);
    if (!Array.isArray(compacts)) return null;
    return compacts.map(expandRoute).filter(Boolean);
  } catch (err) {
    console.warn('[routeShare] decode routes failed:', err);
    return null;
  }
}

export function buildShareUrl(route) {
  const encoded = encodeRoute(route);
  if (!encoded) return null;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#route=${encoded}`;
}

export function buildShareAllUrl(routes) {
  const encoded = encodeRoutes(routes);
  if (!encoded) return null;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#routes=${encoded}`;
}

// 解析 hash, 返回 { type: 'single'|'all', data }
// - single: data 是单条路线
// - all:    data 是路线数组
export function parseShareHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';

  let m = hash.match(/^#routes=(.+)$/);
  if (m) {
    const routes = decodeRoutes(m[1]);
    if (routes && routes.length > 0) return { type: 'all', data: routes };
  }

  m = hash.match(/^#route=(.+)$/);
  if (m) {
    const route = decodeRoute(m[1]);
    if (route) return { type: 'single', data: route };
  }

  return null;
}

export function clearShareHash() {
  if (typeof window === 'undefined') return;
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function estimateShareUrlLength(target) {
  const url = Array.isArray(target)
    ? buildShareAllUrl(target)
    : buildShareUrl(target);
  return url ? url.length : 0;
}

// 从城市列表生成简单的直线轨迹 (无需 OSRM)
export function buildSimpleRoute(cities, mode = 'driving') {
  if (!Array.isArray(cities) || cities.length < 2) return null;

  const validCities = cities.filter(c => c && typeof c.lat === 'number' && typeof c.lng === 'number');
  if (validCities.length < 2) return null;

  const segments = [];
  let allCoords = [];

  for (let i = 0; i < validCities.length - 1; i++) {
    const from = validCities[i];
    const to = validCities[i + 1];
    const segMode = from.mode || to.mode || mode;

    // 简单的直线插值 (20 个点)
    const steps = 20;
    const segCoords = [];
    for (let s = 0; s <= steps; s++) {
      const lat = from.lat + (to.lat - from.lat) * (s / steps);
      const lng = from.lng + (to.lng - from.lng) * (s / steps);
      segCoords.push([lat, lng]);
    }

    if (i === 0) {
      allCoords = [...segCoords];
    } else {
      allCoords = [...allCoords, ...segCoords.slice(1)];
    }

    segments.push({
      from: from.name,
      to: to.name,
      mode: segMode,
      coordinates: segCoords
    });
  }

  return {
    cities: validCities,
    coordinates: allCoords,
    segments
  };
}

// 为导入的路线填充坐标和段 (用于分享接收后渲染)
export function enrichImportedRoutes(routes) {
  if (!Array.isArray(routes)) return [];
  return routes.map(route => {
    if (!route || !Array.isArray(route.cities) || route.cities.length < 2) {
      return route;
    }
    if (Array.isArray(route.coordinates) && route.coordinates.length > 0) {
      return route; // 已有坐标, 跳过
    }
    const enriched = buildSimpleRoute(route.cities, route.mode || 'driving');
    if (!enriched) return route;
    return {
      ...route,
      cities: enriched.cities,
      coordinates: enriched.coordinates,
      segments: enriched.segments
    };
  });
}