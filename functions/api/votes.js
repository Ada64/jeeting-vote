export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'GET') {
    let votes = 0;
    
    try {
      const storedVotes = await env.VOTES_KV.get('total_votes');
      votes = storedVotes ? parseInt(storedVotes) : 0;
    } catch (e) {
      votes = 0;
    }
    
    return new Response(JSON.stringify({ votes }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
} 