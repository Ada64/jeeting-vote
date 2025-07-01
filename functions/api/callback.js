export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('No code', { status: 400 });

  const clientId = '1389376514763526196';
  const clientSecret = 'BPYA2lJBImlFS_jfyvN3qZNIlxj2I803';
  const redirectUri = 'https://miguel-vote.pages.dev/api/callback';

  // ex. code for tkn
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      scope: 'identify'
    })
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return new Response('Failed to get token: ' + err, { status: 400 });
  }

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return new Response('No token', { status: 400 });

  // get pmo info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  if (!userRes.ok) {
    const err = await userRes.text();
    return new Response('Failed to get user: ' + err, { status: 400 });
  }
  const user = await userRes.json();

  // cookie (still KV storage available)
  return new Response(
    `<script>window.location.href='/'</script>`,
    {
      headers: {
        'Set-Cookie': `discord_id=${user.id}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        'Content-Type': 'text/html'
      }
    }
  );
} 