# Monitor Server - NestJS + PostgreSQL + Docker

基于 NestJS、PostgreSQL 和 Docker 的前端监控服务端重构版本。

## 技术栈

- NestJS - Node.js 框架
- TypeORM - ORM 框架
- PostgreSQL - 数据库
- Docker & Docker Compose - 容器化部署
- pnpm - 包管理器

## 快速开始

### 前置要求

- Docker & Docker Compose

### 快速启动

一键启动数据库和应用：

```bash
./start.sh
```

或手动启动：

```bash
docker-compose up -d
```

服务将在 http://localhost:3001 启动

### 停止服务

```bash
docker-compose down
```

### 查看日志

```bash
docker-compose logs -f
```

### 测试 API

```bash
./test-api.sh
```

### 本地开发（不使用 Docker）

如果需要本地开发，需要：

1. 安装 Node.js 18+ 和 pnpm
2. 安装并启动 PostgreSQL（无密码）
3. 安装依赖并启动：

```bash
pnpm install
pnpm run start:dev
```

## API 接口

### 测试接口

- `GET /api/test` - 测试接口
  - Query: `error` (可选) - 传入任意值返回 500 错误

### 查询接口

所有查询接口支持分页，每页 10 条数据

- `GET /api/get/apiLog?page=1` - 获取 API 日志
- `GET /api/get/actionLog?page=1` - 获取用户行为日志
- `GET /api/get/errorLog?page=1` - 获取错误日志
- `GET /api/get/performanceLog?page=1` - 获取性能日志
- `GET /api/get/behaviorLog?page=1` - 获取行为日志

### 上报接口

- `POST /report/actions` - 上报监控数据

请求体示例：

```json
{
  "id": "unique-id",
  "appId": "app-001",
  "userId": "user-001",
  "type": "error",
  "data": [
    {
      "errorType": "TypeError",
      "message": "Cannot read property 'x' of undefined",
      "stack": "Error stack trace...",
      "filename": "app.js",
      "lineno": 10,
      "colno": 5
    }
  ],
  "currentTime": 1234567890,
  "currentPage": "https://example.com/page",
  "ua": "Mozilla/5.0..."
}
```

支持的 type 类型：
- `action` - 用户操作
- `error` - 错误日志
- `behavior` - 行为日志
- `api` - API 调用日志
- `performance` - 性能指标

## 数据库表结构

- `user_actions` - 用户操作记录
- `error_logs` - 错误日志
- `behavior_logs` - 行为日志
- `api_logs` - API 调用日志
- `performance_logs` - 性能指标

## 开发命令

```bash
# 开发模式
pnpm run start:dev

# 构建
pnpm run build

# 生产模式
pnpm run start:prod

# 代码格式化
pnpm run format

# 代码检查
pnpm run lint

# 测试
pnpm run test
```

## 项目结构

```
src/
├── dto/                    # 数据传输对象
├── entities/               # 数据库实体
├── modules/
│   └── monitor/           # 监控模块
│       ├── monitor.controller.ts
│       ├── monitor.service.ts
│       └── monitor.module.ts
├── app.module.ts          # 应用主模块
└── main.ts                # 应用入口
```

## 与原 server 的区别

1. 使用 TypeScript 替代 JavaScript
2. 使用 PostgreSQL 替代 MongoDB
3. 使用 NestJS 框架替代 Express
4. 使用 TypeORM 替代 Mongoose
5. 完整的 Docker 支持
6. 更好的类型安全和代码组织

## 注意事项

- 首次启动时，TypeORM 会自动创建数据库表（synchronize: true）
- 生产环境建议关闭 synchronize，使用 migration 管理数据库变更
- 确保 PostgreSQL 数据库已启动并可访问
