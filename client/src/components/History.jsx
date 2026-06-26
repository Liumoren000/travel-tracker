import { useState, useEffect } from 'react';
import { List, Button, Tag, message, Empty, Spin } from 'antd';
import { HistoryOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from '../hooks/useLanguage';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

const History = ({ onLoadRoute }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/routes`, { timeout: 5000 });
      setRoutes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/routes/${id}`);
      if (response.data) {
        onLoadRoute(response.data);
        message.success(t('loadSuccess'));
      }
    } catch (error) {
      console.error('Failed to load route:', error);
      message.error(t('loadFailed'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/routes/${id}`);
      message.success(t('deleteSuccess'));
      fetchRoutes();
    } catch (error) {
      console.error('Failed to delete:', error);
      message.error(t('deleteFailed'));
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3><HistoryOutlined /> {t('history')}</h3>
        <Button size="small" onClick={fetchRoutes}>{t('refresh')}</Button>
      </div>

      <Spin spinning={loading}>
        {!Array.isArray(routes) || routes.length === 0 ? (
          <Empty description={t('noHistory')} />
        ) : (
          <List
            size="small"
            dataSource={routes}
            renderItem={(route) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handleView(route.id)}
                  >
                    {t('view')}
                  </Button>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDelete(route.id)}
                  >
                    {t('delete')}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={route.name || '未命名路线'}
                  description={
                    <div>
                      <div>{formatDate(route.created_at)}</div>
                      <div>
                        {Array.isArray(route.cities) && route.cities.map((city, i) => (
                          <Tag key={i} color={i === 0 ? 'green' : i === route.cities.length - 1 ? 'red' : 'blue'}>
                            {city.name || '未知'}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  );
};

export default History;
