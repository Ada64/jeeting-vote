let votes = 0;

export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ votes }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
} 