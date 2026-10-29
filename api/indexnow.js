const HOST = 'www.baigiangtrennui.com';
const KEY = 'a30027f9cef7a9776f4201fb435c2190';
const windows = new Map();
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const reply = (status, value) => { res.statusCode = status; res.end(JSON.stringify(value)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, { error: 'Method not allowed' }); }
  if (req.headers.origin !== `https://${HOST}` || !String(req.headers['content-type'] || '').startsWith('application/json')) {
    return reply(403, { error: 'Same-site JSON requests required' });
  }
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return reply(400, { error: 'Invalid JSON' }); }
  if (!Array.isArray(body?.urls) || !body.urls.length || body.urls.length > 20) return reply(400, { error: 'Expected 1–20 URLs' });
  const urls = [...new Set(body.urls)];
  if (urls.some(value => {
    try {
      const url = new URL(value);
      return url.origin !== `https://${HOST}` || url.username || url.password || url.search || url.hash ||
        !/^\/(?:$|(?:cac-thanh|nha-tho|bai-viet|su-kien|cau-nguyen|giao-ly)(?:\/[a-z0-9-]+)?)$/.test(url.pathname);
    } catch { return true; }
  })) return reply(400, { error: 'Only canonical content URLs on this site are allowed' });
  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0];
  const now = Date.now();
  for (const [key, entry] of windows) if (now - entry.start > 60000) windows.delete(key);
  const window = windows.get(ip) || { start: now, count: 0 };
  if (window.count >= 30 || windows.size > 5000) { res.setHeader('Retry-After', '60'); return reply(429, { error: 'Retry later' }); }
  window.count++; windows.set(ip, window);
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
      signal: AbortSignal.timeout(10000),
    });
    if (![200, 202].includes(response.status)) {
      res.setHeader('Retry-After', '60'); return reply(503, { error: 'IndexNow unavailable', upstreamStatus: response.status });
    }
    return reply(response.status, { accepted: true, submitted: urls.length });
  } catch { res.setHeader('Retry-After', '60'); return reply(503, { error: 'IndexNow unavailable' }); }
};
