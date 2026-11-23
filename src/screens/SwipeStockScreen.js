import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { theme } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

export default function SwipeStockScreen({ navigation }) {
  const { items, swipeConsume, swipePass, cartCount } = useStock();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const position = useRef(new Animated.ValueXY()).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const totalCount = items?.length || 0;
  const currentItem = items?.[currentIndex];
  const nextItem = items?.[currentIndex + 1];
  const isAllSwiped = currentIndex >= totalCount;

  // 토스트 메시지 표시
  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.delay(1600),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => setToastMessage(null));
  };

  // 카드 회전 애니메이션
  const rotate = position.x.interpolate({
    inputRange: [-240, 0, 240],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  // '다 씀 / 장바구니 담기' 오버레이 스탬프 투명도 (왼쪽 스와이프)
  const consumeStampOpacity = position.x.interpolate({
    inputRange: [-160, -30, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  // '넉넉함 / 패스' 오버레이 스탬프 투명도 (오른쪽 스와이프)
  const passStampOpacity = position.x.interpolate({
    inputRange: [0, 30, 160],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  // 뒷 카드 스케일 효과
  const nextCardScale = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  // PanResponder 설정 (웹 마우스 드래그 & 모바일 터치 스와이프 100% 호환)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.35 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          triggerSwipe('left');
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          triggerSwipe('right');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      tension: 40,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  // 스와이프 완료 트리거 함수
  const triggerSwipe = (direction) => {
    const targetX = direction === 'left' ? -SCREEN_WIDTH - 80 : SCREEN_WIDTH + 80;
    Animated.timing(position, {
      toValue: { x: targetX, y: 0 },
      duration: 220,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = (direction) => {
    const item = items[currentIndex];
    if (item) {
      if (direction === 'left') {
        // 왼쪽 스와이프: 다 씀 / 장바구니 추가
        swipeConsume(item.id);
        showToast(`🛒 '${item.name}' 장바구니에 담겼습니다!`);
      } else {
        // 오른쪽 스와이프: 넉넉함 / 패스
        swipePass(item.id);
        showToast(`✅ '${item.name}' 넉넉함 체크 완료!`);
      }
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  // 처음부터 다시 체크하기
  const handleRestart = () => {
    setCurrentIndex(0);
    position.setValue({ x: 0, y: 0 });
  };

  // 진행률 계산
  const currentDisplayIndex = Math.min(currentIndex + 1, totalCount);
  const progressRatio = totalCount > 0 ? Math.min(1, currentIndex / totalCount) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 토스트 알림 팝업 */}
        {toastMessage && (
          <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        )}

        {/* 상단 헤더: 앱 타이틀 & 장바구니 숏컷 */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <Ionicons name="flame" size={18} color="#fff" />
              </View>
              <Text style={styles.brandTitle}>SwipeStock</Text>
            </View>
            <TouchableOpacity
              style={styles.cartHeaderBtn}
              onPress={() => navigation.navigate('스마트장바구니')}
              activeOpacity={0.8}
            >
              <Ionicons name="cart" size={22} color={theme.colors.primary} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 이번 주 재고 체크 프로그레스 영역 */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressTitle}>
                이번 주 재고 체크: <Text style={styles.progressHighlight}>{isAllSwiped ? totalCount : currentDisplayIndex}/{totalCount}</Text>
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressRatio * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* 중앙 카드 스와이프 덱 영역 */}
        <View style={styles.cardDeckArea}>
          {!isAllSwiped && currentItem ? (
            <View style={styles.cardStackContainer}>
              {/* 뒷 카드 (스택 미리보기 효과) */}
              {nextItem && (
                <Animated.View
                  style={[
                    styles.cardWrapper,
                    styles.backCard,
                    { transform: [{ scale: nextCardScale }] },
                  ]}
                >
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={{ uri: nextItem.imageUrl }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.tagRow}>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{nextItem.category}</Text>
                      </View>
                      <View style={styles.locationTag}>
                        <Ionicons name="location-sharp" size={12} color="#4F46E5" />
                        <Text style={styles.locationTagText}>{nextItem.location}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {nextItem.name}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.unitText}>{nextItem.unit || '1개'}</Text>
                      <Text style={styles.priceText}>
                        예상 <Text style={styles.priceHighlight}>{(nextItem.estimatedPrice || 0).toLocaleString()}원</Text>
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* 현재 활성 스와이프 카드 (제스처 및 회전 인터랙션) */}
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.cardWrapper,
                  styles.frontCard,
                  {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { rotate: rotate },
                    ],
                  },
                ]}
              >
                {/* 왼쪽 스와이프 스탬프 라벨: '🛒 다 씀 (담기)' */}
                <Animated.View
                  style={[styles.stampBadge, styles.stampLeft, { opacity: consumeStampOpacity }]}
                >
                  <Text style={styles.stampTextLeft}>🛒 다 씀 (담기)</Text>
                </Animated.View>

                {/* 오른쪽 스와이프 스탬프 라벨: '✅ 넉넉함 (패스)' */}
                <Animated.View
                  style={[styles.stampBadge, styles.stampRight, { opacity: passStampOpacity }]}
                >
                  <Text style={styles.stampTextRight}>✅ 넉넉함 (패스)</Text>
                </Animated.View>

                {/* 상품 이미지 영역 */}
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: currentItem.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  {/* 보유 수량 상태 뱃지 */}
                  <View
                    style={[
                      styles.stockBadge,
                      currentItem.quantity <= 1 ? styles.stockBadgeDanger : styles.stockBadgeSafe,
                    ]}
                  >
                    <View
                      style={[
                        styles.stockDot,
                        { backgroundColor: currentItem.quantity <= 1 ? '#EF4444' : '#10B981' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.stockBadgeText,
                        { color: currentItem.quantity <= 1 ? '#DC2626' : '#059669' },
                      ]}
                    >
                      현재 {currentItem.quantity}개 보유 {currentItem.quantity <= 1 ? '(부족)' : '(여유)'}
                    </Text>
                  </View>
                </View>

                {/* 카드 상세 정보 영역 */}
                <View style={styles.cardContent}>
                  <View style={styles.tagRow}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{currentItem.category}</Text>
                    </View>
                    <View style={styles.locationTag}>
                      <Ionicons name="location-sharp" size={12} color="#4F46E5" />
                      <Text style={styles.locationTagText}>{currentItem.location}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {currentItem.name}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.unitText}>{currentItem.unit ? `단위: ${currentItem.unit}` : '1개입'}</Text>
                    <Text style={styles.priceText}>
                      예상 <Text style={styles.priceHighlight}>{(currentItem.estimatedPrice || 0).toLocaleString()}원</Text>
                    </Text>
                  </View>

                  <View style={styles.swipeGuideRow}>
                    <Text style={styles.swipeGuideLeft}>👈 왼쪽으로 밀면 '다 씀'</Text>
                    <Text style={styles.swipeGuideRight}>오른쪽으로 밀면 '넉넉함' 👉</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          ) : (
            /* 모든 생필품 체크 완료 축하 화면 */
            <View style={styles.completedCard}>
              <View style={styles.completedIconCircle}>
                <Ionicons name="checkmark-done" size={44} color="#fff" />
              </View>
              <Text style={styles.completedTitle}>이번 주 재고 체크 완료! 🎉</Text>
              <Text style={styles.completedSubtitle}>
                총 {totalCount}개 생필품의 재고 상태를 모두 확인했습니다.
              </Text>

              <View style={styles.completedSummaryBox}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>확인한 품목</Text>
                  <Text style={styles.summaryValue}>{totalCount}개</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>장바구니 담김</Text>
                  <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                    {cartCount}개
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.completedCartBtn}
                onPress={() => navigation.navigate('스마트장바구니')}
                activeOpacity={0.85}
              >
                <Ionicons name="cart" size={20} color="#fff" />
                <Text style={styles.completedCartBtnText}>장바구니 확인하고 구매하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completedRestartBtn}
                onPress={handleRestart}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={17} color="#64748B" />
                <Text style={styles.completedRestartBtnText}>처음부터 다시 체크하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 하단 2개의 대형 액션 버튼 */}
        {!isAllSwiped && (
          <View style={styles.bottomActionBar}>
            {/* 왼쪽 버튼: '다 씀 / 장바구니 추가' (빨간색 테마) */}
            <TouchableOpacity
              style={styles.btnConsume}
              onPress={() => triggerSwipe('left')}
              activeOpacity={0.8}
            >
              <View style={styles.btnIconCircleRed}>
                <Ionicons name="cart" size={24} color="#EF4444" />
              </View>
              <View style={styles.btnTextWrap}>
                <Text style={styles.btnTitleRed}>다 씀</Text>
                <Text style={styles.btnSubRed}>장바구니 추가</Text>
              </View>
            </TouchableOpacity>

            {/* 오른쪽 버튼: '넉넉함 / 패스' (초록색 테마) */}
            <TouchableOpacity
              style={styles.btnPass}
              onPress={() => triggerSwipe('right')}
              activeOpacity={0.8}
            >
              <View style={styles.btnIconCircleGreen}>
                <Ionicons name="checkmark" size={26} color="#10B981" />
              </View>
              <View style={styles.btnTextWrap}>
                <Text style={styles.btnTitleGreen}>넉넉함</Text>
                <Text style={styles.btnSubGreen}>패스하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: '#F8F9FA',
    flexDirection: 'column',
  },
  toastContainer: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  cartHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  progressSection: {
    marginTop: 2,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  progressHighlight: {
    fontWeight: '800',
    color: theme.colors.primary,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 999,
  },
  cardDeckArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStackContainer: {
    width: '100%',
    height: '100%',
    maxHeight: 520,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  frontCard: {
    zIndex: 10,
  },
  backCard: {
    zIndex: 5,
    opacity: 0.85,
  },
  cardImageContainer: {
    width: '100%',
    height: '58%',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stockBadgeDanger: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  stockBadgeSafe: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardContent: {
    height: '42%',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  locationTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
    marginLeft: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  unitText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  priceHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  swipeGuideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  swipeGuideLeft: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  swipeGuideRight: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  stampBadge: {
    position: 'absolute',
    top: 24,
    zIndex: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  stampLeft: {
    right: 20,
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    transform: [{ rotate: '12deg' }],
  },
  stampRight: {
    left: 20,
    backgroundColor: '#10B981',
    borderColor: '#059669',
    transform: [{ rotate: '-12deg' }],
  },
  stampTextLeft: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stampTextRight: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  btnConsume: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnIconCircleRed: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnTextWrap: {
    alignItems: 'flex-start',
  },
  btnTitleRed: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  btnSubRed: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  btnPass: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnIconCircleGreen: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnTitleGreen: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  btnSubGreen: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    width: '94%',
  },
  completedIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  completedTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  completedSummaryBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  completedCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  completedCartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  completedRestartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  completedRestartBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});
