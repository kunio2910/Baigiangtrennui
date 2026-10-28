// Shared, bounded read cache. A cold instance fails explicitly instead of inventing content.
const ROOT = 'https://firestore.googleapis.com/v1/projects/truyen-giao-kito/databases/(default)/documents';
const KEY = 'AIzaSyDIwxGKJCMo5_BJv9fWTaFN-vIz-7CMpLc';
const cache = new Map();
function decode(field) {
  if (!field) return null;
  if (field.mapValue) return fields(field.mapValue.fields);
  if (field.arrayValue) return (field.arrayValue.values || []).map(decode);
  if ('integerValue' in field) return Number(field.integerValue);
  if ('nullValue' in field) return null;
  return Object.values(field)[0];
}
function fields(value = {}) { return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decode(v)])); }
function item(doc) { return { ...fields(doc.fields), id: doc.name.split('/').pop() }; }
async function request(url, options) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Content source returned ${response.status}`);
  return response.json();
}
async function cached(key, loader) {
  const old = cache.get(key);
  if (old?.pending) return old.pending;
  if (old && Date.now() - old.time < 60000) return old.value;
  const entry = old || {};
  entry.pending = loader().then(value => {
    entry.value = value; entry.time = Date.now(); return value;
  }).catch(error => {
    if (entry.value !== undefined && Date.now() - entry.time < 3600000) return entry.value;
    throw error;
  }).finally(() => { delete entry.pending; });
  cache.set(key, entry);
  if (cache.size > 256) cache.delete(cache.keys().next().value);
  return entry.pending;
}
async function all() {
  return cached('all', async () => {
    const result = []; let token = '';
    do {
      const url = new URL(`${ROOT}/contents`);
      url.searchParams.set('key', KEY); url.searchParams.set('pageSize', '300');
      if (token) url.searchParams.set('pageToken', token);
      const data = await request(url);
      result.push(...(data.documents || []).map(item)); token = data.nextPageToken || '';
    } while (token);
    return result;
  });
}
async function query(field, value, op = 'EQUAL') {
  return cached(`${field}:${op}:${value}`, async () => {
    const rows = await request(`${ROOT}:runQuery?key=${KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'contents' }],
        where: { fieldFilter: { field: { fieldPath: field }, op, value: { stringValue: value } } } } }),
    });
    return rows.filter(row => row.document).map(row => item(row.document));
  });
}
function unavailable(res, type = 'text/plain; charset=utf-8') {
  res.statusCode = 503;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Retry-After', '60');
  res.end('Nội dung tạm thời chưa tải được. Vui lòng thử lại sau.');
}
module.exports = { all, query, unavailable };
