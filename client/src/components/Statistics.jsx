import { useState, useRef, useCallback } from 'react';
import { Tag, Spin } from 'antd';
import { GlobalOutlined, EnvironmentOutlined, DownOutlined, UpOutlined, AimOutlined, HolderOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { calculateTotalDistance, formatDistance } from '../utils/distance';
import { estimateTotalCost, formatCost } from '../utils/cost';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  
  // 计算总距离
  const totalDistance = routes ? calculateTotalDistance(routes) : 0;
  const formattedDistance = formatDistance(totalDistance);
  
  // 计算总费用
  const totalCost = routes ? estimateTotalCost(routes) : 0;
  const formattedCost = formatCost(totalCost);

  // 拖动开始
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position]);

  // 触摸拖动支持
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStartRef.current.x,
        y: touch.clientY - dragStartRef.current.y
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [position]);

  if (stats.cityCount === 0) {
    return null;
  }

  return (
    <div 
      className="statistics-container"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="statistics-summary">
        <div 
          className="statistics-drag-handle"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: 'grab', padding: '2px 4px', marginRight: '4px' }}
        >
          <HolderOutlined style={{ color: '#999', fontSize: '12px' }} />
        </div>
        <div className="statistics-numbers" onClick={() => setExpanded(!expanded)} style={{ flex: 1, cursor: 'pointer' }}>
          <Spin size="small" spinning={loading}>
            <span className="statistics-item-sm">
              <GlobalOutlined /> {stats.countryCount}
            </span>
            <span className="statistics-divider">/</span>
            <span className="statistics-item-sm">
              <EnvironmentOutlined /> {stats.cityCount}
            </span>
            {totalDistance > 0 && (
              <>
                <span className="statistics-divider">/</span>
                <span className="statistics-item-sm">
                  <AimOutlined /> {formattedDistance}
                </span>
              </>
            )}
            {totalCost > 0 && (
              <>
                <span className="statistics-divider">/</span>
                <span className="statistics-item-sm">
                  <MoneyCollectOutlined /> {formattedCost}
                </span>
              </>
            )}
          </Spin>
        </div>
        <div className="statistics-toggle" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', padding: '2px 4px' }}>
          {expanded ? <UpOutlined style={{ fontSize: '10px' }} /> : <DownOutlined style={{ fontSize: '10px' }} />}
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
