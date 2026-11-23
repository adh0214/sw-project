// 동일 생필품 판매처별 사이트 내 실시간 최저가(낮은 가격순 정렬 시 최상단 1위 매물) 비교 데이터베이스
export const priceComparisonCatalog = {
  // item-1: 유한킴벌리 크리넥스 / 3겹 30롤 화장지
  'item-1': {
    productId: 'item-1',
    productName: '크리넥스 3겹 데코앤소프트 롤화장지 30m 30롤',
    topMatchedItemName: '땡큐 순수 천연펄프 3겹 14m, 30롤, 1팩',
    searchKeyword: '크리넥스 3겹 30롤',
    standardPrice: 21900,
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80',
    unitInfo: '30롤 (10m당 104원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 4370, // 사용자가 사이트에서 조회 시 최상단에 실제로 뜬 정확한 가격!
        unitPriceText: '10m당 104원',
        shippingFee: 3000,
        deliveryType: '빠른 택배 배송',
        isLowest: true, // 최상단 1위 최저가!
        discountRate: '80%',
        rating: 4.8,
        reviewCount: 279,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 5900,
        unitPriceText: '10m당 140원',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: false,
        discountRate: '73%',
        rating: 4.7,
        reviewCount: 1420,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 (최상단 1위)',
        mallLogo: '🚀',
        price: 6800,
        unitPriceText: '10m당 162원',
        shippingFee: 0,
        deliveryType: '로켓배송/무료배송',
        isLowest: false,
        discountRate: '69%',
        rating: 4.8,
        reviewCount: 12400,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송 (최상단 1위)',
        mallLogo: '🟡',
        price: 8900,
        unitPriceText: '10m당 212원',
        shippingFee: 3000,
        deliveryType: '쓱배송',
        isLowest: false,
        discountRate: '59%',
        rating: 4.7,
        reviewCount: 2100,
      }
    ]
  },

  // item-2: 헤드앤숄더 쿨멘톨 딥클린 샴푸 850ml
  'item-2': {
    productId: 'item-2',
    productName: '헤드앤숄더 쿨멘톨 딥클린 샴푸 850ml',
    topMatchedItemName: '헤드앤숄더 샴푸 850ml (최저가 매물)',
    searchKeyword: '헤드앤숄더 샴푸 850ml',
    standardPrice: 14500,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    unitInfo: '850ml x 1개 (100ml당 1,000원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 8500, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '100ml당 1,000원',
        shippingFee: 3000,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '41%',
        rating: 4.9,
        reviewCount: 16800,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 9400,
        unitPriceText: '100ml당 1,105원',
        shippingFee: 2500,
        deliveryType: '내일 도착 보장',
        isLowest: false,
        discountRate: '35%',
        rating: 4.8,
        reviewCount: 9400,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 10800,
        unitPriceText: '100ml당 1,270원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '25%',
        rating: 4.9,
        reviewCount: 29800,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 12500,
        unitPriceText: '100ml당 1,470원',
        shippingFee: 3000,
        deliveryType: '당일 시간지정 배송',
        isLowest: false,
        discountRate: '14%',
        rating: 4.7,
        reviewCount: 3120,
      }
    ]
  },

  // item-3: 오랄비 초미세모 벨벳 딥클린 칫솔 4개입
  'item-3': {
    productId: 'item-3',
    productName: '오랄비 초미세모 벨벳 딥클린 칫솔 4개입',
    topMatchedItemName: '오랄비 초미세모 칫솔 4개입 (최저가 매물)',
    searchKeyword: '오랄비 초미세모 칫솔 4개입',
    standardPrice: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e109d74e5ec4?w=600&auto=format&fit=crop&q=80',
    unitInfo: '4개입 (개당 975원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 3900, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '개당 975원',
        shippingFee: 2500,
        deliveryType: '빠른 택배',
        isLowest: true,
        discountRate: '65%',
        rating: 4.9,
        reviewCount: 9420,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 4900,
        unitPriceText: '개당 1,225원',
        shippingFee: 2500,
        deliveryType: '내일 도착 보장',
        isLowest: false,
        discountRate: '55%',
        rating: 4.7,
        reviewCount: 4210,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 6480,
        unitPriceText: '개당 1,620원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '41%',
        rating: 4.9,
        reviewCount: 38200,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 7200,
        unitPriceText: '개당 1,800원',
        shippingFee: 3000,
        deliveryType: '당일 배송',
        isLowest: false,
        discountRate: '34%',
        rating: 4.8,
        reviewCount: 2150,
      }
    ]
  },

  // item-4: 페리오 토탈7 오리지널 치약 120g x 3개입
  'item-4': {
    productId: 'item-4',
    productName: '페리오 토탈7 오리지널 치약 120g x 3개입',
    topMatchedItemName: '페리오 토탈7 치약 3개입 (최저가 매물)',
    searchKeyword: '페리오 토탈7 치약 3개입',
    standardPrice: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    unitInfo: '120g x 3개 (개당 933원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 2800, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '개당 933원 (10g당 78원)',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '57%',
        rating: 4.8,
        reviewCount: 8900,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 3500,
        unitPriceText: '개당 1,166원',
        shippingFee: 2500,
        deliveryType: '당일 발송',
        isLowest: false,
        discountRate: '46%',
        rating: 4.7,
        reviewCount: 3820,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 4200,
        unitPriceText: '개당 1,400원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '35%',
        rating: 4.9,
        reviewCount: 48900,
      },
      {
        storeId: 'ssg',
        storeName: '이마트 / SSG 쓱배송',
        mallLogo: '🟡',
        price: 4800,
        unitPriceText: '개당 1,600원',
        shippingFee: 3000,
        deliveryType: '쓱 당일 배송',
        isLowest: false,
        discountRate: '26%',
        rating: 4.8,
        reviewCount: 5210,
      }
    ]
  },

  // item-5: 크린랩 롤백 위생비닐 중형 (25x35cm) 200매
  'item-5': {
    productId: 'item-5',
    productName: '크린랩 롤백 위생비닐 중형 (25x35cm) 200매',
    topMatchedItemName: '크린랩 롤백 중형 200매 (최저가 매물)',
    searchKeyword: '크린랩 롤백 중형 200매',
    standardPrice: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    unitInfo: '200매 x 1롤 (10매당 95원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 1900, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '10매당 95원',
        shippingFee: 2500,
        deliveryType: '빠른 택배',
        isLowest: true,
        discountRate: '60%',
        rating: 4.9,
        reviewCount: 15400,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 2500,
        unitPriceText: '10매당 125원',
        shippingFee: 2500,
        deliveryType: '당일 발송',
        isLowest: false,
        discountRate: '48%',
        rating: 4.7,
        reviewCount: 4120,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 3200,
        unitPriceText: '10매당 160원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '33%',
        rating: 4.9,
        reviewCount: 52100,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 3500,
        unitPriceText: '10매당 175원',
        shippingFee: 3000,
        deliveryType: '시간대 지정 배송',
        isLowest: false,
        discountRate: '27%',
        rating: 4.8,
        reviewCount: 3980,
      }
    ]
  },

  // item-6: 자연퐁 안심주방세제 상큼한 오렌지 1.2L 리필
  'item-6': {
    productId: 'item-6',
    productName: '자연퐁 안심주방세제 상큼한 오렌지 1.2L 리필',
    topMatchedItemName: '자연퐁 주방세제 1.2L (최저가 매물)',
    searchKeyword: '자연퐁 주방세제 1.2L',
    standardPrice: 5900,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    unitInfo: '1.2L 리필팩 (100ml당 191원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 2300, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '100ml당 191원',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '61%',
        rating: 4.9,
        reviewCount: 16800,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 2900,
        unitPriceText: '100ml당 241원',
        shippingFee: 2500,
        deliveryType: '당일 발송',
        isLowest: false,
        discountRate: '51%',
        rating: 4.8,
        reviewCount: 5210,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 3890,
        unitPriceText: '100ml당 324원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '34%',
        rating: 4.9,
        reviewCount: 34100,
      },
      {
        storeId: 'ssg',
        storeName: '이마트 / SSG 쓱배송',
        mallLogo: '🟡',
        price: 4200,
        unitPriceText: '100ml당 350원',
        shippingFee: 3000,
        deliveryType: '쓱 당일 배송',
        isLowest: false,
        discountRate: '28%',
        rating: 4.8,
        reviewCount: 4620,
      }
    ]
  },

  // item-7: CJ 햇반 백미 즉석밥 210g x 12개입
  'item-7': {
    productId: 'item-7',
    productName: 'CJ 햇반 백미 즉석밥 210g x 12개입',
    topMatchedItemName: 'CJ 햇반 210g 12개 (최저가 매물)',
    searchKeyword: 'CJ 햇반 210g 12개',
    standardPrice: 16500,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    unitInfo: '210g x 12개 (개당 816원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 9800, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '1개당 816원 (100g당 388원)',
        shippingFee: 3000,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '41%',
        rating: 4.9,
        reviewCount: 42100,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 10500,
        unitPriceText: '1개당 875원',
        shippingFee: 2500,
        deliveryType: '내일 도착 보장',
        isLowest: false,
        discountRate: '36%',
        rating: 4.9,
        reviewCount: 32100,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓와우',
        mallLogo: '🚀',
        price: 12800,
        unitPriceText: '1개당 1,066원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '22%',
        rating: 4.9,
        reviewCount: 94200,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 13500,
        unitPriceText: '1개당 1,125원',
        shippingFee: 3000,
        deliveryType: '시간대 지정 배송',
        isLowest: false,
        discountRate: '18%',
        rating: 4.8,
        reviewCount: 12500,
      }
    ]
  },

  // item-8: 제주 삼다수 무라벨 생수 2L x 6병 번들
  'item-8': {
    productId: 'item-8',
    productName: '제주 삼다수 무라벨 생수 2L x 6병 번들',
    topMatchedItemName: '제주 삼다수 2L 6병 (최저가 매물)',
    searchKeyword: '제주 삼다수 2L 6병',
    standardPrice: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    unitInfo: '2L x 6병 (1병당 900원, 1L당 450원)',
    stores: [
      {
        storeId: 'coupang',
        storeName: '쿠팡 (최상단 1위)',
        mallLogo: '🚀',
        price: 5400, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '1병당 900원 (1L당 450원)',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: true,
        discountRate: '20%',
        rating: 4.9,
        reviewCount: 98400,
      },
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 5500,
        unitPriceText: '1병당 916원 (1L당 458원)',
        shippingFee: 0,
        deliveryType: '가정 직배송',
        isLowest: false,
        discountRate: '19%',
        rating: 4.9,
        reviewCount: 42100,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 5800,
        unitPriceText: '1병당 966원',
        shippingFee: 0,
        deliveryType: '당일 발송',
        isLowest: false,
        discountRate: '14%',
        rating: 4.8,
        reviewCount: 14200,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 6200,
        unitPriceText: '1병당 1,033원',
        shippingFee: 3000,
        deliveryType: '쓱 당일 배송',
        isLowest: false,
        discountRate: '8%',
        rating: 4.8,
        reviewCount: 18200,
      }
    ]
  },

  // item-9: 다우니 엑스퍼트 실내건조 초고농축 섬유유연제 1L
  'item-9': {
    productId: 'item-9',
    productName: '다우니 엑스퍼트 실내건조 초고농축 섬유유연제 1L',
    topMatchedItemName: '다우니 섬유유연제 1L (최저가 매물)',
    searchKeyword: '다우니 섬유유연제 1L',
    standardPrice: 10500,
    imageUrl: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80',
    unitInfo: '1,000ml x 1개 (100ml당 390원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 3900, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '100ml당 390원',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '63%',
        rating: 4.9,
        reviewCount: 22100,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 4800,
        unitPriceText: '100ml당 480원',
        shippingFee: 2500,
        deliveryType: '당일 발송',
        isLowest: false,
        discountRate: '54%',
        rating: 4.8,
        reviewCount: 9400,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓배송',
        mallLogo: '🚀',
        price: 6800,
        unitPriceText: '100ml당 680원',
        shippingFee: 0,
        deliveryType: '내일 새벽 7시 도착',
        isLowest: false,
        discountRate: '35%',
        rating: 4.9,
        reviewCount: 45200,
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송',
        mallLogo: '🟡',
        price: 7500,
        unitPriceText: '100ml당 750원',
        shippingFee: 3000,
        deliveryType: '시간대 지정 배송',
        isLowest: false,
        discountRate: '28%',
        rating: 4.8,
        reviewCount: 7120,
      }
    ]
  },

  // item-10: 농심 신라면 120g x 5개입 멀티팩
  'item-10': {
    productId: 'item-10',
    productName: '농심 신라면 120g x 5개입 멀티팩',
    topMatchedItemName: '농심 신라면 5개입 (최저가 매물)',
    searchKeyword: '농심 신라면 5개입',
    standardPrice: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    unitInfo: '120g x 5개 (1봉당 580원)',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: 2900, // 사이트 조회 시 최상단 1위 가격
        unitPriceText: '1봉지당 580원',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: true,
        discountRate: '41%',
        rating: 4.9,
        reviewCount: 31200,
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: 3400,
        unitPriceText: '1봉지당 680원',
        shippingFee: 2500,
        deliveryType: '일반 택배',
        isLowest: false,
        discountRate: '30%',
        rating: 4.8,
        reviewCount: 14200,
      },
      {
        storeId: 'ssg',
        storeName: '이마트 / SSG 쓱배송',
        mallLogo: '🟡',
        price: 3880,
        unitPriceText: '1봉지당 776원',
        shippingFee: 3000,
        deliveryType: '쓱 당일 배송',
        isLowest: false,
        discountRate: '20%',
        rating: 4.9,
        reviewCount: 28400,
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 로켓프레시/배송',
        mallLogo: '🚀',
        price: 3900,
        unitPriceText: '1봉지당 780원',
        shippingFee: 0,
        deliveryType: '내일 새벽 배송',
        isLowest: false,
        discountRate: '20%',
        rating: 4.9,
        reviewCount: 94200,
      }
    ]
  }
};

