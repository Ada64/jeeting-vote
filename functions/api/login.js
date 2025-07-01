export async function onRequest(context) {
  const redirectUri = encodeURIComponent('https://miguel-vote.pages.dev/api/callback');
  const clientId = '1389376514763526196';
  const scope = 'identify';
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
  return Response.redirect(discordAuthUrl, 302);
} 