import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { initialStockItems } from '../data/initialStock';
import { getProductPriceComparison, buildMallSearchUrl } from '../data/priceComparisonDB';
import { snapCycleDays } from '../utils/consumptionCycle';
import { fetchAllMallsRealtimePrices } from '../services/shoppingApiService';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  const [items, setItems] = useState(initialStockItems);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [autoDecreasedLogs, setAutoDecreasedLogs] = useState([]);
  const [isApiSyncing, setIsApiSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date().toLocaleTimeString('ko-KR'));

  // 사이트 내 '낮은 가격순' 설정 시 가장 처음으로 뜬 1위 최저가로 상품 가격 자동 동기화
  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => {
        const comparison = getProductPriceComparison(item);
        const lowestStore =
          comparison?.stores?.find((s) => s.isLowest) || comparison?.stores?.[0];
        if (lowestStore?.price && lowestStore.price !== item.estimatedPrice) {
          return {
            ...item,
            estimatedPrice: lowestStore.price,
          };
        }
        return item;
      })
    );
  }, []);

  // 사이트별 실시간 API 비동기 조회 및 가격 전역 실시간 반영 함수
  const syncAllPricesWithApi = async () => {
    setIsApiSyncing(true);
    try {
      // 1초 지연 시뮬레이션 및 실제 비동기 병렬 API 조회
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const apiData = await fetchAllMallsRealtimePrices(item.name);
          const lowestStore = apiData.stores.find((s) => s.isLowest) || apiData.stores[0];
          if (lowestStore?.price) {
            return {
              ...item,
              estimatedPrice: lowestStore.price,
            };
          }
          return item;
        })
      );

      setItems(updatedItems);
      setLastSyncedTime(new Date().toLocaleTimeString('ko-KR'));
      return { success: true, count: updatedItems.length };
    } catch (err) {
      console.warn('실시간 API 동기화 실패:', err);
      return { success: false, error: err };
    } finally {
      setIsApiSyncing(false);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  const getElapsedDays = (fromDate, toDate = getTodayString()) => {
    const from = new Date(`${fromDate}T00:00:00.000Z`);
    const to = new Date(`${toDate}T00:00:00.000Z`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
    return Math.max(0, Math.floor((to - from) / 86400000));
  };

  // 경과 일수 및 D-Day 계산 헬퍼 함수
  const getDDayInfo = (item) => {
    const cycle = item.consumptionCycleDays || 30;
    const todayStr = getTodayString();
    const baseDateStr = item.lastDecreasedAt || item.lastChecked || todayStr;
    const diffDays = getElapsedDays(baseDateStr, todayStr);
    
    const daysLeft = Math.max(0, cycle - diffDays);
    const percentPassed = Math.min(100, Math.round((diffDays / cycle) * 100));

    let dDayText = `D-${daysLeft}`;
    if (daysLeft === 0) {
      dDayText = 'D-Day (소모 주기 도래)';
    }

    const next = new Date(`${baseDateStr}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + cycle);
    const nextDecreaseDate = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;

    return {
      cycle,
      diffDays,
      daysLeft,
      dDayText,
      percentPassed,
      isDue: diffDays >= cycle,
      nextDecreaseDate,
    };
  };

  // 앱 시작 시 및 주기적 점검: 설정된 소모 주기 도래 시 수량 자동 감소 처리
  const checkAndApplyAutoConsumption = () => {
    const todayStr = getTodayString();
    const logs = [];

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (!item.autoDecreaseEnabled && item.autoDecreaseEnabled !== undefined) {
          return item;
        }

        const cycle = item.consumptionCycleDays || 30;
        const lastDateStr = item.lastDecreasedAt || item.lastChecked || todayStr;
        const lastDate = new Date(lastDateStr);

        const diffDays = getElapsedDays(lastDateStr, todayStr);

        if (diffDays >= cycle && item.quantity > 0) {
          const cyclesToReduce = Math.floor(diffDays / cycle);
          const reducedQty = Math.min(item.quantity, cyclesToReduce);
          const newQty = item.quantity - reducedQty;
          const nextDecreaseDate = new Date(`${lastDateStr}T00:00:00.000Z`);
          nextDecreaseDate.setUTCDate(nextDecreaseDate.getUTCDate() + cyclesToReduce * cycle);
          const nextDecreaseDateStr = nextDecreaseDate.toISOString().slice(0, 10);

          logs.push({
            itemId: item.id,
            itemName: item.name,
            reducedQty,
            cycleDays: cycle,
            remainingQty: newQty,
            date: todayStr,
          });

          return {
            ...item,
            quantity: newQty,
            lastDecreasedAt: nextDecreaseDateStr,
            lastChecked: todayStr,
          };
        }

        return item;
      })
    );

    if (logs.length > 0) {
      setAutoDecreasedLogs((prev) => [...logs, ...prev]);
    }
  };

  // 컴포넌트 마운트 시 자동 소모 점검 실행
  useEffect(() => {
    checkAndApplyAutoConsumption();
  }, []);

  // 15일 단위 소모 주기 변경 함수
  const updateItemConsumptionCycle = (id, newCycleDays) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              consumptionCycleDays: snapCycleDays(newCycleDays),
            }
          : item
      )
    );
  };

  // 수동 1회 주기 소모 테스트 트리거 (시연용)
  const simulateCycleDecrease = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity - 1);
          return {
            ...item,
            quantity: newQty,
            lastDecreasedAt: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
  };

  // 수량 1개 이하인 경고 품목 수 (재고 현황 및 추천 뱃지)
  const warningItems = useMemo(() => {
    return items.filter((item) => item.quantity <= 1);
  }, [items]);

  const warningCount = warningItems.length;

  // 장바구니 총 담긴 아이템 개수 (장바구니 뱃지)
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // 장바구니 총 금액
  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price || item.store?.price || 0) * item.quantity, 0);
  }, [cart]);

  // 생필품 신규 등록
  const addItem = (newItem) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const item = {
      ...newItem,
      id: `item-${Date.now()}`,
      quantity: newItem.quantity ?? 1,
      minThreshold: 2,
      lastChecked: todayStr,
      lastDecreasedAt: todayStr,
      consumptionCycleDays: snapCycleDays(newItem.consumptionCycleDays || 30),
      autoDecreaseEnabled: true,
      imageUrl:
        newItem.imageUrl ||
        'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    };
    setItems((prev) => [item, ...prev]);
    return item;
  };

  // 생필품 정보 수정
  const updateItem = (id, updatedFields) => {
    const nextFields = { ...updatedFields };
    if (nextFields.consumptionCycleDays != null) {
      nextFields.consumptionCycleDays = snapCycleDays(nextFields.consumptionCycleDays);
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...nextFields } : item))
    );
  };

  // 생필품 실거래 최저가 직접 업데이트
  const updateItemEstimatedPrice = (id, newPrice) => {
    const priceNum = Math.max(0, parseInt(newPrice, 10) || 0);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estimatedPrice: priceNum } : item))
    );
  };

  // 생필품 삭제
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((cartItem) => cartItem.productId !== id));
  };

  // 생필품 수량 증감
  const updateQuantity = (id, delta) => {
    const todayStr = getTodayString();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(0, item.quantity + delta);
          return {
            ...item,
            quantity: nextQty,
            lastChecked: todayStr,
            ...(delta > 0 ? { lastDecreasedAt: todayStr } : {}),
          };
        }
        return item;
      })
    );
  };

  // 틴더 스와이프: '다 씀 / 장바구니 추가' (왼쪽 스와이프)
  const swipeConsume = (itemId) => {
    const targetItem = items.find((it) => it.id === itemId);
    if (!targetItem) return;

    // 수량 0으로 업데이트
    updateQuantity(itemId, -targetItem.quantity);

    // 최저가 판매처 정보 조회 후 장바구니에 자동 추가
    const comparison = getProductPriceComparison(targetItem);
    const lowestStore = comparison?.stores?.find((s) => s.isLowest) || comparison?.stores?.[0] || {
      storeId: 'naver',
      storeName: '네이버 쇼핑 최저가몰',
      mallLogo: '🟢',
      price: targetItem.estimatedPrice || 10000,
      deliveryType: '내일 도착 보장',
      isLowest: true,
      purchaseUrl: buildMallSearchUrl('naver', targetItem.name),
    };

    addToCart(targetItem, lowestStore, 1);
  };

  // 틴더 스와이프: '넉넉함 / 패스' (오른쪽 스와이프)
  const swipePass = (itemId) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            lastChecked: new Date().toISOString().split('T')[0],
            quantity: item.quantity === 0 ? 2 : item.quantity,
          };
        }
        return item;
      })
    );
  };

  // 장바구니에 상품 추가 (쇼핑몰별 최저가 링크 보존)
  const addToCart = (product, store, quantity = 1) => {
    const storeId = store?.storeId || 'naver';
    let purchaseUrl = store?.purchaseUrl;
    if (
      !purchaseUrl ||
      purchaseUrl === 'https://www.coupang.com' ||
      purchaseUrl === 'https://www.11st.co.kr' ||
      purchaseUrl === 'https://www.ssg.com'
    ) {
      purchaseUrl = buildMallSearchUrl(storeId, product.name);
    }

    const resolvedStore = {
      ...(store || {}),
      purchaseUrl,
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.store?.storeId === resolvedStore.storeId
      );
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        const newCartItem = {
          cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          id: product.id,
          name: product.name,
          productName: product.name,
          category: product.category,
          imageUrl: product.imageUrl,
          unit: product.unit,
          price: resolvedStore?.price || product.estimatedPrice || 10000,
          estimatedPrice: product.estimatedPrice || 10000,
          store: resolvedStore,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newCartItem];
      }
    });
  };

  // 장바구니 항목 삭제
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // 장바구니 수량 변경
  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 결제 완료 & 재고 자동 증가
  const checkoutCart = (paymentMethod = '쿠팡 로켓 & 네이버 최저가 원클릭 결제') => {
    if (cart.length === 0) return null;

    const purchasedItems = [...cart];
    const totalAmount = cartTotalPrice;

    setItems((prev) =>
      prev.map((stockItem) => {
        const matchedCartItems = purchasedItems.filter((ci) => ci.productId === stockItem.id);
        if (matchedCartItems.length > 0) {
          const totalAddedQty = matchedCartItems.reduce((acc, ci) => acc + ci.quantity, 0);
          return {
            ...stockItem,
            quantity: stockItem.quantity + totalAddedQty,
            lastChecked: new Date().toISOString().split('T')[0],
            lastDecreasedAt: new Date().toISOString().split('T')[0],
          };
        }
        return stockItem;
      })
    );

    const newOrder = {
      orderId: `ORDER-${Date.now()}`,
      orderDate: new Date().toLocaleString('ko-KR'),
      items: purchasedItems,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      shippingStatus: '배송 준비 중 (내일 도착 예정)',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <StockContext.Provider
      value={{
        items,
        cart,
        orders,
        warningItems,
        warningCount,
        cartCount,
        cartTotalPrice,
        autoDecreasedLogs,
        getDDayInfo,
        checkAndApplyAutoConsumption,
        updateItemConsumptionCycle,
        simulateCycleDecrease,
        addItem,
        updateItem,
        updateItemEstimatedPrice,
        deleteItem,
        updateQuantity,
        swipeConsume,
        swipePass,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        isApiSyncing,
        lastSyncedTime,
        syncAllPricesWithApi,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
