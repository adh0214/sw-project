import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { theme } from '../styles/theme';
import { buildMallSearchUrl } from '../data/priceComparisonDB';
import CheckoutSuccessModal from '../components/CheckoutSuccessModal';

export default function SmartCartScreen({ navigation }) {
  const {
    cart,
    cartCount,
    cartTotalPrice,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkoutCart,
    orders
  } = useStock();

  const [activeTab, setActiveTab] = useState('CART'); // 'CART' | 'ORDERS'
  const [successOrder, setSuccessOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const openProductLink = (item) => {
    const storeId = item.store?.storeId || 'naver';
    const pName = item.productName || item.name || '';
    let targetUrl = item.store?.purchaseUrl;
    const isGenericDomain =
      !targetUrl ||
      targetUrl === 'https://www.coupang.com' ||
      targetUrl === 'https://www.11st.co.kr' ||
      targetUrl === 'https://www.ssg.com' ||
      targetUrl === 'https://search.shopping.naver.com';

    if (isGenericDomain) {
      targetUrl = buildMallSearchUrl(storeId, pName);
    }

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.open) {
        window.open(targetUrl, '_blank');
      }
      return;
    }
    Linking.openURL(targetUrl).catch(() => {
      Alert.alert('링크 열기 실패', '쇼핑몰 페이지를 열 수 없습니다.');
    });
  };

  // 결제 진행 핸들러
  const handleProceedCheckout = (mallType = '쿠팡 로켓원클릭 결제') => {
    if (cart.length === 0) {
      Alert.alert('장바구니 확인', '장바구니가 비어 있습니다.');
      return;
    }

    // 결제 완료 처리 -> 재고 자동 +N개 증가!
    const newOrder = checkoutCart(mallType);
    if (newOrder) {
      setSuccessOrder(newOrder);
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 탭 전환: 장바구니 vs 결제 내역 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>스마트 장바구니</Text>
            <Text style={styles.headerSub}>최저가 한 번에 결제 & 재고 자동 충전</Text>
          </View>
          
          <View style={styles.tabToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, activeTab === 'CART' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('CART')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'CART' && styles.toggleBtnTextActive]}>
                장바구니 ({cartCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, activeTab === 'ORDERS' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('ORDERS')}
            >
              <Text style={[styles.toggleBtnText, activeTab === 'ORDERS' && styles.toggleBtnTextActive]}>
                구매 내역 ({orders.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'CART' ? (
          <>
            {/* 장바구니 안내 팁 */}
            {cart.length > 0 && (
              <View style={styles.benefitBanner}>
                <Ionicons name="sparkles" size={16} color="#059669" />
                <Text style={styles.benefitBannerText}>
                  구매 완료 시 재고가 자동으로 충전되어 '여유' 상태로 바뀝니다.
                </Text>
                <TouchableOpacity onPress={clearCart}>
                  <Text style={styles.clearText}>전체삭제</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 장바구니 리스트 */}
            <FlatList
              data={cart}
              keyExtractor={item => item.cartId}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="cart-outline" size={60} color={theme.colors.textMuted} />
                  <Text style={styles.emptyTitle}>장바구니가 비어 있습니다.</Text>
                  <Text style={styles.emptySub}>
                    틴더 스와이프 또는 최저가 추천에서 부족한 생필품을 담아보세요.
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyGoBtn}
                    onPress={() => navigation.navigate('스와이프홈')}
                  >
                    <Text style={styles.emptyGoBtnText}>틴더 스와이프 체크하러 가기</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.cartCard}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

                  <View style={styles.itemInfo}>
                    <View style={styles.storeRow}>
                      <Text style={styles.storeLogo}>{item.store?.mallLogo || '🛒'}</Text>
                      <Text style={styles.storeName}>{item.store?.storeName}</Text>
                      {item.store?.isLowest && (
                        <View style={styles.lowestBadge}>
                          <Text style={styles.lowestBadgeText}>최저가</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.productName} numberOfLines={1}>
                      {item.productName}
                    </Text>

                    <Text style={styles.priceText}>
                      {(item.store?.price * item.quantity).toLocaleString()}원
                      <Text style={styles.unitPriceText}> (개당 {item.store?.price.toLocaleString()}원)</Text>
                    </Text>

                    {/* 수량 변경 및 삭제 */}
                    <View style={styles.cartControlRow}>
                      <View style={styles.qtyBox}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={14} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={14} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.linkBtn}
                        onPress={() => openProductLink(item)}
                      >
                        <Ionicons name="open-outline" size={14} color="#15803D" />
                        <Text style={styles.linkBtnText}>최저가 링크</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeFromCart(item.cartId)}
                      >
                        <Ionicons name="trash-outline" size={16} color={theme.colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />

            {/* 하단 고정 결제 금액 & CTA 버튼 */}
            {cart.length > 0 && (
              <View style={styles.stickyFooter}>
                <View style={styles.totalRow}>
                  <View>
                    <Text style={styles.totalLabel}>총 결제 예상 금액 (무료배송)</Text>
                    <Text style={styles.totalSavings}>
                      💡 최저가 조합으로 약 {Math.round(cartTotalPrice * 0.15).toLocaleString()}원 절약 중!
                    </Text>
                  </View>
                  <Text style={styles.totalAmount}>
                    {cartTotalPrice.toLocaleString()}원
                  </Text>
                </View>

                {/* 원클릭 결제 CTA 버튼 */}
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => handleProceedCheckout('쿠팡 로켓 & 네이버 최저가 원클릭 결제')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="flash" size={20} color="#FBBF24" />
                  <Text style={styles.checkoutBtnText}>
                    총 {cartTotalPrice.toLocaleString()}원 한 번에 구매하기
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          /* 결제 완료 및 재고 충전 히스토리 뷰 */
          <FlatList
            data={orders}
            keyExtractor={item => item.orderId}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color={theme.colors.textMuted} />
                <Text style={styles.emptyTitle}>구매 내역이 없습니다.</Text>
                <Text style={styles.emptySub}>
                  장바구니에서 결제를 진행하면 재고가 자동으로 충전됩니다.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{item.orderId}</Text>
                    <Text style={styles.orderDate}>{item.orderDate}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>재고 충전 완료</Text>
                  </View>
                </View>

                <View style={styles.orderItemsBox}>
                  {item.items?.map((orderItem, idx) => (
                    <View key={idx} style={styles.orderItemRow}>
                      <Text style={styles.orderItemName} numberOfLines={1}>
                        • {orderItem.productName}
                      </Text>
                      <Text style={styles.orderItemQty}>+{orderItem.quantity}개 증가</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderPayMethod}>{item.paymentMethod}</Text>
                  <Text style={styles.orderTotalAmount}>
                    {item.totalAmount?.toLocaleString()}원
                  </Text>
                </View>
              </View>
            )}
          />
        )}

        {/* 결제 완료 & 재고 자동 증가 피드백 모달 */}
        <CheckoutSuccessModal
          visible={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          order={successOrder}
          onGoToStatus={() => navigation.navigate('재고현황')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.soft,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  benefitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successLight,
    padding: 10,
    borderRadius: 14,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
  },
  benefitBannerText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingBottom: 110,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadows.soft,
  },
  itemImage: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  storeLogo: {
    fontSize: 12,
  },
  storeName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  lowestBadge: {
    backgroundColor: '#EF4444',
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  lowestBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  unitPriceText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  cartControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qtyBtn: {
    padding: 4,
    paddingHorizontal: 8,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  linkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  deleteBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyGoBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    ...theme.shadows.soft,
  },
  emptyGoBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...theme.shadows.modal,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  totalSavings: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    ...theme.shadows.card,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadows.soft,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: theme.colors.successLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  orderItemsBox: {
    marginVertical: 4,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  orderItemName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  orderPayMethod: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  orderTotalAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  }
});
