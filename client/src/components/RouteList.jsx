import { useState, useEffect, useCallback } from 'react';
import { List, Button, Tag, Popconfirm, message, Radio, Select } from 'antd';
import { DeleteOutlined, EnvironmentOutlined, PlusOutlined, ClearOutlined, CarOutlined, GlobalOutlined } from '@ant-design/icons';

const RouteList = ({ 
  cities, 
  onRemoveCity, 
  onGenerateRoute, 
  onAddToMap, 
  onSaveRoute, 
  onReset, 
  loading, 
  hasCurrentRoute,
  onCityModeChange
}) => {
  const handleGenerate = () => {
    if (cities.length < 2) {
      message.warning('请至少添加两个城市');
      return;
    }
    onGenerateRoute();
  };

  const handleAddToMap = () => {
    if (!hasCurrentRoute) {
      message.warning('请先生成轨迹');
      return;
    }
    onAddToMap();
  };

  const handleSave = () => {
    if (cities.length < 2) {
      message.warning('请至少添加两个城市');
      return;
    }
    onSaveRoute();
  };

  const modeOptions = [
    { value: 'driving', label: '🚗 驾车' },
    { value: 'flight', label: '✈️ 飞机' },
    { value: 'walking', label: '🚶 步行' }
  ];

  return (
    <div className="route-list">
      <div className="route-header">
        <h3>当前行程</h3>
        <div className="route-header-tags">
          <Tag color="blue">{cities.length} 个城市</Tag>
          {cities.length > 0 && (
            <Button size="small" icon={<ClearOutlined />} onClick={onReset}>清空</Button>
          )}
        </div>
      </div>

      <List
        size="small"
        dataSource={cities}
        renderItem={(city, index) => (
          <List.Item
            actions={[
              <Popconfirm
                title="确定移除这个城市吗？"
                onConfirm={() => onRemoveCity(index)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <div className="city-number">
                  {index === 0 ? (
                    <EnvironmentOutlined style={{ color: '#52c41a' }} />
                  ) : index === cities.length - 1 ? (
                    <EnvironmentOutlined style={{ color: '#f5222d' }} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              }
              title={
                <div className="city-title-row">
                  <span>{city.name}</span>
                  {index > 0 && (
                    <Select
                      value={city.mode || 'driving'}
                      onChange={(value) => onCityModeChange(index, value)}
                      size="small"
                      style={{ width: 90 }}
                      options={modeOptions}
                    />
                  )}
                </div>
              }
              description={
                <div>
                  {index > 0 && (
                    <div className="mode-hint">
                      从 {cities[index - 1].name} 出发
                    </div>
                  )}
                  <div>{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {cities.length >= 2 && (
        <div className="route-actions">
          <Button
            type="primary"
            onClick={handleGenerate}
            loading={loading}
            block
          >
            生成轨迹
          </Button>
          {hasCurrentRoute && (
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={handleAddToMap}
              style={{ marginTop: 8 }}
              block
            >
              添加到地图
            </Button>
          )}
          <Button
            onClick={handleSave}
            style={{ marginTop: 8 }}
            block
          >
            保存路线
          </Button>
        </div>
      )}
    </div>
  );
};

export default RouteList;
