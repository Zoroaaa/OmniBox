// Enhanced Proxy Handler - Core Proxy Logic
// Handles all proxy-related functionality for OmniBox

import { CONFIG, type EnvVariables } from './config.js';
import { ContentInjector } from './injector.js';
import { getMainPageTemplate, getPasswordPageTemplate, getErrorPageTemplate } from './templates.js';
import { getCookie, getHTMLResponse, getUnrestrictedCorsHeaders } from './utils.js';
import { CacheManager } from './cache.js';

export interface RedirectResult {
  redirect: true;
  response: Response;
}

function replaceProxyUrls(value: string, actualUrl: URL): string {
  const proxyHttps = (globalThis as any).thisProxyServerUrlHttps;
  const proxyHost = (globalThis as any).thisProxyServerUrl_hostOnly;

  if (!proxyHttps || !proxyHost) return value;

  return value
    .replaceAll(`${proxyHttps}http`, 'http')
    .replaceAll(proxyHttps, `${actualUrl.protocol}//${actualUrl.hostname}/`)
    .replaceAll(proxyHttps.slice(0, -1), `${actualUrl.protocol}//${actualUrl.hostname}`)
    .replaceAll(proxyHost, actualUrl.host);
}

export class ProxyHandler {
  private env: EnvVariables;
  private cacheManager: CacheManager | null;
  private injector: ContentInjector;
  private password: string;
  private showPasswordPage: boolean;

  constructor(env: EnvVariables, cacheManager: CacheManager | null) {
    this.env = env;
    this.cacheManager = cacheManager;
    this.injector = new ContentInjector();
    this.password = env.PROXY_PASSWORD || CONFIG.DEFAULT_PASSWORD;
    this.showPasswordPage = env.SHOW_PASSWORD_PAGE !== 'false';
  }

