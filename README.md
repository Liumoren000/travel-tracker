# 自由轨迹 - 旅行轨迹网页

一个可以记录和展示旅行轨迹的网页应用，支持多城市连续轨迹、多种交通方式、地图样式切换和 GPX 文件导入导出。

## 功能特点

### 核心功能
- 🔍 **智能城市搜索**：本地数据库（600+ 城市）+ Nominatim API 全球覆盖
- 🗺️ **多城市轨迹**：支持 A→B→C 连续路线规划
- 🚗 **多种交通方式**：驾车、飞机、步行三种模式
- 💾 **轨迹保存**：保存到 SQLite 数据库，支持历史记录
- 📊 **国家城市统计**：自动统计访问的国家和城市数量
- 📏 **距离计算**：显示总距离和各段距离

### 地图功能
- 🛰️ **多种地图样式**：标准、卫星、地形、暗色主题
- 🖱️ **地图点击添加**：直接在地图上点击添加城市
- 📍 **线路详情**：点击线路查看距离和交通方式
- 🖼️ **导出图片**：将地图轨迹导出为 PNG 图片

### 数据管理
- 📤 **GPX 导出**：导出标准 GPX 文件，可在 Google Earth 等软件中打开
- 📥 **GPX 导入**：导入 GPX 文件，自动添加到地图
- ✏️ **线路编辑**：支持编辑、删除、移动城市顺序
- 🔄 **自动同步**：支持代码修改后自动同步到 GitHub

### 界面特性
- 📱 **响应式设计**：支持桌面和移动端
- 🎨 **可折叠侧边栏**：最大化地图显示区域
- 🖱️ **可拖动统计栏**：自由调整统计信息位置
- 🌙 **暗色主题**：地图支持暗色模式

## 技术栈

### 前端
- React 19
- Vite 8
- Leaflet + OpenStreetMap
- Ant Design 6
- Axios

### 后端
- Node.js
- Express
- SQLite (better-sqlite3)

## 安装和运行

### 1. 安装前端依赖

```bash
cd client
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
```

### 3. 启动后端服务器

```bash
cd server
npm start
```

服务器将在 http://localhost:3001 启动

### 4. 启动前端开发服务器

```bash
cd client
npm run dev
```

前端将在 http://localhost:5173 启动

## 使用说明

### 基本操作

1. **搜索城市**：在搜索框输入城市名称（中文或英文），从下拉列表选择
2. **选择交通方式**：添加第二个城市时，选择到达该城市的交通方式
3. **生成轨迹**：点击"生成轨迹"按钮查看路线
4. **添加到地图**：点击"添加到地图"将路线显示在地图上
5. **保存路线**：点击"保存路线"将路线保存到数据库

### 地图操作

- **切换地图样式**：点击左下角地球图标，选择标准/卫星/地形/暗色主题
- **查看线路详情**：点击地图上的线路，查看距离和交通方式
- **导出图片**：点击右上角"导出图片"按钮
- **折叠侧边栏**：点击左下角箭头图标

### 数据导入导出

- **导出 GPX**：在侧边栏点击"导出"按钮
- **导入 GPX**：在侧边栏点击"导入"按钮，选择 .gpx 文件

### 快捷操作

- **地图点击添加**：点击"开启地图点击添加"按钮，然后在地图上点击添加城市
- **拖动统计栏**：按住统计栏左侧拖动手柄移动位置
- **编辑线路**：点击线路详情中的"编辑线路"按钮

## API 接口

- `POST /api/routes` - 保存轨迹
- `GET /api/routes` - 获取历史轨迹列表
- `GET /api/routes/:id` - 获取单个轨迹详情
- `DELETE /api/routes/:id` - 删除轨迹
- `GET /api/geocoding/search?q=城市名` - 搜索城市

## 项目结构

```
自由轨迹/
├── client/                    # React 前端
│   ├── src/
│   │   ├── components/        # 组件
│   │   │   ├── Map.jsx        # 地图组件
│   │   │   ├── CitySearch.jsx # 城市搜索
│   │   │   ├── RouteList.jsx  # 路线列表
│   │   │   ├── History.jsx    # 历史记录
│   │   │   └── Statistics.jsx # 统计信息
│   │   ├── data/
│   │   │   └── citiesDatabase.js  # 城市数据库（600+ 城市）
│   │   ├── hooks/
│   │   │   └── useStatistics.js   # 统计逻辑
│   │   ├── services/
│   │   │   └── countryCache.js    # 国家缓存服务
│   │   ├── utils/
│   │   │   ├── distance.js    # 距离计算
│   │   │   └── gpx.js         # GPX 导入导出
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                    # Node.js 后端
│   ├── routes/               # API 路由
│   │   ├── routes.js         # 路线 API
│   │   └── geocoding.js      # 地理编码 API
│   ├── db/                   # 数据库
│   │   └── init.js           # 数据库初始化
│   ├── index.js
│   └── package.json
├── auto-sync.sh              # 自动同步脚本
├── Dockerfile                # Docker 配置
├── docker-compose.yml        # Docker Compose 配置
├── nginx.conf                # Nginx 配置
└── README.md
```

## 部署

### Vercel + Railway 部署

1. 后端部署到 Railway：参见 `VERCEL_RAILWAY_DEPLOY.md`
2. 前端部署到 Vercel：
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 环境变量：`VITE_API_BASE=https://your-railway-domain/api`

### Docker 部署

```bash
docker-compose up -d
```

## 自动同步

运行自动同步脚本，代码修改后自动推送到 GitHub：

```bash
./auto-sync.sh
```

## 许可证

MIT License
