export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { access_token, dates } = req.body || {};
  if (!access_token || !dates) return res.status(400).json({ error: 'Missing params' });

  const r = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filters: {
        dateFilter: { dates },
        mediaTypeFilter: { mediaTypes: ['PHOTO'] }
      },
      pageSize: 100
    })
  });

  const data = await r.json();
  res.status(r.status).json(data);
}
