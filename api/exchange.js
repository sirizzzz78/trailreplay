export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  const r = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    })
  });

  const data = await r.json();
  if (data.errors || !data.access_token) {
    return res.status(400).send('Auth failed: ' + JSON.stringify(data));
  }

  const params = new URLSearchParams({
    access_token:  data.access_token,
    refresh_token: data.refresh_token,
    expires_at:    data.expires_at,
    athlete_name:  data.athlete?.firstname || ''
  });

  res.redirect(`/?${params}`);
}
