// In-memory storage (will reset on function restart, but no 15-min timeout!)
let votes = 0;
let votedIPs = new Set(); // Track IPs that have voted

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'POST') {
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'unknown';
    
    try {
      const hasVoted = await env.VOTES_KV.get(`voted_${clientIP}`);
      if (hasVoted) {
        return new Response(JSON.stringify({ error: 'Already voted' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      let currentVotes = 0;
      const storedVotes = await env.VOTES_KV.get('total_votes');
      currentVotes = storedVotes ? parseInt(storedVotes) : 0;
      
      await env.VOTES_KV.put(`voted_${clientIP}`, 'true', { expirationTtl: 86400 });
      await env.VOTES_KV.put('total_votes', (currentVotes + 1).toString());
      
      return new Response(JSON.stringify({ 
        success: true, 
        votes: currentVotes + 1
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
} 