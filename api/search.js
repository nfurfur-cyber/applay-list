module.exports = async function handler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  // 1차: YouTube Data API v3
  const YT_KEY = 'AIzaSyC6AQw8olBFz_7bAu-FkJNGx09J0AnYm8I';
  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(q)}&key=${YT_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (r.ok) {
      const data = await r.json();
      if (data.items && data.items.length) {
        return res.json(data.items.map(item => ({
          v: item.id.videoId,
          t: item.snippet.title || '',
          a: item.snippet.channelTitle || ''
        })));
      }
    }
  } catch (e) {}

  // 2차: YouTube 내부 API (youtubei) - API 키 불필요
  try {
    const r = await fetch(
      'https://www.youtube.com/youtubei/v1/search?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          query: q,
          context: { client: { clientName: 'WEB', clientVersion: '2.20231219.04.00' } }
        }),
        signal: AbortSignal.timeout(8000)
      }
    );
    if (r.ok) {
      const data = await r.json();
      const contents =
        data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
          ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
      const items = [];
      for (const c of contents) {
        const vr = c.videoRenderer;
        if (!vr || !vr.videoId) continue;
        items.push({
          v: vr.videoId,
          t: vr.title?.runs?.[0]?.text || '',
          a: vr.ownerText?.runs?.[0]?.text || ''
        });
        if (items.length >= 8) break;
      }
      if (items.length) return res.json(items);
    }
  } catch (e) {}

  return res.status(502).json({ error: 'Search failed' });
};
