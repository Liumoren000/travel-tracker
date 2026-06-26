import { useState, useMemo } from 'react';
import { Modal, Button, Tabs } from 'antd';
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useLanguage } from '../hooks/useLanguage';

const COLORS = [
  '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#2f54eb', '#a0d911',
  '#ff7a45', '#36cfc9', '#ffc53d', '#40a9ff', '#9254de'
];

const TravelStatsModal = ({ visible, onClose, routes, countryStats }) => {
  const { t } = useLanguage();

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

    return [
      { name: `🚗 ${t('driving')}`, value: counts.driving },
      { name: `🚂 ${t('train')}`, value: counts.train },
      { name: `✈️ ${t('flight')}`, value: counts.flight },
      { name: `🚶 ${t('walking')}`, value: counts.walking }
    ].filter(item => item.value > 0);
  }, [routes, t]);

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
    >
      <Tabs
        defaultActiveKey="country"
        items={[
          {
            key: 'country',
            label: language === 'zh' ? '国家分布' : 'Countries',
            children: (
              <div style={{ height: 350 }}>
                {countryCityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
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
              <div style={{ height: 350 }}>
                {transportData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
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
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
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
              <div style={{ height: 350 }}>
                {routeDistanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={routeDistanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} km`, language === 'zh' ? '距离' : 'Distance']} />
                      <Bar dataKey="distance" fill="#1890ff" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
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
              <div style={{ height: 350 }}>
                {cityByCountryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityByCountryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => [value, language === 'zh' ? '城市数' : 'Cities']} />
                      <Bar dataKey="cities" fill="#52c41a" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
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
