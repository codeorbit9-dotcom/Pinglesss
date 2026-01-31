
/**
 * PINGLESS CLOUDFLARE WORKER PROXY ENGINE
 * Enhanced with Target Key Injection support.
 */

interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
  put(key: string, value: string | ReadableStream | ArrayBuffer | FormData, options?: any): Promise<void>;
}

export interface Env {
  PINGLESS_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // 1. Extract API Key
    const apiKey = request.headers.get("X-Pingless-Key");
    if (!apiKey) {
      return this.errorResponse("Missing API Key (X-Pingless-Key header required)", 401);
    }

    // 2. Extract Target URL
    const targetUrlStr = request.headers.get("X-Pingless-Target");
    if (!targetUrlStr) {
      return this.errorResponse("Missing Target URL (X-Pingless-Target header required)", 400);
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(targetUrlStr);
    } catch (e) {
      return this.errorResponse("Invalid Target URL format", 400);
    }

    // 3. Verify API Key & Plan Limits
    // Key data structure in KV: { name, usage, limit, status, userId, targetApiKey }
    const keyData = await env.PINGLESS_KV.get(`key:${apiKey}`, "json");
    if (!keyData) {
      return this.errorResponse("Unauthorized: Invalid API Key", 401);
    }

    if (keyData.status !== 'active') {
      return this.errorResponse("Forbidden: API Key is disabled", 403);
    }

    if (keyData.usage >= keyData.limit) {
      return this.errorResponse("Rate Limit Exceeded: Please upgrade your Pingless plan", 429);
    }

    // 4. FIREWALL ENFORCEMENT
    const clientIP = request.headers.get("CF-Connecting-IP") || "";
    const isBlockedIP = await env.PINGLESS_KV.get(`rule:block:ip:${clientIP}`);
    if (isBlockedIP) {
      return this.errorResponse(`Access Denied: IP ${clientIP} is blocked by firewall`, 403);
    }

    const targetHost = targetUrl.hostname;
    const isBlockedDomain = await env.PINGLESS_KV.get(`rule:block:domain:${targetHost}`);
    if (isBlockedDomain) {
      return this.errorResponse(`Access Denied: Destination domain ${targetHost} is restricted`, 403);
    }

    const targetPath = targetUrl.pathname;
    const isBlockedPath = await env.PINGLESS_KV.get(`rule:block:path:${targetPath}`);
    if (isBlockedPath) {
      return this.errorResponse(`Access Denied: Path ${targetPath} is restricted by edge policy`, 403);
    }

    // 5. Proxy Request to Target
    const proxyHeaders = new Headers(request.headers);
    
    // Remove Pingless-specific headers
    proxyHeaders.delete("X-Pingless-Key");
    proxyHeaders.delete("X-Pingless-Target");
    
    // IMPORTANT: Inject Target Key if it exists in metadata
    if (keyData.targetApiKey) {
      // Common pattern: Inject as Bearer token if not already present
      if (!proxyHeaders.has("Authorization")) {
        proxyHeaders.set("Authorization", `Bearer ${keyData.targetApiKey}`);
      }
    }
    
    proxyHeaders.set("Host", targetHost);

    try {
      const forwardedResponse = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: proxyHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : null,
        redirect: 'follow'
      });

      // 6. Post-Response Tasks: Increment Usage
      const newUsage = (keyData.usage || 0) + 1;
      await env.PINGLESS_KV.put(`key:${apiKey}`, JSON.stringify({ ...keyData, usage: newUsage }));

      return forwardedResponse;
    } catch (err) {
      return this.errorResponse("Gateway Error: Unable to reach target API", 502);
    }
  },

  errorResponse(message: string, status: number): Response {
    return new Response(JSON.stringify({ 
      success: false, 
      error: message,
      timestamp: new Date().toISOString()
    }), { 
      status,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
