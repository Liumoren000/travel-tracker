import { useState, useEffect } from 'react';
import { Modal, Spin, Tag } from 'antd';
import { EnvironmentOutlined, TeamOutlined, EnvironmentOutlined as SpotOutlined } from '@ant-design/icons';
import { getCityDetails } from '../data/cityDetails';
import { getWeather } from '../services/weather';

const CityInfoModal = ({ visible, onClose, city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);

  useEffect(() => {
    if (visible && city) {
      // 获取城市详情
      const details = getCityDetails(city.name);
      setCityDetails(details);

      // 获取天气信息
      setLoading(true);
      getWeather(city.lat, city.lng)
        .then(data => {
          setWeather(data);
        })
        .catch(err => {
          console.error('获取天气失败:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, city]);

  if (!city) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>{city.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {/* 基本信息 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
            坐标: {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
          </div>
          
          {cityDetails ? (
            <>
              <div style={{ marginBottom: 12, lineHeight: 1.6 }}>
                {cityDetails.description}
              </div>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TeamOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontSize: 13 }}>人口: {cityDetails.population}</span>
                </div>
              </div>

              {cityDetails.attractions && cityDetails.attractions.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                    🏛️ 主要景点
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cityDetails.attractions.map((attraction, index) => (
                      <Tag key={index} color="blue">{attraction}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: '#999', fontSize: 13 }}>
              暂无该城市的详细信息
            </div>
          )}
        </div>

        {/* 天气信息 */}
        <div style={{ 
          padding: 12, 
          background: '#f5f7fa', 
          borderRadius: 8,
          border: '1px solid #e8e8e8'
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
            🌤️ 天气信息
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Spin size="small" />
              <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>加载天气中...</div>
            </div>
          ) : weather ? (
            <>
              {/* 当前天气 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 12,
                padding: 8,
                background: '#fff',
                borderRadius: 6
              }}>
                <div>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>
                    {weather.current.icon}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {weather.current.description}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#1890ff' }}>
                    {weather.current.temp}°C
                  </div>
                  <div style={{ fontSize: 11, color: '#999' }}>
                    体感 {weather.current.feelsLike}°C
                  </div>
                </div>
              </div>

              {/* 详细信息 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                marginBottom: 12,
                fontSize: 12,
                color: '#666'
              }}>
                <div>💧 湿度 {weather.current.humidity}%</div>
                <div>💨 风速 {weather.current.windSpeed}km/h</div>
              </div>

              {/* 未来天气 */}
              {weather.forecast && weather.forecast.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    未来天气预报
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {weather.forecast.map((day, index) => {
                      const date = new Date(day.date);
                      const isToday = index === 0;
                      return (
                        <div key={index} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                            {isToday ? '今天' : `${date.getMonth() + 1}/${date.getDate()}`}
                          </div>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>
                            {day.icon}
                          </div>
                          <div style={{ fontSize: 12 }}>
                            <span style={{ color: '#ff4d4f' }}>{day.maxTemp}°</span>
                            <span style={{ color: '#d9d9d9' }}> / </span>
                            <span style={{ color: '#1890ff' }}>{day.minTemp}°</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12, padding: 16 }}>
              天气信息获取失败
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CityInfoModal;
