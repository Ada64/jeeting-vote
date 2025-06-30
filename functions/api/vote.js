let votes = 0;
let votedIPs = new Set();

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'POST') {
    // Get discord_id from cookie
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/discord_id=([^;]+)/);
    const discordId = match ? match[1] : null;
    if (!discordId) {
      return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    try {
      const hasVoted = await env.VOTES_KV.get(`voted_${discordId}`);
      if (hasVoted) {
        return new Response(JSON.stringify({ error: 'Already voted' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      let currentVotes = 0;
      const storedVotes = await env.VOTES_KV.get('total_votes');
      currentVotes = storedVotes ? parseInt(storedVotes) : 0;
      await env.VOTES_KV.put(`voted_${discordId}`, 'true');
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