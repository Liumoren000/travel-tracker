import { useState, useRef, useCallback } from 'react';
import { Input, Modal, Radio, Spin } from 'antd';
import { SearchOutlined, CarOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CITIES_DATABASE } from '../data/citiesDatabase';
import { useLanguage } from '../hooks/useLanguage';

const CitySearch = ({ onAddCity, isFirst }) => {
  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const { t } = useLanguage();

  // 搜索城市（本地 + API）
  const handleSearch = useCallback((value) => {
    setSearchText(value);
    
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 取消之前的 API 请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!value || value.trim().length < 1) {
      setOptions([]);
      setLoading(false);
      return;
    }

    const q = value.trim();

    // 立即显示本地搜索结果
    const localResults = CITIES_DATABASE
      .filter(city => {
        return city.name.includes(q) || 
               city.nameEn.toLowerCase().includes(q.toLowerCase());
      })
      .slice(0, 8)
      .map(city => ({
        name: city.name,
        nameEn: city.nameEn,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        source: 'local'
      }));
    
    setOptions(localResults);

    // 延迟调用 API 搜索（全球覆盖）
    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=10&accept-language=zh-CN,zh&addressdetails=1`,
          { 
            timeout: 5000,
            signal: abortController.signal,
            headers: { 'User-Agent': 'TravelTracker/1.0' }
          }
        );

        if (abortController.signal.aborted) return;

        const apiResults = response.data
          .filter(item => item.display_name)
          .map(item => {
            let cityName = '';
            if (item.address) {
              cityName = item.address.city || 
                         item.address.town || 
                         item.address.village || 
                         item.address.county || 
                         item.address.state || '';
            }
            if (!cityName) {
              cityName = item.display_name.split(',')[0].trim();
            }

            return {
              name: cityName,
              nameEn: '',
              country: item.address?.country || '',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              source: 'api'
            };
          })
          .filter(item => item.name && !item.name.match(/[а-яА-Я]/));

        // 合并结果，本地优先
        const allResults = [...localResults];
        const existingNames = new Set(localResults.map(r => r.name));

        for (const result of apiResults) {
          if (!existingNames.has(result.name) && allResults.length < 15) {
            allResults.push(result);
            existingNames.add(result.name);
          }
        }

        setOptions(allResults);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.warn('API search failed:', error.message);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 200);
  }, []);

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
          placeholder={t('searchPlaceholder')}
          suffix={loading ? <Spin size="small" /> : <SearchOutlined style={{ cursor: 'pointer' }} />}
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
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {options.map((option, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => handleSelect(option)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{option.name}</div>
                  {option.nameEn && (
                    <div style={{ fontSize: 12, color: '#999' }}>{option.nameEn}</div>
                  )}
                </div>
                {option.country && (
                  <div style={{ fontSize: 12, color: '#666' }}>{option.country}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={t('selectTransport')}
        open={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText={t('add')}
        cancelText={t('cancel')}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            {t('addCity')}：{selectedCity?.name}
          </div>
          <div style={{ color: '#666', marginBottom: 12, fontSize: 12 }}>
            {t('selectTransportDesc')}
          </div>
          <Radio.Group 
            value={selectedMode} 
            onChange={e => setSelectedMode(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <Radio value="driving">
              <CarOutlined /> {t('driving')}
            </Radio>
            <Radio value="train">
              <SendOutlined /> {t('train')}
            </Radio>
            <Radio value="flight">
              <GlobalOutlined /> {t('flight')}
            </Radio>
            <Radio value="walking">
              🚶 {t('walking')}
            </Radio>
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default CitySearch;
