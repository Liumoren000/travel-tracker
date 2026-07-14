import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Button, message, Dropdown, Space } from 'antd';
import { DownloadOutlined, EnvironmentOutlined, MenuFoldOutlined, MenuUnfoldOutlined, GlobalOutlined, ShareAltOutlined } from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';
import { calculateRouteDistance, formatDistance, calculateSegmentDistances } from '../utils/distance';
import { getCityDetails } from '../data/cityDetails';
import { getWeather, formatWeatherHTML } from '../services/weather';
import { generateAllFlightLinks } from '../utils/flightLinks';
import ShareModal from './ShareModal';

// 标签碰撞检测的最小间距（像素）
const LABEL_GAP = 4;

const buildMarkerIcon = (city, bgColor, borderColor, isOtherSelected, isCurrent) => {
  const innerClass = `marker-label${isCurrent ? ' marker-current' : ''}`;
  const labelHTML = `<div class="${innerClass}" style="background:${bgColor};border-color:${borderColor};opacity:${isOtherSelected ? 0.4 : 1}">${city.name || '未知'}</div>`;

  return L.divIcon({
    className: 'custom-marker',
    html: labelHTML,
    iconSize: [1, 1],
    iconAnchor: [0, 0]
  });
};

// 地图样式配置
const MAP_STYLES = {
  standard: {
    name: '标准',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: '卫星',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  terrain: {
    name: '地形',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  },
  dark: {
    name: '暗色',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
  }
};

const Map = forwardRef(({ 
  routes = [], 
  currentRoute = null, 
  selectedRouteIndex = null,
  addMode = false,
  onMapClick,
  onDeleteCity,
  siderCollapsed = false,
  onToggleSider,
  onCityClick,
  isDark = false
}, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const markersDataRef = useRef([]);
  const clickHandlerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [mapStyle, setMapStyle] = useState(isDark ? 'dark' : 'standard');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // 监听深色模式变化，自动切换地图样式
  useEffect(() => {
    if (isDark && mapStyle !== 'dark') {
      changeMapStyle('dark');
    } else if (!isDark && mapStyle === 'dark') {
      changeMapStyle('standard');
    }
  }, [isDark]);

  // 切换地图样式
  const changeMapStyle = (styleKey) => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    
    const style = MAP_STYLES[styleKey];
    if (!style) return;

    // 移除旧图层
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    
    // 添加新图层
    tileLayerRef.current = L.tileLayer(style.url, {
      attribution: style.attribution
    }).addTo(mapInstanceRef.current);
    
    setMapStyle(styleKey);
    message.success(`已切换到${style.name}地图`);
  };

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([35.8617, 104.1954], 4);

    tileLayerRef.current = L.tileLayer(MAP_STYLES.standard.url, {
      attribution: MAP_STYLES.standard.attribution
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.on('zoomend', () => {
      requestAnimationFrame(() => resolveLabelOverlaps());
    });

    // 监听容器大小变化，更新地图
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 300);
      }
    });
    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('zoomend');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (clickHandlerRef.current) {
      mapInstanceRef.current.off('click', clickHandlerRef.current);
      clickHandlerRef.current = null;
    }

    if (addMode) {
      clickHandlerRef.current = (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      };
      mapInstanceRef.current.on('click', clickHandlerRef.current);
      mapInstanceRef.current.getContainer().style.cursor = 'crosshair';
    } else {
      mapInstanceRef.current.getContainer().style.cursor = '';
    }

    return () => {
      if (mapInstanceRef.current && clickHandlerRef.current) {
        mapInstanceRef.current.off('click', clickHandlerRef.current);
      }
    };
  }, [addMode, onMapClick]);

  // 设置全局城市详情打开函数
  useEffect(() => {
    if (onCityClick) {
      window.__openCityInfo = onCityClick;
    }
    return () => {
      delete window.__openCityInfo;
    };
  }, [onCityClick]);

  // 给定标签尺寸，生成围绕其城市点的多个候选放置位置（按 5 圈 × 8 方向）
  const buildAnchorOffsets = (dotX, dotY, w, h, mapW, mapH) => {
    const DOT_R = 5;
    const PAD = 2;
    const baseDistance = DOT_R + LABEL_GAP;
    const list = [];

    for (let ring = 0; ring < 5; ring++) {
      const dist = baseDistance + ring * 12;
      const positions = [
        { side: 'r', x: dotX + dist, y: dotY - h / 2 },
        { side: 'b', x: dotX - w / 2, y: dotY + dist },
        { side: 'l', x: dotX - dist - w, y: dotY - h / 2 },
        { side: 't', x: dotX - w / 2, y: dotY - dist - h },
        { side: 'br', x: dotX + dist, y: dotY + dist },
        { side: 'bl', x: dotX - dist - w, y: dotY + dist },
        { side: 'tr', x: dotX + dist, y: dotY - dist - h },
        { side: 'tl', x: dotX - dist - w, y: dotY - dist - h }
      ];
      positions.forEach(({ x, y }) => {
        const cx = x + w / 2;
        const cy = y + h / 2;
        if (cx < PAD || cy < PAD || cx > mapW - PAD || cy > mapH - PAD) return;
        list.push({ x, y, dist: Math.hypot(cx - dotX, cy - dotY) });
      });
    }
    return list;
  };

  // 测量所有标签并按"评分函数"选择位置：评分 = 重叠面积×1000 + 离圆点距离
  // 评分最低的候选胜出。配合 5 圈候选 + 引线，可保证所有城市名都可见
  const resolveLabelOverlaps = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const items = markersDataRef.current;
    if (items.length === 0) return;

    if (items.length === 1) {
      if (items[0].label && items[0].geoPos) {
        items[0].label.setLatLng(items[0].geoPos);
      }
      if (items[0].leaderLine) {
        items[0].leaderLine.remove();
        items[0].leaderLine = null;
      }
      return;
    }

    const mapSize = map.getSize();
    const mapW = mapSize.x;
    const mapH = mapSize.y;
    const placed = [];

    const sortedItems = [...items].sort((a, b) => {
      const ap = map.latLngToContainerPoint(a.geoPos);
      const bp = map.latLngToContainerPoint(b.geoPos);
      if (ap.y !== bp.y) return ap.y - bp.y;
      return ap.x - bp.x;
    });

    sortedItems.forEach((data) => {
      const el = data.label && data.label.getElement();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dotPixel = map.latLngToContainerPoint(data.geoPos);
      const dotX = dotPixel.x;
      const dotY = dotPixel.y;

      const anchors = buildAnchorOffsets(dotX, dotY, w, h, mapW, mapH);

      let chosen = null;
      let bestScore = Infinity;
      anchors.forEach((off) => {
        let overlap = 0;
        for (const p of placed) {
          const ox = Math.max(0, Math.min(off.x + w, p.x + p.w) - Math.max(off.x, p.x));
          const oy = Math.max(0, Math.min(off.y + h, p.y + p.h) - Math.max(off.y, p.y));
          overlap += ox * oy;
        }
        const distFromDot = Math.hypot(off.x + w / 2 - dotX, off.y + h / 2 - dotY);
        const score = overlap * 1000 + distFromDot;
        if (score < bestScore) {
          bestScore = score;
          chosen = off;
        }
      });

      if (!chosen) {
        chosen = { x: dotX - w / 2, y: dotY - h / 2, dist: 0 };
      }

      const finalX = Math.max(0, Math.min(chosen.x, mapW - w));
      const finalY = Math.max(0, Math.min(chosen.y, mapH - h));

      placed.push({ x: finalX, y: finalY, w, h });
      const newLatLng = map.containerPointToLatLng([finalX, finalY]);
      data.label.setLatLng(newLatLng);

      // 引线：当标签中心离圆点 > 22 像素时画一条虚线连回圆点
      const labelCenterX = finalX + w / 2;
      const labelCenterY = finalY + h / 2;
      const dist = Math.hypot(labelCenterX - dotX, labelCenterY - dotY);
      if (dist > 22) {
        const nearestX = Math.max(finalX, Math.min(dotX, finalX + w));
        const nearestY = Math.max(finalY, Math.min(dotY, finalY + h));
        const nearestLatLng = map.containerPointToLatLng([nearestX, nearestY]);
        if (!data.leaderLine) {
          data.leaderLine = L.polyline([data.geoPos, nearestLatLng], {
            color: data.bgColor,
            weight: 1.2,
            opacity: 0.7,
            dashArray: '2, 3',
            interactive: false
          }).addTo(map);
          layersRef.current.push(data.leaderLine);
        } else {
          data.leaderLine.setLatLngs([data.geoPos, nearestLatLng]);
          data.leaderLine.setStyle({ color: data.bgColor });
        }
      } else if (data.leaderLine) {
        data.leaderLine.remove();
        layersRef.current = layersRef.current.filter((l) => l !== data.leaderLine);
        data.leaderLine = null;
      }
    });
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    layersRef.current.forEach(layer => {
      try { layer.remove(); } catch (e) { /* ignore */ }
    });
    layersRef.current = [];
    markersDataRef.current = [];

    const allBounds = [];

    if (Array.isArray(routes)) {
      routes.forEach((route, routeIndex) => {
        if (!route || !route.cities || !Array.isArray(route.cities)) return;

        const color = route.color || '#1890ff';
        const routeName = route.name || `线路 ${routeIndex + 1}`;
        const isSelected = selectedRouteIndex === routeIndex;
        const isOtherSelected = selectedRouteIndex !== null && selectedRouteIndex !== routeIndex;

        route.cities.forEach((city, index) => {
          if (!city || typeof city.lat !== 'number' || typeof city.lng !== 'number') return;

          const isFirst = index === 0;
          const isLast = index === route.cities.length - 1;
          let borderColor = color;
          if (isFirst) borderColor = '#52c41a';
          if (isLast) borderColor = '#f5222d';

          const icon = buildMarkerIcon(city, color, borderColor, isOtherSelected, false);

          const citiesList = route.cities.map((c, i) => 
            `<div style="padding:3px 0;font-size:12px;${i === index ? 'font-weight:bold;color:' + color : ''}">
              ${c.name || '未知'}${i === 0 ? ' (起点)' : ''}${i === route.cities.length - 1 && i !== 0 ? ' (终点)' : ''}
            </div>`
          ).join('');

          const popupContent = `
            <div style="min-width:200px;max-height:300px;overflow-y:auto">
              <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:${color}">${routeName}</div>
              <div style="border-top:1px solid #eee;padding-top:8px">
                ${citiesList}
              </div>
              <div style="margin-top:8px;text-align:center">
                <button onclick="window.__openCityInfo && window.__openCityInfo({name:'${city.name}',lat:${city.lat},lng:${city.lng}})" style="padding:4px 12px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px">
                  查看城市详情
                </button>
              </div>
            </div>
          `;

          const dot = L.circleMarker([city.lat, city.lng], {
            radius: 5,
            fillColor: color,
            color: borderColor,
            weight: 2,
            opacity: isOtherSelected ? 0.4 : 1,
            fillOpacity: isOtherSelected ? 0.4 : 1
          }).addTo(mapInstanceRef.current).bindPopup(popupContent);

          const label = L.marker([city.lat, city.lng], { icon, zIndexOffset: isSelected ? 500 : 0 })
            .addTo(mapInstanceRef.current);

          layersRef.current.push(dot);
          layersRef.current.push(label);
          markersDataRef.current.push({
            label,
            dot,
            city,
            geoPos: [city.lat, city.lng],
            bgColor: color,
            borderColor,
            isOtherSelected,
            isCurrent: false
          });
          allBounds.push([city.lat, city.lng]);
        });

        if (Array.isArray(route.coordinates) && route.coordinates.length > 0) {
          // 计算路线距离
          const routeDistance = calculateRouteDistance(route.cities);
          const formattedRouteDistance = formatDistance(routeDistance);
          
          // Check if route has segments with different modes
          if (Array.isArray(route.segments) && route.segments.length > 0) {
            // 计算各段距离
            const segmentDistances = calculateSegmentDistances(route.cities);
            
            route.segments.forEach((segment, segIndex) => {
              const isFlight = segment.mode === 'flight';
              const isTrain = segment.mode === 'train';
              
              // 创建透明的宽线作为点击区域
              const hitArea = L.polyline(segment.coordinates, {
                color: 'transparent',
                weight: 20,
                opacity: 0
              }).addTo(mapInstanceRef.current);
              
              // 创建可见的轨迹线
              const segPolyline = L.polyline(segment.coordinates, {
                color: color,
                weight: isSelected ? 6 : 4,
                opacity: isOtherSelected ? 0.3 : 0.8,
                dashArray: isFlight ? '10, 8' : isTrain ? '8, 4' : null
              }).addTo(mapInstanceRef.current);

              // 添加箭头指示方向
              if (segment.coordinates.length >= 2) {
                const decorator = L.polylineDecorator(segPolyline, {
                  patterns: [
                    {
                      offset: '50%',
                      repeat: 0,
                      symbol: L.Symbol.arrowHead({
                        pixelSize: 12,
                        polygon: false,
                        pathOptions: {
                          color: color,
                          weight: isSelected ? 6 : 4,
                          opacity: isOtherSelected ? 0.3 : 0.8,
                          fillOpacity: 1
                        }
                      })
                    }
                  ]
                }).addTo(mapInstanceRef.current);
                layersRef.current.push(decorator);
              }

              const modeLabel = isFlight ? '✈️ 飞行' : isTrain ? '🚂 火车' : segment.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
              const segDistance = segmentDistances[segIndex] ? segmentDistances[segIndex].formatted : '';
              
              // 生成机票链接（如果是飞机段）
              let flightLinksHTML = '';
              if (isFlight) {
                const links = generateAllFlightLinks(segment.from, segment.to);
                const linkButtons = Object.entries(links).map(([key, link]) => 
                  `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="padding:2px 6px;background:#1890ff;color:white;border-radius:3px;font-size:10px;text-decoration:none">${link.name}</a>`
                ).join('');
                flightLinksHTML = `
                  <div style="margin-top:8px;padding-top:6px;border-top:1px solid #eee">
                    <div style="font-size:11px;color:#666;margin-bottom:4px">查询机票价格：</div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap">${linkButtons}</div>
                  </div>
                `;
              }
              
              const popupContent = `
                <div style="min-width:180px">
                  <div style="font-weight:bold;font-size:14px;color:${color}">${segment.from} → ${segment.to}</div>
                  <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
                  <div style="font-size:12px;color:#666;margin-top:4px">距离: ${segDistance}</div>
                  ${flightLinksHTML}
                </div>
              `;
              
              // 绑定弹窗到两条线
              hitArea.bindPopup(popupContent);
              segPolyline.bindPopup(popupContent);
              
              // 悬停效果
              hitArea.on('mouseover', function() {
                segPolyline.setStyle({ weight: (isSelected ? 8 : 6), opacity: 1 });
              });
              hitArea.on('mouseout', function() {
                segPolyline.setStyle({ weight: (isSelected ? 6 : 4), opacity: isOtherSelected ? 0.3 : 0.8 });
              });
              
              layersRef.current.push(hitArea);
              layersRef.current.push(segPolyline);
            });
            allBounds.push(...route.coordinates);
          } else {
            const isFlight = route.mode === 'flight';
            const isTrain = route.mode === 'train';
            
            // 创建透明的宽线作为点击区域
            const hitArea = L.polyline(route.coordinates, {
              color: 'transparent',
              weight: 20,
              opacity: 0
            }).addTo(mapInstanceRef.current);
            
            // 创建可见的轨迹线
            const polyline = L.polyline(route.coordinates, {
              color: color,
              weight: isSelected ? 6 : 4,
              opacity: isOtherSelected ? 0.3 : 0.8,
              dashArray: isFlight ? '10, 8' : isTrain ? '8, 4' : null
            }).addTo(mapInstanceRef.current);

            // 添加箭头指示方向
            if (route.coordinates.length >= 2) {
              const decorator = L.polylineDecorator(polyline, {
                patterns: [
                  {
                    offset: '50%',
                    repeat: 0,
                    symbol: L.Symbol.arrowHead({
                      pixelSize: 12,
                      polygon: false,
                      pathOptions: {
                        color: color,
                        weight: isSelected ? 6 : 4,
                        opacity: isOtherSelected ? 0.3 : 0.8,
                        fillOpacity: 1
                      }
                    })
                  }
                ]
              }).addTo(mapInstanceRef.current);
              layersRef.current.push(decorator);
            }

            const modeLabel = isFlight ? '✈️ 飞行' : isTrain ? '🚂 火车' : route.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
            
            // 生成机票链接（如果是飞机模式）
            let flightLinksHTML = '';
            if (isFlight && route.cities.length >= 2) {
              const links = generateAllFlightLinks(route.cities[0].name, route.cities[route.cities.length - 1].name);
              const linkButtons = Object.entries(links).map(([key, link]) => 
                `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="padding:2px 6px;background:#1890ff;color:white;border-radius:3px;font-size:10px;text-decoration:none">${link.name}</a>`
              ).join('');
              flightLinksHTML = `
                <div style="margin-top:8px;padding-top:6px;border-top:1px solid #eee">
                  <div style="font-size:11px;color:#666;margin-bottom:4px">查询机票价格：</div>
                  <div style="display:flex;gap:4px;flex-wrap:wrap">${linkButtons}</div>
                </div>
              `;
            }
            
            const popupContent = `
              <div style="min-width:180px">
                <div style="font-weight:bold;font-size:14px;color:${color}">${routeName}</div>
                <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
                <div style="font-size:12px;color:#666;margin-top:4px">总距离: ${formattedRouteDistance}</div>
                <div style="font-size:12px;color:#666;margin-top:5px">
                  ${route.cities.map(c => c.name).join(' → ')}
                </div>
                ${flightLinksHTML}
              </div>
            `;
            
            // 绑定弹窗到两条线
            hitArea.bindPopup(popupContent);
            polyline.bindPopup(popupContent);
            
            // 悬停效果
            hitArea.on('mouseover', function() {
              polyline.setStyle({ weight: (isSelected ? 8 : 6), opacity: 1 });
            });
            hitArea.on('mouseout', function() {
              polyline.setStyle({ weight: (isSelected ? 6 : 4), opacity: isOtherSelected ? 0.3 : 0.8 });
            });
            
            layersRef.current.push(hitArea);
            layersRef.current.push(polyline);
            allBounds.push(...route.coordinates);
          }
        }
      });
    }

    if (currentRoute && currentRoute.cities && Array.isArray(currentRoute.cities)) {
      const routeName = currentRoute.name || '当前编辑';

      currentRoute.cities.forEach((city, index) => {
        if (!city || typeof city.lat !== 'number' || typeof city.lng !== 'number') return;

        const isFirst = index === 0;
        const isLast = index === currentRoute.cities.length - 1;
        let borderColor = '#1890ff';
        if (isFirst) borderColor = '#52c41a';
        if (isLast) borderColor = '#f5222d';

        const icon = buildMarkerIcon(city, '#1890ff', borderColor, false, true);

        const citiesList = currentRoute.cities.map((c, i) => 
          `<div style="padding:3px 0;font-size:12px;${i === index ? 'font-weight:bold;color:#1890ff' : ''}">
            ${c.name || '未知'}${i === 0 ? ' (起点)' : ''}${i === currentRoute.cities.length - 1 && i !== 0 ? ' (终点)' : ''}
          </div>`
        ).join('');

        const deleteBtn = `<button class="popup-delete-btn" data-city-index="${index}" style="margin-top:8px;padding:4px 12px;background:#ff4d4f;color:white;border:none;border-radius:4px;cursor:pointer;width:100%">删除此城市</button>`;

        const popupContent = `
          <div style="min-width:200px;max-height:300px;overflow-y:auto">
            <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:#1890ff">${routeName}</div>
            <div style="border-top:1px solid #eee;padding-top:8px">
              ${citiesList}
            </div>
            ${deleteBtn}
          </div>
        `;

        const dot = L.circleMarker([city.lat, city.lng], {
          radius: 5,
          fillColor: '#1890ff',
          color: borderColor,
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(mapInstanceRef.current).bindPopup(popupContent);

        dot.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.querySelector('.popup-delete-btn');
            if (btn) {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cityIdx = parseInt(e.target.getAttribute('data-city-index'));
                if (onDeleteCity && !isNaN(cityIdx)) {
                  onDeleteCity(cityIdx);
                }
              });
            }
          }, 10);
        });

        const label = L.marker([city.lat, city.lng], { icon, zIndexOffset: 1000 })
          .addTo(mapInstanceRef.current);

        layersRef.current.push(dot);
        layersRef.current.push(label);
        markersDataRef.current.push({
          label,
          dot,
          city,
          geoPos: [city.lat, city.lng],
          bgColor: '#1890ff',
          borderColor,
          isOtherSelected: false,
          isCurrent: true
        });
        allBounds.push([city.lat, city.lng]);
      });

      if (Array.isArray(currentRoute.coordinates) && currentRoute.coordinates.length > 0) {
        // 计算当前路线距离
        const currentRouteDistance = calculateRouteDistance(currentRoute.cities);
        const formattedCurrentRouteDistance = formatDistance(currentRouteDistance);
        
        // Check if currentRoute has segments with different modes
        if (Array.isArray(currentRoute.segments) && currentRoute.segments.length > 0) {
          // 计算各段距离
          const currentSegmentDistances = calculateSegmentDistances(currentRoute.cities);
          
          currentRoute.segments.forEach((segment, segIndex) => {
            const isFlight = segment.mode === 'flight';
            const isTrain = segment.mode === 'train';
            const segPolyline = L.polyline(segment.coordinates, {
              color: '#1890ff',
              weight: 5,
              opacity: 0.9,
              dashArray: isFlight ? '10, 8' : isTrain ? '8, 4' : null
            }).addTo(mapInstanceRef.current);

            // 添加箭头指示方向
            if (segment.coordinates.length >= 2) {
              const decorator = L.polylineDecorator(segPolyline, {
                patterns: [
                  {
                    offset: '50%',
                    repeat: 0,
                    symbol: L.Symbol.arrowHead({
                      pixelSize: 12,
                      polygon: false,
                      pathOptions: {
                        color: '#1890ff',
                        weight: 5,
                        opacity: 0.9,
                        fillOpacity: 1
                      }
                    })
                  }
                ]
              }).addTo(mapInstanceRef.current);
              layersRef.current.push(decorator);
            }

            const modeLabel = isFlight ? '✈️ 飞行' : isTrain ? '🚂 火车' : segment.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
            const segDistance = currentSegmentDistances[segIndex] ? currentSegmentDistances[segIndex].formatted : '';
            
            segPolyline.bindPopup(`
              <div style="min-width:180px">
                <div style="font-weight:bold;font-size:14px;color:#1890ff">${segment.from} → ${segment.to}</div>
                <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
                <div style="font-size:12px;color:#666;margin-top:4px">距离: ${segDistance}</div>
              </div>
            `);
            layersRef.current.push(segPolyline);
          });
          allBounds.push(...currentRoute.coordinates);
        } else {
          const isFlight = currentRoute.mode === 'flight';
          const isTrain = currentRoute.mode === 'train';
          const polyline = L.polyline(currentRoute.coordinates, {
            color: '#1890ff',
            weight: 5,
            opacity: 0.9,
            dashArray: isFlight ? '10, 8' : isTrain ? '8, 4' : null
          }).addTo(mapInstanceRef.current);

          // 添加箭头指示方向
          if (currentRoute.coordinates.length >= 2) {
            const decorator = L.polylineDecorator(polyline, {
              patterns: [
                {
                  offset: '50%',
                  repeat: 0,
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 12,
                    polygon: false,
                    pathOptions: {
                      color: '#1890ff',
                      weight: 5,
                      opacity: 0.9,
                      fillOpacity: 1
                    }
                  })
                }
              ]
            }).addTo(mapInstanceRef.current);
            layersRef.current.push(decorator);
          }

          const modeLabel = isFlight ? '✈️ 飞行' : isTrain ? '🚂 火车' : currentRoute.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
          polyline.bindPopup(`
            <div style="min-width:180px">
              <div style="font-weight:bold;font-size:14px;color:#1890ff">${routeName}</div>
              <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
              <div style="font-size:12px;color:#666;margin-top:4px">总距离: ${formattedCurrentRouteDistance}</div>
              <div style="font-size:12px;color:#666;margin-top:5px">
                ${currentRoute.cities.map(c => c.name).join(' → ')}
              </div>
            </div>
          `);
          layersRef.current.push(polyline);
          allBounds.push(...currentRoute.coordinates);
        }
      }
    }

    if (allBounds.length > 0) {
      const bounds = L.latLngBounds(allBounds);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    requestAnimationFrame(() => resolveLabelOverlaps());
  }, [routes, currentRoute, selectedRouteIndex, onDeleteCity]);

  const handleExport = async () => {
    if (routes.length === 0 && !currentRoute) {
      message.warning('没有可导出的轨迹');
      return;
    }

    setExporting(true);
    try {
      const mapContainer = mapRef.current;
      const canvas = document.createElement('canvas');
      const rect = mapContainer.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);

      const drawRoundRect = (x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      const tiles = mapContainer.querySelectorAll('.leaflet-tile-loaded');
      for (const tile of tiles) {
        try {
          const tileRect = tile.getBoundingClientRect();
          const x = tileRect.left - rect.left;
          const y = tileRect.top - rect.top;
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            img.src = tile.src;
          });
          ctx.drawImage(img, x, y, tile.width, tile.height);
        } catch (e) { /* ignore */ }
      }

      const map = mapInstanceRef.current;
      const allItems = [];

      if (Array.isArray(routes)) {
        routes.forEach((route) => {
          if (!route || !route.cities || !Array.isArray(route.cities)) return;
          const color = route.color || '#1890ff';
          route.cities.forEach((city) => {
            if (!city || typeof city.lat !== 'number' || typeof city.lng !== 'number') return;
            allItems.push({ lat: city.lat, lng: city.lng, name: city.name, color });
          });

          if (Array.isArray(route.coordinates) && route.coordinates.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.8;
            route.coordinates.forEach((coord, i) => {
              const point = map.latLngToContainerPoint([coord[0], coord[1]]);
              if (i === 0) ctx.moveTo(point.x, point.y);
              else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      }

      if (currentRoute && currentRoute.cities && Array.isArray(currentRoute.cities)) {
        currentRoute.cities.forEach((city) => {
          if (!city || typeof city.lat !== 'number' || typeof city.lng !== 'number') return;
          allItems.push({ lat: city.lat, lng: city.lng, name: city.name, color: '#1890ff' });
        });

        if (Array.isArray(currentRoute.coordinates) && currentRoute.coordinates.length > 0) {
          ctx.beginPath();
          ctx.strokeStyle = '#1890ff';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 4]);
          ctx.globalAlpha = 0.9;
          currentRoute.coordinates.forEach((coord, i) => {
            const point = map.latLngToContainerPoint([coord[0], coord[1]]);
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }

      allItems.forEach((item) => {
        const point = map.latLngToContainerPoint([item.lat, item.lng]);
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
        const textWidth = ctx.measureText(item.name).width;
        const padding = 6;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = 22;
        ctx.fillStyle = item.color;
        ctx.globalAlpha = 0.9;
        drawRoundRect(point.x - boxWidth / 2, point.y - boxHeight / 2, boxWidth, boxHeight, 4);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        drawRoundRect(point.x - boxWidth / 2, point.y - boxHeight / 2, boxWidth, boxHeight, 4);
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.name, point.x, point.y);
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      link.download = `travel-route-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      message.success('地图导出成功');
    } catch (error) {
      console.error('导出地图失败:', error);
      message.error('导出地图失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const hasRoutes = routes.length > 0 || currentRoute;

  const getShareableRoutes = () => {
    const all = [...routes];
    if (currentRoute && Array.isArray(currentRoute.cities) && currentRoute.cities.length >= 2) {
      all.push(currentRoute);
    }
    return all;
  };

  const handleShareClick = () => {
    const r = getShareableRoutes();
    if (r.length === 0) {
      message.warning('暂无可分享的路线');
      return;
    }
    setShareModalOpen(true);
  };

  // 地图样式切换菜单
  const mapStyleMenuItems = Object.entries(MAP_STYLES).map(([key, style]) => ({
    key: key,
    label: (
      <Space>
        <span style={{ fontWeight: mapStyle === key ? 'bold' : 'normal' }}>
          {style.name}
        </span>
        {mapStyle === key && <span>✓</span>}
      </Space>
    ),
    onClick: () => changeMapStyle(key)
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} className="map-container" />
      
      {/* 左下角：侧边栏切换按钮和地图样式切换 */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {onToggleSider && (
          <Button
            icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleSider}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #d9d9d9',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        )}
        <Dropdown
          menu={{ items: mapStyleMenuItems }}
          placement="topLeft"
          trigger={['click']}
        >
          <Button
            icon={<GlobalOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #d9d9d9',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="切换地图样式"
          />
        </Dropdown>
      </div>

      {/* 右上角：导出按钮 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {hasRoutes && (
          <>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={exporting}
              onClick={handleExport}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              {exporting ? '导出中...' : '导出图片'}
            </Button>
            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShareClick}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              分享路线
            </Button>
          </>
        )}
      </div>

      <ShareModal
        open={shareModalOpen}
        routes={getShareableRoutes()}
        onClose={() => setShareModalOpen(false)}
      />

      {addMode && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(24, 144, 255, 0.9)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}>
          <EnvironmentOutlined /> 点击地图添加城市位置
        </div>
      )}
    </div>
  );
});

export default Map;
