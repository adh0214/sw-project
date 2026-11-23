import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { snapCycleDays } from '../utils/consumptionCycle';

export default function ProductModal({
  visible,
  onClose,
  onSave,
  initialData = null,
  onOpenBarcodeScanner
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('생활용품');
  const [location, setLocation] = useState('욕실/화장실');
  const [quantity, setQuantity] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState('10000');
  const [unit, setUnit] = useState('1개');
  const [barcode, setBarcode] = useState('');
  
  // 15일 단위 자동 소모 시기 설정 (예: 칫솔 30일, 샴푸 60일)
  const [consumptionCycleDays, setConsumptionCycleDays] = useState(30);

  const categories = [
    '화장지/물티슈',
    '헤어/바디',
    '구강위생',
    '주방용품',
    '주방세제/세탁',
    '식품/간편식',
    '음료/생수'
  ];

  const locations = [
    '욕실/화장실',
    '주방 싱크대',
    '펜트리 선반',
    '다용도 세탁실',
    '거실 수납장'
  ];

  // 15일 단위 빠른 프리셋
  const cyclePresets = [
    { label: '15일 (2주: 생수/간편식)', days: 15 },
    { label: '30일 (1달: 칫솔 추천)', days: 30 },
    { label: '45일 (1.5달: 치약/휴지)', days: 45 },
    { label: '60일 (2달: 샴푸 추천)', days: 60 },
    { label: '75일 (2.5달)', days: 75 },
    { label: '90일 (3달: 세제 추천)', days: 90 },
    { label: '120일 (4달)', days: 120 },
    { label: '180일 (6달)', days: 180 },
  ];

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || '생활용품');
      setLocation(initialData.location || initialData.defaultLocation || '욕실/화장실');
      setQuantity(typeof initialData.quantity === 'number' ? initialData.quantity : 1);
      setEstimatedPrice(
        initialData.estimatedPrice ? String(initialData.estimatedPrice) : 
        initialData.standardPrice ? String(initialData.standardPrice) : '10000'
      );
      setUnit(initialData.unit || '1개');
      setBarcode(initialData.barcode || '');
      setConsumptionCycleDays(initialData.consumptionCycleDays || 30);
    } else {
      setName('');
      setCategory('화장지/물티슈');
      setLocation('욕실/화장실');
      setQuantity(1);
      setEstimatedPrice('10000');
      setUnit('1개');
      setBarcode('');
      setConsumptionCycleDays(30);
    }
  }, [initialData, visible]);

  // 15일 단위 증감 핸들러
  const handleAdjustCycle = (delta) => {
    setConsumptionCycleDays(prev => Math.max(15, prev + delta));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('입력 확인', '제품명을 입력해 주세요.');
      return;
    }

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      category,
      location,
      quantity: Number(quantity) || 0,
      estimatedPrice: parseInt(estimatedPrice.replace(/[^0-9]/g, ''), 10) || 10000,
      unit: unit.trim() || '1개',
      barcode: barcode.trim(),
      consumptionCycleDays: snapCycleDays(consumptionCycleDays),
      imageUrl: initialData?.imageUrl
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {initialData?.id ? '생필품 정보 수정' : '새 생필품 등록'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 바코드 카메라 스캐너 호출 버튼 */}
            {!initialData?.id && (
              <TouchableOpacity
                style={styles.barcodeScanButton}
                onPress={() => {
                  onClose();
                  onOpenBarcodeScanner();
                }}
              >
                <Ionicons name="barcode-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.barcodeScanButtonText}>
                  바코드 카메라 스캔으로 상품 자동 불러오기
                </Text>
              </TouchableOpacity>
            )}

            {/* 제품 이름 */}
            <Text style={styles.label}>제품명 *</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 오랄비 칫솔, 헤드앤숄더 샴푸"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* ★ 핵심 요구사항: 상품별 자동 소모 시기 설정 (15일 단위) ★ */}
            <View style={styles.cycleSettingCard}>
              <View style={styles.cycleHeaderRow}>
                <View style={styles.cycleTitleWrap}>
                  <Ionicons name="timer" size={18} color="#4F46E5" />
                  <Text style={styles.cycleMainTitle}>자동 소모 시기 설정 (15일 단위)</Text>
                </View>
                <View style={styles.cycleBadge}>
                  <Text style={styles.cycleBadgeText}>{consumptionCycleDays}일 마다 -1개 감소</Text>
                </View>
              </View>

              <Text style={styles.cycleDesc}>
                설정한 주기마다 보유 수량이 자동으로 1개 감소하여 재고 소진을 알려줍니다.
                (예: 칫솔은 30일 후 1개 감소, 샴푸는 60일 후 감소)
              </Text>

              {/* 15일 단위 미세 조절 스테퍼 */}
              <View style={styles.stepperContainer}>
                <Text style={styles.stepperLabel}>감소 주기 세세 조절:</Text>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustCycle(-15)}
                  >
                    <Ionicons name="remove" size={18} color="#4F46E5" />
                    <Text style={styles.stepperBtnSub}>-15일</Text>
                  </TouchableOpacity>

                  <View style={styles.stepperValueBox}>
                    <Text style={styles.stepperValueText}>{consumptionCycleDays}일</Text>
                    <Text style={styles.stepperApproxText}>
                      (약 {(consumptionCycleDays / 30).toFixed(1)}개월)
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleAdjustCycle(15)}
                  >
                    <Ionicons name="add" size={18} color="#4F46E5" />
                    <Text style={styles.stepperBtnSub}>+15일</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 15일 단위 빠른 프리셋 칩 */}
              <Text style={styles.presetSectionLabel}>추천 소모 주기 빠른 선택:</Text>
              <View style={styles.chipGrid}>
                {cyclePresets.map((preset, pIdx) => {
                  const isSelected = consumptionCycleDays === preset.days;
                  return (
                    <TouchableOpacity
                      key={pIdx}
                      style={[styles.presetChip, isSelected && styles.presetChipActive]}
                      onPress={() => setConsumptionCycleDays(preset.days)}
                    >
                      <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 수량 설정 */}
            <Text style={styles.label}>현재 보유 수량</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(0, quantity - 1))}
              >
                <Ionicons name="remove" size={18} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}개</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* 보관 위치 선택 */}
            <Text style={styles.label}>보관 위치</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {locations.map((loc, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.pill, location === loc && styles.pillActive]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[styles.pillText, location === loc && styles.pillTextActive]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 카테고리 선택 */}
            <Text style={styles.label}>카테고리</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {categories.map((cat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.pill, category === cat && styles.pillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 예상 가격 & 단위 */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>예상 가격(원)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: 12900"
                  placeholderTextColor={theme.colors.textMuted}
                  value={estimatedPrice}
                  onChangeText={setEstimatedPrice}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>규격/단위</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: 850ml, 4개입"
                  placeholderTextColor={theme.colors.textMuted}
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>
                {initialData?.id ? '변경 내용 저장' : '생필품 등록 완료'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  barcodeScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  barcodeScanButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 6,
  },
  cycleSettingCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 12,
  },
  cycleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cycleTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cycleMainTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3730A3',
  },
  cycleBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cycleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  cycleDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  stepperContainer: {
    marginBottom: 12,
  },
  stepperLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 6,
  },
  stepperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  stepperBtnSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  stepperValueBox: {
    alignItems: 'center',
  },
  stepperValueText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  stepperApproxText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  presetSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  presetChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  presetChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 40,
    textAlign: 'center',
  },
  pillScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  pill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 6,
  },
  pillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  pillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  halfCol: {
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 20,
    gap: 6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
