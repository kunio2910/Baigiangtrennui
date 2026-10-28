// Local adapter for the same Vercel handlers. --fixture is offline and never writes Firestore.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../vercel.json');
if (process.argv.includes('--fixture')) {
  const { fixture, mockFetch } = require('../tests/seo.cjs'); global.fetch = mockFetch(fixture);
}
const types = { 'cac-thanh': 'saints', 'nha-tho': 'churches', 'bai-viet': 'articles', 'su-kien': 'events', 'cau-nguyen': 'prayers', 'giao-ly': 'catechism' };
const root = path.resolve(__dirname, '..');
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const redirect = config.redirects.find(x => x.source === url.pathname);
    if (redirect) { res.writeHead(308, { Location: redirect.destination }); res.end(); return; }
    req.query = Object.fromEntries(url.searchParams);
    const [category, slug] = url.pathname.split('/').filter(Boolean);
    let handler;
    if (url.pathname === '/') handler = 'home-page';
    if (url.pathname === '/sitemap.xml') handler = 'sitemap';
    if (types[category]) { handler = slug ? 'detail-page' : 'category-page'; Object.assign(req.query, { type: types[category], slug }); }
    if (handler) { await require(`../api/${handler}`)(req, res); return; }
    const rewrite = config.rewrites.find(x => x.source === url.pathname);
    const requested = rewrite?.destination || url.pathname;
    const file = path.resolve(root, '.' + requested);
    if (!file.startsWith(root + path.sep) || /[/\\](\.git|lib|api|tests|scripts)[/\\]/.test(file) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.txt': 'text/plain; charset=utf-8' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch (error) { res.writeHead(500); res.end(String(error)); }
});
server.listen(Number(process.env.PORT || 4175), '127.0.0.1', () => console.log('SEO preview: http://127.0.0.1:' + server.address().port));
module.exports = server;
