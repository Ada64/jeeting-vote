let votedIPs = new Set();

export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'GET') {
    // Get discord_id from cookie
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/discord_id=([^;]+)/);
    const discordId = match ? match[1] : null;
    if (!discordId) {
      return new Response(JSON.stringify({ voted: false, error: 'Not logged in' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    try {
      const hasVoted = await env.VOTES_KV.get(`voted_${discordId}`);
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