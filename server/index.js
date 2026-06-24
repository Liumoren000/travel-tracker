const express = require('express');
const cors = require('cors');
const routesRouter = require('./routes/routes');
const geocodingRouter = require('./routes/geocoding');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/routes', routesRouter);
app.use('/api/geocoding', geocodingRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
