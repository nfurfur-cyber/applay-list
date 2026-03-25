export default async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const instances = [
    'https://inv.nadeko.net',
    'https://invidious.fdn.fr',
    'https://vid.puffyan.us',
    'https://invidious.nerdvpn.de'
  ];

  for (const instance of instances) {
    try {
      const response = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(q)}&type=video`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!response.ok) continue;
      const data = await response.json();
      const items = data.filter(i => i.videoId).slice(0, 8).map(item => ({
        v: item.videoId,
        t: item.title || '',
        a: item.author || ''
      }));
      return res.json(items);
    } catch (e) {
      continue;
    }
  }

  return res.status(502).json({ error: 'All search instances failed' });
}
