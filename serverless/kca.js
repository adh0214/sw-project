const API_BASE = 'https://apis.data.go.kr/B551919/ProductPriceInfoService';
const API_KEY = process.env.KCA_SERVICE_KEY;
let cache = { expiresAt: 0, items: [] };

function parseItems(xml) {
  const decode = (value) => value
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, itemXml]) => {
    const item = {};
    for (const [, key, value] of itemXml.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      item[key] = decode(value.trim());
    }
    return item;
  });
}

function requireApiKey() {
  if (!API_KEY) {
    const error = new Error('Vercel 환경변수 KCA_SERVICE_KEY를 설정해야 참가격 API를 사용할 수 있습니다.');
    error.status = 503;
    throw error;
  }
}

async function fetchText(url) {
  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) throw new Error(`참가격 API HTTP ${response.status}`);
  return body;
}

async function getProducts(query = '') {
  requireApiKey();
  if (Date.now() >= cache.expiresAt) {
    const url = new URL(`${API_BASE}/getProductInfoSvc.do`);
    url.searchParams.set('ServiceKey', API_KEY);
    const xml = await fetchText(url);
    const items = parseItems(xml);
    if (!items.length && !/<resultCode>00<\/resultCode>/.test(xml)) {
      throw new Error('참가격 API 응답에 상품 목록이 없습니다. 인증키 또는 API 활용 승인을 확인해 주세요.');
    }
    cache = { items, expiresAt: Date.now() + 6 * 60 * 60 * 1000 };
  }
  const normalized = String(query).trim().toLowerCase();
  return normalized
    ? cache.items.filter((item) => String(item.goodName || '').toLowerCase().includes(normalized))
    : cache.items;
}

async function getPrices(goodId) {
  requireApiKey();
  const date = new Date();
  const daysSinceFriday = (date.getUTCDay() + 2) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceFriday);
  const inspectDay = date.toISOString().slice(0, 10).replace(/-/g, '');
  const url = new URL(`${API_BASE}/getProductPriceInfoSvc.do`);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('goodInspectDay', inspectDay);
  url.searchParams.set('goodId', goodId);
  const xml = await fetchText(url);
  const items = parseItems(xml);
  if (!items.length && !/<resultCode>00<\/resultCode>/.test(xml)) {
    throw new Error('해당 조사일의 가격이 없거나 API 응답에 오류가 있습니다.');
  }
  return { source: '한국소비자원 참가격 OpenAPI', goodInspectDay: inspectDay, items };
}

module.exports = { getProducts, getPrices };
