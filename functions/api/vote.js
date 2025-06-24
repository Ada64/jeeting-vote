// In-memory storage (will reset on function restart, but no 15-min timeout!)
let votes = 0;
let votedIPs = new Set(); // Track IPs that have voted

export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'POST') {
    // Get client IP address
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'unknown';
    
    // Check if this IP has already voted
    if (votedIPs.has(clientIP)) {
      return new Response(JSON.stringify({ error: 'Already voted' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add IP to voted list and increment vote count
    votedIPs.add(clientIP);
    votes++;
    
    return new Response(JSON.stringify({ 
      success: true, 
      votes
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
} 