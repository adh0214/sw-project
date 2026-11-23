import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export default function PriceEditModal({
  visible,
  onClose,
  product,
  currentPrice,
  onSavePrice
}) {
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    if (visible && currentPrice != null) {
      setPriceInput(String(currentPrice));
    }
  }, [visible, currentPrice]);

  if (!visible || !product) return null;

  const handleSave = () => {
    const num = parseInt(priceInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      onSavePrice(product.id, num);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
                <Text style={styles.headerTitle}>실거래 최저가 직접 수정</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.desc}>
              쇼핑몰(쿠팡, 11번가, 네이버, SSG)에서 확인하신 당일 실거래 최저가를 입력하시면 앱의 모든 화면에 실시간 반영됩니다.
            </Text>

            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={priceInput}
                onChangeText={setPriceInput}
                keyboardType="numeric"
                placeholder="예: 18900"
                autoFocus
              />
              <Text style={styles.wonText}>원</Text>
            </View>

            <View style={styles.presetRow}>
              {[500, 1000, 3000].map((delta) => (
                <TouchableOpacity
                  key={delta}
                  style={styles.presetChip}
                  onPress={() => {
                    const base = parseInt(priceInput.replace(/[^0-9]/g, ''), 10) || currentPrice || 10000;
                    setPriceInput(String(Math.max(0, base - delta)));
                  }}
                >
                  <Text style={styles.presetText}>-{delta.toLocaleString()}원</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>실거래가 저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  wonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
