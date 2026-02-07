
/**
 * VERCEL EDGE PROXY (Replaces Cloudflare Worker)
 * 
 * This function runs on Vercel's Edge Network.
 * LIMITATIONS:
 * 1. Stateless: Does not connect to Firebase/Firestore directly for low latency.
 * 2. Non-Persistent Logging: Logs are not saved to DB in this demo.
 * 3. Simulation: Uses heuristics to simulate blocking for the demo.
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  
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

  // 3. EDGE ENFORCEMENT (DEMO MODE)
  // Since we don't have KV sync in Vercel Edge (without Redis), we simulate firewall rules.
  
  // Simulation: Block specific "bad" keys
  if (apiKey === 'ping_blocked_key') {
    return errorResponse("Access Denied: API Key has been revoked.", 403);
  }

  // Simulation: Block IPs via header (x-forwarded-for)
  const clientIP = request.headers.get("x-forwarded-for") || "0.0.0.0";
  if (clientIP.includes("1.2.3.4")) { // Simulating a blocked IP
    return errorResponse(`Access Denied: IP ${clientIP} is blocked by firewall rules.`, 403);
  }

  // 4. Proxy Request
  const proxyHeaders = new Headers(request.headers);
  proxyHeaders.delete("X-Pingless-Key");
  proxyHeaders.delete("X-Pingless-Target");
  proxyHeaders.delete("Host"); // Let fetch set the host
  proxyHeaders.set("Host", targetUrl.hostname);

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : null,
      redirect: 'follow',
    });

    // 5. Response Handling
    // In a real app, we would push logs to a queue here (e.g. Tinybird, Upstash).
    // For this demo, we just pass the response back.
    
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Edge-Runtime', 'Vercel');
    newHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

  } catch (err) {
    return errorResponse("Gateway Error: Unable to reach target API. Ensure the target URL is public.", 502);
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
