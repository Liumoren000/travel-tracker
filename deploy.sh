#!/bin/bash

echo "=== 自由轨迹 部署脚本 ==="

# 方案1: 使用 Docker
deploy_docker() {
    echo "使用 Docker 部署..."
    docker-compose up -d --build
    echo "部署完成！访问 http://localhost:3001"
}

# 方案2: 使用 PM2
deploy_pm2() {
    echo "使用 PM2 部署..."
    
    # 安装 PM2
    npm install -g pm2
    
    # 构建前端
    cd client
    npm install
    npm run build
    cd ..
    
    # 启动后端
    cd server
    npm install --production
    pm2 start index.js --name "travel-tracker"
    cd ..
    
    echo "部署完成！"
    echo "使用 pm2 logs travel-tracker 查看日志"
    echo "使用 pm2 restart travel-tracker 重启服务"
}

# 方案3: Vercel + Railway
deploy_vercel() {
    echo "=== Vercel 前端部署 ==="
    cd client
    npm install -g vercel
    vercel --prod
    cd ..
    
    echo ""
    echo "=== Railway 后端部署 ==="
    echo "请访问 https://railway.app 手动部署 server 目录"
}

# 显示菜单
echo ""
echo "请选择部署方案："
echo "1) Docker 部署（推荐用于云服务器）"
echo "2) PM2 部署（推荐用于 Linux 服务器）"
echo "3) Vercel + Railway 部署（推荐用于免费托管）"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1) deploy_docker ;;
    2) deploy_pm2 ;;
    3) deploy_vercel ;;
    *) echo "无效选项" ;;
esac
