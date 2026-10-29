const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const fixture = Array.from({ length: 12 }, (_, i) => ({ id: `article-${i}`, type: 'articles',
  title: `Bài suy niệm ${i}`, seoSlug: `bai-suy-niem-${i}`, description: 'Lời Chúa và đời sống đức tin.',
  bodyHtml: '<p>Nội dung bài đọc.</p><a href="/giao-ly">Giáo lý</a>', status: 'actived', sortOrder: i,
  createdAt: '2026-01-01T00:00:00Z', contentUpdatedAt: '2026-02-02T00:00:00Z', updatedAt: '2026-10-28T00:00:00Z',
  previousSlugs: i === 0 ? ['duong-dan-cu'] : [], image: '/Default.jpg' }));
fixture.push({ ...fixture[0], id: 'hidden', seoSlug: 'hidden', status: 'unactived' });
function encode(value) {
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  if (typeof value === 'number') return { integerValue: String(value) };
  return { stringValue: value };
}
function doc(item) { return { name: `projects/test/documents/contents/${item.id}`, fields: Object.fromEntries(Object.entries(item).map(([k, v]) => [k, encode(v)])) }; }
function mockFetch(items, calls = []) {
  return async (url, options) => {
    calls.push(String(url));
    if (options?.body) {
      const f = JSON.parse(options.body).structuredQuery.where.fieldFilter;
      const matching = items.filter(item => f.op === 'ARRAY_CONTAINS' ? (item[f.field.fieldPath] || []).includes(f.value.stringValue) : item[f.field.fieldPath] === f.value.stringValue);
      return { ok: true, json: async () => matching.map(item => ({ document: doc(item) })) };
    }
    return { ok: true, json: async () => ({ documents: items.map(doc) }) };
  };
}
function fresh() {
  for (const key of Object.keys(require.cache)) if (/[/\\](api|lib)[/\\]/.test(key)) delete require.cache[key];
  return { home: require('../api/home-page'), category: require('../api/category-page'), detail: require('../api/detail-page'), sitemap: require('../api/sitemap') };
}
async function invoke(handler, query = {}, method = 'GET') {
  const res = { statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(body = '') { this.body = body; } };
  await handler({ query, method }, res); return res;
}
module.exports = { fixture, mockFetch, fresh, invoke };
if (require.main === module) {
test('SSR links, pagination, canonical, hidden filtering and real modification dates', async () => {
  global.fetch = mockFetch(fixture); const api = fresh();
  const home = await invoke(api.home);
  assert.equal(home.statusCode, 200); assert.match(home.body, /href="\/bai-viet\/bai-suy-niem-0"/);
  assert(!home.body.includes('"seoSlug":"hidden"'));
  const page = await invoke(api.category, { type: 'articles', page: '2' });
  assert.equal(page.statusCode, 200); assert.match(page.body, /canonical" href="https:\/\/www.baigiangtrennui.com\/bai-viet\?page=2"/);
  assert.match(page.body, /category-card/); assert.match(page.body, /href="\/bai-viet\?page=2"/);
  assert.equal((page.body.match(/class="category-card/g) || []).length, 3);
  assert.equal((await invoke(api.category, { type: 'articles', page: '3' })).statusCode, 404);
  const sitemap = await invoke(api.sitemap);
  assert.match(sitemap.body, /<lastmod>2026-02-02<\/lastmod>/); assert(!sitemap.body.includes('2026-10-28</lastmod>'));
  assert(!sitemap.body.includes('/hidden<')); assert(sitemap.body.includes('/gop-y</loc>'));
  assert.equal((await invoke(api.home, {}, 'HEAD')).body, '');
  assert.equal((await invoke(api.sitemap, {}, 'POST')).statusCode, 405);
});
test('Direct slug query, alias redirect, missing page and internal article links', async () => {
  const calls = []; global.fetch = mockFetch(fixture, calls); const api = fresh();
  const article = await invoke(api.detail, { type: 'articles', slug: 'bai-suy-niem-0' });
  assert.equal(article.statusCode, 200); assert.equal(calls.length, 1);
  assert.match(article.body, /<h1>Bài suy niệm 0<\/h1>/); assert.match(article.body, /href="\/giao-ly"/);
  assert.match(article.body, /"dateModified":"2026-02-02/);
  const old = await invoke(api.detail, { type: 'articles', slug: 'duong-dan-cu' });
  assert.equal(old.statusCode, 308); assert.equal(old.headers.location, '/bai-viet/bai-suy-niem-0');
  assert.equal((await invoke(api.detail, { type: 'articles', slug: 'not-a-real-page' })).statusCode, 404);
});
test('Cold source failure yields 503; valid warm cache survives a transient failure', async () => {
  global.fetch = async () => { throw Error('offline'); }; let api = fresh();
  for (const [handler, query] of [[api.sitemap, {}], [api.home, {}], [api.category, { type: 'articles' }], [api.detail, { type: 'articles', slug: 'test' }]]) {
    const res = await invoke(handler, query); assert.equal(res.statusCode, 503); assert.equal(res.headers['cache-control'], 'no-store');
  }
  global.fetch = mockFetch(fixture); api = fresh();
  const good = await invoke(api.sitemap);
  const now = Date.now; Date.now = () => now() + 120000;
  global.fetch = async () => { throw Error('offline'); };
  try { const warm = await invoke(api.sitemap); assert.equal(warm.statusCode, 200); assert.match(warm.body, /bai-suy-niem-0/); }
  finally { Date.now = now; }
  assert.match(good.body, /bai-suy-niem-0/);
});
test('Stable slugs survive title edits/deletions and duplicate legacy routes', async () => {
  const { assignContentRouteSlugs } = require('../api/detail-page').helpers;
  const list = [{ id: '1', title: 'Cầu nguyện', createdAt: '2026-01-01' }, { id: '2', title: 'Cầu nguyện', createdAt: '2026-02-01' }];
  assignContentRouteSlugs(list); assert.deepEqual(list.map(x => x.routeSlug), ['cau-nguyen', 'cau-nguyen-2']);
  list.forEach(x => { x.seoSlug = x.routeSlug; }); list.shift(); list[0].title = 'Tiêu đề mới';
  assignContentRouteSlugs(list); assert.equal(list[0].routeSlug, 'cau-nguyen-2');
});
test('HTML encoding and configured feedback route agree', () => {
  for (const file of ['faith-discovery.html', 'prayer-request.html', 'gop-y.html']) {
    const html = fs.readFileSync(file, 'utf8'); assert(!/Ã|Ä|Æ|áº|á»/.test(html), file);
  }
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  assert(config.routes.some(x => x.src === '^/gop-y$' && x.dest === '/gop-y.html'));
  assert(config.routes.some(x => x.headers?.Location === '/gop-y' && x.status === 308));
  assert(config.routes.findIndex(x => x.src === '^/$') < config.routes.findIndex(x => x.handle === 'filesystem'));
});
test('Admin edits pin existing URLs, record aliases, and keep rating/order timestamps separate', async () => {
  const records = new Map([
    ['a', { type: 'articles', title: 'Cầu nguyện', createdAt: '2026-01-01', status: 'actived' }],
    ['b', { type: 'articles', title: 'Cầu nguyện', createdAt: '2026-02-01', status: 'actived' }],
  ]);
  const ref = id => ({ id, set: async patch => records.set(id, { ...records.get(id), ...patch }), delete: async () => records.delete(id) });
  const db = { collection: () => ({ doc: ref, get: async () => ({ forEach: fn => records.forEach((data, id) => fn({ id, data: () => data })) }) }),
    batch: () => { const writes = []; return { set: (doc, patch) => writes.push(() => doc.set(patch)), commit: async () => { for (const write of writes) await write(); } }; } };
  let stamp = 0;
  const context = vm.createContext({ requireFirebase: () => ({ db }),
    queueIndexNowChanges: async () => {},
    firebase: { firestore: { FieldValue: { serverTimestamp: () => `stamp-${++stamp}`, increment: n => n } } },
    CONTENT_TYPES: ['articles'], CONTENT_TYPE_PATHS: { articles: 'bai-viet' },
    normalizeContentItem: item => item,
    slugifyText: value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  });
  const source = fs.readFileSync('data.js', 'utf8');
  for (const name of ['contentBaseSlug', 'contentRouteCreatedAt', 'assignContentRouteSlugs', 'pinLegacyContentRoutes', 'saveContentItem', 'deleteContentItem', 'updateContentOrder', 'submitContentRating']) {
    const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
    const remaining = source.slice(start); const next = remaining.slice(1).search(/\n(?:async )?function /);
    vm.runInContext(next < 0 ? remaining : remaining.slice(0, next + 1), context);
  }
  await context.saveContentItem('articles', { id: 'a', title: 'Tiêu đề mới' });
  assert.equal(records.get('a').seoSlug, 'cau-nguyen'); assert.equal(records.get('b').seoSlug, 'cau-nguyen-2');
  const modified = records.get('a').contentUpdatedAt;
  await context.updateContentOrder('articles', ['a', 'b']);
  await context.submitContentRating('a', { content: 5, layout: 4 });
  assert.equal(records.get('a').contentUpdatedAt, modified);
  await context.saveContentItem('articles', { id: 'a', title: 'Tiêu đề mới', seoSlug: 'duong-dan-moi' });
  assert(records.get('a').previousSlugs.includes('cau-nguyen'));
  await assert.rejects(context.saveContentItem('articles', { id: 'new', title: 'New', seoSlug: 'cau-nguyen' }));
  await context.deleteContentItem('a'); assert.equal(records.get('b').seoSlug, 'cau-nguyen-2');
});
}
