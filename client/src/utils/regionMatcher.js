// 省级行政区 / 国家边界匹配工具
// 数据源:
//   - 中国省级: 阿里 DataV.GeoAtlas (https://geo.datav.aliyun.com)
//   - 世界国家: Natural Earth 1:110m 简化版 (nvkelso/natural-earth-vector)

import { getProvinceByCityName } from '../data/cityToProvince';

const CHINA_PROVINCE_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
const WORLD_COUNTRIES_URLS = [
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
];

let chinaGeoCache = null;
let chinaLoadingPromise = null;
let worldGeoCache = null;
let worldByIsoCache = null;
let worldLoadingPromise = null;

// Ray-casting 算法: 判断点是否在多边形内 (point 为 [lng, lat])
function pointInRing(point, ring) {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect = ((yi > y) !== (yj > y))
      && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInGeometry(point, geometry) {
  if (!geometry) return false;
  if (geometry.type === 'Polygon') {
    if (!pointInRing(point, geometry.coordinates[0])) return false;
    for (let i = 1; i < geometry.coordinates.length; i++) {
      if (pointInRing(point, geometry.coordinates[i])) return false;
    }
    return true;
  }
  if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      if (!pointInRing(point, polygon[0])) continue;
      let inHole = false;
      for (let i = 1; i < polygon.length; i++) {
        if (pointInRing(point, polygon[i])) { inHole = true; break; }
      }
      if (!inHole) return true;
    }
    return false;
  }
  return false;
}

async function loadChinaGeo() {
  if (chinaGeoCache) return chinaGeoCache;
  if (chinaLoadingPromise) return chinaLoadingPromise;

  chinaLoadingPromise = fetch(CHINA_PROVINCE_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      chinaGeoCache = data;
      return data;
    })
    .catch(err => {
      console.warn('[regionMatcher] 中国省级 GeoJSON 加载失败:', err);
      chinaLoadingPromise = null;
      return null;
    });

  return chinaLoadingPromise;
}

async function loadWorldGeo() {
  if (worldGeoCache) return worldGeoCache;
  if (worldLoadingPromise) return worldLoadingPromise;

  worldLoadingPromise = (async () => {
    for (const url of WORLD_COUNTRIES_URLS) {
      try {
        const r = await fetch(url);
        if (!r.ok) continue;
        const data = await r.json();
        if (data.type === 'FeatureCollection') {
          worldGeoCache = data;
          // 按 ISO_A2 / ISO_A2_EH / ADM0_A3 建索引, 方便按国家代码查找
          worldByIsoCache = new Map();
          for (const feature of data.features) {
            const p = feature.properties || {};
            const codes = [p.ISO_A2, p.ISO_A2_EH, p.ADM0_A3, p.SOV_A3].filter(Boolean);
            for (const code of codes) {
              if (!worldByIsoCache.has(code)) worldByIsoCache.set(code, feature);
            }
          }
          return worldGeoCache;
        }
      } catch (err) {
        console.warn('[regionMatcher] 世界国家 GeoJSON 加载失败:', url, err);
      }
    }
    return null;
  })();

  return worldLoadingPromise;
}

export async function getProvinceForCity(city) {
  if (!city) return null;
  if (typeof city.lat !== 'number' || typeof city.lng !== 'number') return null;

  if (city.province) return city.province;

  const mapped = getProvinceByCityName(city.name);
  if (mapped) return mapped;

  const geo = await loadChinaGeo();
  if (!geo || !geo.features) return null;

  const point = [city.lng, city.lat];
  for (const feature of geo.features) {
    if (pointInGeometry(point, feature.geometry)) {
      return feature.properties?.name || null;
    }
  }
  return null;
}