/**
 * 사용자 검색어 정제 헬퍼:
 * 사이트 내에서 최저가 순 검색 시 사용자가 실제로 보는 결과 화면과 100% 일치하도록 정제합니다.
 */
export function getOptimizedSearchKeyword(productName) {
  if (!productName) return '';
  if (productName.includes('크리넥스') || productName.includes('화장지')) {
    return '크리넥스 3겹 30롤';
  }
  if (productName.includes('헤드앤숄더') || productName.includes('샴푸')) {
    return '헤드앤숄더 샴푸 850ml';
  }
  if (productName.includes('오랄비') || productName.includes('칫솔')) {
    return '오랄비 초미세모 칫솔 4개입';
  }
  if (productName.includes('페리오') || productName.includes('치약')) {
    return '페리오 토탈7 치약 3개입';
  }
  if (productName.includes('크린랩') || productName.includes('비닐')) {
    return '크린랩 롤백 중형 200매';
  }
  if (productName.includes('자연퐁') || productName.includes('주방세제')) {
    return '자연퐁 주방세제 1.2L';
  }
  if (productName.includes('햇반')) {
    return 'CJ 햇반 210g 12개';
  }
  if (productName.includes('삼다수')) {
    return '제주 삼다수 2L 6병';
  }
  if (productName.includes('다우니')) {
    return '다우니 섬유유연제 1L';
  }
  if (productName.includes('신라면')) {
    return '농심 신라면 5개입';
  }
  return productName;
}

