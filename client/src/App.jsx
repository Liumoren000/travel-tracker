import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, message, Modal, Input, Button, Tag, List, Popconfirm, AutoComplete, Radio, Space, Select } from 'antd';
import { EnvironmentOutlined, DeleteOutlined, ClearOutlined, EyeOutlined, PlusOutlined, EditOutlined, SaveOutlined, CloseOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, CarOutlined, GlobalOutlined, SendOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, DownloadOutlined, BulbOutlined, BarChartOutlined, ToolOutlined } from '@ant-design/icons';
import axios from 'axios';
import Map from './components/Map';
import CitySearch from './components/CitySearch';
import RouteList from './components/RouteList';
import History from './components/History';
import Statistics from './components/Statistics';
import CityInfoModal from './components/CityInfoModal';
import TravelStatsModal from './components/TravelStatsModal';
import { useStatistics } from './hooks/useStatistics';
import { useTheme } from './hooks/useTheme.jsx';
import { useLanguage } from './hooks/useLanguage.jsx';
import { downloadGPX, importGPXFile } from './utils/gpx';
import { generateAllFlightLinks } from './utils/flightLinks';
import { parseShareHash, clearShareHash, enrichImportedRoutes } from './utils/routeShare';
import { regenerateRoutes, generateRoutePath } from './utils/routeGenerator';
import { CITIES_DATABASE } from './data/citiesDatabase';
import './App.css';

const { Sider, Content } = Layout;
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

// 生成 200+ 种可区分的颜色
const ROUTE_COLORS = [
  // 基础颜色 (10)
  '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#2f54eb', '#a0d911',
  // 红色系 (15)
  '#ff4d4f', '#ff7a45', '#ff8a80', '#ff80ab', '#ea80fc',
  '#f5222d', '#cf1322', '#a8071a', '#ad2102', '#e81123',
  '#ff6b6b', '#ee5a24', '#d63031', '#e17055', '#fab1a0',
  // 橙色系 (15)
  '#fa8c16', '#d46b08', '#ad4e00', '#d48806', '#ffc53d',
  '#ffcc80', '#ff9c6e', '#ffa940', '#ff7a45', '#fa541c',
  '#e8590c', '#fd7e14', '#ff922b', '#e67e22', '#f39c12',
  // 黄色系 (15)
  '#faad14', '#d4b106', '#ad8b00', '#d48806', '#ffc53d',
  '#ffd666', '#fff566', '#ffec3d', '#fadb14', '#d4b106',
  '#f1c40f', '#f9ca24', '#f6e58d', '#ffeaa7', '#fdcb6e',
  // 绿色系 (15)
  '#52c41a', '#389e0d', '#237804', '#135200', '#73d13d',
  '#95de64', '#b7eb8f', '#a0d911', '#7cb305', '#5b8c00',
  '#27ae60', '#2ecc71', '#00b894', '#55efc4', '#81ecec',
  // 青色系 (15)
  '#13c2c2', '#08979c', '#006d75', '#00a7ac', '#36cfc9',
  '#5cdbd3', '#87e8de', '#84fab0', '#00cec9', '#81ecec',
  '#2ed573', '#7bed9f', '#70a1ff', '#1e90ff', '#3742fa',
  // 蓝色系 (15)
  '#1890ff', '#096dd9', '#0050b3', '#003a8c', '#40a9ff',
  '#69b1ff', '#91d5ff', '#2f54eb', '#1d39c4', '#10239e',
  '#597ef7', '#85a8ff', '#adc6ff', '#3b82f6', '#60a5fa',
  // 紫色系 (15)
  '#722ed1', '#531dab', '#391085', '#22075e', '#9254de',
  '#b37feb', '#d3adf7', '#eb2f96', '#c41d7f', '#9e1068',
  '#a855f7', '#c084fc', '#d8b4fe', '#8b5cf6', '#a78bfa',
  // 粉色系 (15)
  '#eb2f96', '#c41d7f', '#9e1068', '#6e0b4c', '#f759ab',
  '#ff85c0', '#ffadd2', '#ff69b4', '#ff1493', '#db7093',
  '#e91e63', '#f06292', '#f48fb1', '#fce4ec', '#f8bbd0',
  // 棕色系 (15)
  '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e',
  '#a1887f', '#bcaaa4', '#d7ccc8', '#8b4513', '#a0522d',
  '#cd853f', '#deb887', '#d2b48c', '#f4a460', '#bc8f8f',
  // 灰色系 (15)
  '#8c8c8c', '#595959', '#434343', '#262626', '#1f1f1f',
  '#bfbfbf', '#d9d9d9', '#f0f0f0', '#666666', '#999999',
  '#4a4a4a', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1',
  // 特殊颜色 (20)
  '#00d2d3', '#01a3a4', '#0abde3', '#48dbfb', '#2e86de',
  '#341f97', '#5f27cd', '#6c5ce7', '#a29bfe', '#dfe6e9',
  '#00b4d8', '#0077b6', '#90e0ef', '#caf0f8', '#023e8a',
  '#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'
];

const STORAGE_KEY = 'travel-tracker-routes';

function loadRoutesFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(route => {
          if (!route || typeof route !== 'object') return null;
          
          const cities = Array.isArray(route.cities) ? route.cities : [];
          const validCities = cities.map(c => {
            if (!c) return null;
            if (typeof c.lat !== 'number' || typeof c.lng !== 'number') return null;
            return {
              name: c.name || '未知城市',
              lat: c.lat,
              lng: c.lng,
              mode: c.mode || 'driving'
            };
          }).filter(Boolean);
          
          if (validCities.length === 0) return null;
          
          return {
            name: route.name || '未命名线路',
            color: route.color || '#1890ff',
            cities: validCities,
            coordinates: Array.isArray(route.coordinates) ? route.coordinates : [],
            segments: Array.isArray(route.segments) ? route.segments : []
          };
        }).filter(Boolean);
      }
    }
  } catch (e) {
    console.error('加载保存的线路失败:', e);
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}

function saveRoutesToStorage(routes) {
  try {
    // 只保存必要的数据，减少存储大小
    const dataToSave = routes.map(route => ({
      name: route.name || '未命名线路',
      color: route.color || '#1890ff',
      cities: route.cities || [],
      coordinates: route.coordinates || [],
      segments: route.segments || []
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error('保存线路失败:', e);
    // 如果存储失败，尝试清理旧数据
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    } catch (e2) {
      console.error('二次保存也失败:', e2);
    }
  }
}

function App() {
  const [cities, setCities] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [routes, setRoutes] = useState(loadRoutesFromStorage);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [routeDetailVisible, setRouteDetailVisible] = useState(false);
  const [selectedRouteDetail, setSelectedRouteDetail] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingRouteIndex, setEditingRouteIndex] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [mapClickCityName, setMapClickCityName] = useState('');
  const [mapClickModalVisible, setMapClickModalVisible] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [mapClickTransportMode, setMapClickTransportMode] = useState('driving');
  const [editAddCityVisible, setEditAddCityVisible] = useState(false);
  const [editAddCityName, setEditAddCityName] = useState('');
  const [editAddCityLatLng, setEditAddCityLatLng] = useState(null);
  const [editSearchText, setEditSearchText] = useState('');
  const [editSearchOptions, setEditSearchOptions] = useState([]);
  const [editSearchLoading, setEditSearchLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [cityInfoVisible, setCityInfoVisible] = useState(false);
  const [selectedCityInfo, setSelectedCityInfo] = useState(null);
  const [travelStatsVisible, setTravelStatsVisible] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const fileInputRef = useRef(null);

  useEffect(() => {
    saveRoutesToStorage(routes);
  }, [routes]);

  // 从 URL hash 加载分享的路线
  useEffect(() => {
    const shared = parseShareHash();
    if (!shared) return;

    if (shared.type === 'all') {
      // 多条路线: 直接加入地图 (自动生成直线轨迹)
      const enrichedRoutes = enrichImportedRoutes(shared.data);
      const routesToAdd = enrichedRoutes.map((r, i) => ({
        ...r,
        color: r.color || ROUTE_COLORS[(routes.length + i) % ROUTE_COLORS.length]
      }));
      Modal.confirm({
        title: `收到 ${routesToAdd.length} 条分享的路线`,
        content: (
          <div>
            {routesToAdd.map((r, i) => (
              <div key={i} style={{ marginBottom: 8, padding: 8, background: '#fafafa', borderRadius: 4, borderLeft: `3px solid ${r.color}` }}>
                <div style={{ fontWeight: 500 }}>{r.name || `线路 ${i + 1}`}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {r.cities?.length || 0} 城市 · {r.cities?.map(c => c.name).join(' → ')}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, color: '#1890ff' }}>
              是否添加到地图?
            </div>
          </div>
        ),
        okText: '添加到地图',
        cancelText: '忽略',
        onOk: () => {
          setRoutes(prev => [...prev, ...routesToAdd]);
          message.success(`已导入 ${routesToAdd.length} 条路线`);
          clearShareHash();
        },
        onCancel: () => clearShareHash()
      });
    } else if (shared.type === 'single') {
      // 单条路线: 加载到编辑列表 (自动生成直线轨迹)
      const enriched = enrichImportedRoutes([shared.data])[0] || shared.data;
      const route = enriched;
      Modal.confirm({
        title: '收到一条分享的路线',
        content: (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>{route.name || '未命名路线'}</strong>
            </div>
            <div style={{ color: '#666', fontSize: 13 }}>
              {route.cities?.length || 0} 个城市: {route.cities?.map(c => c.name).join(' → ')}
            </div>
            <div style={{ marginTop: 12, color: '#1890ff' }}>
              是否加载到当前编辑列表?
            </div>
          </div>
        ),
        okText: '加载',
        cancelText: '忽略',
        onOk: () => {
          setCities(route.cities);
          setCurrentRoute({
            ...route,
            coordinates: route.coordinates || [],
            segments: route.segments || []
          });
          message.success('已加载分享的路线');
          clearShareHash();
        },
        onCancel: () => clearShareHash()
      });
    }
  }, []);

  const handleAddCity = (city) => {
    const newCity = { ...city, mode: city.mode || 'driving' };
    setCities(prev => [...prev, newCity]);
    setCurrentRoute(null);
  };

  const handleRemoveCity = (index) => {
    setCities(prev => prev.filter((_, i) => i !== index));
    setCurrentRoute(null);
  };

  const handleDeleteCityFromMap = useCallback((index) => {
    setCities(prev => {
      const newCities = prev.filter((_, i) => i !== index);
      if (newCities.length < 2) {
        setCurrentRoute(null);
      }
      return newCities;
    });
    message.success('已删除城市');
  }, []);

  const handleMapClick = useCallback((lat, lng) => {
    if (editingRoute) {
      setEditAddCityLatLng({ lat, lng });
      setEditAddCityName('');
      setEditAddCityVisible(true);
    } else {
      setPendingLatLng({ lat, lng });
      setMapClickCityName('');
      setMapClickModalVisible(true);
    }
  }, [editingRoute]);

  const handleConfirmMapClick = () => {
    if (!mapClickCityName.trim()) {
      message.warning('请输入城市名称');
      return;
    }

    const newCity = {
      name: mapClickCityName.trim(),
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
      mode: cities.length === 0 ? 'driving' : mapClickTransportMode
    };

    setCities(prev => [...prev, newCity]);
    setCurrentRoute(null);
    setMapClickModalVisible(false);
    setMapClickCityName('');
    setPendingLatLng(null);
    setMapClickTransportMode('driving');
    message.success(`已添加城市: ${newCity.name}`);
  };

  const handleCancelMapClick = () => {
    setMapClickModalVisible(false);
    setMapClickCityName('');
    setPendingLatLng(null);
  };

  const handleConfirmEditAddCity = () => {
    if (!editAddCityName.trim()) {
      message.warning('请输入城市名称');
      return;
    }

    const newCity = {
      name: editAddCityName.trim(),
      lat: editAddCityLatLng.lat,
      lng: editAddCityLatLng.lng
    };

    setEditingRoute(prev => ({
      ...prev,
      cities: [...prev.cities, newCity]
    }));
    setEditAddCityVisible(false);
    setEditAddCityName('');
    setEditAddCityLatLng(null);
    message.success(`已添加城市: ${newCity.name}`);
  };

  const handleGenerateRoute = async () => {
    if (cities.length < 2) {
      message.warning('请至少添加两个城市');
      return;
    }

    setLoading(true);
    try {
      const name = `${cities[0].name} → ${cities[cities.length - 1].name}`;
      const path = await generateRoutePath(cities);
      setCurrentRoute({
        name,
        cities: [...cities],
        coordinates: path.coordinates,
        segments: path.segments
      });
      message.success('轨迹生成成功');
    } catch (error) {
      console.error('生成轨迹失败:', error);
      message.error('生成轨迹失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 修复缺失轨迹的路线
  const handleFixMissingRoutes = async () => {
    const broken = routes.filter(r => !r.coordinates || r.coordinates.length === 0);
    if (broken.length === 0) {
      message.info('所有路线都已有轨迹');
      return;
    }

    setLoading(true);
    const loadingMsg = message.loading(`正在修复 ${broken.length} 条路线...`, 0);

    try {
      const fixed = await regenerateRoutes(broken, {
        skipExisting: false,
        onProgress: (current, total) => {
          loadingMsg();
          message.loading(`正在修复 ${current}/${total}...`, 0);
        }
      });

      const fixedMap = new Map(fixed.map((r, i) => [broken[i].color + broken[i].name, r]));
      setRoutes(prev => prev.map(r => {
        const key = r.color + r.name;
        return fixedMap.has(key) ? fixedMap.get(key) : r;
      }));

      loadingMsg();
      message.success(`已修复 ${fixed.length} 条路线`);
    } catch (err) {
      loadingMsg();
      console.error('修复轨迹失败:', err);
      message.error('修复失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMap = () => {
    if (!currentRoute) {
      message.warning('请先生成轨迹');
      return;
    }
    const color = ROUTE_COLORS[routes.length % ROUTE_COLORS.length];
    setRoutes(prev => [...prev, { ...currentRoute, color }]);
    setCities([]);
    setCurrentRoute(null);
    message.success('已添加到地图');
  };

  const handleRemoveRoute = (index) => {
    setRoutes(prev => prev.filter((_, i) => i !== index));
    if (selectedRouteIndex === index) {
      setSelectedRouteIndex(null);
    } else if (selectedRouteIndex > index) {
      setSelectedRouteIndex(prev => prev - 1);
    }
  };

  const handleClearRoutes = () => {
    setRoutes([]);
    setSelectedRouteIndex(null);
    message.success('已清除所有线路');
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(prev => prev === index ? null : index);
  };

  const handleViewRouteDetail = (route, e) => {
    e.stopPropagation();
    setSelectedRouteDetail(route);
    setEditingRoute(null);
    setRouteDetailVisible(true);
  };

  const handleStartEdit = () => {
    const routeIndex = routes.findIndex(r => r === selectedRouteDetail);
    setEditingRoute({ ...selectedRouteDetail });
    setEditingRouteIndex(routeIndex);
  };

  const handleCancelEdit = () => {
    setEditingRoute(null);
    setEditingRouteIndex(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRoute || editingRoute.cities.length < 2) {
      message.warning('线路至少需要2个城市');
      return;
    }

    setLoading(true);
    try {
      const newName = `${editingRoute.cities[0].name} → ${editingRoute.cities[editingRoute.cities.length - 1].name}`;
      
      // 重新生成轨迹坐标
      let allCoords = [];
      const segments = [];

      for (let i = 0; i < editingRoute.cities.length - 1; i++) {
        const from = editingRoute.cities[i];
        const to = editingRoute.cities[i + 1];
        const mode = to.mode || 'driving';

        if (mode === 'flight') {
          // Flight: straight line
          const segCoords = [];
          const steps = 20;
          for (let s = 0; s <= steps; s++) {
            const lat = from.lat + (to.lat - from.lat) * (s / steps);
            const lng = from.lng + (to.lng - from.lng) * (s / steps);
            segCoords.push([lat, lng]);
          }
          if (i === 0) {
            allCoords = [...segCoords];
          } else {
            allCoords = [...allCoords, ...segCoords.slice(1)];
          }
          segments.push({ from: from.name, to: to.name, mode, coordinates: segCoords });
        } else {
          // Ground transport: use OSRM with fallback to straight line
          try {
            const profile = mode === 'walking' ? 'foot' : 'driving';
            const coordinates = `${from.lng},${from.lat};${to.lng},${to.lat}`;
            const response = await axios.get(
              `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson`,
              { timeout: 10000 }
            );

            if (response.data.routes && response.data.routes.length > 0) {
              const route = response.data.routes[0];
              const segCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
              if (i === 0) {
                allCoords = [...segCoords];
              } else {
                allCoords = [...allCoords, ...segCoords.slice(1)];
              }
              segments.push({ from: from.name, to: to.name, mode, coordinates: segCoords });
            } else {
              throw new Error('No route found');
            }
          } catch (err) {
            // Fallback to straight line
            const segCoords = [];
            const steps = 20;
            for (let s = 0; s <= steps; s++) {
              const lat = from.lat + (to.lat - from.lat) * (s / steps);
              const lng = from.lng + (to.lng - from.lng) * (s / steps);
              segCoords.push([lat, lng]);
            }
            if (i === 0) {
              allCoords = [...segCoords];
            } else {
              allCoords = [...allCoords, ...segCoords.slice(1)];
            }
            segments.push({ from: from.name, to: to.name, mode, coordinates: segCoords });
          }
        }
      }

      const updatedRoute = { 
        ...editingRoute, 
        name: newName,
        coordinates: allCoords,
        segments: segments
      };

      setRoutes(prev => prev.map((r, i) => i === editingRouteIndex ? updatedRoute : r));
      setSelectedRouteDetail(updatedRoute);
      setEditingRoute(null);
      setEditingRouteIndex(null);
      message.success('线路已更新');
    } catch (error) {
      console.error('更新线路失败:', error);
      message.error('更新线路失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = (name) => {
    setEditingRoute(prev => ({ ...prev, name }));
  };

  const handleEditDeleteCity = (index) => {
    setEditingRoute(prev => ({
      ...prev,
      cities: prev.cities.filter((_, i) => i !== index)
    }));
  };

  const handleEditCityName = (index, name) => {
    setEditingRoute(prev => ({
      ...prev,
      cities: prev.cities.map((c, i) => i === index ? { ...c, name } : c)
    }));
  };

  const handleEditCityMode = (index, mode) => {
    setEditingRoute(prev => ({
      ...prev,
      cities: prev.cities.map((c, i) => i === index ? { ...c, mode } : c)
    }));
  };

  const handleEditMoveCity = (index, direction) => {
    setEditingRoute(prev => {
      const newCities = [...prev.cities];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex < 0 || targetIndex >= newCities.length) return prev;
      
      [newCities[index], newCities[targetIndex]] = [newCities[targetIndex], newCities[index]];
      
      return { ...prev, cities: newCities };
    });
  };

  const handleCityModeChange = async (index, mode) => {
    const newCities = cities.map((city, i) => i === index ? { ...city, mode } : city);
    setCities(newCities);
    
    // Auto-regenerate route if one exists and has enough cities
    if (currentRoute && newCities.length >= 2) {
      setLoading(true);
      try {
        const name = `${newCities[0].name} → ${newCities[newCities.length - 1].name}`;
        let allCoords = [];
        const segments = [];

        for (let i = 0; i < newCities.length - 1; i++) {
          const from = newCities[i];
          const to = newCities[i + 1];
          const cityMode = to.mode || 'driving';

          if (cityMode === 'flight') {
            const segCoords = [];
            const steps = 20;
            for (let s = 0; s <= steps; s++) {
              const lat = from.lat + (to.lat - from.lat) * (s / steps);
              const lng = from.lng + (to.lng - from.lng) * (s / steps);
              segCoords.push([lat, lng]);
            }
            if (i === 0) {
              allCoords = [...segCoords];
            } else {
              allCoords = [...allCoords, ...segCoords.slice(1)];
            }
            segments.push({ from: from.name, to: to.name, mode: cityMode, coordinates: segCoords });
          } else {
            try {
              const profile = cityMode === 'walking' ? 'foot' : 'driving';
              const coordinates = `${from.lng},${from.lat};${to.lng},${to.lat}`;
              const response = await axios.get(
                `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson`,
                { timeout: 10000 }
              );

              if (response.data.routes && response.data.routes.length > 0) {
                const route = response.data.routes[0];
                const segCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                if (i === 0) {
                  allCoords = [...segCoords];
                } else {
                  allCoords = [...allCoords, ...segCoords.slice(1)];
                }
                segments.push({ from: from.name, to: to.name, mode: cityMode, coordinates: segCoords });
              } else {
                // Fallback to straight line if route not found
                const segCoords = [];
                const steps = 20;
                for (let s = 0; s <= steps; s++) {
                  const lat = from.lat + (to.lat - from.lat) * (s / steps);
                  const lng = from.lng + (to.lng - from.lng) * (s / steps);
                  segCoords.push([lat, lng]);
                }
                if (i === 0) {
                  allCoords = [...segCoords];
                } else {
                  allCoords = [...allCoords, ...segCoords.slice(1)];
                }
                segments.push({ from: from.name, to: to.name, mode: cityMode, coordinates: segCoords });
              }
            } catch (err) {
              // Fallback to straight line on error
              const segCoords = [];
              const steps = 20;
              for (let s = 0; s <= steps; s++) {
                const lat = from.lat + (to.lat - from.lat) * (s / steps);
                const lng = from.lng + (to.lng - from.lng) * (s / steps);
                segCoords.push([lat, lng]);
              }
              if (i === 0) {
                allCoords = [...segCoords];
              } else {
                allCoords = [...allCoords, ...segCoords.slice(1)];
              }
              segments.push({ from: from.name, to: to.name, mode: cityMode, coordinates: segCoords });
            }
          }
        }

        setCurrentRoute({ name, cities: [...newCities], coordinates: allCoords, segments });
      } catch (error) {
        console.error('更新轨迹失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveRoute = () => {
    if (cities.length < 2) {
      message.warning('请至少添加两个城市');
      return;
    }
    setRouteName(`${cities[0].name} → ${cities[cities.length - 1].name}`);
    setSaveModalVisible(true);
  };

  const handleConfirmSave = async () => {
    try {
      const dataToSave = currentRoute || { name: routeName, cities, coordinates: [] };
      await axios.post(`${API_BASE}/routes`, {
        name: routeName,
        cities: dataToSave.cities,
        coordinates: dataToSave.coordinates
      });
      message.success('路线保存成功');
      setSaveModalVisible(false);
      setRouteName('');
    } catch (error) {
      console.error('保存路线失败:', error);
      message.error('保存路线失败');
    }
  };

  const handleLoadRoute = (route) => {
    const color = ROUTE_COLORS[routes.length % ROUTE_COLORS.length];
    setRoutes(prev => [...prev, { ...route, color }]);
    message.success('路线已加载到地图');
  };

  const handleResetCurrent = () => {
    setCities([]);
    setCurrentRoute(null);
    setAddMode(false);
  };

  const toggleSider = useCallback(() => {
    setSiderCollapsed(prev => !prev);
  }, []);

  const toggleAddMode = () => {
    setAddMode(prev => !prev);
    if (addMode) {
      message.info('已退出地图点击添加模式');
    } else {
      message.info('已开启地图点击添加模式，请点击地图选择位置');
    }
  };

  // 导出 GPX 文件
  const handleExportGPX = () => {
    if (routes.length === 0) {
      message.warning('没有可导出的路线');
      return;
    }
    try {
      downloadGPX(routes);
      message.success('GPX 文件导出成功');
    } catch (error) {
      console.error('导出 GPX 失败:', error);
      message.error('导出 GPX 失败，请重试');
    }
  };

  // 导入 GPX 文件
  const handleImportGPX = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedRoutes = await importGPXFile(file);
      if (importedRoutes.length === 0) {
        message.warning('GPX 文件中没有找到有效路线');
        return;
      }

      // 为导入的路线添加颜色
      const coloredRoutes = importedRoutes.map((route, index) => ({
        ...route,
        color: ROUTE_COLORS[(routes.length + index) % ROUTE_COLORS.length]
      }));

      setRoutes(prev => [...prev, ...coloredRoutes]);
      message.success(`成功导入 ${importedRoutes.length} 条路线`);
    } catch (error) {
      console.error('导入 GPX 失败:', error);
      message.error('导入 GPX 失败：' + error.message);
    }

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditSearch = useCallback(async (value) => {
    if (!value || value.trim().length < 1) {
      setEditSearchOptions([]);
      return;
    }

    setEditSearchLoading(true);
    
    // 本地搜索
    const q = value.trim();
    const localResults = CITIES_DATABASE
      .filter(city => {
        const name = city.name;
        const nameEn = city.nameEn;
        
        // 中文名称匹配
        if (name.includes(q)) return true;
        
        // 英文名称匹配（不区分大小写）
        if (nameEn.toLowerCase().includes(q.toLowerCase())) return true;
        
        return false;
      })
      .slice(0, 8)
      .map(city => ({
        value: city.name,
        label: (
          <div className="search-option">
            <span>{city.name} ({city.nameEn}) - {city.country}</span>
          </div>
        ),
        data: {
          name: city.name,
          lat: city.lat,
          lng: city.lng
        }
      }));

    // 立即显示本地结果
    setEditSearchOptions(localResults);

    // 同时调用 Nominatim API（全球覆盖）
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=10&accept-language=zh-CN,zh&addressdetails=1`,
        { 
          timeout: 5000,
          headers: { 'User-Agent': 'TravelTracker/1.0' }
        }
      );

      const apiResults = response.data
        .filter(item => item.display_name)
        .map(item => {
          let cityName = '';
          
          if (item.address) {
            cityName = item.address.city || 
                       item.address.town || 
                       item.address.village || 
                       item.address.county || 
                       item.address.state || '';
          }
          
          if (!cityName) {
            const nameParts = item.display_name.split(',');
            cityName = nameParts[0].trim();
          }
          
          return {
            value: cityName,
            label: (
              <div className="search-option">
                <span>{cityName}</span>
              </div>
            ),
            data: {
              name: cityName,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }
          };
        })
        .filter(item => item.value && !item.value.match(/[а-яА-Я]/));

      // 合并结果，本地中文结果优先
      const allResults = [...localResults];
      const existingNames = new Set(localResults.map(r => r.value));
      
      for (const result of apiResults) {
        if (!existingNames.has(result.value) && allResults.length < 15) {
          allResults.push(result);
          existingNames.add(result.value);
        }
      }

      setEditSearchOptions(allResults);
    } catch (error) {
      console.warn('API 搜索失败，使用本地结果:', error.message);
      // API 失败时保留本地结果
    } finally {
      setEditSearchLoading(false);
    }
  }, []);

  const handleEditSelectCity = (value, option) => {
    if (editingRoute && option && option.data) {
      setEditingRoute(prev => ({
        ...prev,
        cities: [...prev.cities, option.data]
      }));
      message.success(`已添加城市: ${option.data.name}`);
    }
    setEditSearchText('');
    setEditSearchOptions([]);
  };

  const displayRoute = editingRoute || selectedRouteDetail;
  const { stats, loading: statsLoading } = useStatistics(routes);

  // 检测是否为移动端
  const isMobile = window.innerWidth <= 768;

  // 翻译交通方式标签
  const getModeLabel = (mode) => {
    switch(mode) {
      case 'flight': return `✈️ ${t('flight')}`;
      case 'train': return `🚂 ${t('train')}`;
      case 'walking': return `🚶 ${t('walking')}`;
      default: return `🚗 ${t('driving')}`;
    }
  };

  return (
    <Layout className="app-layout">
      <Sider 
        width={isMobile ? '100%' : 380} 
        collapsedWidth={0}
        collapsed={siderCollapsed}
        onCollapse={setSiderCollapsed}
        collapsible
        trigger={null}
        className="app-sider"
      >
        <div className="sider-content">
          <div className="app-title">
            <EnvironmentOutlined />
            <h1>{t('appName')}</h1>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
              <Button 
                className="theme-toggle-btn"
                icon={isDark ? '☀️' : '🌙'}
                onClick={toggleTheme}
                size="small"
                title={isDark ? t('lightMode') : t('darkMode')}
              />
              <Button 
                className="theme-toggle-btn"
                onClick={toggleLanguage}
                size="small"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                {language === 'zh' ? 'EN' : '中'}
              </Button>
            </div>
          </div>

          <CitySearch onAddCity={handleAddCity} isFirst={cities.length === 0} />

          <div className="map-add-mode">
            <Button 
              type={addMode ? 'primary' : 'default'}
              icon={<PlusOutlined />}
              onClick={toggleAddMode}
              block
            >
              {addMode ? t('exitMapClick') : t('mapClickAdd')}
            </Button>
          </div>

          <RouteList
            cities={cities}
            onRemoveCity={handleRemoveCity}
            onGenerateRoute={handleGenerateRoute}
            onAddToMap={handleAddToMap}
            onSaveRoute={handleSaveRoute}
            onReset={handleResetCurrent}
            loading={loading}
            hasCurrentRoute={!!currentRoute}
            onCityModeChange={handleCityModeChange}
          />

          <div className="map-routes">
            <div className="map-routes-header">
              <h3>{t('mapRoutes')} ({routes.length})</h3>
              <Space size="small">
                {routes.length > 0 && (
                  <Button size="small" icon={<BarChartOutlined />} onClick={() => setTravelStatsVisible(true)}>
                    {language === 'zh' ? '统计' : 'Stats'}
                  </Button>
                )}
                {routes.some(r => !r.coordinates || r.coordinates.length === 0) && (
                  <Button
                    size="small"
                    icon={<ToolOutlined />}
                    onClick={handleFixMissingRoutes}
                    loading={loading}
                    title="为缺失轨迹的路线重新生成"
                  >
                    修复轨迹
                  </Button>
                )}
                <Button size="small" icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
                  {t('import')}
                </Button>
                {routes.length > 0 && (
                  <>
                    <Button size="small" icon={<DownloadOutlined />} onClick={handleExportGPX}>
                      {t('export')}
                    </Button>
                    <Popconfirm title={t('confirmRemoveAll')} onConfirm={handleClearRoutes}>
                      <Button size="small" icon={<ClearOutlined />}>{t('clear')}</Button>
                    </Popconfirm>
                  </>
                )}
              </Space>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".gpx"
              style={{ display: 'none' }}
              onChange={handleImportGPX}
              />
              {routes.length > 0 && (
                <List
                  size="small"
                  dataSource={routes}
                  renderItem={(route, index) => (
                    <List.Item
                      className={`route-list-item ${selectedRouteIndex === index ? 'route-selected' : ''}`}
                      onClick={() => handleSelectRoute(index)}
                      actions={[
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          size="small"
                          onClick={(e) => handleViewRouteDetail(route, e)}
                          title={t('viewDetail')}
                        />,
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleRemoveRoute(index); }}
                          title={t('delete')}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<div className="route-color-dot" style={{ background: route.color }} />}
                        title={route.name}
                        description={
                          <div className="route-cities-preview">
                            {route.cities.map((city, i) => (
                              <Tag key={i} color={i === 0 ? 'green' : i === route.cities.length - 1 ? 'red' : 'default'}>
                                {city.name}
                              </Tag>
                            ))}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>

          <History onLoadRoute={handleLoadRoute} />
        </div>
      </Sider>

      <Content className="app-content">
        <Statistics stats={stats} loading={statsLoading} routes={routes} />
        <Map 
          routes={routes} 
          currentRoute={currentRoute} 
          selectedRouteIndex={selectedRouteIndex}
          addMode={addMode}
          onMapClick={handleMapClick}
          onDeleteCity={handleDeleteCityFromMap}
          siderCollapsed={siderCollapsed}
          onToggleSider={toggleSider}
          onCityClick={(city) => {
            setSelectedCityInfo(city);
            setCityInfoVisible(true);
          }}
          isDark={isDark}
        />
      </Content>

      <CityInfoModal
        visible={cityInfoVisible}
        onClose={() => {
          setCityInfoVisible(false);
          setSelectedCityInfo(null);
        }}
        city={selectedCityInfo}
      />

      <TravelStatsModal
        visible={travelStatsVisible}
        onClose={() => setTravelStatsVisible(false)}
        routes={routes}
        countryStats={stats}
      />

      <Modal
        title={t('saveRouteTitle')}
        open={saveModalVisible}
        onOk={handleConfirmSave}
        onCancel={() => setSaveModalVisible(false)}
        okText={t('save')}
        cancelText={t('cancel')}
      >
        <Input
          placeholder={t('inputRouteName')}
          value={routeName}
          onChange={e => setRouteName(e.target.value)}
        />
      </Modal>

      <Modal
        title={t('addCityTitle')}
        open={mapClickModalVisible}
        onOk={handleConfirmMapClick}
        onCancel={handleCancelMapClick}
        okText={t('add')}
        cancelText={t('cancel')}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#666', marginBottom: 8 }}>
            {t('position')} {pendingLatLng?.lat.toFixed(4)}, {pendingLatLng?.lng.toFixed(4)}
          </div>
          <Input
            placeholder={t('inputCityName')}
            value={mapClickCityName}
            onChange={e => setMapClickCityName(e.target.value)}
            onPressEnter={handleConfirmMapClick}
            autoFocus
          />
          {cities.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{t('transportMode')}</div>
              <Radio.Group 
                value={mapClickTransportMode} 
                onChange={e => setMapClickTransportMode(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <Radio value="driving"><CarOutlined /> {t('driving')}</Radio>
                <Radio value="train"><SendOutlined /> {t('train')}</Radio>
                <Radio value="flight"><GlobalOutlined /> {t('flight')}</Radio>
                <Radio value="walking">🚶 {t('walking')}</Radio>
              </Radio.Group>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title={t('addCityToEdit')}
        open={editAddCityVisible}
        onOk={handleConfirmEditAddCity}
        onCancel={() => { setEditAddCityVisible(false); setEditAddCityName(''); setEditAddCityLatLng(null); }}
        okText={t('add')}
        cancelText={t('cancel')}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#666', marginBottom: 8 }}>
            {t('position')} {editAddCityLatLng?.lat.toFixed(4)}, {editAddCityLatLng?.lng.toFixed(4)}
          </div>
          <Input
            placeholder={t('inputCityName')}
            value={editAddCityName}
            onChange={e => setEditAddCityName(e.target.value)}
            onPressEnter={handleConfirmEditAddCity}
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>{editingRoute ? t('editRoute') : t('routeDetail')}</span>
            {editingRoute && <Tag color="editing">{t('editRouteTag')}</Tag>}
          </div>
        }
        open={routeDetailVisible}
        onCancel={() => { setRouteDetailVisible(false); setEditingRoute(null); setEditingRouteIndex(null); }}
        footer={
          editingRoute ? [
            <Button key="cancel" onClick={handleCancelEdit}>{t('cancel')}</Button>,
            <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit}>{t('saveEdit')}</Button>
          ] : [
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={handleStartEdit}>{t('editRoute')}</Button>,
            <Button key="close" onClick={() => setRouteDetailVisible(false)}>{t('close')}</Button>
          ]
        }
        width={450}
      >
        {displayRoute && (
          <div className="route-detail">
            <div className="route-detail-header">
              {editingRoute ? (
                <Input 
                  value={editingRoute.name} 
                  onChange={e => handleEditName(e.target.value)}
                  style={{ width: 250 }}
                />
              ) : (
                <Tag color={displayRoute.color}>{displayRoute.name}</Tag>
              )}
              <span>{displayRoute.cities.length} {t('citiesLabel')}</span>
              {displayRoute.mode && (
                <Tag color={displayRoute.mode === 'flight' ? 'orange' : 'blue'}>
                  {getModeLabel(displayRoute.mode)}
                </Tag>
              )}
            </div>
            
            {/* 机票查询链接 */}
            {displayRoute.cities && displayRoute.cities.length >= 2 && (() => {
              // 查找飞机段
              const flightSegments = [];
              for (let i = 0; i < displayRoute.cities.length - 1; i++) {
                const to = displayRoute.cities[i + 1];
                if (to.mode === 'flight') {
                  flightSegments.push({
                    from: displayRoute.cities[i].name,
                    to: to.name
                  });
                }
              }
              
              if (flightSegments.length === 0) return null;
              
              return (
                <div style={{ 
                  marginBottom: 12, 
                  padding: '8px 12px', 
                  background: '#e6f7ff', 
                  borderRadius: 6,
                  border: '1px solid #91d5ff'
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    ✈️ {t('queryFlightPrice')}
                  </div>
                  {flightSegments.map((seg, index) => {
                    const links = generateAllFlightLinks(seg.from, seg.to);
                    return (
                      <div key={index} style={{ marginBottom: index < flightSegments.length - 1 ? 6 : 0 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                          {seg.from} → {seg.to}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {Object.entries(links).map(([key, link]) => (
                            <a
                              key={key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '2px 8px',
                                background: '#1890ff',
                                color: 'white',
                                borderRadius: 4,
                                fontSize: 11,
                                textDecoration: 'none',
                                display: 'inline-block'
                              }}
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            
            {editingRoute && (
              <div style={{ marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ marginBottom: 8, position: 'relative' }}>
                  <Input
                    placeholder={t('searchAddCity')}
                    prefix={<SearchOutlined />}
                    value={editSearchText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditSearchText(val);
                      console.log('搜索输入:', val);
                      
                      // 本地搜索
                      if (val.trim()) {
                        const q = val.trim();
                        const results = CITIES_DATABASE
                          .filter(city => {
                            const match = city.name.includes(q) || 
                                         city.nameEn.toLowerCase().includes(q.toLowerCase());
                            return match;
                          })
                          .slice(0, 10)
                          .map(city => ({
                            name: city.name,
                            nameEn: city.nameEn,
                            country: city.country,
                            lat: city.lat,
                            lng: city.lng
                          }));
                        console.log('搜索结果:', results.length, '个城市');
                        setEditSearchOptions(results);
                      } else {
                        setEditSearchOptions([]);
                      }
                    }}
                  />
                  {editSearchOptions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      background: '#fff',
                      border: '1px solid #d9d9d9',
                      borderRadius: '0 0 4px 4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {editSearchOptions.map((option, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                          onClick={() => {
                            if (editingRoute) {
                              setEditingRoute(prev => ({
                                ...prev,
                                cities: [...prev.cities, { 
                                  name: option.name, 
                                  lat: option.lat, 
                                  lng: option.lng 
                                }]
                              }));
                              message.success(`已添加城市: ${option.name}`);
                            }
                            setEditSearchText('');
                            setEditSearchOptions([]);
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.background = '#fff'}
                        >
                          {option.name} ({option.nameEn}) - {option.country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }}>{t('transportMode')}</span>
                  <Radio.Group 
                    value={editingRoute.mode || 'driving'} 
                    onChange={e => setEditingRoute(prev => ({ ...prev, mode: e.target.value }))}
                    size="small"
                  >
                    <Radio.Button value="driving"><CarOutlined /> {t('driving')}</Radio.Button>
                    <Radio.Button value="train"><SendOutlined /> {t('train')}</Radio.Button>
                    <Radio.Button value="flight"><GlobalOutlined /> {t('flight')}</Radio.Button>
                    <Radio.Button value="walking">🚶 {t('walking')}</Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {t('editTip')}
                </div>
              </div>
            )}

            <div className="route-detail-cities">
              {displayRoute.cities.map((city, index) => (
                <div key={index} className="route-detail-city">
                  <div className="city-dot" style={{ background: editingRoute ? '#1890ff' : displayRoute.color }} />
                  <div className="city-info" style={{ flex: 1 }}>
                    <div className="city-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {index === 0 && <Tag color="green">{t('startPoint')}</Tag>}
                      {index === displayRoute.cities.length - 1 && index !== 0 && <Tag color="red">{t('endPoint')}</Tag>}
                      {editingRoute ? (
                        <Input 
                          size="small" 
                          value={city.name}
                          onChange={e => handleEditCityName(index, e.target.value)}
                          style={{ width: 120 }}
                        />
                      ) : (
                        <span>{city.name}</span>
                      )}
                    </div>
                    <div className="city-coords">
                      {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                    </div>
                    {editingRoute && index > 0 && (
                      <div style={{ marginTop: 4 }}>
                        <Select
                          value={city.mode || 'driving'}
                          onChange={(value) => handleEditCityMode(index, value)}
                          size="small"
                          style={{ width: 100 }}
                            options={[
                            { value: 'driving', label: t('drivingLabel') },
                            { value: 'train', label: t('trainLabel') },
                            { value: 'flight', label: t('flightLabel') },
                            { value: 'walking', label: t('walkingLabel') }
                          ]}
                        />
                      </div>
                    )}
                    {!editingRoute && city.mode && index > 0 && (
                      <div style={{ marginTop: 2, fontSize: 11, color: '#999' }}>
                        {getModeLabel(city.mode)}
                      </div>
                    )}
                  </div>
                  {editingRoute && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleEditMoveCity(index, 'up')}
                        disabled={index === 0}
                        title={t('moveUp')}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ArrowDownOutlined />}
                        onClick={() => handleEditMoveCity(index, 'down')}
                        disabled={index === displayRoute.cities.length - 1}
                        title={t('moveDown')}
                      />
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleEditDeleteCity(index)}
                        title={t('delete')}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default App;
