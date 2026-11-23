import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { theme } from '../styles/theme';
import { getProductPriceComparison, buildMallSearchUrl } from '../data/priceComparisonDB';
import CartAddedModal from '../components/CartAddedModal';
import PriceEditModal from '../components/PriceEditModal';
import ApiConfigModal from '../components/ApiConfigModal';

// 쇼핑몰별 테마 메타데이터
const MALL_THEMES = {
  coupang: {
    name: '쿠팡',
    shortName: '쿠팡 로켓',
    icon: '🚀',
    accentColor: '#E11D48',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    textColor: '#BE123C',
  },
  '11st': {
    name: '11번가',
    shortName: '11번가',
    icon: '🔴',
    accentColor: '#F43F5E',
    bgColor: '#FFF1F2',
    borderColor: '#FFE4E6',
    textColor: '#E11D48',
  },
  ssg: {
    name: 'SSG',
    shortName: 'SSG 쓱배송',
    icon: '🟡',
    accentColor: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  naver: {
    name: '네이버',
    shortName: '네이버 쇼핑',
    icon: '🟢',
    accentColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
};

export default function RecommendationScreen({ navigation, route }) {
  const {
    warningItems,
    items,
    addToCart,
    updateItemEstimatedPrice,
    isApiSyncing,
    lastSyncedTime,
    syncAllPricesWithApi,
  } = useStock();

  const [addedModalVisible, setAddedModalVisible] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalStore, setModalStore] = useState(null);

  // 실거래가 직접 수정 모달 상태
  const [editPriceModalVisible, setEditPriceModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCurrentPrice, setEditingCurrentPrice] = useState(0);

  // 쇼핑몰 API 설정 모달 상태
  const [apiConfigModalVisible, setApiConfigModalVisible] = useState(false);

  // 부족 품목(1개 이하) 우선 추천, 없으면 전체 생필품 추천
  const requestedItem = route?.params?.targetProductId
    ? items.find((item) => item.id === route.params.targetProductId)
    : null;
  const targetItems = requestedItem
    ? [requestedItem]
    : warningItems.length > 0
      ? warningItems
      : items.slice(0, 6);

  // 각 쇼핑몰(쿠팡, 11번가, SSG, 네이버) 사이트 내 실시간 최저가(낮은 가격순 정렬) 페이지 열기
  const handleOpenStoreLink = (product, store = null, targetStoreId = null) => {
    const storeId = targetStoreId || store?.storeId || 'naver';
    const productName = product?.name || '';
    
    // 각 쇼핑몰의 사이트 내 실시간 최저가(낮은 가격순) 검색 URL 자동 생성
    const targetUrl = buildMallSearchUrl(storeId, productName);

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.open) {
        window.open(targetUrl, '_blank');
      }
    } else {
      Linking.canOpenURL(targetUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(targetUrl);
          } else {
            Alert.alert('링크 열기 실패', '웹 브라우저를 열 수 없습니다.');
          }
        })
        .catch(() => {
          Alert.alert('오류', '링크를 열 수 없습니다.');
        });
    }
  };

  const handleAddToCart = (product, store) => {
    addToCart(product, store, 1);
    setModalProduct(product);
    setModalStore(store);
    setAddedModalVisible(true);
  };

  const handleOpenPriceEdit = (product, currentLowestPrice) => {
    setEditingItem(product);
    setEditingCurrentPrice(currentLowestPrice || product.estimatedPrice || 10000);
    setEditPriceModalVisible(true);
  };

  const handleSavePrice = (productId, newPrice) => {
    updateItemEstimatedPrice(productId, newPrice);
  };

  const handleTriggerApiSync = async () => {
    const result = await syncAllPricesWithApi();
    if (result?.success) {
      if (Platform.OS === 'web') {
        // 성공 토스트 또는 알림
      } else {
        Alert.alert('API 동기화 완료', `네이버 및 쇼핑몰 실시간 API로부터 최신 최저가(${result.count}건)를 반영했습니다.`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeftCol}>
            <Text style={styles.headerTitle}>실시간 쇼핑몰 API 최저가 추천</Text>
            <Text style={styles.headerSub}>
              네이버 Open API · 11번가 · 쿠팡 실시간 가격 피드 연동
            </Text>
          </View>
          <View style={styles.headerBtnGroup}>
            {/* API 설정 버튼 */}
            <TouchableOpacity
              style={styles.apiConfigBtn}
              onPress={() => setApiConfigModalVisible(true)}
              title="API 키 연동 설정"
            >
              <Ionicons name="settings-outline" size={16} color="#4F46E5" />
              <Text style={styles.apiConfigBtnText}>API 설정</Text>
            </TouchableOpacity>

            {/* 실시간 API 새로고침 버튼 */}
            <TouchableOpacity
              style={[styles.refreshApiBtn, isApiSyncing && styles.refreshApiBtnDisabled]}
              onPress={handleTriggerApiSync}
              disabled={isApiSyncing}
              activeOpacity={0.8}
            >
              {isApiSyncing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh" size={15} color="#FFFFFF" />
              )}
              <Text style={styles.refreshApiBtnText}>
                {isApiSyncing ? '조회 중...' : '실시간 갱신'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 상단 API 상태 및 안내 배너 */}
        <View style={styles.apiStatusBar}>
          <View style={styles.apiStatusLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.apiStatusText}>
              <Text style={styles.boldStatus}>실시간 쇼핑몰 API 연동 중</Text> (최근 동기화: {lastSyncedTime})
            </Text>
          </View>
          <View style={styles.apiLiveBadge}>
            <Text style={styles.apiLiveBadgeText}>LIVE API</Text>
          </View>
        </View>

        {/* 추천 리스트 */}
        <FlatList
          data={targetItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const comparison = getProductPriceComparison(item);
            if (!comparison) return null;

            const lowestStore =
              comparison.stores.find((s) => s.isLowest) || comparison.stores[0];
            const lowestTheme = MALL_THEMES[lowestStore?.storeId] || MALL_THEMES.naver;
            const displayLowestPrice = lowestStore?.price || item.estimatedPrice || 0;

            return (
              <View style={styles.productCard}>
                {/* 제품 기본 정보 */}
                <View style={styles.productHeader}>
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                  <View style={styles.productDetails}>
                    <View style={styles.locationBadgeRow}>
                      <Text style={styles.locationTag}>📍 {item.location}</Text>
                      <Text style={styles.unitTag}>{comparison.unitInfo}</Text>
                    </View>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {comparison.topMatchedItemName && (
                      <View style={styles.matchedItemNotice}>
                        <Ionicons name="checkmark-circle" size={12} color="#4F46E5" />
                        <Text style={styles.matchedItemNoticeText} numberOfLines={1}>
                          API 실시간 1위: {comparison.topMatchedItemName}
                        </Text>
                      </View>
                    )}
                    <View style={styles.priceRowHeader}>
                      <View>
                        <Text style={styles.standardPriceText}>
                          정상가 {comparison.standardPrice?.toLocaleString() || '미등록'}원
                        </Text>
                        <Text style={styles.shippingNoticeText}>
                          {lowestStore?.shippingFee === 0
                            ? '무료배송 상품'
                            : `🚚 배송비 ${lowestStore?.shippingFee?.toLocaleString()}원 (총 실구매 ${((lowestStore?.price || 0) + (lowestStore?.shippingFee || 0)).toLocaleString()}원)`}
                        </Text>
                      </View>
                      <View style={styles.priceRightCol}>
                        <View style={styles.lowestPriceBadgeWrap}>
                          <Text style={styles.lowestPriceLabel}>API 최저가 1위</Text>
                          <Text style={styles.lowestHighlightText}>
                            {displayLowestPrice.toLocaleString()}원
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.editPriceChip}
                          onPress={() => handleOpenPriceEdit(item, displayLowestPrice)}
                        >
                          <Ionicons name="pencil" size={11} color="#6366F1" />
                          <Text style={styles.editPriceChipText}>가격 직접 수정</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 1. 최저가 판매처 다이렉트 배너 (실시간 API 최저가 순) */}
                <TouchableOpacity
                  style={[
                    styles.lowestDirectBtn,
                    {
                      backgroundColor: lowestTheme.bgColor,
                      borderColor: lowestTheme.borderColor,
                    },
                  ]}
                  onPress={() => handleOpenStoreLink(item, lowestStore)}
                  activeOpacity={0.85}
                >
                  <View style={styles.lowestBtnLeft}>
                    <Text style={styles.lowestMallIcon}>{lowestTheme.icon}</Text>
                    <View style={styles.lowestBtnCopy}>
                      <View style={styles.lowestBtnTitleRow}>
                        <Text
                          style={[styles.lowestBtnTitle, { color: lowestTheme.textColor }]}
                          numberOfLines={1}
                        >
                          {lowestStore?.storeName || `${lowestTheme.name} 실시간 1위`}
                        </Text>
                        <View style={styles.realLowestChip}>
                          <Text style={styles.realLowestChipText}>실시간 최상단 1위</Text>
                        </View>
                      </View>
                      <Text style={styles.lowestBtnSub} numberOfLines={1}>
                        {lowestStore?.deliveryType} • {lowestStore?.unitPriceText} • 최저 {displayLowestPrice.toLocaleString()}원 {lowestStore?.shippingFee ? `(배송비 ${lowestStore.shippingFee.toLocaleString()}원)` : '(무료배송)'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.lowestBtnRight,
                      { borderColor: lowestTheme.borderColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.lowestBtnActionText,
                        { color: lowestTheme.textColor },
                      ]}
                    >
                      실시간 최저가 보기
                    </Text>
                    <Ionicons name="open-outline" size={14} color={lowestTheme.textColor} />
                  </View>
                </TouchableOpacity>

                {/* 2. 각 쇼핑몰 사이트 내 실시간 최저가(낮은 가격순) 빠른 검색 바 */}
                <View style={styles.quickMallSection}>
                  <View style={styles.quickMallTitleRow}>
                    <Text style={styles.quickMallTitle}>쇼핑몰별 실시간 최저가(낮은가격순) 바로가기:</Text>
                    <Text style={styles.quickMallHint}>클릭 시 실시간 최저가 정렬</Text>
                  </View>
                  <View style={styles.quickMallBtnRow}>
                    <TouchableOpacity
                      style={[styles.quickMallChip, styles.chipCoupang]}
                      onPress={() => handleOpenStoreLink(item, null, 'coupang')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickMallChipText}>🚀 쿠팡 최저가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.quickMallChip, styles.chip11st]}
                      onPress={() => handleOpenStoreLink(item, null, '11st')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickMallChipText}>🔴 11번가 최저가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.quickMallChip, styles.chipSsg]}
                      onPress={() => handleOpenStoreLink(item, null, 'ssg')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickMallChipText}>🟡 SSG 최저가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.quickMallChip, styles.chipNaver]}
                      onPress={() => handleOpenStoreLink(item, null, 'naver')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickMallChipText}>🟢 네이버 최저가</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. 판매처별 실시간 가격 비교 리스트 */}
                <Text style={styles.comparisonSectionTitle}>
                  🛒 판매처별 실시간 가격 & 단위당 가격 비교
                </Text>

                <View style={styles.storesContainer}>
                  {comparison.stores.map((store, sIdx) => {
                    const storeTheme = MALL_THEMES[store.storeId] || MALL_THEMES.naver;
                    return (
                      <View
                        key={sIdx}
                        style={[
                          styles.storeRow,
                          store.isLowest && styles.storeRowLowest,
                        ]}
                      >
                        <View style={styles.storeLeft}>
                          <View style={styles.mallLogoBox}>
                            <Text style={styles.mallLogoIcon}>{store.mallLogo || storeTheme.icon}</Text>
                          </View>
                          <View style={styles.storeInfoCol}>
                            <View style={styles.mallNameRow}>
                              <Text style={styles.mallName}>{store.storeName}</Text>
                              {store.isLowest && (
                                <View style={styles.lowestBadge}>
                                  <Text style={styles.lowestBadgeText}>최저가</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.deliveryText} numberOfLines={1}>
                              {store.deliveryType} • {store.unitPriceText} • {store.shippingFee === 0 ? '무료배송' : `배송비 ${store.shippingFee.toLocaleString()}원`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.storeRight}>
                          <View style={styles.priceColumn}>
                            {store.discountRate && (
                              <Text style={styles.discountRate}>{store.discountRate} 할인</Text>
                            )}
                            <Text
                              style={[
                                styles.storePrice,
                                store.isLowest && styles.storePriceLowest,
                              ]}
                            >
                              {store.price != null
                                ? `${store.price.toLocaleString()}원`
                                : '실거래가 확인'}
                            </Text>
                          </View>

                          <View style={styles.actionBtnGroup}>
                            {/* 각 쇼핑몰 사이트 내 최저가 검색 직행 버튼 */}
                            <TouchableOpacity
                              style={[
                                styles.mallDirectBtn,
                                {
                                  backgroundColor: storeTheme.bgColor,
                                  borderColor: storeTheme.borderColor,
                                },
                              ]}
                              onPress={() => handleOpenStoreLink(item, store)}
                              activeOpacity={0.8}
                              title={`${storeTheme.name} 사이트 내 최저가 확인`}
                            >
                              <Text
                                style={[
                                  styles.mallDirectBtnText,
                                  { color: storeTheme.textColor },
                                ]}
                              >
                                {storeTheme.name} 최저가
                              </Text>
                              <Ionicons
                                name="open-outline"
                                size={12}
                                color={storeTheme.textColor}
                              />
                            </TouchableOpacity>

                            {/* 장바구니 담기 버튼 */}
                            <TouchableOpacity
                              style={[
                                styles.addCartBtn,
                                store.isLowest
                                  ? styles.addCartBtnLowest
                                  : styles.addCartBtnNormal,
                              ]}
                              onPress={() => handleAddToCart(item, store)}
                              activeOpacity={0.8}
                            >
                              <Ionicons
                                name="cart"
                                size={13}
                                color={store.isLowest ? '#fff' : theme.colors.primary}
                              />
                              <Text
                                style={[
                                  styles.addCartBtnText,
                                  store.isLowest
                                    ? styles.addCartBtnTextLowest
                                    : styles.addCartBtnTextNormal,
                                ]}
                              >
                                담기
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          }}
        />

        {/* 장바구니 담김 팝업 모달 */}
        <CartAddedModal
          visible={addedModalVisible}
          onClose={() => setAddedModalVisible(false)}
          product={modalProduct}
          store={modalStore}
          onGoToCart={() => navigation.navigate('스마트장바구니')}
        />

        {/* 실거래 최저가 직접 수정 팝업 모달 */}
        <PriceEditModal
          visible={editPriceModalVisible}
          onClose={() => setEditPriceModalVisible(false)}
          product={editingItem}
          currentPrice={editingCurrentPrice}
          onSavePrice={handleSavePrice}
        />

        {/* 쇼핑몰 실시간 API 설정 모달 */}
        <ApiConfigModal
          visible={apiConfigModalVisible}
          onClose={() => setApiConfigModalVisible(false)}
          onSaved={handleTriggerApiSync}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
  },
  headerLeftCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  apiConfigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    gap: 4,
  },
  apiConfigBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  refreshApiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  refreshApiBtnDisabled: {
    opacity: 0.7,
  },
  refreshApiBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  apiStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  apiStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  apiStatusText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
  },
  boldStatus: {
    fontWeight: '800',
    color: '#059669',
  },
  apiLiveBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  apiLiveBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 40,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationTag: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  unitTag: {
    fontSize: 11,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    marginVertical: 2,
  },
  matchedItemNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  matchedItemNoticeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  priceRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  standardPriceText: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  shippingNoticeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 1,
  },
  priceRightCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  lowestPriceBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lowestPriceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  lowestHighlightText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  editPriceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  editPriceChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
  },
  lowestDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  lowestBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  lowestMallIcon: {
    fontSize: 22,
  },
  lowestBtnCopy: {
    flex: 1,
  },
  lowestBtnTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lowestBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  realLowestChip: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  realLowestChipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  lowestBtnSub: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    marginTop: 1,
  },
  lowestBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  lowestBtnActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickMallSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickMallTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickMallTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  quickMallHint: {
    fontSize: 10,
    color: '#6366F1',
    fontWeight: '600',
  },
  quickMallBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  quickMallChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipCoupang: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  chip11st: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  chipSsg: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  chipNaver: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  quickMallChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  comparisonSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  storesContainer: {
    gap: 8,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  storeRowLowest: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  mallLogoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mallLogoIcon: {
    fontSize: 14,
  },
  storeInfoCol: {
    flex: 1,
  },
  mallNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mallName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  lowestBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  lowestBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  deliveryText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  storeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  discountRate: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  storePrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  storePriceLowest: {
    color: '#DC2626',
    fontSize: 14,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mallDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
  },
  mallDirectBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 3,
  },
  addCartBtnLowest: {
    backgroundColor: '#4F46E5',
  },
  addCartBtnNormal: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  addCartBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  addCartBtnTextLowest: {
    color: '#FFFFFF',
  },
  addCartBtnTextNormal: {
    color: '#4F46E5',
  },
});
