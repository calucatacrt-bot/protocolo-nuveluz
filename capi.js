export default async function handler(req, res) {
  try {
    const { event_name = 'PageView', event_source_url } = req.body || {};
    const PIXEL_ID = process.env.PIXEL_ID || '1234567890123456';
    const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) return res.status(200).json({ ok: true, skipped: 'no token yet' });
    const fbRes = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name,
          event_time: Math.floor(Date.now()/1000),
          action_source: 'website',
          event_source_url: event_source_url || req.headers.referer || 'https://protocolo.nuveluz.com/descubre',
          user_data: {
            client_user_agent: req.headers['user-agent'],
            fbc: req.cookies?._fbc || undefined,
            fbp: req.cookies?._fbp || undefined
          }
        }]
      })
    });
    const data = await fbRes.json();
    res.status(200).json({ ok: true, fb: data });
  } catch(e){ res.status(200).json({ ok: false, error: String(e) }) }
}