  async handleRequest(request: Request): Promise<Response> {
    const userAgent = request.headers.get('User-Agent');
    if (userAgent && userAgent.includes('Bytespider')) {
      return getHTMLResponse(CONFIG.CRAWLER_BLOCK_MESSAGE);
    }

    const siteCookie = request.headers.get('Cookie');
    if (this.password && !this.validatePassword(siteCookie)) {
      return this.handleWrongPassword();
    }

    const url = new URL(request.url);

    if (request.url.endsWith('favicon.ico')) {
      return Response.redirect('https://www.baidu.com/favicon.ico', 302);
    }

    if (request.url.endsWith('robots.txt')) {
      return new Response(CONFIG.ROBOTS_TXT, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const actualUrlStr = this.extractActualUrl(url);

    if (actualUrlStr === '') {
      return getHTMLResponse(getMainPageTemplate());
    }

    const actualUrl = this.validateAndNormalizeUrl(actualUrlStr, siteCookie);
    if (typeof actualUrl === 'object' && 'redirect' in actualUrl) {
      return actualUrl.response;
    }

    return await this.processProxyRequest(request, actualUrl as URL, siteCookie);
  }

  validatePassword(siteCookie: string | null): boolean {
    if (!this.password) return true;

    if (!siteCookie) return false;

    const pwd = getCookie(CONFIG.PASSWORD_COOKIE_NAME, siteCookie);
    return this.constantTimeCompare(pwd, this.password);
  }

  private constantTimeCompare(a: string, b: string): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }

    const lenA = a.length;
    const lenB = b.length;

    let result = lenA ^ lenB;

    const minLen = Math.min(lenA, lenB);
    for (let i = 0; i < minLen; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  private handleWrongPassword(): Response {
    if (this.showPasswordPage) {
      return getHTMLResponse(getPasswordPageTemplate(CONFIG.PASSWORD_COOKIE_NAME));
    } else {
      return getHTMLResponse('<h1>403 Forbidden</h1><br>You do not have access to view this webpage.');
    }
  }

  private extractActualUrl(url: URL): string {
    const pathIndex = url.pathname.indexOf(CONFIG.URL_SEPARATOR);
    if (pathIndex === -1) return '';

    let extractedUrl = url.pathname.substring(pathIndex + CONFIG.URL_SEPARATOR.length) +
           url.search + url.hash;

    try {
      const decodedUrl = decodeURIComponent(extractedUrl);
      if (decodedUrl !== extractedUrl && this.looksLikeEncodedUrl(extractedUrl)) {
        extractedUrl = decodedUrl;
      }
    } catch {
      // URL 解码失败，保持原样
    }

    return extractedUrl;
  }

  private looksLikeEncodedUrl(url: string): boolean {
    return url.includes('%3A%2F%2F') ||
           url.includes('%2F') ||
           url.includes('%3A') ||
           url.includes('%3F') ||
           url.includes('%3D') ||
           url.includes('%26');
  }

  private validateAndNormalizeUrl(actualUrlStr: string, siteCookie: string | null): URL | RedirectResult {
    try {
      let testUrl = actualUrlStr;
      if (!testUrl.startsWith('http')) {
        testUrl = 'https://' + testUrl;
      }

      const urlObj = new URL(testUrl);
      if (!urlObj.host.includes('.')) {
        throw new Error('Invalid host');
      }
    } catch {
      if (siteCookie) {
        const lastVisit = getCookie(CONFIG.LAST_VISIT_COOKIE_NAME, siteCookie);
        if (lastVisit) {
          return {
            redirect: true,
            response: Response.redirect(`${(globalThis as any).thisProxyServerUrlHttps}${lastVisit}/${actualUrlStr}`, 302)
          };
        }
      }
      return {
        redirect: true,
        response: getHTMLResponse(getErrorPageTemplate('URL 格式错误', `无效的网址格式: ${actualUrlStr}`, 400))
      };
    }

    if (!actualUrlStr.startsWith('http') && !actualUrlStr.includes('://')) {
      return {
        redirect: true,
        response: Response.redirect(`${(globalThis as any).thisProxyServerUrlHttps}https://${actualUrlStr}`, 302)
      };
    }

    const actualUrl = new URL(actualUrlStr);

    if (actualUrlStr !== actualUrl.href) {
      return {
        redirect: true,
        response: Response.redirect(`${(globalThis as any).thisProxyServerUrlHttps}${actualUrl.href}`, 302)
      };
    }

    return actualUrl;
  }

  private async processProxyRequest(request: Request, actualUrl: URL, siteCookie: string | null): Promise<Response> {
    const clientHeaders = this.modifyClientHeaders(request.headers, actualUrl);

    const clientBody = await this.modifyClientBody(request, actualUrl);

    const modifiedRequest = new Request(actualUrl, {
      headers: clientHeaders,
      method: request.method,
      body: clientBody,
      redirect: 'manual'
    });

    const response = await fetch(modifiedRequest);

    if (response.status.toString().startsWith('3') && response.headers.get('Location')) {
      try {
        const redirectUrl = new URL(response.headers.get('Location')!, actualUrl.href).href;
        return Response.redirect(`${(globalThis as any).thisProxyServerUrlHttps}${redirectUrl}`, 302);
      } catch {
        return getHTMLResponse(
          getErrorPageTemplate('重定向错误', `无法处理重定向: ${response.headers.get('Location')}`, 500)
        );
      }
    }

    return await this.processResponse(response, actualUrl, siteCookie);
  }

  private modifyClientHeaders(headers: Headers, actualUrl: URL): Headers {
    const modifiedHeaders = new Headers();

    headers.forEach((value, key) => {
      const newValue = replaceProxyUrls(value, actualUrl);
      modifiedHeaders.set(key, newValue);
    });

    return modifiedHeaders;
  }

  private async modifyClientBody(request: Request, actualUrl: URL): Promise<ReadableStream | string | null> {
    if (!request.body) return null;

    try {
      const [body1, body2] = request.body.tee();
      const bodyText = await new Response(body1).text();

      if (bodyText.includes((globalThis as any).thisProxyServerUrlHttps) ||
          bodyText.includes((globalThis as any).thisProxyServerUrl_hostOnly)) {
        return bodyText
          .replaceAll((globalThis as any).thisProxyServerUrlHttps, actualUrl.href)
          .replaceAll((globalThis as any).thisProxyServerUrl_hostOnly, actualUrl.host);
      } else {
        return body2;
      }
    } catch {
      return request.body;
    }
  }

  private async processResponse(response: Response, actualUrl: URL, siteCookie: string | null): Promise<Response> {
    const contentType = response.headers.get('Content-Type') || '';
    const hasProxyHintCookie = getCookie(CONFIG.PROXY_HINT_COOKIE_NAME, siteCookie) !== '';

    let modifiedResponse: Response;
    let isHTML = false;

    const isTextContent = contentType.startsWith('text/');
    const isPotentialHTML = contentType.includes('html') || 
                           contentType.includes('javascript') ||
                           contentType === '' ||
                           contentType === 'application/octet-stream' ||
                           contentType.includes('application/x-typescript') ||
                           contentType.includes('application/typescript');

    if (response.body && (isTextContent || isPotentialHTML)) {
      let body = await response.text();
      
      const actualContentType = this.detectActualContentType(body, contentType);
      isHTML = actualContentType.includes('text/html') && body.includes('<html');

      if (actualContentType.includes('html') || actualContentType.includes('javascript')) {
        body = body.replaceAll('window.location', `window.${CONFIG.REPLACE_URL_OBJ}`);
        body = body.replaceAll('document.location', `document.${CONFIG.REPLACE_URL_OBJ}`);
      }

      if (isHTML) {
        body = await this.injector.injectHTML(body, actualUrl.href, hasProxyHintCookie);
      } else if (isTextContent || actualContentType.includes('javascript')) {
        body = this.injector.replaceURLsInText(body);
      }

      modifiedResponse = new Response(body, response);
      
      if (contentType !== actualContentType && isHTML) {
        modifiedResponse.headers.set('Content-Type', 'text/html; charset=utf-8');
      }
    } else {
      modifiedResponse = new Response(response.body, response);
    }

    this.processCookies(modifiedResponse, actualUrl, isHTML, hasProxyHintCookie);

    this.removeRestrictiveHeaders(modifiedResponse, hasProxyHintCookie);

    return modifiedResponse;
  }

  private detectActualContentType(body: string, declaredContentType: string): string {
    if (declaredContentType.includes('text/html')) {
      return declaredContentType;
    }

    const trimmedBody = body.trim();
    
    if (trimmedBody.startsWith('<!DOCTYPE') || 
        trimmedBody.startsWith('<html') || 
        trimmedBody.startsWith('<HTML') ||
        (trimmedBody.startsWith('<') && trimmedBody.includes('<head') && trimmedBody.includes('<body'))) {
      return 'text/html; charset=utf-8';
    }

    if (trimmedBody.startsWith('<script') || 
        trimmedBody.includes('function ') ||
        trimmedBody.includes('const ') ||
        trimmedBody.includes('let ') ||
        trimmedBody.includes('var ')) {
      if (declaredContentType.includes('typescript') || declaredContentType === 'application/octet-stream') {
        return 'application/javascript; charset=utf-8';
      }
    }

    return declaredContentType || 'text/plain';
  }

  private processCookies(response: Response, actualUrl: URL, isHTML: boolean, hasProxyHintCookie: boolean): void {
    const headers = response.headers;
    const cookieHeaders: Array<{ headerName: string; headerValue: string }> = [];

    for (const [key, value] of headers.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        cookieHeaders.push({ headerName: key, headerValue: value });
      }
    }

    cookieHeaders.forEach(cookieHeader => {
      const cookies = cookieHeader.headerValue.split(',').map(cookie => cookie.trim());

      for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split(';').map(part => part.trim());

        const pathIndex = parts.findIndex(part => part.toLowerCase().startsWith('path='));
        let originalPath = '/';
        if (pathIndex !== -1) {
          originalPath = parts[pathIndex].substring('path='.length);
        }

        const absolutePath = '/' + new URL(originalPath, actualUrl.href).href;

        if (pathIndex !== -1) {
          parts[pathIndex] = `Path=${absolutePath}`;
        } else {
          parts.push(`Path=${absolutePath}`);
        }

        const domainIndex = parts.findIndex(part => part.toLowerCase().startsWith('domain='));
        if (domainIndex !== -1) {
          parts[domainIndex] = `domain=${(globalThis as any).thisProxyServerUrl_hostOnly}`;
        } else {
          parts.push(`domain=${(globalThis as any).thisProxyServerUrl_hostOnly}`);
        }

        cookies[i] = parts.join('; ');
      }

      headers.set(cookieHeader.headerName, cookies.join(', '));
    });

    if (isHTML && response.status === 200) {
      const lastVisitCookie = `${CONFIG.LAST_VISIT_COOKIE_NAME}=${actualUrl.origin}; Path=/; Domain=${(globalThis as any).thisProxyServerUrl_hostOnly}`;
      headers.append('Set-Cookie', lastVisitCookie);

      if (!hasProxyHintCookie) {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000);
        const hintCookie = `${CONFIG.PROXY_HINT_COOKIE_NAME}=1; expires=${expiryDate.toUTCString()}; path=/`;
        headers.append('Set-Cookie', hintCookie);
      }
    }
  }

  private removeRestrictiveHeaders(response: Response, hasProxyHintCookie: boolean): void {
    const headers = response.headers;

    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('X-Frame-Options', 'ALLOWALL');

    CONFIG.HEADERS.REMOVE_HEADERS.forEach(header => {
      headers.delete(header);
    });

    if (!hasProxyHintCookie) {
      headers.set('Cache-Control', 'max-age=0');
    }

    Object.entries(getUnrestrictedCorsHeaders()).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
}
