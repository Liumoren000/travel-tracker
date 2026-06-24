import { useState, useEffect, useCallback } from 'react';
import { Layout, message, Modal, Input, Button, Tag, List, Popconfirm, AutoComplete, Radio } from 'antd';
import { EnvironmentOutlined, DeleteOutlined, ClearOutlined, EyeOutlined, PlusOutlined, EditOutlined, SaveOutlined, CloseOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, CarOutlined, GlobalOutlined } from '@ant-design/icons';
import axios from 'axios';
import Map from './components/Map';
import CitySearch from './components/CitySearch';
import RouteList from './components/RouteList';
import History from './components/History';
import Statistics from './components/Statistics';
import { useStatistics } from './hooks/useStatistics';
import './App.css';

const { Sider, Content } = Layout;
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

const ROUTE_COLORS = [
  '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#2f54eb', '#a0d911'
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (e) {
    console.error('保存线路失败:', e);
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

  useEffect(() => {
    saveRoutesToStorage(routes);
  }, [routes]);

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
      let allCoords = [];
      const segments = [];

      for (let i = 0; i < cities.length - 1; i++) {
        const from = cities[i];
        const to = cities[i + 1];
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

      setCurrentRoute({ name, cities: [...cities], coordinates: allCoords, segments });
      message.success('轨迹生成成功');
    } catch (error) {
      console.error('生成轨迹失败:', error);
      message.error('生成轨迹失败，请重试');
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

  const handleSaveEdit = () => {
    if (!editingRoute || editingRoute.cities.length < 2) {
      message.warning('线路至少需要2个城市');
      return;
    }

    const newName = `${editingRoute.cities[0].name} → ${editingRoute.cities[editingRoute.cities.length - 1].name}`;
    const updatedRoute = { ...editingRoute, name: newName };

    setRoutes(prev => prev.map((r, i) => i === editingRouteIndex ? updatedRoute : r));
    setSelectedRouteDetail(updatedRoute);
    setEditingRoute(null);
    setEditingRouteIndex(null);
    message.success('线路已更新');
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

  const toggleAddMode = () => {
    setAddMode(prev => !prev);
    if (addMode) {
      message.info('已退出地图点击添加模式');
    } else {
      message.info('已开启地图点击添加模式，请点击地图选择位置');
    }
  };

  const handleEditSearch = async (value) => {
    if (!value || value.length < 1) {
      setEditSearchOptions([]);
      return;
    }

    setEditSearchLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/geocoding/search?q=${encodeURIComponent(value)}`
      );

      const cities = response.data.map(item => ({
        value: item.name,
        label: (
          <div className="search-option">
            <span>{item.display_name}</span>
          </div>
        ),
        data: {
          name: item.name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));

      setEditSearchOptions(cities);
    } catch (error) {
      console.error('搜索城市失败:', error);
    } finally {
      setEditSearchLoading(false);
    }
  };

  const handleEditSelectCity = (value, option) => {
    if (editingRoute) {
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

  return (
    <Layout className="app-layout">
      <Sider width={380} className="app-sider">
        <div className="sider-content">
          <div className="app-title">
            <EnvironmentOutlined />
            <h1>自由轨迹</h1>
          </div>

          <CitySearch onAddCity={handleAddCity} isFirst={cities.length === 0} />

          <div className="map-add-mode">
            <Button 
              type={addMode ? 'primary' : 'default'}
              icon={<PlusOutlined />}
              onClick={toggleAddMode}
              block
            >
              {addMode ? '退出地图点击添加' : '开启地图点击添加'}
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

          {routes.length > 0 && (
            <div className="map-routes">
              <div className="map-routes-header">
                <h3>地图线路 ({routes.length})</h3>
                <Popconfirm title="确定清除所有线路？" onConfirm={handleClearRoutes}>
                  <Button size="small" icon={<ClearOutlined />}>清除</Button>
                </Popconfirm>
              </div>
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
                        title="查看详情"
                      />,
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleRemoveRoute(index); }}
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
            </div>
          )}

          <History onLoadRoute={handleLoadRoute} />
        </div>
      </Sider>

      <Content className="app-content">
        <Statistics stats={stats} loading={statsLoading} />
        <Map 
          routes={routes} 
          currentRoute={currentRoute} 
          selectedRouteIndex={selectedRouteIndex}
          addMode={addMode}
          onMapClick={handleMapClick}
          onDeleteCity={handleDeleteCityFromMap}
        />
      </Content>

      <Modal
        title="保存路线"
        open={saveModalVisible}
        onOk={handleConfirmSave}
        onCancel={() => setSaveModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Input
          placeholder="请输入路线名称"
          value={routeName}
          onChange={e => setRouteName(e.target.value)}
        />
      </Modal>

      <Modal
        title="添加城市"
        open={mapClickModalVisible}
        onOk={handleConfirmMapClick}
        onCancel={handleCancelMapClick}
        okText="添加"
        cancelText="取消"
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#666', marginBottom: 8 }}>
            位置: {pendingLatLng?.lat.toFixed(4)}, {pendingLatLng?.lng.toFixed(4)}
          </div>
          <Input
            placeholder="请输入城市名称"
            value={mapClickCityName}
            onChange={e => setMapClickCityName(e.target.value)}
            onPressEnter={handleConfirmMapClick}
            autoFocus
          />
          {cities.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>交通方式：</div>
              <Radio.Group 
                value={mapClickTransportMode} 
                onChange={e => setMapClickTransportMode(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <Radio value="driving"><CarOutlined /> 驾车</Radio>
                <Radio value="flight"><GlobalOutlined /> 飞机</Radio>
                <Radio value="walking">🚶 步行</Radio>
              </Radio.Group>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title="添加城市到编辑线路"
        open={editAddCityVisible}
        onOk={handleConfirmEditAddCity}
        onCancel={() => { setEditAddCityVisible(false); setEditAddCityName(''); setEditAddCityLatLng(null); }}
        okText="添加"
        cancelText="取消"
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#666', marginBottom: 8 }}>
            位置: {editAddCityLatLng?.lat.toFixed(4)}, {editAddCityLatLng?.lng.toFixed(4)}
          </div>
          <Input
            placeholder="请输入城市名称"
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
            <span>{editingRoute ? '编辑线路' : '线路详情'}</span>
            {editingRoute && <Tag color="editing">编辑中</Tag>}
          </div>
        }
        open={routeDetailVisible}
        onCancel={() => { setRouteDetailVisible(false); setEditingRoute(null); setEditingRouteIndex(null); }}
        footer={
          editingRoute ? [
            <Button key="cancel" onClick={handleCancelEdit}>取消</Button>,
            <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveEdit}>保存修改</Button>
          ] : [
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={handleStartEdit}>编辑线路</Button>,
            <Button key="close" onClick={() => setRouteDetailVisible(false)}>关闭</Button>
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
              <span>{displayRoute.cities.length} 个城市</span>
              {displayRoute.mode && (
                <Tag color={displayRoute.mode === 'flight' ? 'orange' : 'blue'}>
                  {displayRoute.mode === 'flight' ? '✈️ 飞行' : displayRoute.mode === 'walking' ? '🚶 步行' : '🚗 驾车'}
                </Tag>
              )}
            </div>
            
            {editingRoute && (
              <div style={{ marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ marginBottom: 8 }}>
                  <AutoComplete
                    value={editSearchText}
                    options={editSearchOptions}
                    onSearch={handleEditSearch}
                    onSelect={handleEditSelectCity}
                    onChange={setEditSearchText}
                    style={{ width: '100%' }}
                  >
                    <Input
                      placeholder="搜索并添加城市..."
                      prefix={<SearchOutlined />}
                      loading={editSearchLoading || undefined}
                    />
                  </AutoComplete>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }}>交通方式：</span>
                  <Radio.Group 
                    value={editingRoute.mode || 'driving'} 
                    onChange={e => setEditingRoute(prev => ({ ...prev, mode: e.target.value }))}
                    size="small"
                  >
                    <Radio.Button value="driving"><CarOutlined /> 驾车</Radio.Button>
                    <Radio.Button value="flight"><GlobalOutlined /> 飞机</Radio.Button>
                    <Radio.Button value="walking">🚶 步行</Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  提示：搜索添加城市，或开启"地图点击添加"后在地图上点击添加
                </div>
              </div>
            )}

            <div className="route-detail-cities">
              {displayRoute.cities.map((city, index) => (
                <div key={index} className="route-detail-city">
                  <div className="city-dot" style={{ background: editingRoute ? '#1890ff' : displayRoute.color }} />
                  <div className="city-info" style={{ flex: 1 }}>
                    <div className="city-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {index === 0 && <Tag color="green">起点</Tag>}
                      {index === displayRoute.cities.length - 1 && index !== 0 && <Tag color="red">终点</Tag>}
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
                  </div>
                  {editingRoute && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleEditMoveCity(index, 'up')}
                        disabled={index === 0}
                        title="上移"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ArrowDownOutlined />}
                        onClick={() => handleEditMoveCity(index, 'down')}
                        disabled={index === displayRoute.cities.length - 1}
                        title="下移"
                      />
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleEditDeleteCity(index)}
                        title="删除"
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
