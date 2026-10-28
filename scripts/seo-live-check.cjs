// Read-only validation against the public content source. Does not publish or update data.
const { invoke } = require('../tests/seo.cjs');
const handlers = { home: require('../api/home-page'), category: require('../api/category-page'), detail: require('../api/detail-page'), sitemap: require('../api/sitemap') };
(async () => {
  const sitemap = await invoke(handlers.sitemap);
  if (sitemap.statusCode !== 200) throw Error(`Local sitemap: ${sitemap.statusCode}`);
  const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  console.log(`Local sitemap: ${urls.length} URLs`);
  const live = await (await fetch('https://www.baigiangtrennui.com/sitemap.xml')).text();
  const liveUrls = [...live.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  const missing = liveUrls.filter(url => !urls.includes(url) && !url.endsWith('/gop-y.html'));
  if (missing.length) throw Error(`Existing URLs changed: ${JSON.stringify(missing)}`);
  console.log('All existing content URLs preserved.');
  for (const type of ['saints', 'churches', 'articles', 'events', 'prayers', 'catechism']) {
    const result = await invoke(handlers.category, { type });
    if (result.statusCode !== 200) throw Error(`${type}: ${result.statusCode}`);
    console.log(`${type}: 200, ${(result.body.match(/class="category-card/g) || []).length} server-rendered cards`);
  }
  const types = { 'cac-thanh': 'saints', 'nha-tho': 'churches', 'bai-viet': 'articles', 'su-kien': 'events', 'cau-nguyen': 'prayers', 'giao-ly': 'catechism' };
  for (const url of urls.filter(url => new URL(url).pathname.split('/').length === 3).slice(0, 3)) {
    const [, category, slug] = new URL(url).pathname.split('/');
    const result = await invoke(handlers.detail, { type: types[category], slug });
    if (result.statusCode !== 200 || !/<h1>.+<\/h1>/.test(result.body)) throw Error(`Detail failed: ${url} ${result.statusCode}`);
    console.log(`Detail: 200 ${new URL(url).pathname}`);
  }
  const home = await invoke(handlers.home);
  if (home.statusCode !== 200) throw Error(`Home: ${home.statusCode}`);
  console.log('Home: 200, public content embedded. Read-only checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
