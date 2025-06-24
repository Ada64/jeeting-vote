// In-memory storage for tracking voted IPs
let votedIPs = new Set();

export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'GET') {
    // Get client IP address
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'unknown';
    
    // Check if IP has voted
    const hasVoted = votedIPs.has(clientIP);
    
    return new Response(JSON.stringify({ voted: hasVoted }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
} 