import { suggestConsumptionCycleDays } from '../utils/consumptionCycle';

// 24시간 열린 소비자 포털 (참가격 / KAN 표준 유통 상품지식정보 DB)
export const consumerPortalBarcodeCatalog = {
  '8801046123456': {
    barcode: '8801046123456',
    name: '크리넥스 3겹 데코앤소프트 롤화장지 30m 30롤',
    brand: '유한킴벌리',
    category: '화장지/물티슈',
    defaultLocation: '욕실/화장실',
    standardPrice: 21900,
    unit: '30롤',
    origin: '대한민국',
    portalRegisteredDate: '2025-01-15',
    certification: 'KC 인증 완료 (환경마크 친환경제품)',
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80',
    description: '3겹 에어엠보싱으로 부드럽고 도톰한 프리미엄 화장지'
  },
  '4902430123456': {
    barcode: '4902430123456',
    name: '헤드앤숄더 쿨멘톨 딥클린 샴푸 850ml',
    brand: 'P&G 헤드앤숄더',
    category: '헤어/바디',
    defaultLocation: '욕실/화장실',
    standardPrice: 14500,
    unit: '850ml',
    origin: '프랑스',
    portalRegisteredDate: '2025-02-10',
    certification: '식약처 화장품 인증',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    description: '두피 피지와 비듬을 씻어내어 시원하고 청량한 쿨링 샴푸'
  },
  '8801051234567': {
    barcode: '8801051234567',
    name: '페리오 토탈7 오리지널 치약 120g x 3개입',
    brand: 'LG생활건강 페리오',
    category: '구강위생',
    defaultLocation: '욕실/화장실',
    standardPrice: 7500,
    unit: '3개입',
    origin: '대한민국',
    portalRegisteredDate: '2025-03-01',
    certification: '의약외품 허가완료',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e109d74e5ec4?w=600&auto=format&fit=crop&q=80',
    description: '충치예방 및 치태제거 구강 7대 고민 토탈 케어'
  },
  '8801234567890': {
    barcode: '8801234567890',
    name: '크린랩 롤백 위생비닐 중형 (25x35cm) 200매',
    brand: '크린랩',
    category: '주방용품',
    defaultLocation: '주방 싱크대',
    standardPrice: 4800,
    unit: '200매',
    origin: '대한민국',
    portalRegisteredDate: '2025-01-20',
    certification: '식품용 기구 및 용기인증',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    description: '신선도 유지 및 찢어짐 없는 안심 위생백'
  },
  '8801052345678': {
    barcode: '8801052345678',
    name: '자연퐁 안심주방세제 상큼한 오렌지 1.2L 리필',
    brand: 'LG생활건강 자연퐁',
    category: '주방세제/세탁',
    defaultLocation: '주방 싱크대 하부',
    standardPrice: 6900,
    unit: '1.2L',
    origin: '대한민국',
    portalRegisteredDate: '2025-04-12',
    certification: '보건복지부 1종 주방세제',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    description: '과일 채소까지 안심 세척 가능한 친환경 주방세제'
  },
  '8801007123456': {
    barcode: '8801007123456',
    name: 'CJ 햇반 백미 즉석밥 210g x 12개입',
    brand: 'CJ제일제당',
    category: '식품/간편식',
    defaultLocation: '펜트리 선반 1단',
    standardPrice: 16500,
    unit: '12개입',
    origin: '대한민국',
    portalRegisteredDate: '2025-02-18',
    certification: 'HACCP 안전관리인증',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: '갓 지은 밥맛 그대로, 무균화 포장 백미 즉석밥'
  },
  '8808244123456': {
    barcode: '8808244123456',
    name: '제주 삼다수 무라벨 생수 2L x 6병 번들',
    brand: '제주특별자치도개발공사',
    category: '음료/생수',
    defaultLocation: '펜트리 바닥',
    standardPrice: 6500,
    unit: '6병',
    origin: '대한민국 (제주)',
    portalRegisteredDate: '2025-01-05',
    certification: '먹는물 수질기준 적합',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    description: '화산암반수로 걸러낸 깨끗한 무라벨 에코 생수'
  },
  '4902430234567': {
    barcode: '4902430234567',
    name: '다우니 엑스퍼트 실내건조 초고농축 섬유유연제 1L',
    brand: 'P&G 다우니',
    category: '주방세제/세탁',
    defaultLocation: '다용도 세탁실',
    standardPrice: 10500,
    unit: '1L',
    origin: '베트남',
    portalRegisteredDate: '2025-03-15',
    certification: '안전확인대상생활화학제품',
    imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    description: '실내 건조 시 발생하는 꿉꿉한 냄새 제거 3배 농축'
  },
  '8801046234567': {
    barcode: '8801046234567',
    name: '유한킴벌리 스카트 항균 빨아쓰는 행주타월 45매',
    brand: '유한킴벌리',
    category: '주방용품',
    defaultLocation: '주방 싱크대',
    standardPrice: 8900,
    unit: '45매',
    origin: '대한민국',
    portalRegisteredDate: '2025-02-28',
    certification: '99.9% 항균 인증',
    imageUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80',
    description: '물에 젖어도 찢어지지 않아 여러 번 빨아쓰는 위생 행주'
  },
  '8801043123456': {
    barcode: '8801043123456',
    name: '농심 신라면 120g x 5개입 멀티팩',
    brand: '농심',
    category: '식품/간편식',
    defaultLocation: '펜트리 선반 2단',
    standardPrice: 4900,
    unit: '5개입',
    origin: '대한민국',
    portalRegisteredDate: '2025-01-10',
    certification: 'HACCP 인증',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    description: '대한민국 대표 매운맛 라면 소고기 육수 베이스'
  },
  // 추가 생필품 바코드 예시 (스마트 스캔 시 즉시 자동 등록 가능)
  '8801053123456': {
    barcode: '8801053123456',
    name: '오랄비 초미세모 벨벳 딥클린 칫솔 4개입',
    brand: '오랄비',
    category: '구강위생',
    defaultLocation: '욕실/화장실',
    standardPrice: 11000,
    unit: '4개입',
    origin: '대한민국',
    portalRegisteredDate: '2025-03-08',
    certification: '의약외품',
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e109d74e5ec4?w=600&auto=format&fit=crop&q=80',
    description: '초미세모로 잇몸 자극을 줄인 칫솔 4개입. 30일마다 1개 소모'
  },
  '8801062123456': {
    barcode: '8801062123456',
    name: '오뚜기 진라면 매운맛 120g x 5개입',
    brand: '오뚜기',
    category: '식품/간편식',
    defaultLocation: '펜트리 선반 2단',
    standardPrice: 3880,
    unit: '5개입',
    origin: '대한민국',
    portalRegisteredDate: '2025-05-01',
    certification: 'HACCP 인증',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    description: '쫄깃한 면발과 진한 쇠고기 국물의 조화'
  },
  '8801047123456': {
    barcode: '8801047123456',
    name: '질레트 마하3 면도날 8입 번들팩',
    brand: 'P&G 질레트',
    category: '헤어/바디',
    defaultLocation: '욕실 서랍장',
    standardPrice: 28900,
    unit: '8입',
    origin: '독일',
    portalRegisteredDate: '2025-04-20',
    certification: '정품 안전인증',
    imageUrl: 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=600&auto=format&fit=crop&q=80',
    description: '3중 밀착 날과 윤활 스트립으로 부드러운 저자극 면도'
  }
};