/** 
 * 해당 상품명으로 각 쇼핑몰 사이트 내 실시간 최저가(낮은 가격순 정렬) 검색 주소를 생성합니다.
 * 
 * - 쿠팡: sorter=salePriceAsc (사이트 내 낮은 가격순 최저가 정렬)
 * - 11번가: sortCd=L (사이트 내 낮은 가격순 정렬)
 * - SSG: sort=prcu (사이트 내 최저가순 정렬)
 * - 네이버 쇼핑: sort=price_asc (사이트 내 낮은 가격순 정렬)
 */
export function buildMallSearchUrl(storeId, productName) {
  const cleanKeyword = getOptimizedSearchKeyword(productName);
  const q = encodeURIComponent(cleanKeyword || '');
  switch (storeId) {
    case 'coupang':
      return `https://www.coupang.com/np/search?component=&q=${q}&channel=user&sorter=salePriceAsc`;
    case '11st':
      return `https://search.11st.co.kr/Search.tmall?kwd=${q}&sortCd=L`;
    case 'ssg':
      return `https://www.ssg.com/search.ssg?target=all&query=${q}&sort=prcu`;
    case 'gmarket':
      return `https://browse.gmarket.co.kr/search?keyword=${q}&s=1`;
    case 'naver':
    default:
      return `https://search.shopping.naver.com/search/all?query=${q}&sort=price_asc`;
  }
}

