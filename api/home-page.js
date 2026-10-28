const fs = require('fs');
const path = require('path');
const store = require('../lib/content-store');
const { group, card, embed, fill } = require('../lib/list-pages');
module.exports = async function handler(req, res) {
  if (req.method && !['GET', 'HEAD'].includes(req.method)) {
    res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); res.end(); return;
  }
  try {
    const content = group(await store.all());
    let html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    for (const [type, limit] of [['saints', 5], ['churches', 3], ['articles', 3], ['events', 3], ['prayers', 12]]) {
      html = fill(html, `${type}List`, content[type].slice(0, limit).map(item => card(item, type)).join(''));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.end(req.method === 'HEAD' ? '' : embed(html, content));
  } catch (error) { store.unavailable(res); }
};