/**
 * 24시간 열린 소비자 포털 API 시뮬레이터
 * 바코드 번호를 조회하여 공공/유통 포털에 등록된 상품 상세정보를 반환합니다.
 */
export async function fetchProductFromConsumerPortal(barcode) {
  // 네트워크 레이턴시 시뮬레이션 (200~400ms)
  await new Promise(resolve => setTimeout(resolve, 300));

  const trimmed = String(barcode).trim();
  const withCycle = (data) => ({
    ...data,
    consumptionCycleDays: suggestConsumptionCycleDays(data.name, data.category),
  });

  if (consumerPortalBarcodeCatalog[trimmed]) {
    return {
      success: true,
      source: '24시간 열린 소비자포털 (참가격 / KAN 표준유통DB)',
      data: withCycle(consumerPortalBarcodeCatalog[trimmed]),
    };
  }

  // 등록되지 않은 신규 바코드일 경우 한국 유통표준(880) 또는 일반 바코드 파싱 스마트 유추
  const isKoreaBarcode = trimmed.startsWith('880');
  return {
    success: true,
    source: '24시간 열린 소비자포털 (표준 식별체계 자동 판별)',
    data: withCycle({
      barcode: trimmed,
      name: isKoreaBarcode ? `국내 유통 표준 생필품 (${trimmed.slice(-4)})` : `수입 유통 규격 상품 (${trimmed.slice(-4)})`,
      brand: '공공 표준 등록 제조사',
      category: isKoreaBarcode ? '주방/생활잡화' : '생활용품',
      defaultLocation: '펜트리/수납장',
      standardPrice: 9900,
      unit: '1개',
      origin: isKoreaBarcode ? '대한민국' : '해외규격',
      portalRegisteredDate: new Date().toISOString().split('T')[0],
      certification: 'KC 인증 검증 대기',
      imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
      description: '소비자 포털 실시간 스캔 매핑 신규 생필품'
    }),
  };
}
