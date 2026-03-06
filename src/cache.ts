// Enhanced Cache Manager for Cloudflare KV Storage
// Handles intelligent caching with TTL based on content types

import { CONFIG, type EnvVariables, type CacheTTLConfig } from './config.js';
import { Logger } from './utils.js';

export interface CacheData {
  body: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  expires: number;
  cachedAt: number;
  contentType: string;
  size: number;
}

export interface CacheStats {
  totalKeys: number;
  cachePrefix: string;
  ttlConfig: CacheTTLConfig;
  timestamp: string;
  error?: string;
}

export class CacheManager {
  private kv: KVNamespace | null;
  private env: EnvVariables;
  private defaultTTL: CacheTTLConfig;
  private logger: Logger;

  constructor(kv: KVNamespace | null, env: EnvVariables) {
    this.kv = kv;
    this.env = env;
    this.logger = Logger.create('CacheManager', env);
    this.defaultTTL = {
      HTML: parseInt(env.CACHE_HTML_TTL || String(CONFIG.CACHE_TTL.HTML), 10),
      CSS: parseInt(env.CACHE_CSS_TTL || String(CONFIG.CACHE_TTL.CSS), 10),
      JS: parseInt(env.CACHE_JS_TTL || String(CONFIG.CACHE_TTL.JS), 10),
      IMAGE: parseInt(env.CACHE_IMAGE_TTL || String(CONFIG.CACHE_TTL.IMAGE), 10),
      FONT: parseInt(env.CACHE_FONT_TTL || String(CONFIG.CACHE_TTL.FONT), 10),
      JSON: parseInt(env.CACHE_JSON_TTL || String(CONFIG.CACHE_TTL.JSON), 10),
      DEFAULT: parseInt(env.CACHE_DEFAULT_TTL || String(CONFIG.CACHE_TTL.DEFAULT), 10)
    };
  }

  private ensureKv(): KVNamespace | null {
    if (!this.kv) {
      this.logger.warn('KV storage not available');
    }
    return this.kv;
  }

  generateCacheKey(url: string, method: string = 'GET', headers: Record<string, string> = {}): string {
    try {
      const normalizedUrl = new URL(url);

      const cacheBustingParams = ['_t', 'timestamp', 'cachebuster', '_', 'nocache'];
      cacheBustingParams.forEach(param => {
        normalizedUrl.searchParams.delete(param);
      });

      const keyComponents = [
        CONFIG.CACHE_PREFIX,
        method.toUpperCase(),
        normalizedUrl.href.substring(0, 200)
      ];

      const relevantHeaders = ['accept', 'accept-encoding', 'user-agent'];
      relevantHeaders.forEach(headerName => {
        const headerValue = headers[headerName];
        if (headerValue) {
          keyComponents.push(`${headerName}:${headerValue.substring(0, 50)}`);
        }
      });

      return keyComponents.join('|');
    } catch (error) {
      this.logger.error('Cache key generation error', { error: String(error), url: url.substring(0, 100) });
      return `${CONFIG.CACHE_PREFIX}|${method}|${url.substring(0, 200)}`;
    }
  }

  getTTLForContentType(contentType: string | null): number {
    if (!contentType) return this.defaultTTL.DEFAULT;

    const type = contentType.toLowerCase();

    if (type.includes('html')) return this.defaultTTL.HTML;
    if (type.includes('css') || type.includes('stylesheet')) return this.defaultTTL.CSS;
    if (type.includes('javascript') || type.includes('ecmascript')) return this.defaultTTL.JS;
    if (type.includes('image/')) return this.defaultTTL.IMAGE;
    if (type.includes('font/') || type.includes('woff') || type.includes('ttf')) return this.defaultTTL.FONT;
    if (type.includes('json') || type.includes('application/json')) return this.defaultTTL.JSON;
    if (type.includes('video/') || type.includes('audio/')) return this.defaultTTL.IMAGE;

    return this.defaultTTL.DEFAULT;
  }

