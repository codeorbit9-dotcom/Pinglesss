
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  
  return new Response(JSON.stringify({
    message: "Pingless Target Reached Successfully",
    method: request.method,
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString(),
    path: url.pathname,
    query: Object.fromEntries(url.searchParams)
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
