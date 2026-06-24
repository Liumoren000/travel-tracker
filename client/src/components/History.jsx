import { useState, useEffect } from 'react';
import { List, Button, Tag, message, Empty, Spin } from 'antd';
import { HistoryOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

const History = ({ onLoadRoute }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/routes`, { timeout: 5000 });
      setRoutes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('获取历史记录失败:', error);
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
        message.success('路线加载成功');
      }
    } catch (error) {
      console.error('加载路线失败:', error);
      message.error('加载路线失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/routes/${id}`);
      message.success('删除成功');
      fetchRoutes();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
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
      return '未知时间';
    }
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3><HistoryOutlined /> 历史记录</h3>
        <Button size="small" onClick={fetchRoutes}>刷新</Button>
      </div>

      <Spin spinning={loading}>
        {!Array.isArray(routes) || routes.length === 0 ? (
          <Empty description="暂无历史记录" />
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
                    查看
                  </Button>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDelete(route.id)}
                  >
                    删除
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
