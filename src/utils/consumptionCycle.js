/** 소모 주기를 15일 단위로 맞춥니다. 최소 15일. */
export function snapCycleDays(days) {
  const n = Number(days);
  if (!Number.isFinite(n) || n <= 0) return 30;
  return Math.max(15, Math.round(n / 15) * 15);
}

/**
 * 상품명·분류로 자동 소모 주기를 제안합니다.
 * 칫솔 30일, 샴푸 60일처럼 15일 단위입니다.
 */
export function suggestConsumptionCycleDays(name = '', category = '') {
  const text = `${name} ${category}`;
  if (/칫솔/.test(text)) return 30;
  if (/샴푸|린스|바디워시|바디로션/.test(text)) return 60;
  if (/치약/.test(text)) return 45;
  if (/휴지|화장지|물티슈/.test(text)) return 45;
  if (/세제|유연제|섬유/.test(text)) return 60;
  if (/라면|즉석밥|햇반|생수|음료|간편식/.test(text)) return 15;
  if (/롤백|위생|랩|행주/.test(text)) return 90;
  if (/면도/.test(text)) return 30;
  return 30;
}
