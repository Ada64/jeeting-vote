export async function onRequest(context) {
  return Response.redirect("https://discord.com/oauth2/authorize?client_id=1389376514763526196&response_type=code&redirect_uri=++https%3A%2F%2Fmiguel-vote.pages.dev%2Fapi%2Fcallback&scope=identify", 302);
} 