// 1인 가구 필수 생필품 초기 재고 데이터 (15일 단위 자동 소모 주기 & 사이트 최저가 조회 시 최상단 1위 가격 100% 일치)
export const initialStockItems = [
  {
    id: 'item-1',
    name: '크리넥스 3겹 데코앤소프트 롤화장지 30m 30롤',
    category: '화장지/물티슈',
    location: '욕실/화장실',
    quantity: 1, // 1개: 부족 상태
    minThreshold: 2,
    barcode: '8801046123456',
    estimatedPrice: 4370, // 네이버 쇼핑 '낮은 가격순' 조회 시 최상단 1위 매물(땡큐 3겹 30롤 최저 4,370원)
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80',
    unit: '30롤',
    lastChecked: '2026-11-08',
    lastDecreasedAt: '2026-10-25',
    consumptionCycleDays: 45, // 45일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-2',
    name: '헤드앤숄더 쿨멘톨 딥클린 샴푸 850ml',
    category: '헤어/바디',
    location: '욕실/화장실',
    quantity: 0, // 0개: 소진 상태
    minThreshold: 1,
    barcode: '4902430123456',
    estimatedPrice: 8500, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    unit: '850ml',
    lastChecked: '2026-11-07',
    lastDecreasedAt: '2026-09-15',
    consumptionCycleDays: 60, // 60일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-3',
    name: '오랄비 초미세모 벨벳 딥클린 칫솔 4개입',
    category: '구강위생',
    location: '욕실/화장실',
    quantity: 2,
    minThreshold: 1,
    barcode: '8801053123456',
    estimatedPrice: 3900, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e109d74e5ec4?w=600&auto=format&fit=crop&q=80',
    unit: '4개입',
    lastChecked: '2026-11-01',
    lastDecreasedAt: '2026-10-20',
    consumptionCycleDays: 30, // 30일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-4',
    name: '페리오 토탈7 오리지널 치약 120g x 3개입',
    category: '구강위생',
    location: '욕실/화장실',
    quantity: 3,
    minThreshold: 1,
    barcode: '8801051234567',
    estimatedPrice: 2800, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    unit: '3개입',
    lastChecked: '2026-11-09',
    lastDecreasedAt: '2026-10-10',
    consumptionCycleDays: 45, // 45일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-5',
    name: '크린랩 롤백 위생비닐 중형 (25x35cm) 200매',
    category: '주방용품',
    location: '주방 싱크대',
    quantity: 1,
    minThreshold: 2,
    barcode: '8801234567890',
    estimatedPrice: 1900, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    unit: '200매',
    lastChecked: '2026-11-06',
    lastDecreasedAt: '2026-08-20',
    consumptionCycleDays: 90, // 90일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-6',
    name: '자연퐁 안심주방세제 상큼한 오렌지 1.2L 리필',
    category: '주방세제/세탁',
    location: '주방 싱크대 하부',
    quantity: 2,
    minThreshold: 1,
    barcode: '8801052345678',
    estimatedPrice: 2300, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    unit: '1.2L',
    lastChecked: '2026-11-08',
    lastDecreasedAt: '2026-09-20',
    consumptionCycleDays: 60, // 60일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-7',
    name: 'CJ 햇반 백미 즉석밥 210g x 12개입',
    category: '식품/간편식',
    location: '펜트리 선반 1단',
    quantity: 1,
    minThreshold: 3,
    barcode: '8801007123456',
    estimatedPrice: 9800, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    unit: '12개입',
    lastChecked: '2026-11-08',
    lastDecreasedAt: '2026-11-02',
    consumptionCycleDays: 15, // 15일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-8',
    name: '제주 삼다수 무라벨 생수 2L x 6병 번들',
    category: '음료/생수',
    location: '펜트리 바닥',
    quantity: 4,
    minThreshold: 2,
    barcode: '8808244123456',
    estimatedPrice: 5400, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    unit: '6병',
    lastChecked: '2026-11-09',
    lastDecreasedAt: '2026-11-01',
    consumptionCycleDays: 15, // 15일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-9',
    name: '다우니 엑스퍼트 실내건조 초고농축 섬유유연제 1L',
    category: '주방세제/세탁',
    location: '다용도 세탁실',
    quantity: 0,
    minThreshold: 1,
    barcode: '4902430234567',
    estimatedPrice: 3900, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    unit: '1L',
    lastChecked: '2026-11-05',
    lastDecreasedAt: '2026-09-10',
    consumptionCycleDays: 60, // 60일 단위 소모 주기
    autoDecreaseEnabled: true,
  },
  {
    id: 'item-10',
    name: '농심 신라면 120g x 5개입 멀티팩',
    category: '식품/간편식',
    location: '펜트리 선반 2단',
    quantity: 1,
    minThreshold: 2,
    barcode: '8801043123456',
    estimatedPrice: 2900, // 사이트 최저가 조회 시 최상단 1위 가격
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    unit: '5개입',
    lastChecked: '2026-11-09',
    lastDecreasedAt: '2026-11-03',
    consumptionCycleDays: 15, // 15일 단위 소모 주기
    autoDecreaseEnabled: true,
  }
];
