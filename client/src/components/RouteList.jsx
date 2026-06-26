import { useState, useEffect, useCallback } from 'react';
import { List, Button, Tag, Popconfirm, message, Radio, Select } from 'antd';
import { DeleteOutlined, EnvironmentOutlined, PlusOutlined, ClearOutlined, CarOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/useLanguage';

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
  const { t } = useLanguage();

  const handleGenerate = () => {
    if (cities.length < 2) {
      message.warning(t('pleaseAddTwoCities'));
      return;
    }
    onGenerateRoute();
  };

  const handleAddToMap = () => {
    if (!hasCurrentRoute) {
      message.warning(t('pleaseGenerateRoute'));
      return;
    }
    onAddToMap();
  };

  const handleSave = () => {
    if (cities.length < 2) {
      message.warning(t('pleaseAddTwoCities'));
      return;
    }
    onSaveRoute();
  };

  const modeOptions = [
    { value: 'driving', label: `🚗 ${t('driving')}` },
    { value: 'train', label: `🚂 ${t('train')}` },
    { value: 'flight', label: `✈️ ${t('flight')}` },
    { value: 'walking', label: `🚶 ${t('walking')}` }
  ];

  return (
    <div className="route-list">
      <div className="route-header">
        <h3>{t('currentRoute')}</h3>
        <div className="route-header-tags">
          <Tag color="blue">{cities.length} {t('cities')}</Tag>
          {cities.length > 0 && (
            <Button size="small" icon={<ClearOutlined />} onClick={onReset}>{t('clear')}</Button>
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
                okText={t('confirm')}
                cancelText={t('cancel')}
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
                      {t('from')} {cities[index - 1].name} {t('depart')}
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
            {t('generateRoute')}
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
              {t('addToMap')}
            </Button>
          )}
          <Button
            onClick={handleSave}
            style={{ marginTop: 8 }}
            block
          >
            {t('saveRoute')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RouteList;
