// 机票查询链接生成工具

// 城市机场代码映射（主要城市）
const AIRPORT_CODES = {
  // 中国
  '北京': 'BJS', '上海': 'SHA', '广州': 'CAN', '深圳': 'SZX',
  '成都': 'CTU', '重庆': 'CKG', '杭州': 'HGH', '武汉': 'WUH',
  '南京': 'NKG', '西安': 'XIY', '昆明': 'KMG', '长沙': 'CSX',
  '青岛': 'TAO', '大连': 'DLC', '厦门': 'XMN', '三亚': 'SYX',
  '海口': 'HAK', '哈尔滨': 'HRB', '沈阳': 'SHE', '郑州': 'CGO',
  '济南': 'TNA', '福州': 'FOC', '南宁': 'NNG', '贵阳': 'KWE',
  '兰州': 'LHW', '乌鲁木齐': 'URC', '拉萨': 'LXA', '银川': 'INC',
  '西宁': 'XNN', '呼和浩特': 'HET', '天津': 'TSN', '太原': 'TYN',
  '合肥': 'HFE', '南昌': 'KHN', '长春': 'CGQ', '石家庄': 'SJW',
  
  // 亚洲
  '东京': 'TYO', '大阪': 'OSA', '首尔': 'SEL', '釜山': 'PUS',
  '曼谷': 'BKK', '新加坡': 'SIN', '吉隆坡': 'KUL', '雅加达': 'JKT',
  '河内': 'HAN', '胡志明市': 'SGN', '马尼拉': 'MNL', '金边': 'PNH',
  '仰光': 'RGN', '科伦坡': 'CMB', '加德满都': 'KTM', '达卡': 'DAC',
  '迪拜': 'DXB', '多哈': 'DOH', '伊斯坦布尔': 'IST', '特拉维夫': 'TLV',
  '台北': 'TPE', '香港': 'HKG', '澳门': 'MFM',
  
  // 欧洲
  '伦敦': 'LON', '巴黎': 'PAR', '罗马': 'ROM', '柏林': 'BER',
  '马德里': 'MAD', '巴塞罗那': 'BCN', '阿姆斯特丹': 'AMS',
  '维也纳': 'VIE', '苏黎世': 'ZRH', '莫斯科': 'MOW',
  '雅典': 'ATH', '布拉格': 'PRG', '布达佩斯': 'BUD',
  '华沙': 'WAW', '哥本哈根': 'CPH', '斯德哥尔摩': 'STO',
  '奥斯陆': 'OSL', '赫尔辛基': 'HEL', '都柏林': 'DUB',
  '里斯本': 'LIS', '布鲁塞尔': 'BRU', '米兰': 'MIL',
  '慕尼黑': 'MUC', '法兰克福': 'FRA',
  
  // 北美洲
  '纽约': 'NYC', '洛杉矶': 'LAX', '旧金山': 'SFO', '芝加哥': 'CHI',
  '华盛顿': 'WAS', '波士顿': 'BOS', '西雅图': 'SEA', '迈阿密': 'MIA',
  '拉斯维加斯': 'LAS', '多伦多': 'YTO', '温哥华': 'YVR',
  '蒙特利尔': 'YMX', '墨西哥城': 'MEX',
  
  // 南美洲
  '里约热内卢': 'RIO', '圣保罗': 'SAO', '布宜诺斯艾利斯': 'BUE',
  '利马': 'LIM', '波哥大': 'BOG', '圣地亚哥': 'SCL',
  
  // 大洋洲
  '悉尼': 'SYD', '墨尔本': 'MEL', '奥克兰': 'AKL',
  '布里斯班': 'BNE', '珀斯': 'PER',
  
  // 非洲
  '开罗': 'CAI', '开普敦': 'CPT', '内罗毕': 'NBO',
  '约翰内斯堡': 'JNB', '卡萨布兰卡': 'CMN'
};

// 获取城市机场代码
function getAirportCode(cityName) {
  return AIRPORT_CODES[cityName] || cityName;
}

// 生成携程机票链接
export function generateCtripLink(from, to, date = '') {
  const fromCode = getAirportCode(from);
  const toCode = getAirportCode(to);
  
  // 携程国内机票
  if (isDomesticCity(from) && isDomesticCity(to)) {
    return `https://flights.ctrip.com/online/list/oneway-${fromCode}-${toCode}?depdate=${date || getDefaultDate()}`;
  }
  
  // 携程国际机票
  return `https://flights.ctrip.com/online/list/oneway-${fromCode}-${toCode}?depdate=${date || getDefaultDate()}&cabin=y&adult=1&child=0&infant=0`;
}

// 生成飞猪机票链接
export function generateFliggyLink(from, to, date = '') {
  const fromCode = getAirportCode(from);
  const toCode = getAirportCode(to);
  return `https://www.fliggy.com/flight/international?spm=181.11350845.0.0.7b2326e7&tripType=1&departCity=${encodeURIComponent(from)}&arrCity=${encodeURIComponent(to)}&departDate=${date || getDefaultDate()}`;
}

// 生成 Google Flights 链接
export function generateGoogleFlightsLink(from, to, date = '') {
  const fromCode = getAirportCode(from);
  const toCode = getAirportCode(to);
  return `https://www.google.com/travel/flights?q=Flights%20from%20${encodeURIComponent(from)}%20to%20${encodeURIComponent(to)}&curr=CNY`;
}

// 生成去哪儿机票链接
export function generateQunarLink(from, to, date = '') {
  return `https://flight.qunar.com/site/oneway_list.htm?searchDepartureAirport=${encodeURIComponent(from)}&searchArrivalAirport=${encodeURIComponent(to)}&searchDepartureTime=${date || getDefaultDate()}&searchArrivalTime=&nextNDays=0&startSearch=true&fromCode=${getAirportCode(from)}&toCode=${getAirportCode(to)}`;
}

// 判断是否为国内城市
function isDomesticCity(cityName) {
  const domesticCities = [
    '北京', '上海', '广州', '深圳', '成都', '重庆', '杭州', '武汉',
    '南京', '西安', '昆明', '长沙', '青岛', '大连', '厦门', '三亚',
    '海口', '哈尔滨', '沈阳', '郑州', '济南', '福州', '南宁', '贵阳',
    '兰州', '乌鲁木齐', '拉萨', '银川', '西宁', '呼和浩特', '天津',
    '太原', '合肥', '南昌', '长春', '石家庄'
  ];
  return domesticCities.includes(cityName);
}

// 获取默认日期（明天）
function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

// 生成所有平台的链接
export function generateAllFlightLinks(from, to, date = '') {
  return {
    ctrip: {
      name: '携程',
      url: generateCtripLink(from, to, date),
      icon: '✈️'
    },
    fliggy: {
      name: '飞猪',
      url: generateFliggyLink(from, to, date),
      icon: '✈️'
    },
    qunar: {
      name: '去哪儿',
      url: generateQunarLink(from, to, date),
      icon: '✈️'
    },
    google: {
      name: 'Google Flights',
      url: generateGoogleFlightsLink(from, to, date),
      icon: '🔍'
    }
  };
}

export default {
  generateCtripLink,
  generateFliggyLink,
  generateGoogleFlightsLink,
  generateQunarLink,
  generateAllFlightLinks,
  AIRPORT_CODES
};
