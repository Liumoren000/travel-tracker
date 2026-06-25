import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Slider, Space, message } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';

const RouteAnimation = ({ map, routes, currentRoute }) => {
  const animationRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const trailRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const currentIndexRef = useRef(0);
  const allPointsRef = useRef([]);

  // 收集所有路线的坐标点
  const collectAllPoints = useCallback(() => {
    const points = [];
    
    // 收集已保存路线的坐标
    if (routes && routes.length > 0) {
      routes.forEach(route => {
        if (route.coordinates && route.coordinates.length > 0) {
          points.push(...route.coordinates);
        }
      });
    }
    
    // 收集当前编辑路线的坐标
    if (currentRoute && currentRoute.coordinates && currentRoute.coordinates.length > 0) {
      points.push(...currentRoute.coordinates);
    }
    
    return points;
  }, [routes, currentRoute]);

  // 初始化动画
  useEffect(() => {
    if (!map) return;

    // 创建动画标记
    const icon = L.divIcon({
      className: 'animation-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background: #ff4d4f;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(255, 77, 79, 0.5);
        animation: pulse 1.5s infinite;
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    markerRef.current = L.marker([0, 0], { icon, interactive: false }).addTo(map);
    markerRef.current.setOpacity(0);

    // 创建轨迹尾迹
    trailRef.current = L.polyline([], {
      color: '#ff4d4f',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8'
    }).addTo(map);

    return () => {
      stopAnimation();
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (trailRef.current) {
        trailRef.current.remove();
      }
    };
  }, [map]);

  // 更新路线点
  useEffect(() => {
    const points = collectAllPoints();
    allPointsRef.current = points;
    setTotalPoints(points.length);
    
    if (points.length > 0) {
      markerRef.current?.setLatLng(points[0]);
      markerRef.current?.setOpacity(1);
      trailRef.current?.setLatLngs([]);
      currentIndexRef.current = 0;
      setProgress(0);
    } else {
      markerRef.current?.setOpacity(0);
    }
  }, [collectAllPoints]);

  // 动画播放
  const animate = useCallback(() => {
    const points = allPointsRef.current;
    if (points.length === 0) return;

    const speed = 50; // 毫秒/点
    let index = currentIndexRef.current;

    const step = () => {
      if (index >= points.length) {
        setIsPlaying(false);
        message.success('动画播放完成');
        return;
      }

      const point = points[index];
      markerRef.current?.setLatLng(point);
      
      // 更新尾迹
      const trail = points.slice(0, index + 1);
      trailRef.current?.setLatLngs(trail);
      
      // 更新进度
      currentIndexRef.current = index;
      setProgress(Math.round((index / (points.length - 1)) * 100));
      
      // 跟随视角
      map.panTo(point, { animate: true, duration: 0.3 });
      
      index++;
      animationRef.current = setTimeout(step, speed);
    };

    step();
  }, [map]);

  // 播放动画
  const playAnimation = useCallback(() => {
    const points = allPointsRef.current;
    if (points.length === 0) {
      message.warning('没有可播放的路线');
      return;
    }

    // 如果播放到末尾，从头开始
    if (currentIndexRef.current >= points.length - 1) {
      currentIndexRef.current = 0;
      trailRef.current?.setLatLngs([]);
      setProgress(0);
    }

    setIsPlaying(true);
    animate();
  }, [animate]);

  // 暂停动画
  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // 停止动画
  const stopAnimation = useCallback(() => {
    pauseAnimation();
    currentIndexRef.current = 0;
    setProgress(0);
    trailRef.current?.setLatLngs([]);
    
    const points = allPointsRef.current;
    if (points.length > 0) {
      markerRef.current?.setLatLng(points[0]);
    }
  }, [pauseAnimation]);

  // 重置动画
  const resetAnimation = useCallback(() => {
    stopAnimation();
    const points = allPointsRef.current;
    if (points.length > 0) {
      markerRef.current?.setLatLng(points[0]);
      map.setView(points[0], 10);
    }
  }, [stopAnimation, map]);

  // 进度条拖动
  const handleProgressChange = useCallback((value) => {
    const points = allPointsRef.current;
    if (points.length === 0) return;

    pauseAnimation();
    
    const index = Math.round((value / 100) * (points.length - 1));
    currentIndexRef.current = index;
    setProgress(value);
    
    markerRef.current?.setLatLng(points[index]);
    trailRef.current?.setLatLngs(points.slice(0, index + 1));
    map.panTo(points[index], { animate: true });
  }, [pauseAnimation, map]);

  if (totalPoints === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '8px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px'
    }}>
      <Space size="small">
        <Button
          type="primary"
          shape="circle"
          icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
          onClick={isPlaying ? pauseAnimation : playAnimation}
          size="small"
        />
        <Button
          shape="circle"
          icon={<ReloadOutlined />}
          onClick={resetAnimation}
          size="small"
          title="重置"
        />
      </Space>
      
      <Slider
        value={progress}
        onChange={handleProgressChange}
        style={{ flex: 1, margin: '0 8px' }}
        tooltip={{ formatter: (val) => `${val}%` }}
      />
      
      <span style={{ fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
        {totalPoints} 点
      </span>
    </div>
  );
};

export default RouteAnimation;
