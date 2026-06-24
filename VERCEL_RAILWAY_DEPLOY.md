# 自由轨迹 - Vercel + Railway 部署指南

## 第一步：部署后端到 Railway

1. 访问 https://railway.app 并用 GitHub 登录

2. 点击 "New Project" → "Deploy from GitHub repo"

3. 选择你的仓库，然后选择 `server` 目录

4. 在 Settings 中：
   - **Start Command**: `node index.js`
   - **Port**: `3001`

5. 点击 "Deploy" 等待部署完成

6. 复制生成的域名，类似：`https://your-app.up.railway.app`

---

## 第二步：部署前端到 Vercel

1. 访问 https://vercel.com 并用 GitHub 登录

2. 点击 "New Project" → 导入你的仓库

3. 配置：
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. 添加环境变量：
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://your-app.up.railway.app/api`（替换为你的 Railway 域名）

5. 点击 "Deploy" 等待部署完成

---

## 第三步：测试

1. 访问 Vercel 提供的域名
2. 搜索城市并添加
3. 生成轨迹测试

---

## 常见问题

### Q: API 请求失败怎么办？
A: 检查 Vercel 的环境变量 `VITE_API_BASE` 是否正确设置

### Q: Railway 部署失败怎么办？
A: 检查 server 目录是否有 `package.json`，确保 `start` 脚本正确

### Q: 如何更新部署？
A: 推送代码到 GitHub，Vercel 和 Railway 会自动重新部署

---

## 环境变量参考

### Vercel (前端)
```
VITE_API_BASE=https://your-railway-domain.up.railway.app/api
```

### Railway (后端)
```
PORT=3001
```
