<div align="center">

# 🌐 OmniBox

**Universal Web Proxy Service**

一个基于 Cloudflare Workers 构建的高性能、功能完善的 Web 代理服务

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[在线演示](https://omnibox.pp.ua/) · [快速开始](#-快速开始) · [功能特性](#-功能特性) · [API 文档](#-api-文档)

</div>

---

## 📖 目录

- [功能特性](#-功能特性)
- [技术架构](#-技术架构)
- [快速开始](#-快速开始)
- [配置说明](#-配置说明)
- [API 文档](#-api-文档)
- [部署指南](#-部署指南)
- [开发指南](#-开发指南)
- [安全说明](#-安全说明)
- [常见问题](#-常见问题)

---

## ✨ 功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
| 🌐 **完整代理** | 支持代理任意网站，包括 HTML、CSS、JavaScript、图片、字体等所有资源 |
| ⚡ **智能缓存** | 基于 Cloudflare KV 的智能缓存系统，支持按内容类型设置不同的 TTL |
| 🔄 **URL 重写** | 自动重写页面中的所有 URL，确保代理后的链接正常工作 |
| 🔐 **密码保护** | 可选的密码保护功能，支持自定义密码输入页面 |
| 📊 **健康监控** | 内置健康检查 API 和状态监控端点 |
| 🎨 **现代化前端** | 深色主题设计，响应式布局，流畅的动画效果 |
| 🇨🇳 **全中文界面** | 完整的中文界面，提升用户体验 |
| 💬 **优化的提示系统** | 美观的代理提示组件，点击关闭后不再显示 |

### 技术亮点

- **零依赖** - 纯 JavaScript 实现，核心功能无需外部依赖
- **模块化设计** - 清晰的代码架构，易于维护和扩展
- **CORS 支持** - 完整的跨域资源共享支持
- **性能优化** - 智能缓存策略，减少源站请求
- **安全防护** - 爬虫过滤、内容过滤、速率限制
- **代码质量** - 集成 ESLint 和 TypeScript 类型检查
- **现代化前端** - 响应式设计，流畅的用户体验

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        OmniBox Worker                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   worker.js  │───▶│  proxy.js    │───▶│  injector.js │  │
│  │   (入口)     │    │  (代理处理)   │    │  (内容注入)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  cache.js    │    │  config.js   │    │ templates.js │  │
│  │  (缓存管理)   │    │  (配置中心)   │    │  (页面模板)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                        │          │
│         ▼                                        ▼          │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │   utils.js   │                        │  KV Storage  │  │
│  │  (工具函数)   │                        │  (持久化缓存) │  │
│  └──────────────┘                        └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 模块说明

| 模块 | 文件 | 职责 |
|------|------|------|
| 入口模块 | `worker.js` | 请求路由、错误处理、缓存检查 |
| 代理处理 | `proxy.js` | URL 提取、请求转发、响应处理 |
| 内容注入 | `injector.js` | HTML 注入、URL 重写、脚本注入 |
| 缓存管理 | `cache.js` | KV 存储操作、TTL 管理、缓存清理 |
| 配置中心 | `config.js` | 全局配置、环境变量、功能开关 |
| 页面模板 | `templates.js` | 主页、密码页、错误页模板 |
| 工具函数 | `utils.js` | 通用工具、Cookie 处理、响应构建 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- npm 或 pnpm
- Cloudflare 账户

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-username/omnibox.git
cd omnibox

# 2. 安装依赖
npm install

# 3. 登录 Cloudflare
npx wrangler login

# 4. 创建 KV 命名空间
npx wrangler kv:namespace create KV_CACHE

# 5. 更新 wrangler.toml 中的 KV 命名空间 ID

# 6. 本地开发
npm run dev

# 7. 代码质量检查
npm run lint
npm run typecheck

# 8. 构建测试
npm run build

# 9. 部署到生产环境
npm run deploy
```

### 使用方式

部署完成后，通过以下方式访问目标网站：

```
https://your-worker.workers.dev/github.com
https://your-worker.workers.dev/https://github.com
```

---

## ⚙️ 配置说明

### 环境变量

在 `wrangler.toml` 中配置或通过 Cloudflare Dashboard 设置：

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `DEBUG` | boolean | `false` | 启用调试模式，显示详细错误信息 |
| `LOG_LEVEL` | string | `warn` | 日志级别：`error` / `warn` / `info` / `debug` |
| `PROXY_PASSWORD` | Secret | - | 访问密码（仅通过 Cloudflare Dashboard 添加 Secret） |
| `SHOW_PASSWORD_PAGE` | boolean | `true` | 是否显示密码输入页面 |
| `MAX_CACHE_SIZE` | number | `1048576` | 单个缓存项最大大小（字节） |

### 缓存 TTL 配置

| 内容类型 | 默认 TTL | 说明 |
|----------|----------|------|
| HTML | 1 小时 | 网页内容 |
| CSS | 1 天 | 样式表 |
| JavaScript | 1 天 | 脚本文件 |
| 图片 | 30 天 | 图片资源 |
| 字体 | 30 天 | 字体文件 |
| JSON | 30 分钟 | API 响应 |

### wrangler.toml 示例

```toml
name = "omnibox"
main = "src/worker.js"
compatibility_date = "2024-12-19"
compatibility_flags = ["nodejs_compat"]

[vars]
DEBUG = "false"
LOG_LEVEL = "warn"
MAX_CACHE_SIZE = "1048576"

[[kv_namespaces]]
binding = "KV_CACHE"
id = "your-kv-namespace-id"

[observability]
enabled = true
```

---

## 📚 API 文档

### 健康检查

```http
GET /api/health
```

**响应示例：**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "service": "OmniBox Proxy Worker",
  "features": {
    "kvCache": true,
    "corsSupport": true,
    "passwordProtection": false
  }
}
```

### 服务状态

```http
GET /api/status
```

**响应示例：**

```json
{
  "status": "active",
  "proxyMode": "omnibox-enhanced",
  "timestamp": 1704067200000,
  "version": "1.0.0",
  "caching": true
}
```

### 清除缓存

```http
POST /api/cache/clear
Content-Type: application/json

{
  "pattern": "omnibox-proxy-cache-v1.0"
}
```

**响应示例：**

```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

---

## 🚢 部署指南

### GitHub Actions 自动部署

项目已配置 GitHub Actions 工作流，推送到 `main` 分支自动部署。

**配置 Secrets：**

1. 进入 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 添加以下 Secrets：

| Secret 名称 | 说明 |
|-------------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |

### 手动部署

```bash
# 部署
npm run deploy
```

### 配置访问密码

1. 进入 Cloudflare Dashboard → Workers & Pages → omnibox
2. Settings → Variables and Secrets
3. 添加 Secret 类型变量：
   - 名称：`PROXY_PASSWORD`
   - 值：你的密码

### 自定义域名

1. 在 Cloudflare Dashboard 中添加自定义域名
2. 或在 `wrangler.toml` 中配置：

```toml
routes = [
  { pattern = "proxy.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

---

## 💻 开发指南

### 项目结构

```
omnibox/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 配置
├── src/
│   ├── worker.js               # 主入口
│   ├── config.js               # 配置模块
│   ├── proxy.js                # 代理处理
│   ├── cache.js                # 缓存管理
│   ├── injector.js             # 内容注入
│   ├── templates.js            # 页面模板
│   └── utils.js                # 工具函数
├── .eslintrc.js               # ESLint 配置
├── .gitignore
├── package.json
├── tsconfig.json              # TypeScript 配置
├── wrangler.toml               # Worker 配置
└── README.md
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://127.0.0.1:8787
```

### 代码质量检查

```bash
# 语法检查
npm run lint

# 类型检查
npm run typecheck

# 构建测试
npm run build
```

### 调试模式

在 `wrangler.toml` 中启用调试：

```toml
[vars]
DEBUG = "true"
LOG_LEVEL = "debug"
```

---

## 🔒 安全说明

### ⚠️ 重要提示

> **请勿通过代理服务登录重要账户！**

代理服务主要用于：
- 浏览网页内容
- 研究和学习
- 访问受限资源

### 安全建议

1. **启用密码保护** - 生产环境建议设置访问密码
2. **使用 Secrets** - 密码等敏感信息仅通过 Cloudflare Dashboard 添加 Secret
3. **定期更新** - 保持依赖和 Worker 运行时最新
4. **监控日志** - 启用 Cloudflare 日志监控异常访问

### 安全特性

- ✅ 爬虫过滤（阻止 Bytespider 等恶意爬虫）
- ✅ 内容类型过滤（阻止可执行文件下载）
- ✅ CORS 安全配置
- ✅ 密码保护机制
- ✅ 速率限制支持

---

## ❓ 常见问题

<details>
<summary><b>Q: 为什么某些网站无法正常代理？</b></summary>

部分网站使用了特殊的反代理技术，如：
- 强制 HTTPS 重定向
- 内容安全策略（CSP）
- 动态加载的内容
- WebSocket 连接

建议尝试不同的 URL 格式或联系开发者反馈问题。
</details>

<details>
<summary><b>Q: 如何清除缓存？</b></summary>

方式一：调用 API
```bash
curl -X POST https://your-worker.workers.dev/api/cache/clear
```

方式二：Cloudflare Dashboard
进入 KV 命名空间，手动删除缓存键。
</details>

<details>
<summary><b>Q: 如何修改代理提示信息？</b></summary>

编辑 `src/config.js` 中的 `PROXY_HINT_DELAY` 和提示文本，或修改 `src/injector.js` 中的 `generateProxyHintScript` 方法。
</details>

<details>
<summary><b>Q: 支持哪些内容类型？</b></summary>

支持所有 HTTP 内容类型，包括：
- 文本内容（HTML、CSS、JavaScript、JSON、XML）
- 二进制内容（图片、字体、视频、音频）
- 其他资源（字体、图标等）
</details>

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

<div align="center">

**Made with ❤️ by OmniBox Team**

[⬆ 返回顶部](#-omnibox)

</div>
