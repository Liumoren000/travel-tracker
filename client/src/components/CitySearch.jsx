import { useState } from 'react';
import { Input, AutoComplete, Modal, Radio } from 'antd';
import { SearchOutlined, CarOutlined, GlobalOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CITIES_DATABASE } from '../data/citiesDatabase';

const CitySearch = ({ onAddCity, isFirst }) => {
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');

  // 本地搜索函数
  const searchLocal = (query) => {
    const q = query.toLowerCase();
    return CITIES_DATABASE
      .filter(city => 
        city.name.toLowerCase().includes(q) || 
        city.nameEn.toLowerCase().includes(q)
      )
      .slice(0, 10)
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
  };

  // Nominatim API 搜索
  const searchNominatim = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&accept-language=zh`,
        { 
          timeout: 5000,
          headers: {
            'User-Agent': 'TravelTracker/1.0'
          }
        }
      );

      return response.data.map(item => ({
        value: item.display_name.split(',')[0],
        label: (
          <div className="search-option">
            <span>{item.display_name.split(',').slice(0, 2).join(',')}</span>
          </div>
        ),
        data: {
          name: item.display_name.split(',')[0],
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));
    } catch (error) {
      console.warn('Nominatim 搜索失败:', error.message);
      return [];
    }
  };

  const searchCity = async (value) => {
    if (!value || value.length < 1) {
      setOptions([]);
      return;
    }

    setLoading(true);
    
    // 首先尝试本地搜索
    const localResults = searchLocal(value);
    
    // 同时发起 Nominatim 搜索
    const nominatimResults = await searchNominatim(value);
    
    // 合并结果，本地结果优先
    const allResults = [...localResults];
    const existingNames = new Set(localResults.map(r => r.value));
    
    for (const result of nominatimResults) {
      if (!existingNames.has(result.value) && allResults.length < 15) {
        allResults.push(result);
        existingNames.add(result.value);
      }
    }

    setOptions(allResults);
    setLoading(false);
  };

  const handleSelect = (value, option) => {
    if (isFirst) {
      // First city doesn't need transport mode
      onAddCity(option.data);
      setSearchText('');
      setOptions([]);
    } else {
      // Show transport mode selection
      setSelectedCity(option.data);
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

  const handleSearch = () => {
    if (searchText.trim()) {
      searchCity(searchText);
    }
  };

  return (
    <div className="city-search">
      <AutoComplete
        value={searchText}
        options={options}
        onSearch={searchCity}
        onSelect={handleSelect}
        onChange={setSearchText}
        style={{ width: '100%' }}
      >
        <Input
          placeholder="输入城市名称搜索..."
          suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
          onPressEnter={handleSearch}
          loading={loading || undefined}
        />
      </AutoComplete>

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
