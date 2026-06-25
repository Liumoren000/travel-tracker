import { useState } from 'react';
import { Input, Modal, Radio } from 'antd';
import { SearchOutlined, CarOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import { CITIES_DATABASE } from '../data/citiesDatabase';

const CitySearch = ({ onAddCity, isFirst }) => {
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');

  // 本地搜索
  const handleSearch = (value) => {
    setSearchText(value);
    
    if (!value || value.trim().length < 1) {
      setOptions([]);
      return;
    }

    const q = value.trim();
    const results = CITIES_DATABASE
      .filter(city => {
        return city.name.includes(q) || 
               city.nameEn.toLowerCase().includes(q.toLowerCase());
      })
      .slice(0, 10)
      .map(city => ({
        name: city.name,
        nameEn: city.nameEn,
        country: city.country,
        lat: city.lat,
        lng: city.lng
      }));
    
    setOptions(results);
  };

  const handleSelect = (option) => {
    if (isFirst) {
      onAddCity({ name: option.name, lat: option.lat, lng: option.lng });
      setSearchText('');
      setOptions([]);
    } else {
      setSelectedCity({ name: option.name, lat: option.lat, lng: option.lng });
      setSelectedMode('driving');
      setModalVisible(true);
    }
  };

  const handleConfirm = () => {
    if (selectedCity) {
      onAddCity({ ...selectedCity, mode: selectedMode });
      setSearchText('');
      setOptions([]);
      setModalVisible(false);
      setSelectedCity(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedCity(null);
  };

  return (
    <div className="city-search">
      <div style={{ position: 'relative' }}>
        <Input
          placeholder="输入城市名称搜索..."
          suffix={<SearchOutlined style={{ cursor: 'pointer' }} />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {options.length > 0 && (
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
            {options.map((option, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => handleSelect(option)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                {option.name} ({option.nameEn}) - {option.country}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="选择交通方式"
        open={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            添加城市：{selectedCity?.name}
          </div>
          <div style={{ color: '#666', marginBottom: 12, fontSize: 12 }}>
            选择从前一个城市到达此城市的交通方式
          </div>
          <Radio.Group 
            value={selectedMode} 
            onChange={e => setSelectedMode(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <Radio value="driving">
              <CarOutlined /> 驾车 - 沿道路行驶
            </Radio>
            <Radio value="train">
              <SendOutlined /> 火车 - 铁路路线
            </Radio>
            <Radio value="flight">
              <GlobalOutlined /> 飞机 - 直线飞行
            </Radio>
            <Radio value="walking">
              🚶 步行 - 步行路线
            </Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default CitySearch;
