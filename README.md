# Meme Memos

Meme Memos 是一个专为 memecoin 爱好者和投资者设计的备忘录网站。用户可以通过输入 memecoin 的 token address 来生成和管理与特定 memecoin 相关的事件备忘录。

## 主要功能

- 通过 token address 生成或访问 memecoin 专属备忘录页面
- 添加、编辑和删除与 memecoin 相关的重要事件
- 为每个事件记录时间、内容描述和相关链接
- 按时间顺序展示 memecoin 的所有记录事件
- 自动获取并展示每个事件前 24 小时内的大额买家信息
- 显示 memecoin 的基本信息，如名称、符号、价格、流动性和交易量

## 使用方法

1. 在主页输入 memecoin 的 token address
2. 点击"生成"或"进入"按钮，跳转到对应的 memo 页面
3. 在 memo 页面查看已记录的事件，或添加新的事件
4. 使用编辑和删除功能管理已有事件
5. 查看每个事件下方折叠展示的大额买家信息
6. 查看页面顶部显示的 memecoin 基本信息

## 技术栈

### 客户端
- React
- TypeScript
- Tailwind CSS
- Vite

### 服务器端
- Node.js
- Express.js
- TypeScript

### 数据源
- Dune API（用于获取链上数据）
- DexScreener API（用于获取代币基本信息）

## 项目结构
```
.
├── README.md
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── server/
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   └── index.ts
    └── package.json
```

## 开发

要在本地运行此项目：

1. 克隆仓库
2. 安装客户端依赖：
   ```
   cd client
   npm install
   ```
3. 安装服务器依赖：
   ```
   cd server
   npm install
   ```
4. 在服务器目录下创建 `.env` 文件，并配置 Dune API 密钥：
   ```
   DUNE_API_KEY=your_dune_api_key_here
   ```
5. 启动服务器：
   ```
   cd server
   npm run dev
   ```
6. 启动客户端开发服务器：
   ```
   cd client
   npm run dev
   ```

## API 集成

### Dune API

本项目的服务器端使用 Dune API 来获取每个事件前 24 小时内的大额买家信息。我们使用的查询 ID 是 4139932，该查询可以获取指定时间范围内特定 token 的大额交易信息。

查询参数包括：
- TOKEN_ADDRESS：memecoin 的合约地址
- START_TIME：事件时间前 24 小时
- END_TIME：事件时间
- MIN_AMOUNT_USD：最小交易金额（美元）

更多关于 Dune API 的使用方法，请参考 [Dune API 文档](https://dune.com/docs/api/)。

### DexScreener API

我们使用 DexScreener API 来获取 memecoin 的基本信息。这个 API 提供了代币的名称、符号、价格、流动性和交易量等信息。

API 端点：`https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}`

返回的数据包括：
- 代币名称
- 代币符号
- 美元价格
- 流动性（美元）
- 24小时交易量
- 代币图片 URL（如果可用）

客户端通过服务器端的 API 获取这些数据，无需直接与 Dune API 或 DexScreener API 交互。

## 后端 API 文档

我们的后端提供了以下 API 端点：

## 后端 API 文档

我们的后端提供了以下 API 端点：

### 1. 获取所有 Memos

- **URL**: `/api/memos`
- **方法**: `GET`
- **成功响应**: 
  - 状态码: 200
  - 内容: 包含所有 memos 信息的 JSON 数组
- **错误响应**:
  - 状态码: 500
  - 内容: `{ "error": "Internal server error" }`

### 2. 获取特定 Memo

- **URL**: `/api/memos/:tokenAddress`
- **方法**: `GET`
- **URL 参数**: 
  - `tokenAddress`: Memecoin 的合约地址
- **成功响应**: 
  - 状态码: 200
  - 内容: 包含特定 memo 信息的 JSON 对象
- **错误响应**:
  - 状态码: 404
  - 内容: `{ "error": "Memo not found" }`

### 3. 创建 Memo

- **URL**: `/api/memos`
- **方法**: `POST`
- **数据参数**: 
  ```json
  {
    "tokenAddress": "0x...",
    "events": []
  }
  ```
- **成功响应**: 
  - 状态码: 201
  - 内容: 创建的 memo 对象
- **错误响应**:
  - 状态码: 400
  - 内容: `{ "error": "Invalid input" }`

### 4. 添加事件

- **URL**: `/api/memos/:tokenAddress/events`
- **方法**: `POST`
- **URL 参数**: 
  - `tokenAddress`: Memecoin 的合约地址
- **数据参数**: 
  ```json
  {
    "timestamp": "2023-05-01T12:00:00Z",
    "description": "Event description",
    "link": "https://example.com"
  }
  ```
- **成功响应**: 
  - 状态码: 201
  - 内容: 更新后的 memo 对象
- **错误响应**:
  - 状态码: 404
  - 内容: `{ "error": "Memo not found" }`
````




## 贡献

欢迎提交 issues 和 pull requests 来帮助改进这个项目。

## 许可

[MIT License](LICENSE)
