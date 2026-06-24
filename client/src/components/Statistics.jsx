import { useState } from 'react';
import { Tag, Spin } from 'antd';
import { GlobalOutlined, EnvironmentOutlined, DownOutlined, UpOutlined, AimOutlined } from '@ant-design/icons';
import { calculateTotalDistance, formatDistance } from '../utils/distance';

const COUNTRY_FLAGS = {
  'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'TH': '🇹🇭', 'SG': '🇸🇬',
  'MY': '🇲🇾', 'ID': '🇮🇩', 'VN': '🇻🇳', 'PH': '🇵🇭', 'AE': '🇦🇪',
  'TR': '🇹🇷', 'TW': '🇹🇼', 'HK': '🇭🇰', 'MO': '🇲🇴',
  'GB': '🇬🇧', 'FR': '🇫🇷', 'IT': '🇮🇹', 'DE': '🇩🇪', 'ES': '🇪🇸',
  'NL': '🇳🇱', 'AT': '🇦🇹', 'CH': '🇨🇭', 'RU': '🇷🇺', 'GR': '🇬🇷',
  'CZ': '🇨🇿', 'DK': '🇩🇰', 'SE': '🇸🇪',
  'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽',
  'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'PE': '🇵🇪',
  'AU': '🇦🇺', 'NZ': '🇳🇿',
  'EG': '🇪🇬', 'ZA': '🇿🇦', 'KE': '🇰🇪',
};

function getFlag(countryCode) {
  return COUNTRY_FLAGS[countryCode] || '🌍';
}

export default function Statistics({ stats, loading, routes }) {
  const [expanded, setExpanded] = useState(false);
  
  // 计算总距离
  const totalDistance = routes ? calculateTotalDistance(routes) : 0;
  const formattedDistance = formatDistance(totalDistance);

  if (stats.cityCount === 0) {
    return null;
  }

  return (
    <div className="statistics-container">
      <div className="statistics-summary" onClick={() => setExpanded(!expanded)}>
        <div className="statistics-numbers">
          <Spin size="small" spinning={loading}>
            <span className="statistics-item">
              <GlobalOutlined /> {stats.countryCount} 个国家
            </span>
            <span className="statistics-divider">/</span>
            <span className="statistics-item">
              <EnvironmentOutlined /> {stats.cityCount} 个城市
            </span>
            {totalDistance > 0 && (
              <>
                <span className="statistics-divider">/</span>
                <span className="statistics-item">
                  <AimOutlined /> {formattedDistance}
                </span>
              </>
            )}
          </Spin>
        </div>
        <div className="statistics-toggle">
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      
      {expanded && (
        <div className="statistics-detail">
          {stats.countries.map((group) => (
            <div key={group.country} className="statistics-country">
              <div className="statistics-country-header">
                <span className="statistics-country-flag">
                  {getFlag(group.countryCode)}
                </span>
                <span className="statistics-country-name">
                  {group.country}
                </span>
                <Tag className="statistics-country-count" color="blue">
                  {group.cities.length}
                </Tag>
              </div>
              <div className="statistics-cities">
                {group.cities.map((city, index) => (
                  <Tag key={index} className="statistics-city-tag">
                    {city}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
