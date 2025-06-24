// In-memory storage for tracking voted IPs
let votedIPs = new Set();

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'GET') {
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'unknown';
    
    try {
      const hasVoted = await env.VOTES_KV.get(`voted_${clientIP}`);
      return new Response(JSON.stringify({ voted: !!hasVoted }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ voted: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
} 