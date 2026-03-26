module.exports = async function handler(req, res) {
  const v = req.query.v;
  if (!v) return res.status(400).json({ dur: 0, cat: '', error: true });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  // 1차: YouTube Data API
  const YT_KEY = 'AIzaSyC6AQw8olBFz_7bAu-FkJNGx09J0AnYm8I';
  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${v}&key=${YT_KEY}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (r.ok) {
      const data = await r.json();
      if (data.items && data.items.length) {
        const item = data.items[0];
        const iso = item.contentDetails.duration;
        const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const dur = match ? (parseInt(match[1]||0)*3600)+(parseInt(match[2]||0)*60)+parseInt(match[3]||0) : 0;
        const cat = item.snippet.categoryId || '';
        return res.json({ dur, cat, error: false });
      }
    }
  } catch (e) {}

  // 2차: YouTube 내부 API (youtubei) - 쿼터 무관
  try {
    const r = await fetch(
      'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          videoId: v,
          context: { client: { clientName: 'WEB', clientVersion: '2.20231219.04.00' } }
        }),
        signal: AbortSignal.timeout(5000)
      }
    );
    if (r.ok) {
      const data = await r.json();
      const dur = parseInt(data?.videoDetails?.lengthSeconds || '0');
      const cat = data?.microformat?.playerMicroformatRenderer?.category || '';
      // youtubei의 category는 "Music" 문자열 → "10"으로 변환
      const catId = cat === 'Music' ? '10' : (cat === 'Entertainment' ? '24' : '');
      return res.json({ dur, cat: catId, error: false });
    }
  } catch (e) {}

  return res.json({ dur: 0, cat: '', error: true });
};