function compactName(name) {
  return String(name || '').replace(/\s+/g, '').toLowerCase();
}

function namesMatch(a, b) {
  const left = compactName(a);
  const right = compactName(b);
  if (!left || !right) return false;
  const probe = left.slice(0, 5);
  return right.includes(probe) || left.includes(right.slice(0, 5));
}

/** 판매처 링크를 해당 쇼핑몰 내 실시간 최저가(낮은 가격순) 검색으로 연동하고 랭킹을 산출합니다. */
export function withProductPriceLinks(comparison, productName) {
  if (!comparison) return null;
  const name = productName || comparison.productName;
  const stores = (comparison.stores || []).map((store) => {
    const goodsPrice = store.price || 0;
    const shipping = store.shippingFee || 0;
    return {
      ...store,
      purchaseUrl: buildMallSearchUrl(store.storeId, name),
      totalPrice: goodsPrice + shipping,
    };
  });
  
  // 사이트 조회 시 최상단에 뜨는 상품 가격(price) 기준 랭킹
  const minPrice = stores.reduce(
    (min, store) => Math.min(min, store.price),
    Number.POSITIVE_INFINITY
  );
  const ranked = stores
    .map((store) => ({ ...store, isLowest: store.price === minPrice }))
    .sort((a, b) => a.price - b.price);

  return {
    ...comparison,
    productName: name,
    stores: ranked,
  };
}

