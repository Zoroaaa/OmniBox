# OmniBox Proxy Worker

Universal Web Proxy Service powered by Cloudflare Workers.

## Features

- 🌐 **Complete Proxy** - Full website content proxy including JavaScript and CSS resource handling
- ⚡ **Smart Caching** - KV cache support for improved speed and user experience
- 🔄 **URL Rewriting** - Intelligent URL rewriting system ensuring all links work properly
- 📊 **Health Monitoring** - Built-in health check APIs and status monitoring features
- 🔐 **Password Protection** - Optional password protection for access control

## Quick Start

### Prerequisites

- Node.js 20+
- Wrangler CLI (`npm install -g wrangler`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/omnibox.git
cd omnibox

# Install dependencies
npm install
```

### Local Development

```bash
# Start local development server
npm run dev
```

### Deployment

```bash
# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Workers
npm run deploy
```

## Configuration

### Environment Variables

Set these in `wrangler.toml` or via Cloudflare Dashboard:

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug mode | `false` |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | `warn` |
| `PROXY_PASSWORD` | Access password (empty = no password) | `""` |
| `SHOW_PASSWORD_PAGE` | Show password input page | `true` |
| `MAX_CACHE_SIZE` | Max cache size per item (bytes) | `1048576` |

### KV Namespace

1. Create a KV namespace in Cloudflare Dashboard
2. Update `wrangler.toml` with your KV namespace ID:

```toml
[[kv_namespaces]]
binding = "KV_CACHE"
id = "your-kv-namespace-id"
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/status` | GET | Service status |
| `/api/cache/clear` | POST | Clear cache |

## Usage

Access any website by appending its URL:

```
https://your-worker.workers.dev/github.com
https://your-worker.workers.dev/https://github.com
```

## Security Notes

- **Do not log into important accounts** through the proxy service
- Password protection is recommended for production use
- Use Cloudflare Secrets for sensitive configuration

## License

MIT License
