import { findCityByName, findCityByCoordinates } from '../data/citiesDatabase';

const CACHE_KEY = 'travel-tracker-country-cache';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

function loadCache() {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean expired entries
      const now = Date.now();
      const cleaned = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value.timestamp && now - value.timestamp < CACHE_EXPIRY) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
  } catch (e) {
    console.error('Failed to load country cache:', e);
  }
  return {};
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save country cache:', e);
  }
}

function getCacheKey(lat, lng) {
  // Round to 2 decimal places to increase cache hits for nearby cities
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

// 从本地数据库查询国家信息
function getCountryFromLocalDB(lat, lng, cityName) {
  // 首先尝试按城市名称匹配
  if (cityName) {
    const cityByName = findCityByName(cityName);
    if (cityByName) {
      return {
        country: cityByName.country,
        countryCode: cityByName.countryCode,
        source: 'local-name'
      };
    }
  }
  
  // 然后按坐标匹配（50km 阈值）
  const cityByCoords = findCityByCoordinates(lat, lng, 50);
  if (cityByCoords) {
    return {
      country: cityByCoords.country,
      countryCode: cityByCoords.countryCode,
      source: 'local-coords',
      matchedCity: cityByCoords.name,
      distance: cityByCoords.distance
    };
  }
  
  return null;
}

export async function getCountryForCity(lat, lng, cityName = '') {
  const cache = loadCache();
  const key = getCacheKey(lat, lng);
  
  // 1. 检查缓存
  if (cache[key]) {
    return { ...cache[key].data, source: 'cache' };
  }

  // 2. 检查本地数据库
  const localResult = getCountryFromLocalDB(lat, lng, cityName);
  if (localResult) {
    // 保存到缓存
    cache[key] = {
      data: localResult,
      timestamp: Date.now()
    };
    saveCache(cache);
    return localResult;
  }

  // 3. 调用 Nominatim API（最后的备选方案）
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=zh`,
      {
        headers: {
          'User-Agent': 'TravelTracker/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch country info');
    }

    const data = await response.json();
    const countryInfo = {
      country: data.address?.country || '未知',
      countryCode: data.address?.country_code?.toUpperCase() || 'XX',
      source: 'api'
    };

    // 保存到缓存
    cache[key] = {
      data: countryInfo,
      timestamp: Date.now()
    };
    saveCache(cache);

    return countryInfo;
  } catch (error) {
    console.error('Error fetching country for city:', error);
    return { country: '未知', countryCode: 'XX', source: 'error' };
  }
}

export async function getCountriesForCities(cities) {
  const results = new Map();
  const uncachedCities = [];
  const cache = loadCache();

  // 第一遍：检查缓存和本地数据库
  for (const city of cities) {
    const key = getCacheKey(city.lat, city.lng);
    
    // 检查缓存
    if (cache[key]) {
      results.set(city.name, { ...cache[key].data, source: 'cache' });
      continue;
    }
    
    // 检查本地数据库
    const localResult = getCountryFromLocalDB(city.lat, city.lng, city.name);
    if (localResult) {
      results.set(city.name, localResult);
      // 保存到缓存
      cache[key] = {
        data: localResult,
        timestamp: Date.now()
      };
      continue;
    }
    
    // 需要调用 API 的城市
    uncachedCities.push(city);
  }

  // 保存更新后的缓存
  if (Object.keys(cache).length > 0) {
    saveCache(cache);
  }

  // 第二遍：调用 API 查询未命中的城市（带速率限制）
  for (const city of uncachedCities) {
    const countryInfo = await getCountryForCity(city.lat, city.lng, city.name);
    results.set(city.name, countryInfo);
    // Rate limit: wait 100ms between API requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
