const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.post('/', (req, res) => {
  try {
    const { name, cities, coordinates } = req.body;

    if (!name || !cities || cities.length < 2) {
      return res.status(400).json({ error: '请提供有效的路线名称和至少两个城市' });
    }

    const stmt = db.prepare('INSERT INTO routes (name, cities, coordinates) VALUES (?, ?, ?)');
    const result = stmt.run(name, JSON.stringify(cities), JSON.stringify(coordinates || []));

    res.json({
      id: result.lastInsertRowid,
      name,
      cities,
      coordinates,
      message: '路线保存成功'
    });
  } catch (error) {
    console.error('保存路线失败:', error);
    res.status(500).json({ error: '保存路线失败' });
  }
});

router.get('/', (req, res) => {
  try {
    const routes = db.prepare('SELECT * FROM routes ORDER BY created_at DESC').all();

    const formattedRoutes = routes.map(route => ({
      ...route,
      cities: JSON.parse(route.cities),
      coordinates: JSON.parse(route.coordinates || '[]')
    }));

    res.json(formattedRoutes);
  } catch (error) {
    console.error('获取路线列表失败:', error);
    res.status(500).json({ error: '获取路线列表失败' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const route = db.prepare('SELECT * FROM routes WHERE id = ?').get(id);

    if (!route) {
      return res.status(404).json({ error: '路线不存在' });
    }

    res.json({
      ...route,
      cities: JSON.parse(route.cities),
      coordinates: JSON.parse(route.coordinates || '[]')
    });
  } catch (error) {
    console.error('获取路线详情失败:', error);
    res.status(500).json({ error: '获取路线详情失败' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM routes WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: '路线不存在' });
    }

    res.json({ message: '路线删除成功' });
  } catch (error) {
    console.error('删除路线失败:', error);
    res.status(500).json({ error: '删除路线失败' });
  }
});

module.exports = router;
