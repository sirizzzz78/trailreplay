export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type:    'authorization_code',
      redirect_uri:  'https://trailreplay.vercel.app/api/google-auth'
    })
  });

  const data = await r.json();
  if (!data.access_token) {
    return res.status(400).send('Google auth failed: ' + JSON.stringify(data));
  }

  const params = new URLSearchParams({
    google_access_token:  data.access_token,
    google_refresh_token: data.refresh_token || '',
    google_expires_in:    data.expires_in || 3600
  });

  res.redirect(`/?${params}`);
}
