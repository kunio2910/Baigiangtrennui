const { assignContentRouteSlugs, contentPath, escapeHtml: escape, repairMojibakeText: repair } = require('../api/detail-page').helpers;
const TYPES = ['saints', 'churches', 'articles', 'events', 'prayers', 'catechism', 'daily', 'banners'];
function group(items) {
  return Object.fromEntries(TYPES.map(type => [type, assignContentRouteSlugs(items.filter(item => item.type === type)
    .map(item => ({ ...item })).sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999) || String(b.createdAt || '').localeCompare(String(a.createdAt || ''))))
    .filter(item => item.status !== 'unactived')]));
}
function summary(value, limit) {
  const text = repair(String(value || '')).trim();
  return escape(text.length > limit ? text.slice(0, limit).trim() + '...' : text);
}
function dateParts(value) {
  const text = String(value || '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return { day: text.slice(8), month: `THÁNG ${text.slice(5, 7)}`, display: `${text.slice(8)} THÁNG ${text.slice(5, 7)}` };
  return { display: text, isText: true };
}
function card(item, type, categoryInfo) {
  const href = escape(contentPath(type, item));
  const title = escape(repair(item.title));
  const img = `<img src="${escape(item.image || '/Default.jpg')}" alt="${title}" loading="lazy" decoding="async" />`;
  const link = `<a href="${href}" onclick="event.stopPropagation()">${type === 'articles' ? 'Đọc thêm' : 'Chi tiết'}</a>`;
  const attrs = `clickable-card" onclick="window.location.href='${href}'"`;
  const date = dateParts(item.date);
  if (categoryInfo) return `<article class="category-card ${attrs}>${img}<div><p class="eyebrow">${escape(repair(item.meta || categoryInfo.title))}</p><h2>${title}</h2><p>${summary(item.description, 150)}</p>${item.date ? `<small>${escape(date.display)}</small>` : ''}${link}</div></article>`;
  if (type === 'events') return `<article class="event-card ${attrs}><div class="event-date ${date.isText ? 'is-text-date' : ''}">${date.isText ? `<span>${escape(date.display)}</span>` : `<strong>${date.day}</strong><span>${date.month}</span>`}</div><div><h3>${title}</h3><p>${escape(repair(item.meta || item.description))}</p><small>${summary(item.description, 85)}</small>${link}</div></article>`;
  if (type === 'prayers') return `<article class="prayer-card ${attrs} style="--prayer-image: url('${escape(item.image || '/Default.jpg')}')"><div><h3><a class="prayer-title-link" href="${href}">${title}</a></h3><blockquote>“${summary(String(item.bodyHtml || item.description || '').replace(/<[^>]*>/g, ' '), 125)}”</blockquote></div></article>`;
  const css = type === 'saints' ? 'content-card' : type === 'churches' ? 'church-card' : 'article-card';
  return `<article class="${css} ${attrs}>${img}<div><h3>${title}</h3><p>${type === 'churches' ? `📍 ${escape(repair(item.meta || 'Việt Nam'))}` : summary(item.description, 105)}</p>${link}</div></article>`;
}
function embed(html, content) {
  // Only already-public records are embedded; '<' is escaped to prevent script termination.
  return html.replace('</head>', `<script id="seoContent" type="application/json">${JSON.stringify(content).replace(/</g, '\\u003c')}</script></head>`);
}
function fill(html, id, cards) {
  return html.replace(new RegExp(`(<div[^>]*id="${id}"[^>]*>)[\\s\\S]*?</div>`), (_, open) => open + cards + '</div>');
}
module.exports = { group, card, embed, fill };
