#!/bin/bash

BASE_URL="http://localhost:3001"

echo "🧪 测试 Monitor Server API..."
echo ""

# 测试基础接口
echo "1️⃣ 测试基础接口 /api/test"
curl -s "$BASE_URL/api/test"
echo -e "\n"

# 测试上报接口
echo "2️⃣ 测试上报接口 /report/actions"
curl -s -X POST "$BASE_URL/report/actions" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-001",
    "appId": "app-001",
    "userId": "user-001",
    "type": "error",
    "data": [{
      "errorType": "TypeError",
      "message": "Test error message",
      "stack": "Error stack trace...",
      "filename": "test.js",
      "lineno": 10,
      "colno": 5
    }],
    "currentTime": 1234567890,
    "currentPage": "https://example.com/test",
    "ua": "Mozilla/5.0 Test"
  }'
echo -e "\n"

# 测试查询接口
echo "3️⃣ 测试查询错误日志 /api/get/errorLog"
curl -s "$BASE_URL/api/get/errorLog?page=1" | head -c 200
echo -e "...\n"

echo "4️⃣ 测试查询 API 日志 /api/get/apiLog"
curl -s "$BASE_URL/api/get/apiLog?page=1" | head -c 200
echo -e "...\n"

echo "5️⃣ 测试查询用户行为 /api/get/actionLog"
curl -s "$BASE_URL/api/get/actionLog?page=1" | head -c 200
echo -e "...\n"

echo "6️⃣ 测试查询性能日志 /api/get/performanceLog"
curl -s "$BASE_URL/api/get/performanceLog?page=1" | head -c 200
echo -e "...\n"

echo "7️⃣ 测试查询行为日志 /api/get/behaviorLog"
curl -s "$BASE_URL/api/get/behaviorLog?page=1" | head -c 200
echo -e "...\n"

echo "✅ API 测试完成！"
