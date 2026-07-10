// 路线分享工具 - 通过 URL hash 编码/解码路线数据
// 压缩格式: lz-string + 紧凑字段名 + 坐标精度限制

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
  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeRoute(encoded) {
  if (!encoded) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const compact = JSON.parse(json);
    return expandRoute(compact);
  } catch (err) {
    console.warn('[routeShare] decode failed:', err);
    return null;
  }
}

export function buildShareUrl(route) {
  const encoded = encodeRoute(route);
  if (!encoded) return null;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#route=${encoded}`;
}

export function parseShareHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  const match = hash.match(/^#route=(.+)$/);
  if (!match) return null;
  return decodeRoute(match[1]);
}

export function clearShareHash() {
  if (typeof window === 'undefined') return;
  // 保留其他 hash, 只移除 #route= 部分
  const newHash = window.location.hash.replace(/#route=[^&]+/, '').replace(/^#$/, '');
  if (newHash) {
    history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export function estimateShareUrlLength(route) {
  const url = buildShareUrl(route);
  return url ? url.length : 0;
}