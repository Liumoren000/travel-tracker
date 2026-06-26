# 自由轨迹 - Travel Tracker

一个可以记录和展示旅行轨迹的网页应用，支持多城市连续轨迹、多种交通方式、地图样式切换和 GPX 文件导入导出。

[English](#english) | [中文](#功能特点)

## 功能特点

### 核心功能
- 🔍 **智能城市搜索**：本地数据库（530+ 城市）+ Nominatim API 全球覆盖
- 🗺️ **多城市轨迹**：支持 A→B→C 连续路线规划
- 🚗 **多种交通方式**：驾车、火车、飞机、步行四种模式
- 💾 **轨迹保存**：保存到 SQLite 数据库，支持历史记录
- 📊 **国家城市统计**：自动统计访问的国家和城市数量
- 📏 **距离计算**：显示总距离和各段距离

### 地图功能
- 🛰️ **多种地图样式**：标准、卫星、地形、暗色主题
- 🖱️ **地图点击添加**：直接在地图上点击添加城市
- 📍 **线路详情**：点击线路查看距离、交通方式和城市列表
- 🖼️ **导出图片**：将地图轨迹导出为 PNG 图片
- ➡️ **轨迹方向箭头**：在轨迹线上显示方向箭头
- 🎯 **宽点击区域**：轨迹线支持宽范围点击，易于选中

### 城市信息
- 🏙️ **城市详情**：Wikipedia API 获取全球城市简介、图片
- 🌤️ **天气信息**：显示目的地当前天气和未来3天预报

### 机票查询
- ✈️ **实时机票价格**：点击飞机段轨迹，跳转到携程/飞猪/去哪儿/Google Flights 查询
- 🔗 **一键跳转**：支持多个平台比价

### 旅行统计
- 📊 **统计图表**：饼图/柱状图展示旅行数据
- 🌍 **国家分布**：饼图显示各国家访问城市占比
- 🚗 **交通方式**：饼图显示各交通方式使用占比
- 📏 **路线距离**：柱状图显示各路线距离排名
- 🏙️ **城市统计**：横向柱状图显示各国家城市数量

### 数据管理
- 📤 **GPX 导出**：导出标准 GPX 文件，可在 Google Earth 等软件中打开
- 📥 **GPX 导入**：导入 GPX 文件，自动添加到地图
- ✏️ **线路编辑**：支持编辑城市名称、删除、移动城市顺序
- 🚂 **交通方式编辑**：编辑线路时可修改每个城市的交通方式
- 🎨 **200+ 线路颜色**：支持 200 种可区分颜色，避免线路重色

### 界面特性
- 📱 **响应式设计**：支持桌面和移动端，适配手机和平板
- 🎨 **可折叠侧边栏**：最大化地图显示区域
- 🖱️ **可拖动统计栏**：自由调整统计信息位置
- 🌙 **深色模式**：整个界面支持深色主题（包括弹窗、图表、输入框）
- 🌐 **多语言支持**：支持中文和英文界面

## English

### Core Features
- 🔍 **Smart City Search**: Local database (530+ cities) + Nominatim API global coverage
- 🗺️ **Multi-city Routes**: A→B→C continuous route planning
- 🚗 **Multiple Transport Modes**: Driving, Train, Flight, Walking
- 💾 **Route Saving**: SQLite database with history records
- 📊 **Country & City Statistics**: Auto-count visited countries and cities
- 📏 **Distance Calculation**: Total distance and segment distances

### Map Features
- 🛰️ **Multiple Map Styles**: Standard, Satellite, Terrain, Dark theme
- 🖱️ **Map Click Add**: Click map to add city locations
- 📍 **Route Details**: Click routes to view distance, transport mode, cities
- 🖼️ **Export Image**: Export map as PNG image
- ➡️ **Route Arrows**: Direction arrows on route lines
- 🎯 **Wide Click Area**: Easy to click on route lines

### City Information
- 🏙️ **City Details**: Wikipedia API for city descriptions and images
- 🌤️ **Weather Info**: Current weather and 3-day forecast

### Flight Search
- ✈️ **Real Flight Prices**: Click flight segments to query prices
- 🔗 **One-click Redirect**: Ctrip/Fliggy/Qunar/Google Flights

### Travel Statistics
- 📊 **Statistics Charts**: Pie/bar charts for travel data
- 🌍 **Country Distribution**: Pie chart of cities by country
- 🚗 **Transport Modes**: Pie chart of transport mode usage
- 📏 **Route Distance**: Bar chart of route distances
- 🏙️ **City Statistics**: Horizontal bar chart of cities by country

### Data Management
- 📤 **GPX Export**: Export standard GPX files
- 📥 **GPX Import**: Import GPX files to map
- ✏️ **Route Editing**: Edit city names, delete, reorder
- 🚂 **Transport Mode**: Edit transport mode per city
- 🎨 **200+ Route Colors**: 200 distinguishable colors to avoid duplicates

### Interface
- 📱 **Responsive Design**: Desktop and mobile support
- 🎨 **Collapsible Sidebar**: Maximize map area
- 🖱️ **Draggable Stats**: Move statistics panel freely
- 🌙 **Dark Mode**: Full dark theme (including modals, charts, inputs)
- 🌐 **Multi-language**: Chinese and English UI

## 技术栈 / Tech Stack

### 前端 / Frontend
- React 19
- Vite 8
- Leaflet + OpenStreetMap
- Ant Design 6
- Recharts (图表)
- Axios

### 后端 / Backend
- Node.js
- Express
- SQLite (better-sqlite3)

### 外部 API / External APIs
- OpenStreetMap Nominatim - 地理编码 / Geocoding
- Open-Meteo - 天气信息 / Weather
- Wikipedia - 城市详情 / City Details
- OSRM - 路线规划 / Route Planning

## 安装和运行 / Getting Started

### 1. 安装前端依赖 / Install Frontend

```bash
cd client
npm install
```

### 2. 安装后端依赖 / Install Backend

```bash
cd server
npm install
```

### 3. 启动后端服务器 / Start Backend

```bash
cd server
npm start
```

服务器将在 http://localhost:3001 启动

### 4. 启动前端开发服务器 / Start Frontend

```bash
cd client
npm run dev
```

前端将在 http://localhost:5173 启动

## 使用说明 / Usage

### 基本操作 / Basic Operations

1. **搜索城市**：在搜索框输入城市名称（中文或英文），从下拉列表选择
2. **选择交通方式**：添加第二个城市时，选择到达该城市的交通方式
3. **生成轨迹**：点击"生成轨迹"按钮查看路线
4. **添加到地图**：点击"添加到地图"将路线显示在地图上
5. **保存路线**：点击"保存路线"将路线保存到数据库

### 地图操作 / Map Operations

- **切换地图样式**：点击左下角地球图标，选择标准/卫星/地形/暗色主题
- **查看线路详情**：点击地图上的线路，查看距离、交通方式
- **查询机票价格**：点击飞机段轨迹，跳转到携程/飞猪/去哪儿查询
- **查看城市详情**：点击城市标记，查看 Wikipedia 信息和天气
- **折叠侧边栏**：点击左下角箭头图标

### 界面设置 / Interface Settings

- **深色模式**：点击标题栏 🌙/☀️ 按钮切换
- **语言切换**：点击标题栏 EN/中 按钮切换中英文
- **旅行统计**：点击侧边栏"统计"按钮查看图表

### 数据导入导出 / Import & Export

- **导出 GPX**：在侧边栏点击"导出"按钮
- **导入 GPX**：在侧边栏点击"导入"按钮，选择 .gpx 文件
- **导出图片**：点击右上角"导出图片"按钮

## API 接口 / API Endpoints

- `POST /api/routes` - 保存轨迹 / Save route
- `GET /api/routes` - 获取历史轨迹 / Get history routes
- `GET /api/routes/:id` - 获取轨迹详情 / Get route detail
- `DELETE /api/routes/:id` - 删除轨迹 / Delete route
- `GET /api/geocoding/search?q=城市名` - 搜索城市 / Search city

## 项目结构 / Project Structure

```
自由轨迹/
├── client/                        # React 前端
│   ├── src/
│   │   ├── components/            # 组件
│   │   │   ├── Map.jsx            # 地图组件
│   │   │   ├── CitySearch.jsx     # 城市搜索
│   │   │   ├── RouteList.jsx      # 路线列表
│   │   │   ├── History.jsx        # 历史记录
│   │   │   ├── Statistics.jsx     # 统计信息
│   │   │   ├── CityInfoModal.jsx  # 城市详情弹窗
│   │   │   └── TravelStatsModal.jsx # 旅行统计图表
│   │   ├── data/
│   │   │   ├── citiesDatabase.js  # 城市数据库（530+ 城市）
│   │   │   └── cityDetails.js     # 城市详情数据库（146 城市）
│   │   ├── hooks/
│   │   │   ├── useStatistics.js   # 统计逻辑
│   │   │   ├── useTheme.jsx       # 深色模式
│   │   │   └── useLanguage.jsx    # 多语言
│   │   ├── i18n/
│   │   │   └── translations.js    # 翻译文件
│   │   ├── services/
│   │   │   ├── countryCache.js    # 国家缓存服务
│   │   │   ├── weather.js         # 天气 API 服务
│   │   │   └── wikipedia.js       # Wikipedia API 服务
│   │   ├── utils/
│   │   │   ├── distance.js        # 距离计算
│   │   │   ├── gpx.js             # GPX 导入导出
│   │   │   └── flightLinks.js     # 机票查询链接
│   │   ├── theme.css              # 深色模式样式
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                        # Node.js 后端
│   ├── routes/                   # API 路由
│   │   ├── routes.js             # 路线 API
│   │   └── geocoding.js          # 地理编码 API
│   ├── db/                       # 数据库
│   │   └── init.js               # 数据库初始化
│   ├── index.js
│   └── package.json
├── auto-sync.sh                  # 自动同步脚本
├── Dockerfile                    # Docker 配置
├── docker-compose.yml            # Docker Compose 配置
├── nginx.conf                    # Nginx 配置
└── README.md
```

## 部署 / Deployment

### Vercel + Railway 部署

1. 后端部署到 Railway：参见 `VERCEL_RAILWAY_DEPLOY.md`
2. 前端部署到 Vercel：
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 环境变量：`VITE_API_BASE=https://your-railway-domain/api`

### Docker 部署 / Docker Deployment

```bash
docker-compose up -d
```

## 自动同步 / Auto Sync

运行自动同步脚本，代码修改后自动推送到 GitHub：

```bash
./auto-sync.sh
```

## 更新日志 / Changelog

### v1.10.0 (2026-06-25)
- ✨ 线路颜色扩展到 200+ 种，避免线路重色
- ✨ 颜色按色系分类（红、橙、黄、绿、青、蓝、紫、粉、棕、灰）

### v1.9.0 (2026-06-25)
- ✨ 添加旅行统计图表（饼图/柱状图）
- ✨ 深色模式完整适配（弹窗、图表、输入框、下拉菜单）
- 🐛 修复深色模式下边框颜色问题
- 🐛 修复旅行统计深色模式样式

### v1.8.0 (2026-06-25)
- ✨ 添加深色模式（整个界面）
- ✨ 添加多语言支持（中文/英文）
- ✨ 完善所有组件的翻译
- 🐛 修复深色模式下地图自动切换为暗色样式

### v1.7.0 (2026-06-25)
- ✨ 添加机票查询链接功能（携程/飞猪/去哪儿/Google Flights）
- ✨ 轨迹点击区域优化，更容易选中
- ✨ 统计栏详情改为横排显示
- 🗑️ 移除预估费用功能

### v1.6.0 (2026-06-25)
- 🐛 优化线路存储逻辑，修复刷新后线路丢失问题
- 🐛 修复编辑线路搜索功能
- ✨ 优化移动端响应式布局
- ✨ 集成 Wikipedia API 获取全球城市详情

### v1.5.0 (2026-06-25)
- ✨ 添加城市详情功能（简介、人口、景点）
- ✨ 添加天气信息集成（当前天气和未来预报）
- ✨ 城市详情独立弹窗显示
- ✨ 添加轨迹方向箭头
- ✨ 移动端响应式优化

### v1.4.0 (2026-06-25)
- ✨ 添加火车交通方式
- ✨ 编辑线路时可修改每个城市的交通方式
- ✨ 点击轨迹线显示里程
- 🐛 修复搜索结果重复问题
- ✨ 加强联网搜索（Nominatim API 优先）

### v1.3.0 (2026-06-24)
- ✨ 添加国家城市统计功能
- ✨ 统计栏可拖动
- ✨ 显示总距离
- ✨ 支持多种地图样式（标准、卫星、地形、暗色）
- ✨ 支持 GPX 文件导入导出

### v1.2.0 (2026-06-23)
- ✨ 扩展城市数据库到 530+ 城市
- ✨ 添加自动同步脚本
- ✨ 优化侧边栏折叠功能

### v1.1.0 (2026-06-22)
- ✨ 添加地图点击添加城市功能
- ✨ 支持线路编辑
- ✨ 添加历史记录功能

### v1.0.0 (2026-06-21)
- 🎉 初始版本发布
- ✨ 基础轨迹生成功能
- ✨ 多城市路线规划

## 许可证 / License

MIT License
