import { useEffect, useRef, useState, useCallback } from 'react';
import { message } from 'antd';

const RouteAnimation = ({ map, route, onAnimationEnd }) => {
  const animationRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentIndexRef = useRef(0);
  const pointsRef = useRef([]);

  // 初始化动画图层
  useEffect(() => {
    if (!map) return;

    // 创建移动标记
    const icon = L.divIcon({
      className: 'animation-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background: #ff4d4f;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(255, 77, 79, 0.6);
        animation: pulse 1s infinite;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    markerRef.current = L.marker([0, 0], { icon, interactive: false, zIndex: 1001 }).addTo(map);
    markerRef.current.setOpacity(0);

    // 创建动画轨迹线
    polylineRef.current = L.polyline([], {
      color: '#ff4d4f',
      weight: 5,
      opacity: 0.9
    }).addTo(map);

    return () => {
      stopAnimation();
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    };
  }, [map]);

  // 当选择的路线变化时，准备动画数据
  useEffect(() => {
    if (!route || !route.coordinates || route.coordinates.length === 0) {
      pointsRef.current = [];
      stopAnimation();
      markerRef.current?.setOpacity(0);
      return;
    }

    pointsRef.current = route.coordinates;
    currentIndexRef.current = 0;
    setProgress(0);
    
    // 显示起点标记
    markerRef.current?.setLatLng(route.coordinates[0]);
    markerRef.current?.setOpacity(1);
    polylineRef.current?.setLatLngs([]);
  }, [route]);

  // 动画播放
  const animate = useCallback(() => {
    const points = pointsRef.current;
    if (points.length === 0) return;

    const speed = 30; // 毫秒/点
    let index = currentIndexRef.current;

    const step = () => {
      if (index >= points.length) {
        setIsPlaying(false);
        message.success('动画播放完成');
        onAnimationEnd?.();
        return;
      }

      const point = points[index];
      markerRef.current?.setLatLng(point);
      
      // 逐渐延伸轨迹线
      const currentPath = points.slice(0, index + 1);
      polylineRef.current?.setLatLngs(currentPath);
      
      // 更新进度
      currentIndexRef.current = index;
      setProgress(Math.round((index / (points.length - 1)) * 100));
      
      // 跟随视角
      map.panTo(point, { animate: false });
      
      index++;
      animationRef.current = setTimeout(step, speed);
    };

    step();
  }, [map, onAnimationEnd]);

  // 播放动画
  const playAnimation = useCallback(() => {
    const points = pointsRef.current;
    if (points.length === 0) {
      message.warning('没有可播放的路线');
      return;
    }

    // 如果播放到末尾，从头开始
    if (currentIndexRef.current >= points.length - 1) {
      currentIndexRef.current = 0;
      polylineRef.current?.setLatLngs([]);
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
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    currentIndexRef.current = 0;
    setProgress(0);
    polylineRef.current?.setLatLngs([]);
  }, []);

  // 重置动画
  const resetAnimation = useCallback(() => {
    stopAnimation();
    const points = pointsRef.current;
    if (points.length > 0) {
      markerRef.current?.setLatLng(points[0]);
      polylineRef.current?.setLatLngs([]);
      map.setView(points[0], 6);
    }
  }, [stopAnimation, map]);

  // 暴露控制方法
  useEffect(() => {
    if (map) {
      map._routeAnimation = {
        play: playAnimation,
        pause: pauseAnimation,
        stop: stopAnimation,
        reset: resetAnimation,
        isPlaying: () => isPlaying,
        getProgress: () => progress
      };
    }
  }, [map, playAnimation, pauseAnimation, stopAnimation, resetAnimation, isPlaying, progress]);

  return null; // 纯逻辑组件，不渲染UI
};

export default RouteAnimation;