  async get(cacheKey: string): Promise<CacheData | null> {
    const kv = this.ensureKv();
    if (!kv) return null;

    try {
      const cached = await kv.get(cacheKey, 'json') as CacheData | null;
      if (!cached) return null;

      if (cached.expires && Date.now() > cached.expires) {
        kv.delete(cacheKey).catch(err => {
          this.logger.error('Failed to delete expired cache', { cacheKey, error: String(err) });
        });
        return null;
      }

      if (!cached.body || !cached.headers) {
        this.logger.warn('Invalid cache structure, deleting', { cacheKey });
        kv.delete(cacheKey).catch(() => {});
        return null;
      }

      return {
        body: cached.body,
        headers: cached.headers,
        status: cached.status || 200,
        statusText: cached.statusText || 'OK',
        cachedAt: cached.cachedAt,
        expires: cached.expires,
        contentType: cached.contentType,
        size: cached.size
      };
    } catch (error) {
      this.logger.error('Cache get error', { cacheKey, error: String(error) });
      return null;
    }
  }

  async set(cacheKey: string, response: Response, customTTL: number | null = null): Promise<void> {
    const kv = this.ensureKv();
    if (!kv) return;

    try {
      if (response.status < 200 || response.status >= 300) {
        return;
      }

      const maxSize = parseInt(this.env.MAX_CACHE_SIZE || String(CONFIG.MAX_CACHE_SIZE), 10);
      const cacheControl = response.headers.get('cache-control') || '';

      if (cacheControl.includes('private') || cacheControl.includes('no-store')) {
        return;
      }

      const responseClone = response.clone();
      const body = await responseClone.text();
      const bodySize = new TextEncoder().encode(body).length;

      if (bodySize > maxSize) {
        this.logger.warn('Response body too large to cache', { bodySize, maxSize });
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      const ttl = customTTL || this.getTTLForContentType(contentType);

      const cacheData: CacheData = {
        body: body,
        headers: Object.fromEntries(response.headers.entries()),
        status: response.status,
        statusText: response.statusText,
        expires: Date.now() + (ttl * 1000),
        cachedAt: Date.now(),
        contentType: contentType,
        size: bodySize
      };

      await kv.put(cacheKey, JSON.stringify(cacheData), {
        expirationTtl: ttl
      });

      this.logger.info('Cached response', { cacheKey, ttl, bodySize });

    } catch (error) {
      this.logger.error('Cache set error', { cacheKey, error: String(error) });
    }
  }

  async clearPattern(pattern: string): Promise<void> {
    const kv = this.ensureKv();
    if (!kv) return;

    try {
      this.logger.info('Clearing cache pattern', { pattern });

      const list = await kv.list({ prefix: pattern });
      const deletePromises = list.keys.map(key =>
        kv.delete(key.name).catch(err => {
          this.logger.error('Failed to delete cache key', { key: key.name, error: String(err) });
        })
      );

      await Promise.allSettled(deletePromises);
      this.logger.info('Cleared cache entries', { count: list.keys.length });

    } catch (error) {
      this.logger.error('Cache clear error', { pattern, error: String(error) });
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    return this.clearPattern(CONFIG.CACHE_PREFIX);
  }

  async getStats(): Promise<CacheStats> {
    const kv = this.ensureKv();

    if (!kv) {
      return {
        error: 'KV storage not available',
        totalKeys: 0,
        cachePrefix: CONFIG.CACHE_PREFIX,
        ttlConfig: this.defaultTTL,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const list = await kv.list({ prefix: CONFIG.CACHE_PREFIX });

      const stats: CacheStats = {
        totalKeys: list.keys.length,
        cachePrefix: CONFIG.CACHE_PREFIX,
        ttlConfig: this.defaultTTL,
        timestamp: new Date().toISOString()
      };

      return stats;

    } catch (error) {
      this.logger.error('Failed to get cache stats', { error: String(error) });
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        totalKeys: 0,
        cachePrefix: CONFIG.CACHE_PREFIX,
        ttlConfig: this.defaultTTL,
        timestamp: new Date().toISOString()
      };
    }
  }

  async preloadUrls(urls: string[]): Promise<void> {
    if (!Array.isArray(urls)) return;

    const kv = this.ensureKv();
    if (!kv) return;

    this.logger.info('Preloading URLs into cache', { count: urls.length });

    const preloadPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const cacheKey = this.generateCacheKey(url, 'GET');
          await this.set(cacheKey, response);
        }
      } catch (error) {
        this.logger.error('Failed to preload URL', { url, error: String(error) });
      }
    });

    await Promise.allSettled(preloadPromises);
    this.logger.info('Cache preloading completed');
  }
}
