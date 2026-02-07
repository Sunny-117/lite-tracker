#!/bin/bash

echo "🚀 启动 Monitor Server..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker 未运行，请先启动 Docker"
  exit 1
fi

# 启动 Docker Compose
echo "🐳 启动 PostgreSQL 和应用..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 8

# 检查服务状态
echo "✅ 检查服务状态..."
docker-compose ps

echo ""
echo "🎉 服务启动成功！"
echo "📍 应用地址: http://localhost:3001"
echo "📍 数据库地址: localhost:5433 (用户: postgres, 无密码)"
echo ""
echo "💡 常用命令:"
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo "   测试 API: ./test-api.sh"
