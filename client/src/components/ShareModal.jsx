import { useState, useEffect } from 'react';
import { Modal, Input, Button, message, Space, Tag, QRCode } from 'antd';
import { CopyOutlined, LinkOutlined, ExportOutlined } from '@ant-design/icons';
import { buildShareUrl, encodeRoute, estimateShareUrlLength } from '../utils/routeShare';

const ShareModal = ({ open, route, onClose }) => {
  const [url, setUrl] = useState('');
  const [urlLength, setUrlLength] = useState(0);

  useEffect(() => {
    if (open && route) {
      const shareUrl = buildShareUrl(route);
      setUrl(shareUrl || '');
      setUrlLength(estimateShareUrlLength(route));
    }
  }, [open, route]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      message.success('链接已复制到剪贴板');
    } catch (err) {
      // 降级方案: 选中文本
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

  if (!route) return null;

  const cityCount = route.cities?.length || 0;
  const cityList = route.cities?.map(c => c.name).join(' → ') || '';
  const tooLong = urlLength > 2000;

  return (
    <Modal
      title={<Space><LinkOutlined />分享路线</Space>}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>关闭</Button>
      ]}
      width={520}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
          {route.name || '未命名路线'}
        </div>
        <Space size="small" wrap>
          <Tag color="blue">{cityCount} 个城市</Tag>
          {route.mode && <Tag>{route.mode === 'driving' ? '驾车' : route.mode === 'flight' ? '飞行' : route.mode === 'train' ? '火车' : '步行'}</Tag>}
        </Space>
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
          {cityList}
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
          <li>任何人打开此链接都能看到这条路线</li>
          <li>链接包含完整路线数据, 无需服务器存储</li>
          <li>支持中文和英文城市名</li>
        </ul>
      </div>
    </Modal>
  );
};

export default ShareModal;