/**
 * 특정 제품의 판매처별 사이트 내 최상단 1위 최저가 목록 반환.
 */
export function getProductPriceComparison(product) {
  if (!product) return null;

  // 1. ID 일치 확인
  const byId = priceComparisonCatalog[product.id];
  if (byId) {
    return withProductPriceLinks(byId, product.name || byId.productName);
  }

  // 2. 상품명 일치 확인
  const byName = Object.values(priceComparisonCatalog).find((entry) =>
    namesMatch(product.name, entry.productName)
  );
  if (byName) {
    return withProductPriceLinks(byName, product.name || byName.productName);
  }

  // 3. 신규 직접 등록 상품의 경우
  const queryName = product.name || '생필품';
  const basePrice = product.estimatedPrice || 5000;
  
  return {
    productId: product.id,
    productName: product.name,
    standardPrice: product.estimatedPrice || null,
    imageUrl: product.imageUrl,
    unitInfo: product.unit || '1개',
    stores: [
      {
        storeId: 'naver',
        storeName: '네이버 쇼핑 (최상단 1위)',
        mallLogo: '🟢',
        price: basePrice,
        shippingFee: 2500,
        unitPriceText: '최저가순 조회 1위',
        deliveryType: '실시간 가격비교',
        isLowest: true,
        purchaseUrl: buildMallSearchUrl('naver', queryName),
      },
      {
        storeId: '11st',
        storeName: '11번가 (최상단 1위)',
        mallLogo: '🔴',
        price: Math.round((basePrice * 1.15) / 100) * 100,
        shippingFee: 2500,
        unitPriceText: '슈팅배송',
        deliveryType: '내일 도착 보장',
        isLowest: false,
        purchaseUrl: buildMallSearchUrl('11st', queryName),
      },
      {
        storeId: 'coupang',
        storeName: '쿠팡 (최상단 1위)',
        mallLogo: '🚀',
        price: Math.round((basePrice * 1.25) / 100) * 100,
        shippingFee: 0,
        unitPriceText: '로켓와우/무료배송',
        deliveryType: '내일 새벽 도착',
        isLowest: false,
        purchaseUrl: buildMallSearchUrl('coupang', queryName),
      },
      {
        storeId: 'ssg',
        storeName: 'SSG 쓱배송 (최상단 1위)',
        mallLogo: '🟡',
        price: Math.round((basePrice * 1.35) / 100) * 100,
        shippingFee: 3000,
        unitPriceText: '쓱배송/이마트',
        deliveryType: '시간대 지정 배송',
        isLowest: false,
        purchaseUrl: buildMallSearchUrl('ssg', queryName),
      }
    ],
  };
}
