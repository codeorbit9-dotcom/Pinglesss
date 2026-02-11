
/**
 * VERCEL EDGE PROXY
 * This function runs on Vercel's Global Edge Network.
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Pingless-Key, X-Pingless-Target',
      },
    });
  }

  try {
    // 1. Extract Headers
    const apiKey = request.headers.get("X-Pingless-Key");
    const targetUrlStr = request.headers.get("X-Pingless-Target");

    // 2. Validate Input
    if (!apiKey) {
      return errorResponse("Missing API Key (X-Pingless-Key header required)", 401);
    }

    if (!targetUrlStr) {
      return errorResponse("Missing Target URL (X-Pingless-Target header required)", 400);
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(targetUrlStr);
    } catch (e) {
      return errorResponse("Invalid Target URL format", 400);
    }

    // 3. Security Checks (Demo Simulation)
    if (apiKey === 'ping_blocked_key') {
      return errorResponse("Access Denied: API Key has been revoked.", 403);
    }

    // 4. Construct Proxy Request
    const proxyHeaders = new Headers(request.headers);
    // Remove proxy-specific headers before forwarding
    proxyHeaders.delete("X-Pingless-Key");
    proxyHeaders.delete("X-Pingless-Target");
    proxyHeaders.delete("Host");
    // Ensure we claim the correct host for the target
    proxyHeaders.set("Host", targetUrl.hostname);

    // Prepare body only for methods that support it
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const body = hasBody ? await request.arrayBuffer() : null;

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body,
      redirect: 'follow',
    });

    // 5. Construct Response
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Edge-Runtime', 'Vercel');
    newHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

  } catch (err: any) {
    console.error("Proxy Error:", err);
    return errorResponse(`Gateway Error: ${err.message || "Unknown error"}`, 502);
  }
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    edge: "Vercel"
  }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
