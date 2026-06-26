import { useState, useMemo } from 'react';
import { Modal, Tabs } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

const COLORS = [
  '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#2f54eb', '#a0d911',
  '#ff7a45', '#36cfc9', '#ffc53d', '#40a9ff', '#9254de'
];

// 自定义 Tooltip
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: isDark ? '#333' : '#fff',
        border: `1px solid ${isDark ? '#555' : '#ccc'}`,
        borderRadius: 4,
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <p style={{ margin: 0, color: isDark ? '#fff' : '#333', fontWeight: 500 }}>
          {label || payload[0].name}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0 0', color: isDark ? '#ccc' : '#666', fontSize: 13 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TravelStatsModal = ({ visible, onClose, routes, countryStats }) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  // 计算国家城市分布
  const countryCityData = useMemo(() => {
    if (!countryStats || !countryStats.countries) return [];
    return countryStats.countries.map(group => ({
      name: group.country,
      value: group.cities.length
    })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [countryStats]);

  // 计算交通方式分布
  const transportData = useMemo(() => {
    const counts = { driving: 0, train: 0, flight: 0, walking: 0 };
    
    routes.forEach(route => {
      if (route.cities) {
        route.cities.forEach((city, index) => {
          if (index > 0) {
            const mode = city.mode || 'driving';
            counts[mode] = (counts[mode] || 0) + 1;
          }
        });
      }
    });

    const labels = {
      zh: { driving: '🚗 驾车', train: '🚂 火车', flight: '✈️ 飞机', walking: '🚶 步行' },
      en: { driving: '🚗 Driving', train: '🚂 Train', flight: '✈️ Flight', walking: '🚶 Walking' }
    };

    return [
      { name: labels[language].driving, value: counts.driving },
      { name: labels[language].train, value: counts.train },
      { name: labels[language].flight, value: counts.flight },
      { name: labels[language].walking, value: counts.walking }
    ].filter(item => item.value > 0);
  }, [routes, language]);

  // 计算路线距离分布
  const routeDistanceData = useMemo(() => {
    return routes.map((route, index) => {
      let totalDistance = 0;
      if (route.cities && route.cities.length >= 2) {
        for (let i = 0; i < route.cities.length - 1; i++) {
          const from = route.cities[i];
          const to = route.cities[i + 1];
          const R = 6371;
          const dLat = (to.lat - from.lat) * Math.PI / 180;
          const dLng = (to.lng - from.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          totalDistance += R * c;
        }
      }
      return {
        name: route.name || `Route ${index + 1}`,
        distance: Math.round(totalDistance)
      };
    }).sort((a, b) => b.distance - a.distance).slice(0, 10);
  }, [routes]);

  // 计算访问城市数量（按国家）
  const cityByCountryData = useMemo(() => {
    if (!countryStats || !countryStats.countries) return [];
    return countryStats.countries.map(group => ({
      name: group.country,
      cities: group.cities.length
    })).sort((a, b) => b.cities - a.cities).slice(0, 10);
  }, [countryStats]);

  // 自定义饼图标签
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 图表容器样式
  const chartContainerStyle = {
    background: isDark ? '#1f1f1f' : '#fff',
    borderRadius: 8,
    padding: '16px',
    marginBottom: '8px'
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChartOutlined style={{ color: '#1890ff' }} />
          <span>{language === 'zh' ? '旅行统计' : 'Travel Statistics'}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
      styles={{ body: { background: isDark ? '#1f1f1f' : '#fff' } }}
    >
      <Tabs
        defaultActiveKey="country"
        items={[
          {
            key: 'country',
            label: language === 'zh' ? '国家分布' : 'Countries',
            children: (
              <div style={chartContainerStyle}>
                {countryCityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={countryCityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {countryCityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Legend 
                        formatter={(value) => <span style={{ color: isDark ? '#fff' : '#333' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: isDark ? '#999' : '#999' }}>
                    {language === 'zh' ? '暂无数据' : 'No data'}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'transport',
            label: language === 'zh' ? '交通方式' : 'Transport',
            children: (
              <div style={chartContainerStyle}>
                {transportData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={transportData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {transportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Legend 
                        formatter={(value) => <span style={{ color: isDark ? '#fff' : '#333' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: isDark ? '#999' : '#999' }}>
                    {language === 'zh' ? '暂无数据' : 'No data'}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'distance',
            label: language === 'zh' ? '路线距离' : 'Distance',
            children: (
              <div style={chartContainerStyle}>
                {routeDistanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={routeDistanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#e8e8e8'} />
                      <XAxis 
                        dataKey="name" 
                        angle={-30} 
                        textAnchor="end" 
                        height={80} 
                        tick={{ fill: isDark ? '#ccc' : '#666', fontSize: 11 }} 
                      />
                      <YAxis tick={{ fill: isDark ? '#ccc' : '#666' }} />
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Bar dataKey="distance" fill="#1890ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: isDark ? '#999' : '#999' }}>
                    {language === 'zh' ? '暂无数据' : 'No data'}
                  </div>
                )}
              </div>
            )
          },
          {
            key: 'cities',
            label: language === 'zh' ? '城市统计' : 'Cities',
            children: (
              <div style={chartContainerStyle}>
                {cityByCountryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={cityByCountryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#e8e8e8'} />
                      <XAxis type="number" tick={{ fill: isDark ? '#ccc' : '#666' }} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={80} 
                        tick={{ fill: isDark ? '#ccc' : '#666', fontSize: 12 }} 
                      />
                      <Tooltip content={<CustomTooltip isDark={isDark} />} />
                      <Bar dataKey="cities" fill="#52c41a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: isDark ? '#999' : '#999' }}>
                    {language === 'zh' ? '暂无数据' : 'No data'}
                  </div>
                )}
              </div>
            )
          }
        ]}
      />
    </Modal>
  );
};

export default TravelStatsModal;
