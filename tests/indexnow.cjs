const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const handler = require('../api/indexnow');
async function invoke(body, headers = {}, method = 'POST') {
  const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.body = JSON.parse(value); } };
  await handler({ method, body, headers: { origin: 'https://www.baigiangtrennui.com', 'content-type': 'application/json', ...headers } }, res);
  return res;
}
test('Submits canonical URLs with the deployed verification key; 202 counts as accepted', async () => {
  let submitted;
  global.fetch = async (url, options) => { assert.equal(url, 'https://api.indexnow.org/indexnow'); submitted = JSON.parse(options.body); return { status: 202 }; };
  const url = 'https://www.baigiangtrennui.com/bai-viet/bai-moi';
  const result = await invoke({ urls: [url, url] });
  assert.equal(result.statusCode, 202); assert.equal(result.body.submitted, 1);
  assert.equal(fs.readFileSync(`${submitted.key}.txt`, 'utf8').trim(), submitted.key);
  assert.deepEqual(submitted.urlList, [url]);
});
test('Rejects cross-site, malformed and external URLs before making upstream requests', async () => {
  global.fetch = async () => { throw Error('must not be called'); };
  assert.equal((await invoke({}, {}, 'GET')).statusCode, 405);
  assert.equal((await invoke({ urls: [] })).statusCode, 400);
  assert.equal((await invoke({ urls: ['https://example.com/bai-viet/test'] })).statusCode, 400);
  assert.equal((await invoke({ urls: ['https://www.baigiangtrennui.com/admin.html'] })).statusCode, 400);
  assert.equal((await invoke({ urls: ['https://www.baigiangtrennui.com/'] }, { origin: 'https://example.com' })).statusCode, 403);
});
test('Upstream failure remains retryable and does not report success', async () => {
  global.fetch = async () => ({ status: 429 });
  const result = await invoke({ urls: ['https://www.baigiangtrennui.com/'] });
  assert.equal(result.statusCode, 503); assert.equal(result.headers['Retry-After'], '60');
  global.fetch = async () => { throw Error('offline'); };
  assert.equal((await invoke({ urls: ['https://www.baigiangtrennui.com/'] })).statusCode, 503);
});
