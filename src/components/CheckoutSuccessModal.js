import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export default function CheckoutSuccessModal({
  visible,
  onClose,
  order,
  onGoToStatus
}) {
  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 축하 애니메이션 헤더 */}
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={32} color="#fff" />
          </View>

          <Text style={styles.title}>주문 및 결제 완료!</Text>
          <Text style={styles.subtitle}>
            결제하신 품목의 재고가 자동으로 업데이트되었습니다.
          </Text>

          {/* 재고 자동 복구 피드백 박스 */}
          <View style={styles.autoRestoreCard}>
            <View style={styles.restoreHeader}>
              <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
              <Text style={styles.restoreHeaderTitle}>재고 수량 자동 증가 (+충전 완료)</Text>
            </View>
            <Text style={styles.restoreDesc}>
              수량 부족 '경고(Warning)' 상태에서 즉시 '여유(Sufficient)' 상태로 자동 전환되었습니다.
            </Text>

            <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
              {order.items?.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyBadgeText}>+{item.quantity}개 충전</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 주문 영수증 요약 */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>주문 번호</Text>
              <Text style={styles.receiptVal}>{order.orderId}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>결제 수단</Text>
              <Text style={styles.receiptVal}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>총 결제 금액</Text>
              <Text style={styles.totalPrice}>{order.totalAmount?.toLocaleString()}원</Text>
            </View>
          </View>

          {/* 하단 액션 버튼 */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => {
              onClose();
              if (onGoToStatus) onGoToStatus();
            }}
          >
            <Ionicons name="stats-chart" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>업데이트된 재고 현황 확인하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...theme.shadows.modal,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  autoRestoreCard: {
    backgroundColor: theme.colors.successLight,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
    borderRadius: 18,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  restoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  restoreHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  restoreDesc: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 10,
    lineHeight: 16,
  },
  itemList: {
    maxHeight: 100,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.2)',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#064E3B',
    flex: 1,
    marginRight: 8,
  },
  qtyBadge: {
    backgroundColor: '#059669',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  qtyBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  receiptCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    gap: 8,
    ...theme.shadows.card,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  }
});
