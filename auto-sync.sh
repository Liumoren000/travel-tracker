#!/bin/bash

# 自动同步脚本 - 监控文件变化并自动推送到 GitHub
# 使用方法: ./auto-sync.sh

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="main"

cd "$REPO_DIR" || exit 1

echo "🔄 开始监控文件变化..."
echo "📁 监控目录: $REPO_DIR"
echo "🌿 分支: $BRANCH"
echo "按 Ctrl+C 停止"
echo ""

# 检查是否安装了 fswatch
if ! command -v fswatch &> /dev/null; then
    echo "⚠️  fswatch 未安装，正在安装..."
    brew install fswatch
fi

# 监控文件变化
fswatch -o . --exclude='.git' --exclude='node_modules' --exclude='.DS_Store' --exclude='dist' --exclude='build' | while read -r file; do
    echo ""
    echo "📝 检测到文件变化: $file"

    sleep 1

    if [ -n "$(git status --porcelain)" ]; then
        echo "📦 正在提交..."
        git add .
        git commit -m "Auto sync: $(date '+%Y-%m-%d %H:%M:%S')"

        echo "🚀 正在推送..."
        if git push origin "$BRANCH"; then
            echo "✅ 同步成功！Vercel/Railway 将自动重新部署"
        else
            echo "❌ 推送失败，请检查网络连接和 GitHub 凭证"
        fi
    else
        echo "ℹ️  没有实质性变化，跳过"
    fi
done
