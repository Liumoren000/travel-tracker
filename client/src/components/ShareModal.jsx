import { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Button, message, Space, Tag, QRCode } from 'antd';
import { CopyOutlined, LinkOutlined, ExportOutlined } from '@ant-design/icons';
import { buildShareUrl, buildShareAllUrl, estimateShareUrlLength } from '../utils/routeShare';

const ShareModal = ({ open, route, routes, onClose }) => {
  // routes 优先于 route
  const allRoutes = useMemo(() => {
    if (Array.isArray(routes) && routes.length > 0) return routes;
    if (route) return [route];
    return [];
  }, [route, routes]);

  const isMulti = allRoutes.length > 1;

  const [url, setUrl] = useState('');
  const [urlLength, setUrlLength] = useState(0);

  useEffect(() => {
    if (open && allRoutes.length > 0) {
      const shareUrl = isMulti
        ? buildShareAllUrl(allRoutes)
        : buildShareUrl(allRoutes[0]);
      setUrl(shareUrl || '');
      setUrlLength(estimateShareUrlLength(isMulti ? allRoutes : allRoutes[0]));
    }
  }, [open, allRoutes, isMulti]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      message.success('链接已复制到剪贴板');
    } catch (err) {
      const input = document.getElementById('share-url-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        message.success('链接已复制');
      } else {
        message.error('复制失败, 请手动复制');
      }
    }
  };

  const handleOpen = () => {
    if (url) window.open(url, '_blank');
  };

  if (allRoutes.length === 0) return null;

  const tooLong = urlLength > 2000;

  const totalCities = allRoutes.reduce((sum, r) => sum + (r.cities?.length || 0), 0);

  return (
    <Modal
      title={<Space><LinkOutlined />分享{isMulti ? '所有路线' : '路线'}</Space>}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>关闭</Button>
      ]}
      width={520}
    >
      <div style={{ marginBottom: 16 }}>
        <Space size="small" wrap>
          <Tag color="blue">{allRoutes.length} 条路线</Tag>
          <Tag color="cyan">{totalCities} 个城市</Tag>
        </Space>

        <div style={{ marginTop: 12, maxHeight: 200, overflowY: 'auto' }}>
          {allRoutes.map((r, i) => {
            const cityNames = r.cities?.map(c => c.name).join(' → ') || '';
            return (
              <div
                key={i}
                style={{
                  padding: '8px 10px',
                  marginBottom: 6,
                  background: '#fafafa',
                  borderRadius: 4,
                  borderLeft: `3px solid ${r.color || '#1890ff'}`
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  {r.name || `线路 ${i + 1}`}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                  {r.cities?.length || 0} 城市 · {cityNames}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 12, fontWeight: 500 }}>分享链接</div>
      <Input.Group compact>
        <Input
          id="share-url-input"
          value={url}
          readOnly
          style={{ width: 'calc(100% - 180px)' }}
          onFocus={(e) => e.target.select()}
        />
        <Button
          type="primary"
          icon={<CopyOutlined />}
          onClick={handleCopy}
          style={{ width: 90 }}
        >
          复制
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={handleOpen}
          style={{ width: 90 }}
        >
          打开
        </Button>
      </Input.Group>

      <div style={{ marginTop: 8, fontSize: 12, color: tooLong ? '#ff4d4f' : '#999' }}>
        链接长度: {urlLength} 字符
        {tooLong && ' (过长, 部分聊天工具可能截断)'}
      </div>

      {url && !tooLong && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>扫码分享</div>
          <div style={{ display: 'inline-block', padding: 8, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <QRCode value={url} size={140} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4, fontSize: 12, color: '#666' }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>使用说明:</div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>链接包含所有路线的完整数据, 无需服务器存储</li>
          <li>打开链接将一次性导入地图上的全部路线</li>
          <li>支持中文和英文城市名</li>
        </ul>
      </div>
    </Modal>
  );
};

export default ShareModal;