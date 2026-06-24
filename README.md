# 自由轨迹 - 旅行轨迹网页

一个可以记录和展示旅行轨迹的网页应用，支持多城市连续轨迹。

## 功能特点

- 城市搜索：使用 Nominatim API 进行地理编码
- 轨迹生成：使用 OSRM API 获取路线坐标
- 多城市轨迹：支持 A→B→C 连续路线
- 轨迹保存：保存到 SQLite 数据库
- 历史记录：查看和加载历史轨迹

## 技术栈

### 前端
- React 18
- Vite
- Leaflet + OpenStreetMap
- Ant Design

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

1. 在搜索框中输入城市名称
2. 从搜索结果中选择城市
3. 添加多个城市到行程列表
4. 点击"生成轨迹"按钮查看路线
5. 点击"保存路线"按钮保存轨迹
6. 在历史记录中查看已保存的轨迹

## API 接口

- `POST /api/routes` - 保存轨迹
- `GET /api/routes` - 获取历史轨迹列表
- `GET /api/routes/:id` - 获取单个轨迹详情
- `DELETE /api/routes/:id` - 删除轨迹

## 项目结构

```
自由轨迹/
├── client/                # React 前端
│   ├── src/
│   │   ├── components/    # 组件
│   │   │   ├── Map.jsx           # 地图组件
│   │   │   ├── CitySearch.jsx    # 城市搜索
│   │   │   ├── RouteList.jsx     # 路线列表
│   │   │   └── History.jsx       # 历史记录
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                # Node.js 后端
│   ├── routes/           # API 路由
│   ├── db/               # 数据库
│   ├── index.js
│   └── package.json
└── README.md
```
