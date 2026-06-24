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

export async function getCountryForCity(lat, lng) {
  const cache = loadCache();
  const key = getCacheKey(lat, lng);
  
  if (cache[key]) {
    return cache[key].data;
  }

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
      countryCode: data.address?.country_code?.toUpperCase() || 'XX'
    };

    // Save to cache
    cache[key] = {
      data: countryInfo,
      timestamp: Date.now()
    };
    saveCache(cache);

    return countryInfo;
  } catch (error) {
    console.error('Error fetching country for city:', error);
    return { country: '未知', countryCode: 'XX' };
  }
}

export async function getCountriesForCities(cities) {
  const results = new Map();
  const uncachedCities = [];
  const cache = loadCache();

  // Check cache first
  for (const city of cities) {
    const key = getCacheKey(city.lat, city.lng);
    if (cache[key]) {
      results.set(city.name, cache[key].data);
    } else {
      uncachedCities.push(city);
    }
  }

  // Fetch uncached cities with rate limiting
  for (const city of uncachedCities) {
    const countryInfo = await getCountryForCity(city.lat, city.lng);
    results.set(city.name, countryInfo);
    // Rate limit: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}