export async function getCountryInfoForCity(city) {
  if (!city) return null;
  if (typeof city.lat !== 'number' || typeof city.lng !== 'number') return null;

  if (city.countryCode) {
    const geo = await loadWorldGeo();
    if (geo && worldByIsoCache) {
      const feature = worldByIsoCache.get(city.countryCode);
      if (feature) {
        return {
          name: feature.properties?.ADMIN || feature.properties?.NAME || city.country,
          iso: city.countryCode,
        };
      }
    }
  }

  if (city.country) {
    return { name: city.country, iso: city.countryCode || null };
  }

  // 最后用 point-in-polygon
  const geo = await loadWorldGeo();
  if (!geo || !geo.features) return null;
  const point = [city.lng, city.lat];
  for (const feature of geo.features) {
    if (pointInGeometry(point, feature.geometry)) {
      return {
        name: feature.properties?.ADMIN || feature.properties?.NAME || null,
        iso: feature.properties?.ISO_A2 || null,
      };
    }
  }
  return null;
}

export async function resolveVisitedRegions(cities) {
  const visitedProvinces = new Set();
  const visitedCountryCodes = new Set();
  const visitedCountryLabels = new Map(); // code -> 中文名 (用于展示)

  await Promise.all(cities.map(async (city) => {
    const isChinese = city.countryCode === 'CN'
      || city.countryCode === 'HK'
      || city.countryCode === 'MO'
      || city.countryCode === 'TW'
      || city.country === '中国';
    if (isChinese) {
      const province = await getProvinceForCity(city);
      if (province) visitedProvinces.add(province);
    } else {
      const info = await getCountryInfoForCity(city);
      if (info) {
        if (info.iso) {
          visitedCountryCodes.add(info.iso);
          visitedCountryLabels.set(info.iso, city.country || info.name);
        } else if (city.country) {
          visitedCountryLabels.set(`_name_${city.country}`, city.country);
        }
      }
    }
  }));

  return { visitedProvinces, visitedCountryCodes, visitedCountryLabels };
}

export async function renderRegionOverlay(map, options = {}) {
  const {
    visitedProvinces = new Set(),
    visitedCountryCodes = new Set(),
    highlightColor = '#1890ff',
    baseColor = '#e8e8e8',
    borderColor = '#999999',
    highlightOpacity = 0.55,
    baseOpacity = 0.25,
    highlightBorderColor = '#096dd9',
  } = options;

  if (!map) return null;

  const group = L.featureGroup();

  const chinaGeo = await loadChinaGeo();
  if (chinaGeo && chinaGeo.features) {
    const chinaLayer = L.geoJSON(chinaGeo, {
      style: (feature) => {
        const name = feature.properties?.name;
        const visited = name && visitedProvinces.has(name);
        return {
          color: visited ? highlightBorderColor : borderColor,
          weight: visited ? 1.5 : 0.8,
          fillColor: visited ? highlightColor : baseColor,
          fillOpacity: visited ? highlightOpacity : baseOpacity,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.name;
        if (name && visitedProvinces.has(name)) {
          layer.bindTooltip(name, { sticky: true, direction: 'top' });
        }
      },
    });
    chinaLayer.addTo(group);
  }

  if (visitedCountryCodes.size > 0) {
    const worldGeo = await loadWorldGeo();
    if (worldGeo && worldGeo.features && worldByIsoCache) {
      const worldLayer = L.geoJSON(worldGeo, {
        filter: (feature) => {
          const p = feature.properties || {};
          const codes = [p.ISO_A2, p.ISO_A2_EH, p.ADM0_A3, p.SOV_A3];
          return codes.some(c => c && visitedCountryCodes.has(c));
        },
        style: () => ({
          color: highlightBorderColor,
          weight: 1.2,
          fillColor: highlightColor,
          fillOpacity: highlightOpacity * 0.85,
        }),
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          const code = p.ISO_A2 || p.ISO_A2_EH;
          const label = code ? visitedCountryLabels.get(code) : null;
          const tooltipText = label || p.ADMIN || p.NAME;
          if (tooltipText) layer.bindTooltip(tooltipText, { sticky: true });
        },
      });
      worldLayer.addTo(group);
    }
  }

  group.addTo(map);
  return group;
}

// 预加载, 避免用户首次点击时延迟
export function preloadRegionGeo() {
  loadChinaGeo();
  loadWorldGeo();
}

export const __test__ = { pointInRing, pointInGeometry };