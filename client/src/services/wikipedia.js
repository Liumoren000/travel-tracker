// Wikipedia API 服务 - 获取城市详情
const WIKI_CACHE_KEY = 'travel-tracker-wiki-cache';
const WIKI_CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 天

// 加载缓存
function loadCache() {
  try {
    const saved = localStorage.getItem(WIKI_CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const cleaned = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value.timestamp && now - value.timestamp < WIKI_CACHE_EXPIRY) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
  } catch (e) {
    console.error('Failed to load wiki cache:', e);
  }
  return {};
}

// 保存缓存
function saveCache(cache) {
  try {
    localStorage.setItem(WIKI_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save wiki cache:', e);
  }
}

// 从 Wikipedia 获取城市摘要
async function getWikiSummary(title, lang = 'zh') {
  try {
    const response = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { 
        timeout: 5000,
        headers: { 'User-Agent': 'TravelTracker/1.0' }
      }
    );

    if (!response.ok) {
      // 如果中文没有，尝试英文
      if (lang === 'zh') {
        return await getWikiSummary(title, 'en');
      }
      return null;
    }

    const data = await response.json();
    return {
      title: data.title,
      description: data.description || '',
      extract: data.extract || '',
      thumbnail: data.thumbnail?.source || null,
      pageUrl: data.content_urls?.desktop?.page || null
    };
  } catch (error) {
    console.warn('Wikipedia API error:', error.message);
    return null;
  }
}

// 搜索 Wikipedia 页面
async function searchWiki(query, lang = 'zh') {
  try {
    const response = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=1&origin=*`,
      { timeout: 5000 }
    );

    if (!response.ok) {
      if (lang === 'zh') {
        return await searchWiki(query, 'en');
      }
      return null;
    }

    const data = await response.json();
    if (data.query?.search?.length > 0) {
      return data.query.search[0].title;
    }
    return null;
  } catch (error) {
    console.warn('Wikipedia search error:', error.message);
    return null;
  }
}

// 获取城市详情（带缓存）
export async function getCityWikiInfo(cityName, country = '') {
  const cache = loadCache();
  const cacheKey = `${cityName}_${country}`;
  
  // 检查缓存
  if (cache[cacheKey]) {
    return cache[cacheKey].data;
  }

  try {
    // 先尝试直接获取
    let wikiInfo = await getWikiSummary(cityName);
    
    // 如果没有找到，尝试搜索
    if (!wikiInfo) {
      const searchQuery = country ? `${cityName} ${country}` : cityName;
      const pageTitle = await searchWiki(searchQuery);
      if (pageTitle) {
        wikiInfo = await getWikiSummary(pageTitle);
      }
    }

    if (wikiInfo) {
      const result = {
        description: wikiInfo.extract ? wikiInfo.extract.substring(0, 200) + (wikiInfo.extract.length > 200 ? '...' : '') : wikiInfo.description,
        image: wikiInfo.thumbnail,
        wikiUrl: wikiInfo.pageUrl
      };

      // 保存到缓存
      cache[cacheKey] = {
        data: result,
        timestamp: Date.now()
      };
      saveCache(cache);

      return result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching city wiki info:', error);
    return null;
  }
}

export default { getCityWikiInfo };
