// 天气 API 服务
// 使用 Open-Meteo API (免费，无需 API Key)

const WEATHER_CACHE_KEY = 'travel-tracker-weather-cache';
const WEATHER_CACHE_EXPIRY = 30 * 60 * 1000; // 30 分钟

// 天气代码对应的描述和图标
const WEATHER_CODES = {
  0: { desc: '晴朗', icon: '☀️' },
  1: { desc: '大部晴朗', icon: '🌤️' },
  2: { desc: '多云', icon: '⛅' },
  3: { desc: '阴天', icon: '☁️' },
  45: { desc: '雾', icon: '🌫️' },
  48: { desc: '雾凇', icon: '🌫️' },
  51: { desc: '小毛毛雨', icon: '🌦️' },
  53: { desc: '毛毛雨', icon: '🌦️' },
  55: { desc: '大毛毛雨', icon: '🌧️' },
  61: { desc: '小雨', icon: '🌧️' },
  63: { desc: '中雨', icon: '🌧️' },
  65: { desc: '大雨', icon: '🌧️' },
  71: { desc: '小雪', icon: '🌨️' },
  73: { desc: '中雪', icon: '🌨️' },
  75: { desc: '大雪', icon: '❄️' },
  77: { desc: '雪粒', icon: '🌨️' },
  80: { desc: '小阵雨', icon: '🌦️' },
  81: { desc: '阵雨', icon: '🌧️' },
  82: { desc: '大阵雨', icon: '🌧️' },
  85: { desc: '小阵雪', icon: '🌨️' },
  86: { desc: '大阵雪', icon: '❄️' },
  95: { desc: '雷暴', icon: '⛈️' },
  96: { desc: '雷暴伴小冰雹', icon: '⛈️' },
  99: { desc: '雷暴伴大冰雹', icon: '⛈️' }
};

// 加载天气缓存
function loadWeatherCache() {
  try {
    const saved = localStorage.getItem(WEATHER_CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const cleaned = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value.timestamp && now - value.timestamp < WEATHER_CACHE_EXPIRY) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
  } catch (e) {
    console.error('Failed to load weather cache:', e);
  }
  return {};
}

// 保存天气缓存
function saveWeatherCache(cache) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save weather cache:', e);
  }
}

// 获取天气信息
export async function getWeather(lat, lng) {
  const cache = loadWeatherCache();
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  
  // 检查缓存
  if (cache[key]) {
    return cache[key].data;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`,
      { timeout: 5000 }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather');
    }

    const data = await response.json();
    
    const weatherInfo = {
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        description: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code)
      },
      forecast: data.daily.time.map((date, index) => ({
        date: date,
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        weatherCode: data.daily.weather_code[index],
        description: getWeatherDescription(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index])
      }))
    };

    // 保存到缓存
    cache[key] = {
      data: weatherInfo,
      timestamp: Date.now()
    };
    saveWeatherCache(cache);

    return weatherInfo;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

// 获取天气描述
function getWeatherDescription(code) {
  return WEATHER_CODES[code]?.desc || '未知';
}

// 获取天气图标
function getWeatherIcon(code) {
  return WEATHER_CODES[code]?.icon || '❓';
}

// 格式化天气信息为 HTML
export function formatWeatherHTML(weatherInfo) {
  if (!weatherInfo) {
    return '<div style="color: #999; font-size: 12px;">天气信息加载失败</div>';
  }

  const { current, forecast } = weatherInfo;
  
  let html = `
    <div style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px; font-size: 12px;">
      <div style="font-weight: bold; margin-bottom: 4px;">${current.icon} 当前天气</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${current.description}</span>
        <span>${current.temp}°C</span>
      </div>
      <div style="color: #999; font-size: 11px;">
        体感 ${current.feelsLike}°C | 湿度 ${current.humidity}% | 风速 ${current.windSpeed}km/h
      </div>
  `;

  if (forecast && forecast.length > 0) {
    html += '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">';
    html += '<div style="font-weight: bold; margin-bottom: 4px;">未来天气</div>';
    
    forecast.forEach(day => {
      const date = new Date(day.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>${dateStr} ${day.icon}</span>
          <span>${day.minTemp}°~${day.maxTemp}°</span>
        </div>
      `;
    });
    
    html += '</div>';
  }

  html += '</div>';
  return html;
}

export default { getWeather, formatWeatherHTML };
