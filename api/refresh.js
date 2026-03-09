export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { refresh_token } = req.body || {};
  if (!refresh_token) return res.status(400).json({ error: 'Missing refresh_token' });

  const r = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token,
      grant_type: 'refresh_token'
    })
  });

  const data = await r.json();
  res.json(data);
}
