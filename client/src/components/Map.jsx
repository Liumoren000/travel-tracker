import { useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined, EnvironmentOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ 
  routes = [], 
  currentRoute = null, 
  selectedRouteIndex = null,
  addMode = false,
  onMapClick,
  onDeleteCity,
  siderCollapsed = false,
  onToggleSider
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const clickHandlerRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([35.8617, 104.1954], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
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

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    layersRef.current.forEach(layer => {
      try { layer.remove(); } catch (e) { /* ignore */ }
    });
    layersRef.current = [];

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

          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-label" style="background:${color};border-color:${borderColor};opacity:${isOtherSelected ? 0.4 : 1}">${city.name || '未知'}</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12]
          });

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
            </div>
          `;

          const marker = L.marker([city.lat, city.lng], { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(popupContent);

          layersRef.current.push(marker);
          allBounds.push([city.lat, city.lng]);
        });

        if (Array.isArray(route.coordinates) && route.coordinates.length > 0) {
          // Check if route has segments with different modes
          if (Array.isArray(route.segments) && route.segments.length > 0) {
            route.segments.forEach((segment) => {
              const isFlight = segment.mode === 'flight';
              const segPolyline = L.polyline(segment.coordinates, {
                color: color,
                weight: isSelected ? 6 : 4,
                opacity: isOtherSelected ? 0.3 : 0.8,
                dashArray: isFlight ? '10, 8' : null
              }).addTo(mapInstanceRef.current);

              const modeLabel = isFlight ? '✈️ 飞行' : segment.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
              segPolyline.bindPopup(`
                <div style="min-width:150px">
                  <div style="font-weight:bold;font-size:14px;color:${color}">${segment.from} → ${segment.to}</div>
                  <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
                </div>
              `);
              layersRef.current.push(segPolyline);
            });
            allBounds.push(...route.coordinates);
          } else {
            const isFlight = route.mode === 'flight';
            const polyline = L.polyline(route.coordinates, {
              color: color,
              weight: isSelected ? 6 : 4,
              opacity: isOtherSelected ? 0.3 : 0.8,
              dashArray: isFlight ? '10, 8' : null
            }).addTo(mapInstanceRef.current);

            const modeLabel = isFlight ? '✈️ 飞行' : route.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
            polyline.bindPopup(`
              <div style="min-width:150px">
                <div style="font-weight:bold;font-size:14px;color:${color}">${routeName}</div>
                <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
                <div style="font-size:12px;color:#666;margin-top:5px">
                  ${route.cities.map(c => c.name).join(' → ')}
                </div>
              </div>
            `);
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

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-label marker-current" style="border-color:${borderColor}">${city.name || '未知'}</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        });

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

        const marker = L.marker([city.lat, city.lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(popupContent);

        marker.on('popupopen', () => {
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

        layersRef.current.push(marker);
        allBounds.push([city.lat, city.lng]);
      });

      if (Array.isArray(currentRoute.coordinates) && currentRoute.coordinates.length > 0) {
        // Check if currentRoute has segments with different modes
        if (Array.isArray(currentRoute.segments) && currentRoute.segments.length > 0) {
          currentRoute.segments.forEach((segment) => {
            const isFlight = segment.mode === 'flight';
            const segPolyline = L.polyline(segment.coordinates, {
              color: '#1890ff',
              weight: 5,
              opacity: 0.9,
              dashArray: isFlight ? '10, 8' : '8, 4'
            }).addTo(mapInstanceRef.current);

            const modeLabel = isFlight ? '✈️ 飞行' : segment.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
            segPolyline.bindPopup(`
              <div style="min-width:150px">
                <div style="font-weight:bold;font-size:14px;color:#1890ff">${segment.from} → ${segment.to}</div>
                <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
              </div>
            `);
            layersRef.current.push(segPolyline);
          });
          allBounds.push(...currentRoute.coordinates);
        } else {
          const isFlight = currentRoute.mode === 'flight';
          const polyline = L.polyline(currentRoute.coordinates, {
            color: '#1890ff',
            weight: 5,
            opacity: 0.9,
            dashArray: isFlight ? '10, 8' : '8, 4'
          }).addTo(mapInstanceRef.current);

          const modeLabel = isFlight ? '✈️ 飞行' : currentRoute.mode === 'walking' ? '🚶 步行' : '🚗 驾车';
          polyline.bindPopup(`
            <div style="min-width:150px">
              <div style="font-weight:bold;font-size:14px;color:#1890ff">${routeName}</div>
              <div style="font-size:12px;color:#999;margin-top:2px">${modeLabel}</div>
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} className="map-container" />
      
      {/* 左上角：侧边栏切换按钮 */}
      {onToggleSider && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000
        }}>
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
        </div>
      )}

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
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={exporting}
            onClick={handleExport}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            {exporting ? '导出中...' : '导出图片'}
          </Button>
        )}
      </div>

      {addMode && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
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
};

export default Map;
