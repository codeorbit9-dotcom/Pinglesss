
export const config = {
  runtime: 'edge',
};

// Security: Whitelist allowed domains to prevent open proxy abuse
const ALLOWED_TARGET = "https://generativelanguage.googleapis.com";

export default async function handler(request: Request) {
  // 1. CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 2. Security Checks
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed. Use POST." }), { status: 405 });
  }

  try {
    // 3. Get API Key from Server Environment (Never Client)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in Vercel environment variables.");
      return new Response(JSON.stringify({ error: "Server Misconfiguration: API Key missing" }), { status: 500 });
    }

    // 4. Construct Secure Upstream URL
    // Using gemini-1.5-flash as the current standard fast model. 
    // If 2.5 becomes available via API, simply update this string.
    const model = "gemini-1.5-flash"; 
    const upstreamUrl = `${ALLOWED_TARGET}/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    // 5. Read Client Body
    let clientBody;
    try {
      clientBody = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
    }

    // 6. Call Google Gemini
    const googleResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientBody)
    });

    // 7. Handle Google Errors
    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error("Gemini API Error:", errorText);
      return new Response(errorText, { 
        status: googleResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 8. Return Successful Response
    const data = await googleResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Backend-Runtime': 'Vercel-Gemini-Secure'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
