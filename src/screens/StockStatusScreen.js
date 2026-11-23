import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { theme } from '../styles/theme';

export default function StockStatusScreen({ navigation }) {
  const { items, warningItems, warningCount } = useStock();
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'WARNING' | 'SUFFICIENT'

  const totalCount = items.length;
  const sufficientCount = totalCount - warningCount;
  const safetyRate = totalCount > 0 ? Math.round((sufficientCount / totalCount) * 100) : 100;

  const displayItems = items.filter(item => {
    if (filterMode === 'WARNING') return item.quantity <= 1;
    if (filterMode === 'SUFFICIENT') return item.quantity >= 2;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>재고 상태 현황 분석</Text>
          <Text style={styles.headerSub}>실시간 재고 경고 및 소진 위험도 지표</Text>
        </View>

        {/* 상단 통계 대시보드 카드 */}
        <View style={styles.dashboardCard}>
          <View style={styles.dashboardTop}>
            <View>
              <Text style={styles.safetyRateLabel}>우리집 생필품 안전도</Text>
              <Text style={[styles.safetyRateVal, { color: safetyRate >= 70 ? '#10B981' : '#EF4444' }]}>
                {safetyRate}%
              </Text>
            </View>
            <View style={styles.safetyBadge}>
              <Ionicons
                name={safetyRate >= 70 ? 'shield-checkmark' : 'alert-circle'}
                size={18}
                color={safetyRate >= 70 ? '#10B981' : '#EF4444'}
              />
              <Text style={[styles.safetyBadgeText, { color: safetyRate >= 70 ? '#10B981' : '#EF4444' }]}>
                {safetyRate >= 70 ? '안정적 유지 중' : '재주문 필요'}
              </Text>
            </View>
          </View>

          {/* 3대 지표 수치 */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={[styles.statBox, filterMode === 'ALL' && styles.statBoxActive]}
              onPress={() => setFilterMode('ALL')}
            >
              <Text style={styles.statLabel}>전체 품목</Text>
              <Text style={styles.statVal}>{totalCount}개</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statBox, styles.statBoxWarning, filterMode === 'WARNING' && styles.statBoxWarningActive]}
              onPress={() => setFilterMode('WARNING')}
            >
              <Text style={[styles.statLabel, { color: '#EF4444' }]}>🚨 경고 (부족)</Text>
              <Text style={[styles.statVal, { color: '#EF4444' }]}>{warningCount}개</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statBox, styles.statBoxSuccess, filterMode === 'SUFFICIENT' && styles.statBoxSuccessActive]}
              onPress={() => setFilterMode('SUFFICIENT')}
            >
              <Text style={[styles.statLabel, { color: '#10B981' }]}>✅ 여유</Text>
              <Text style={[styles.statVal, { color: '#10B981' }]}>{sufficientCount}개</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 경고 품목 일괄 최저가 추천 배너 */}
        {warningCount > 0 && (
          <TouchableOpacity
            style={styles.recommendBanner}
            onPress={() => navigation.navigate('제품추천')}
          >
            <View style={styles.recommendBannerLeft}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="pricetags" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.recommendBannerTitle}>
                  부족한 {warningCount}개 품목 실시간 최저가 추천
                </Text>
                <Text style={styles.recommendBannerSub}>
                  쿠팡, 네이버, 11번가 동일 제품 가격 비교
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}

        {/* 재고 상태 품목 리스트 */}
        <FlatList
          data={displayItems}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isWarning = item.quantity <= 1;
            return (
              <View style={[styles.itemCard, isWarning ? styles.itemCardWarning : styles.itemCardSuccess]}>
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

                <View style={styles.itemBody}>
                  <View style={styles.itemHeaderRow}>
                    {/* 상태 태그 (필수 요구사항: 수량 1개 이하 경고(붉은색), 2개 이상 여유(초록색)) */}
                    {isWarning ? (
                      <View style={styles.warningTag}>
                        <Ionicons name="warning" size={12} color="#EF4444" />
                        <Text style={styles.warningTagText}>경고 (Warning)</Text>
                      </View>
                    ) : (
                      <View style={styles.sufficientTag}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text style={styles.sufficientTagText}>여유 (Sufficient)</Text>
                      </View>
                    )}

                    <Text style={styles.itemLocation}>📍 {item.location}</Text>
                  </View>

                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  
                  <View style={styles.itemFooterRow}>
                    <Text style={styles.qtyText}>
                      보유 수량: <Text style={[styles.qtyNum, isWarning && styles.qtyNumDanger]}>{item.quantity}개</Text>
                    </Text>

                    {/* 수량 1개 이하 시 [추천 상품 보기] 버튼 활성화 (클릭 시 추천 화면으로 이동) */}
                    {isWarning ? (
                      <TouchableOpacity
                        style={styles.viewRecommendBtn}
                        onPress={() => navigation.navigate('제품추천', { targetProductId: item.id })}
                      >
                        <Ionicons name="sparkles" size={14} color="#fff" />
                        <Text style={styles.viewRecommendBtnText}>추천 상품 보기</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.stableBadge}>
                        <Text style={styles.stableBadgeText}>재고 충분</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
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
  },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadows.card,
  },
  dashboardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  safetyRateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  safetyRateVal: {
    fontSize: 32,
    fontWeight: '900',
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  safetyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statBoxActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  statBoxWarning: {
    backgroundColor: theme.colors.dangerLight,
    borderColor: theme.colors.dangerBorder,
  },
  statBoxWarningActive: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  statBoxSuccess: {
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.successBorder,
  },
  statBoxSuccessActive: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  recommendBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  recommendBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bannerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  recommendBannerSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...theme.shadows.soft,
  },
  itemCardWarning: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFAFA',
  },
  itemCardSuccess: {
    borderColor: '#E2E8F0',
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  warningTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.dangerLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  warningTagText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  sufficientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  sufficientTagText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  itemLocation: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginVertical: 4,
  },
  itemFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  qtyNum: {
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  qtyNumDanger: {
    color: '#EF4444',
  },
  viewRecommendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    ...theme.shadows.soft,
  },
  viewRecommendBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  stableBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  stableBadgeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  }
});
