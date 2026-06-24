# 自由轨迹 - 部署指南

## 快速开始

### 本地开发
```bash
# 启动后端
cd server
npm install
npm run dev

# 启动前端（新终端）
cd client
npm install
npm run dev
```

访问 http://localhost:5173

---

## 云服务器部署

### 方案一：Docker 部署（推荐）

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh

# 2. 克隆项目
git clone <your-repo>
cd 自由轨迹

# 3. 构建并启动
docker-compose up -d --build

# 4. 访问
http://your-server-ip:3001
```

### 方案二：PM2 部署

```bash
# 1. 安装 Node.js 和 PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# 2. 构建前端
cd client
npm install
npm run build
cd ..

# 3. 启动后端
cd server
npm install --production
pm2 start index.js --name "travel-tracker"
pm2 save
pm2 startup

# 4. 配置 Nginx
sudo cp nginx.conf /etc/nginx/sites-available/travel-tracker
sudo ln -s /etc/nginx/sites-available/travel-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 方案三：Vercel + Railway（免费）

#### 前端部署到 Vercel
1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 导入项目，选择 client 目录
4. 部署

#### 后端部署到 Railway
1. 访问 https://railway.app
2. 用 GitHub 登录
3. 创建新项目，上传 server 目录
4. 设置环境变量 PORT=3001

---

## 环境变量

```bash
# 后端
PORT=3001  # 服务端口

# 前端（构建时）
VITE_API_BASE=https://your-api-domain.com/api  # 后端API地址
```

---

## 常见问题

### Q: 如何修改端口？
A: 修改 server/index.js 中的 PORT 变量

### Q: 如何配置 HTTPS？
A: 使用 Let's Encrypt 或云服务商提供的 SSL 证书

### Q: 数据库在哪里？
A: SQLite 数据库文件位于 server/db/routes.db

### Q: 如何备份数据？
A: 复制 server/db/routes.db 文件即可
