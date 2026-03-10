<div align="center">

# 🌐 OmniBox

**Universal Web Proxy Service**

一个基于 Cloudflare Workers 构建的高性能、功能完善的 Web 代理服务

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/Zoroaaa/OmniBox)

[在线演示](https://omnibox.pp.ua/) · [快速开始](#-快速开始) · [功能特性](#-功能特性) · [API 文档](#-api-文档)

</div>

---

## 📖 目录

- [项目简介](#-项目简介)
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

## 📝 项目简介

OmniBox 是一个基于 Cloudflare Workers 构建的通用 Web 代理服务，具有以下特点：

- **零运行时依赖** - 纯 TypeScript 实现，核心功能无需外部依赖
- **边缘计算** - 利用 Cloudflare 全球 CDN 网络，实现低延迟访问
- **智能缓存** - 基于 Cloudflare KV 的多级缓存系统
- **安全防护** - 内置 SSRF 防护、爬虫过滤、密码保护等安全机制
- **完整代理** - 支持 HTML、CSS、JavaScript、图片、字体等所有资源类型

---

## ✨ 功能特性

### 核心功能

| 功能 | 描述 |
|------|------|
| 🌐 **完整代理** | 支持代理任意网站，包括 HTML、CSS、JavaScript、图片、字体等所有资源 |
| ⚡ **智能缓存** | 基于 Cloudflare KV 的智能缓存系统，支持按内容类型设置不同的 TTL |
| 🔄 **URL 重写** | 自动重写页面中的所有 URL，确保代理后的链接正常工作 |
| 🔐 **密码保护** | 可选的密码保护功能，支持自定义密码输入页面，使用 SHA-256 哈希 + 常量时间比较防止时序攻击 |
| 📊 **健康监控** | 内置健康检查 API 和状态监控端点 |
| 🎨 **现代化前端** | 深色/浅色主题设计，响应式布局，流畅的动画效果 |
| 🇨🇳 **全中文界面** | 完整的中文界面，提升用户体验 |
| 💬 **优化的提示系统** | 美观的代理提示组件，点击关闭后不再显示 |

### 安全特性

| 特性 | 说明 |
|------|------|
| 🛡️ **SSRF 防护** | 阻止内网 IP 访问（10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, IPv6 本地地址等） |
| 🤖 **爬虫过滤** | 默认屏蔽 Bytespider、GPTBot、CCBot、SemrushBot、AhrefsBot 等恶意爬虫 |
| ⏱️ **时序攻击防护** | 密码验证使用常量时间比较算法 |
| 🔒 **Cookie 安全** | 内部 Cookie 使用 HttpOnly、Secure、SameSite=Lax 属性 |
| 🚫 **敏感头移除** | 自动移除 CSP、HSTS、X-Frame-Options 等限制性响应头 |
| 🔑 **API 鉴权** | 写操作 API 需要Bearer Token 鉴权 |

### 技术亮点

- **TypeScript 严格模式** - 完整的 TypeScript 类型支持，严格模式编译，提升代码质量和开发体验
- **零运行时依赖** - 纯 TypeScript 实现，核心功能无需外部依赖，仅开发依赖
- **模块化设计** - 清晰的代码架构，7 个独立模块，职责分离，易于维护和扩展
- **CORS 支持** - 完整的跨域资源共享支持，无限制 CORS 头
- **性能优化** - 智能缓存策略、请求超时控制、响应体大小限制
- **完整日志系统** - 分级日志（error/warn/info/debug），支持请求追踪
- **代码质量** - 集成 ESLint 10.x 和 TypeScript 5.9 严格类型检查

---

## 🏗️ 技术架构

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        OmniBox Worker                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  worker.ts   │───▶│  proxy.ts    │───▶│ injector.ts  │  │
│  │   (入口)     │    │  (代理处理)   │    │  (内容注入)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  cache.ts    │    │  config.ts   │    │templates.ts  │  │
│  │  (缓存管理)   │    │  (配置中心)   │    │  (页面模板)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                        │          │
│         ▼                                        ▼          │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │   utils.ts   │                        │  KV Storage  │  │
│  │  (工具函数)   │                        │  (持久化缓存) │  │
│  └──────────────┘                        └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 模块说明

| 模块 | 文件 | 职责 | 主要功能 |
|------|------|------|----------|
| 入口模块 | `worker.ts` | 请求路由、错误处理、缓存检查 | API 路由分发、全局错误捕获、请求 ID 生成、缓存命中/未命中处理 |
| 代理处理 | `proxy.ts` | URL 提取、请求转发、响应处理 | 密码验证、URL 规范化、SSRF 防护、重定向处理、Cookie 路径修复 |
| 内容注入 | `injector.ts` | HTML 注入、URL 重写、脚本注入 | ProxyLocation 类、XMLHttpRequest/Fetch 拦截、MutationObserver 监听 |
| 缓存管理 | `cache.ts` | KV 存储操作、TTL 管理、缓存清理 | 按内容类型 TTL、缓存键 SHA-256 哈希、分页清除缓存 |
| 配置中心 | `config.ts` | 全局配置、环境变量、功能开关 | 类型定义、默认值、常量管理 |
| 页面模板 | `templates.ts` | 主页、密码页、错误页模板 | 响应式设计、深色/浅色主题切换、动态缓存统计 |
| 工具函数 | `utils.ts` | 通用工具、Cookie 处理、响应构建 | 分级日志系统、常量时间比较、SHA-256 哈希 |

### 数据流

```
用户请求 → Worker入口 → 密码验证 → 缓存检查 → 代理请求 → 内容处理 → 缓存存储 → 响应返回
                ↓           ↓           ↓           ↓
              API路由    Cookie验证   KV读取    URL重写/注入
```

### 核心技术实现

#### 1. Location 对象代理

通过 `ProxyLocation` 类包装原始 location 对象，拦截 `href`、`protocol`、`host` 等属性访问，使代理页面中的 JavaScript 获取正确的 URL 信息。

```typescript
class ProxyLocation {
  get href() { return original_website_url_str; }
  set href(url) { this.originalLocation.href = changeURL(url); }
  // ... 其他属性
}
```

#### 2. 网络请求拦截

- **XMLHttpRequest.open 重写** - 拦截 XHR 请求，自动转换 URL
- **fetch 方法重写** - 拦截 Fetch API 请求
- **window.open 拦截** - 处理新窗口打开的链接

#### 3. DOM 动态监听

使用 MutationObserver 监听 DOM 变化，自动转换新插入元素的 URL，支持动态加载内容。采用 100ms 防抖优化性能。

#### 4. 缓存键生成策略

```
缓存键 = SHA-256(前缀|方法|URL|accept-language).slice(0, 48)
```

自动排除缓存破坏参数（`_t`、`timestamp`、`cachebuster` 等）。

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
| `SHOW_PASSWORD_PAGE` | boolean | `true` | 是否显示密码输入页面，false 则直接返回 403 |
| `BLOCKED_UA_PATTERNS` | string | - | 爬虫黑名单（逗号分隔），默认已包含 Bytespider/GPTBot/CCBot/SemrushBot/AhrefsBot |
| `MAX_CACHE_SIZE` | number | `1048576` | 单个缓存项最大大小（字节，默认 1MB） |

### 缓存 TTL 配置

| 内容类型 | 默认 TTL | 环境变量 | 说明 |
|----------|----------|----------|------|
| HTML | 1 小时 | `CACHE_HTML_TTL` | 网页内容 |
| CSS | 1 天 | `CACHE_CSS_TTL` | 样式表 |
| JavaScript | 1 天 | `CACHE_JS_TTL` | 脚本文件 |
| 图片 | 30 天 | `CACHE_IMAGE_TTL` | 图片资源 |
| 字体 | 30 天 | `CACHE_FONT_TTL` | 字体文件 |
| JSON | 30 分钟 | `CACHE_JSON_TTL` | API 响应 |
| 默认 | 1 小时 | `CACHE_DEFAULT_TTL` | 其他内容 |

### 性能配置

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `MAX_REDIRECT_DEPTH` | 5 | 最大重定向深度 |
| `REQUEST_TIMEOUT` | 15000ms | 请求超时时间 |
| `STREAM_READ_TIMEOUT` | 10000ms | 流式读取超时时间 |
| `MAX_RESPONSE_SIZE` | 50MB | 最大响应体大小 |
| `MAX_TEXT_PROCESS_SIZE` | 5MB | 文本处理最大大小 |
| `CONCURRENT_REQUESTS_LIMIT` | 10 | 并发请求限制 |

### wrangler.toml 示例

```toml
name = "omnibox"
main = "src/worker.ts"
compatibility_date = "2024-12-19"
compatibility_flags = ["nodejs_compat"]
preview_urls = false

[vars]
DEBUG = "false"
LOG_LEVEL = "warn"
MAX_CACHE_SIZE = "1048576"
SHOW_PASSWORD_PAGE = "true"
CACHE_HTML_TTL = "3600"
CACHE_CSS_TTL = "86400"
CACHE_JS_TTL = "86400"
CACHE_IMAGE_TTL = "2592000"
CACHE_FONT_TTL = "2592000"
CACHE_JSON_TTL = "1800"
CACHE_DEFAULT_TTL = "3600"
BLOCKED_UA_PATTERNS = ""

[[kv_namespaces]]
binding = "KV_CACHE"
id = "your-kv-namespace-id"
preview_id = "your-kv-namespace-id"

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
  "globals": {
    "https": "https://your-worker.workers.dev/",
    "host": "your-worker.workers.dev"
  },
  "features": {
    "enhancedProxyMode": true,
    "originalFunctionality": true,
    "kvCache": true,
    "corsSupport": true,
    "passwordProtection": false,
    "proxyHint": true
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
  "cors": "unrestricted",
  "caching": true,
  "passwordProtected": false,
  "hintEnabled": true
}
```

### 缓存统计

```http
GET /api/cache/stats
```

**响应示例：**

```json
{
  "totalKeys": 0,
  "cachePrefix": "omnibox-proxy-cache-v1.0",
  "ttlConfig": {
    "HTML": 3600,
    "CSS": 86400,
    "JS": 86400,
    "IMAGE": 2592000,
    "FONT": 2592000,
    "JSON": 1800,
    "DEFAULT": 3600
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "hitCount": 0,
  "missCount": 0,
  "hitRate": "N/A"
}
```

### 清除缓存

```http
POST /api/cache/clear
Authorization: Bearer <PROXY_PASSWORD>
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

> **注意**：写操作（POST）需要鉴权，使用 `PROXY_PASSWORD` 作为 Bearer Token

### 预热缓存

```http
POST /api/cache/preload
Authorization: Bearer <PROXY_PASSWORD>
```

**响应示例：**

```json
{
  "success": true,
  "message": "Preload completed",
  "preloaded": 5,
  "urls": ["https://example.com/..."]
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

**部署流程：**
1. 代码检查（ESLint + TypeScript）
2. 配置验证
3. 自动部署到 Cloudflare Workers

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
│   ├── worker.ts               # 主入口 - 请求路由、API处理
│   ├── config.ts               # 配置模块 - 常量、类型定义
│   ├── proxy.ts                # 代理处理 - URL提取、请求转发
│   ├── cache.ts                # 缓存管理 - KV操作、TTL管理
│   ├── injector.ts             # 内容注入 - HTML处理、URL重写
│   ├── templates.ts            # 页面模板 - 主页、密码页、错误页
│   └── utils.ts                # 工具函数 - 日志、Cookie、响应构建
├── eslint.config.js            # ESLint 配置 (v10 flat config)
├── .gitignore
├── package.json
├── tsconfig.json               # TypeScript 配置 (strict mode)
├── wrangler.toml               # Worker 配置
├── LICENSE                     # MIT License
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
# ESLint 语法检查
npm run lint

# TypeScript 类型检查
npm run typecheck

# 详细类型检查
npm run typecheck:verbose

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

### 技术栈版本

| 依赖 | 版本 | 用途 |
|------|------|------|
| TypeScript | ^5.9.3 | 类型系统 |
| Wrangler | ^4.60.0 | Cloudflare Workers CLI |
| ESLint | ^10.0.2 | 代码检查 |
| @cloudflare/workers-types | ^4.20260305.1 | Workers 类型定义 |
| typescript-eslint | ^8.56.1 | TypeScript ESLint 插件 |

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

- ✅ SSRF 防护（阻止内网 IP 访问）
- ✅ 爬虫过滤（阻止 Bytespider、GPTBot、CCBot、SemrushBot、AhrefsBot 等恶意爬虫）
- ✅ 密码常量时间比较（防止时序攻击）
- ✅ 密码 SHA-256 哈希存储（Cookie 中存储哈希值而非明文）
- ✅ CORS 安全配置
- ✅ robots.txt 禁止爬取
- ✅ 敏感请求头移除（CSP、HSTS、X-Frame-Options 等）
- ✅ API 写操作鉴权（Bearer Token）
- ✅ 内部 Cookie 过滤（不透传给上游站点）

### Cookie 安全

| Cookie 名称 | 用途 | 安全属性 |
|-------------|------|----------|
| `__OMNIBOX_PWD__` | 密码哈希存储 | HttpOnly, Secure, SameSite=Lax |
| `__OMNIBOX_VISITEDsite__` | 最后访问站点 | HttpOnly, Secure |
| `__OMNIBOX_HINT__` | 提示关闭标记 | Secure |

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

方式一：调用 API（需要密码鉴权）
```bash
curl -X POST https://your-worker.workers.dev/api/cache/clear \
  -H "Authorization: Bearer YOUR_PASSWORD"
```

方式二：Cloudflare Dashboard
进入 KV 命名空间，手动删除缓存键。
</details>

<details>
<summary><b>Q: 如何修改代理提示信息？</b></summary>

编辑 `src/config.ts` 中的 `PROXY_HINT_DELAY` 和提示文本，或修改 `src/injector.ts` 中的 `generateProxyHintScript` 方法。
</details>

<details>
<summary><b>Q: 支持哪些内容类型？</b></summary>

支持所有 HTTP 内容类型，包括：
- 文本内容（HTML、CSS、JavaScript、JSON、XML）
- 二进制内容（图片、字体、视频、音频）
- 其他资源（字体、图标等）

注意：二进制内容（图片、字体等）不进行缓存，直接透传。
</details>

<details>
<summary><b>Q: 如何添加自定义域名？</b></summary>

1. 在 Cloudflare Dashboard → Workers → omnibox → Settings → Triggers
2. 添加自定义域名
3. 确保域名已托管在 Cloudflare
</details>

<details>
<summary><b>Q: 缓存键是如何生成的？</b></summary>

缓存键生成策略：
- 前缀: `omnibox-proxy-cache-v1.0`
- 组件: `前缀|方法|URL|accept-language`
- 最终键: SHA-256 哈希（截断 48 字符）
- 自动排除缓存破坏参数（_t, timestamp, cachebuster 等）
</details>

<details>
<summary><b>Q: 如何添加自定义爬虫黑名单？</b></summary>

在 `wrangler.toml` 中配置：
```toml
BLOCKED_UA_PATTERNS = "MyBot,AnotherBot"
```
这会追加到默认黑名单（Bytespider/GPTBot/CCBot/SemrushBot/AhrefsBot）之后。
</details>

<details>
<summary><b>Q: 密码是如何存储和验证的？</b></summary>

1. 用户输入密码后，客户端使用 SHA-256 对密码进行哈希
2. 哈希值存储在 Cookie 中（而非明文密码）
3. 服务端同样对 `PROXY_PASSWORD` 进行 SHA-256 哈希
4. 使用常量时间比较算法比对两个哈希值，防止时序攻击
</details>

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

本项目在实现过程中借鉴了 [cf-proxy-ex](https://github.com/1234567Yang/cf-proxy-ex) 的设计思路，感谢原作者的开源贡献。

---

<div align="center">

**Made with ❤️ by OmniBox Team**

[⬆ 返回顶部](#-omnibox)

</div>
