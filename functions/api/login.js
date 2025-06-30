export async function onRequest(context) {
  const clientId = '1389376514763526196';
  const redirectUri = encodeURIComponent('https://miguel-vote.pages.dev/api/callback');
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
  return Response.redirect(discordAuthUrl, 302);
} 