export async function searchKcaProducts(query) {
  const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `참가격 API 요청 실패 (${response.status})`);
  return payload.items || [];
}

export async function fetchKcaPrices(goodId) {
  const response = await fetch(`/api/prices?goodId=${encodeURIComponent(goodId)}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `참가격 가격 조회 실패 (${response.status})`);
  return payload;
}

export function mapKcaProduct(item) {
  return {
    id: String(item.goodId || `kca-${Date.now()}`),
    name: item.goodName || '상품명 없음',
    category: item.goodUnit || '참가격 생필품',
    defaultLocation: '직접 지정',
    estimatedPrice: null,
    unit: item.goodTotal || item.goodUnit || '단위 정보 없음',
    barcode: '',
    consumptionCycleDays: 30,
    imageUrl: '',
    source: '한국소비자원 참가격 OpenAPI',
  };
}
