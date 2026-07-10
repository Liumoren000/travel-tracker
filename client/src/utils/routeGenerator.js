// 路线生成工具 - 使用 OSRM 生成真实道路路径, 失败时降级为直线
import axios from 'axios';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';
const STRAIGHT_LINE_STEPS = 20;
const REQUEST_TIMEOUT = 10000;

function buildStraightLine(from, to) {
  const segCoords = [];
  for (let s = 0; s <= STRAIGHT_LINE_STEPS; s++) {
    const lat = from.lat + (to.lat - from.lat) * (s / STRAIGHT_LINE_STEPS);
    const lng = from.lng + (to.lng - from.lng) * (s / STRAIGHT_LINE_STEPS);
    segCoords.push([lat, lng]);
  }
  return segCoords;
}

// 仅生成直线轨迹 (不调用 OSRM, 快速可靠)
export async function generateStraightPath(cities, defaultMode = 'driving') {
  if (!Array.isArray(cities) || cities.length < 2) {
    return { coordinates: [], segments: [], osrmCount: 0, straightCount: 0 };
  }

  const valid = cities.filter(c => c && typeof c.lat === 'number' && typeof c.lng === 'number');
  if (valid.length < 2) {
    return { coordinates: [], segments: [], osrmCount: 0, straightCount: 0 };
  }

  let allCoords = [];
  const segments = [];

  for (let i = 0; i < valid.length - 1; i++) {
    const from = valid[i];
    const to = valid[i + 1];
    const mode = to.mode || from.mode || defaultMode;
    const segCoords = buildStraightLine(from, to);

    if (i === 0) {
      allCoords = [...segCoords];
    } else {
      allCoords = [...allCoords, ...segCoords.slice(1)];
    }

    segments.push({
      from: from.name,
      to: to.name,
      mode,
      coordinates: segCoords
    });
  }

  return { coordinates: allCoords, segments, osrmCount: 0, straightCount: valid.length - 1 };
}

async function fetchOSRMSegment(from, to, mode) {
  const profile = mode === 'walking' ? 'foot' : 'driving';
  const coordinates = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const response = await axios.get(
    `${OSRM_BASE}/${profile}/${coordinates}?overview=full&geometries=geojson`,
    { timeout: REQUEST_TIMEOUT }
  );
  if (response.data.routes && response.data.routes.length > 0) {
    return response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
  }
  throw new Error('No route found');
}

// 为单个段生成坐标
async function generateSegmentCoords(from, to, mode) {
  if (mode === 'flight') {
    return { coords: buildStraightLine(from, to), viaOSRM: false };
  }
  try {
    const coords = await fetchOSRMSegment(from, to, mode);
    return { coords, viaOSRM: true };
  } catch (err) {
    return { coords: buildStraightLine(from, to), viaOSRM: false };
  }
}

// 为一条路线生成完整 coordinates 和 segments
// 返回 { coordinates, segments, osrmCount, straightCount }
export async function generateRoutePath(cities, defaultMode = 'driving') {
  if (!Array.isArray(cities) || cities.length < 2) {
    return { coordinates: [], segments: [], osrmCount: 0, straightCount: 0 };
  }

  const valid = cities.filter(c => c && typeof c.lat === 'number' && typeof c.lng === 'number');
  if (valid.length < 2) {
    return { coordinates: [], segments: [], osrmCount: 0, straightCount: 0 };
  }

  let allCoords = [];
  const segments = [];
  let osrmCount = 0;
  let straightCount = 0;

  for (let i = 0; i < valid.length - 1; i++) {
    const from = valid[i];
    const to = valid[i + 1];
    const mode = to.mode || from.mode || defaultMode;

    const { coords, viaOSRM } = await generateSegmentCoords(from, to, mode);
    if (viaOSRM) osrmCount++; else straightCount++;

    if (i === 0) {
      allCoords = [...coords];
    } else {
      allCoords = [...allCoords, ...coords.slice(1)];
    }

    segments.push({
      from: from.name,
      to: to.name,
      mode,
      coordinates: coords
    });
  }

  return { coordinates: allCoords, segments, osrmCount, straightCount };
}

// 为多条路线批量生成/修复轨迹
// - skipExisting: true 时跳过已有坐标的路线 (用于选择性修复)
export async function regenerateRoutes(routes, options = {}) {
  const { skipExisting = false, onProgress = null } = options;
  if (!Array.isArray(routes)) return [];

  const results = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    if (!route || !Array.isArray(route.cities) || route.cities.length < 2) {
      results.push(route);
      continue;
    }
    if (skipExisting && Array.isArray(route.coordinates) && route.coordinates.length > 0) {
      results.push(route);
      if (onProgress) onProgress(i + 1, routes.length, route);
      continue;
    }

    if (onProgress) onProgress(i, routes.length, route);

    try {
      const path = await generateRoutePath(route.cities, route.mode || 'driving');
      results.push({
        ...route,
        coordinates: path.coordinates,
        segments: path.segments
      });
    } catch (err) {
      console.warn('[routeGenerator] regenerate failed:', route.name, err);
      results.push(route);
    }

    if (onProgress) onProgress(i + 1, routes.length, route);
  }
  return results;
}