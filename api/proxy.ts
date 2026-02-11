
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Handle CORS preflight
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
    const apiKey = request.headers.get("X-Pingless-Key");
    const targetUrlStr = request.headers.get("X-Pingless-Target");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing X-Pingless-Key" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (!targetUrlStr) {
      return new Response(JSON.stringify({ error: "Missing X-Pingless-Target" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(targetUrlStr);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid Target URL" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Prepare Request
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete("X-Pingless-Key");
    proxyHeaders.delete("X-Pingless-Target");
    proxyHeaders.delete("Host");
    proxyHeaders.set("Host", targetUrl.hostname);

    // Forward Request
    const body = (request.method !== 'GET' && request.method !== 'HEAD') 
      ? await request.arrayBuffer() 
      : null;

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: proxyHeaders,
      body,
      redirect: 'follow',
    });

    // Handle Response
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('X-Edge-Runtime', 'Vercel-Pingless');
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (err: any) {
    return new Response(JSON.stringify({
      error: "Proxy Gateway Error",
      details: err.message
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
