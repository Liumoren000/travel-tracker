import { useState, useRef, useCallback } from 'react';
import { Input, AutoComplete, Modal, Radio } from 'antd';
import { SearchOutlined, CarOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CITIES_DATABASE } from '../data/citiesDatabase';

const CitySearch = ({ onAddCity, isFirst }) => {
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const abortControllerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // 本地搜索函数
  const searchLocal = useCallback((query) => {
    const q = query.trim();
    if (!q) return [];
    
    // 搜索结果并排序
    const results = CITIES_DATABASE
      .filter(city => {
        const name = city.name.toLowerCase();
        const nameEn = city.nameEn.toLowerCase();
        const query = q.toLowerCase();
        
        // 完全匹配优先
        if (name === query || nameEn === query) return true;
        
        // 开头匹配
        if (name.startsWith(query) || nameEn.startsWith(query)) return true;
        
        // 包含匹配
        if (name.includes(query) || nameEn.includes(query)) return true;
        
        // 拼音首字母匹配（简单实现）
        const pinyinInitials = getInitials(city.nameEn);
        if (pinyinInitials.includes(query)) return true;
        
        return false;
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aNameEn = a.nameEn.toLowerCase();
        const bNameEn = b.nameEn.toLowerCase();
        const query = q.toLowerCase();
        
        // 完全匹配排最前
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;
        if (aNameEn === query && bNameEn !== query) return -1;
        if (bNameEn === query && aNameEn !== query) return 1;
        
        // 开头匹配排前面
        const aStartsWith = aName.startsWith(query) || aNameEn.startsWith(query);
        const bStartsWith = bName.startsWith(query) || bNameEn.startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (bStartsWith && !aStartsWith) return 1;
        
        return 0;
      })
      .slice(0, 12);
    
    return results.map(city => ({
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
  }, []);

  // 获取英文名首字母
  const getInitials = (nameEn) => {
    return nameEn.split(/[\s-]+/).map(word => word[0]?.toLowerCase() || '').join('');
  };

  // Nominatim API 搜索
  const searchNominatim = useCallback(async (query, signal) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&accept-language=zh`,
        { 
          timeout: 5000,
          signal,
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
      if (axios.isCancel(error)) {
        console.log('请求已取消');
      } else {
        console.warn('Nominatim 搜索失败:', error.message);
      }
      return [];
    }
  }, []);

  const searchCity = useCallback((value) => {
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || value.trim().length < 1) {
      setOptions([]);
      setLoading(false);
      return;
    }

    // 取消之前的 API 请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 立即显示本地搜索结果
    const localResults = searchLocal(value);
    setOptions(localResults);
    setLoading(true);

    // 创建新的 AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 同时发起 API 请求
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const nominatimResults = await searchNominatim(value, abortController.signal);
        
        // 检查请求是否被取消
        if (abortController.signal.aborted) return;
        
        // 合并结果，API 结果优先
        const allResults = [...nominatimResults];
        const existingNames = new Set(nominatimResults.map(r => r.value));
        
        // 添加本地结果（去重）
        for (const result of localResults) {
          if (!existingNames.has(result.value) && allResults.length < 15) {
            allResults.push(result);
            existingNames.add(result.value);
          }
        }

        setOptions(allResults);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('搜索失败:', error);
          // API 失败时保留本地结果
          setOptions(localResults);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 200);
  }, [searchLocal, searchNominatim]);

  const handleSelect = useCallback((value, option) => {
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
  }, [isFirst, onAddCity]);

  const handleConfirm = useCallback(() => {
    if (selectedCity) {
      onAddCity({ ...selectedCity, mode: selectedMode });
      setSearchText('');
      setOptions([]);
      setModalVisible(false);
      setSelectedCity(null);
    }
  }, [selectedCity, selectedMode, onAddCity]);

  const handleCancel = useCallback(() => {
    setModalVisible(false);
    setSelectedCity(null);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      searchCity(searchText);
    }
  }, [searchText, searchCity]);

  return (
    <div className="city-search">
      <AutoComplete
        value={searchText}
        options={options}
        onSearch={searchCity}
        onSelect={handleSelect}
        onChange={setSearchText}
        style={{ width: '100%' }}
        defaultActiveFirstOption={false}
        filterOption={false}
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
