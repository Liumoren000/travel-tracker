// GPX 文件导入导出工具

// 生成 GPX 文件内容
export function generateGPX(routes) {
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TravelTracker"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>自由轨迹 - 旅行路线</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  routes.forEach((route, routeIndex) => {
    const routeName = route.name || `路线 ${routeIndex + 1}`;
    
    // 添加航点
    if (route.cities && route.cities.length > 0) {
      route.cities.forEach((city, cityIndex) => {
        gpx += `  <wpt lat="${city.lat}" lon="${city.lng}">
    <name>${escapeXml(city.name)}</name>
    <desc>路线: ${escapeXml(routeName)} - 第 ${cityIndex + 1} 站</desc>
  </wpt>
`;
      });
    }

    // 添加路线
    gpx += `  <rte>
    <name>${escapeXml(routeName)}</name>
`;
    
    if (route.cities && route.cities.length > 0) {
      route.cities.forEach(city => {
        gpx += `    <rtept lat="${city.lat}" lon="${city.lng}">
      <name>${escapeXml(city.name)}</name>
    </rtept>
`;
      });
    }

    gpx += `  </rte>
`;

    // 添加轨迹（如果有坐标数据）
    if (route.coordinates && route.coordinates.length > 0) {
      gpx += `  <trk>
    <name>${escapeXml(routeName)}</name>
    <trkseg>
`;
      route.coordinates.forEach(coord => {
        gpx += `      <trkpt lat="${coord[0]}" lon="${coord[1]}"></trkpt>
`;
      });
      gpx += `    </trkseg>
  </trk>
`;
    }
  });

  gpx += `</gpx>`;
  return gpx;
}

// 解析 GPX 文件
export function parseGPX(gpxContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
  
  // 检查解析错误
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('GPX 文件格式错误');
  }

  const routes = [];
  
  // 解析航点
  const waypoints = xmlDoc.querySelectorAll('wpt');
  const waypointsArray = Array.from(waypoints).map(wpt => ({
    name: wpt.querySelector('name')?.textContent || '未知',
    lat: parseFloat(wpt.getAttribute('lat')),
    lng: parseFloat(wpt.getAttribute('lon'))
  }));

  // 解析路线
  const rteElements = xmlDoc.querySelectorAll('rte');
  rteElements.forEach(rte => {
    const name = rte.querySelector('name')?.textContent || '未命名路线';
    const rtepts = rte.querySelectorAll('rtept');
    const cities = Array.from(rtepts).map(rtept => ({
      name: rtept.querySelector('name')?.textContent || '未知',
      lat: parseFloat(rtept.getAttribute('lat')),
      lng: parseFloat(rtept.getAttribute('lon'))
    }));

    if (cities.length >= 2) {
      routes.push({
        name: name,
        cities: cities,
        coordinates: [] // 轨迹数据需要从 trk 获取
      });
    }
  });

  // 如果没有路线，但有航点，创建一条默认路线
  if (routes.length === 0 && waypointsArray.length >= 2) {
    routes.push({
      name: '导入的路线',
      cities: waypointsArray,
      coordinates: []
    });
  }

  // 解析轨迹坐标
  const trkElements = xmlDoc.querySelectorAll('trk');
  trkElements.forEach((trk, index) => {
    const trkpts = trk.querySelectorAll('trkpt');
    const coordinates = Array.from(trkpts).map(trkpt => [
      parseFloat(trkpt.getAttribute('lat')),
      parseFloat(trkpt.getAttribute('lon'))
    ]);

    if (routes[index] && coordinates.length > 0) {
      routes[index].coordinates = coordinates;
    }
  });

  return routes;
}

// 导出 GPX 文件
export function downloadGPX(routes) {
  try {
    const gpxContent = generateGPX(routes);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travel-route-${new Date().toISOString().slice(0, 10)}.gpx`;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 使用 setTimeout 确保 DOM 更新后再点击
    setTimeout(() => {
      link.click();
      // 延迟清理，避免过早移除
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }, 0);
  } catch (error) {
    console.error('GPX export error:', error);
    throw error;
  }
}

// 导入 GPX 文件
export function importGPXFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const gpxContent = e.target.result;
        const routes = parseGPX(gpxContent);
        resolve(routes);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

// XML 特殊字符转义
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
