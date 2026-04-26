#!/bin/bash

echo "======================================"
echo "   AI思维导图工具 - 启动脚本"
echo "======================================"
echo ""

# 检查是否在正确的目录
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ 错误: 请在项目根目录下运行此脚本"
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 启动后端服务
echo "🚀 启动后端服务..."
cd backend
npm run start:dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
cd ..

# 等待后端启动
sleep 3

# 启动前端服务
echo "🚀 启动前端服务..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "======================================"
echo "   服务启动完成！"
echo "======================================"
echo ""
echo "📝 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "📋 进程信息:"
echo "   后端PID: $BACKEND_PID"
echo "   前端PID: $FRONTEND_PID"
echo ""
echo "⚠️  停止服务请运行: ./stop.sh"
echo ""

# 保存PID到文件
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid
