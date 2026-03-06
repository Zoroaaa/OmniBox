// Utility Functions Module
// Common helper functions used across the OmniBox proxy worker

import { CONFIG, type EnvVariables } from './config.js';

export interface CorsHeaders {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
  'Access-Control-Allow-Credentials': string;
  'Access-Control-Max-Age': string;
  'Access-Control-Expose-Headers': string;
  'X-OmniBox-Proxy-Version': string;
  [key: string]: string;
}

export function getUnrestrictedCorsHeaders(): CorsHeaders {
  return {
    ...CONFIG.HEADERS.CORS_HEADERS,
    'X-OmniBox-Proxy-Version': CONFIG.VERSION,
    ...CONFIG.HEADERS.ADD_HEADERS
  } as CorsHeaders;
}

export function getCookie(cookieName: string, cookies: string | null): string {
  if (!cookies || !cookieName) return '';

  try {
    const cookieRegex = new RegExp(cookieName + '=([^;]+)');
    const match = cookieRegex.exec(cookies);
    return match ? decodeURIComponent(match[1]) : '';
  } catch (error) {
    console.error('Cookie extraction error:', error);
    return '';
  }
}

export function getHTMLResponse(
  html: string,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): Response {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...getUnrestrictedCorsHeaders(),
      ...additionalHeaders
    }
  });
}

export function generateRequestId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createJsonHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...getUnrestrictedCorsHeaders()
  };
}

export interface LogContext {
  module?: string;
  operation?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  module?: string;
  operation?: string;
  context?: Record<string, unknown>;
  requestId?: string;
  version: string;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

export class Logger {
  private level: LogLevel;
  private module: string;
  private requestId: string | null;
  private version: string;

  constructor(module: string, env: EnvVariables = {}) {
    this.module = module;
    this.level = (env.LOG_LEVEL as LogLevel) || 'warn';
    this.requestId = null;
    this.version = CONFIG.VERSION;
  }

  setRequestId(requestId: string | null): void {
    this.requestId = requestId;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }

  private formatEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      module: this.module,
      version: this.version
    };

    if (this.requestId) {
      entry.requestId = this.requestId;
    }

    if (context) {
      const { module: _, operation, ...rest } = context;
      if (operation) entry.operation = operation;
      if (Object.keys(rest).length > 0) {
        entry.context = rest as Record<string, unknown>;
      }
    }

    return entry;
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const entry = this.formatEntry('error', message, context);
      console.error(JSON.stringify(entry));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      const entry = this.formatEntry('warn', message, context);
      console.warn(JSON.stringify(entry));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      const entry = this.formatEntry('info', message, context);
      console.info(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      const entry = this.formatEntry('debug', message, context);
      console.log(JSON.stringify(entry));
    }
  }

  time(label: string): () => number {
    const start = Date.now();
    const fullLabel = `[${this.module}] ${label}`;

    return (): number => {
      const duration = Date.now() - start;
      this.debug(`${fullLabel}: ${duration}ms`);
      return duration;
    };
  }

  static create(module: string, env: EnvVariables = {}): Logger {
    return new Logger(module, env);
  }
}
