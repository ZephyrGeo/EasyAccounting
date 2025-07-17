# EasyAccounting 后端服务器

这是 EasyAccounting 项目的 Express.js 后端服务器，用于替换 json-server，提供更稳定和功能丰富的 API 服务。

## 功能特性

- ✅ 完整的 RESTful API
- ✅ CORS 支持
- ✅ 数据验证
- ✅ 错误处理
- ✅ 查询过滤
- ✅ 统计信息
- ✅ 健康检查

## 安装依赖

```bash
# 在项目根目录运行
npm run server:install

# 或者在 server 目录下运行
cd server
npm install
```

## 启动服务器

### 生产模式
```bash
# 在项目根目录运行
npm run server

# 或者在 server 目录下运行
cd server
npm start
```

### 开发模式（自动重启）
```bash
# 在项目根目录运行
npm run server:dev

# 或者在 server 目录下运行
cd server
npm run dev
```

## API 接口文档

### 基础信息
- **服务地址**: `http://localhost:8000`
- **数据格式**: JSON
- **编码**: UTF-8

### 交易记录接口

#### 1. 获取所有交易记录
```http
GET /transactions
```

**查询参数**:
- `startDate`: 开始日期 (YYYY-MM-DD)
- `endDate`: 结束日期 (YYYY-MM-DD)
- `category`: 分类过滤
- `merchant`: 商户过滤
- `sortBy`: 排序字段 (默认: date)
- `sortOrder`: 排序方向 (asc/desc, 默认: desc)

**响应示例**:
```json
[
  {
    "id": "T2025010200002",
    "amount": 25000,
    "category": "Food",
    "subCategory": "Grocery",
    "merchant": "Whole Foods",
    "date": "25/01/02",
    "time": "14:30",
    "tags": ["Weekly Shopping"]
  }
]
```

#### 2. 获取单个交易记录
```http
GET /transactions/:id
```

#### 3. 创建新交易记录
```http
POST /transactions
Content-Type: application/json

{
  "amount": 25000,
  "category": "Food",
  "subCategory": "Grocery",
  "merchant": "Whole Foods",
  "date": "25/01/02",
  "time": "14:30",
  "tags": ["Weekly Shopping"]
}
```

#### 4. 批量更新交易记录
```http
PUT /transactions
Content-Type: application/json

{
  "transactions": [
    {
      "id": "T2025010200002",
      "amount": 25000,
      "category": "Food",
      "subCategory": "Grocery",
      "merchant": "Whole Foods",
      "date": "25/01/02",
      "time": "14:30",
      "tags": ["Weekly Shopping"]
    }
  ]
}
```

#### 5. 更新单个交易记录
```http
PUT /transactions/:id
Content-Type: application/json

{
  "amount": 30000,
  "merchant": "Updated Merchant"
}
```

#### 6. 删除交易记录
```http
DELETE /transactions/:id
```

### 统计信息接口

#### 获取统计摘要
```http
GET /transactions/stats/summary
```

**响应示例**:
```json
{
  "totalTransactions": 150,
  "totalAmount": 1250000,
  "categories": {
    "Food": { "count": 45, "amount": 450000 },
    "Transportation": { "count": 20, "amount": 200000 }
  },
  "merchants": {
    "Whole Foods": { "count": 15, "amount": 150000 }
  },
  "monthlyStats": {
    "25/01": { "count": 30, "amount": 300000 }
  }
}
```

### 系统接口

#### 健康检查
```http
GET /health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

## 数据验证规则

### 交易记录字段要求
- `amount`: 必填，正数
- `category`: 必填，字符串
- `subCategory`: 必填，字符串
- `merchant`: 必填，字符串
- `date`: 必填，格式 YY/MM/DD
- `time`: 必填，格式 HH:MM
- `tags`: 可选，字符串数组
- `id`: 自动生成或手动指定

## 错误处理

所有错误响应都使用以下格式：
```json
{
  "error": "错误描述信息"
}
```

常见状态码：
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## 开发说明

### 项目结构
```
server/
├── app.js          # 主应用文件
├── package.json    # 依赖配置
└── README.md       # 文档
```

### 依赖说明
- `express`: Web 框架
- `cors`: 跨域支持
- `uuid`: ID 生成（预留）
- `nodemon`: 开发时自动重启

### 数据存储
- 数据存储在 `../data/transactions.json` 文件中
- 支持并发读写
- 自动备份和恢复

## 与前端集成

前端应用会自动连接到 `http://localhost:8000`，无需额外配置。如果后端服务器未启动，前端会自动降级使用本地 JSON 数据。

## 故障排除

### 端口占用
如果 8000 端口被占用，可以：
1. 查找占用进程：`lsof -i :8000`
2. 终止进程：`kill -9 <PID>`
3. 或修改 `app.js` 中的 PORT 配置

### 权限问题
确保对 `data/transactions.json` 文件有读写权限。

### 依赖问题
如果遇到依赖问题，尝试：
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```