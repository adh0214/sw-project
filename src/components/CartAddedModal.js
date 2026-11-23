import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export default function CartAddedModal({
  visible,
  onClose,
  product,
  store,
  onGoToCart
}) {
  if (!product || !store) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 성공 아이콘 뱃지 */}
          <View style={styles.iconCircle}>
            <Ionicons name="cart" size={32} color="#fff" />
          </View>

          <Text style={styles.title}>장바구니 담기 완료!</Text>
          <Text style={styles.subtitle}>선택하신 최저가 상품이 스마트 장바구니에 추가되었습니다.</Text>

          {/* 상품 요약 카드 */}
          <View style={styles.productCard}>
            {product.imageUrl && (
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            )}
            <View style={styles.productInfo}>
              <View style={styles.storeBadge}>
                <Text style={styles.storeLogo}>{store.mallLogo}</Text>
                <Text style={styles.storeName}>{store.storeName}</Text>
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.priceText}>
                {store.price?.toLocaleString()}원
              </Text>
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.continueBtn} onPress={onClose}>
              <Text style={styles.continueBtnText}>쇼핑 계속하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => {
                onClose();
                if (onGoToCart) onGoToCart();
              }}
            >
              <Ionicons name="arrow-forward" size={18} color="#fff" />
              <Text style={styles.cartBtnText}>장바구니 확인하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    ...theme.shadows.modal,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  productInfo: {
    flex: 1,
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  storeLogo: {
    fontSize: 12,
  },
  storeName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.danger,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  cartBtn: {
    flex: 1.2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...theme.shadows.soft,
  },
  cartBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  }
});
