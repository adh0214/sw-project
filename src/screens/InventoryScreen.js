import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { theme } from '../styles/theme';
import ProductModal from '../components/ProductModal';
import BarcodeScannerModal from '../components/BarcodeScannerModal';

export default function InventoryScreen({ navigation }) {
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    updateQuantity,
    getDDayInfo,
    updateItemConsumptionCycle,
    simulateCycleDecrease,
  } = useStock();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');

  // 모달 상태
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const locations = ['전체', '욕실/화장실', '주방 싱크대', '펜트리', '세탁실'];

  // 필터링된 재고 리스트
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLocation =
        selectedLocation === '전체' || item.location.includes(selectedLocation);
      return matchSearch && matchLocation;
    });
  }, [items, searchQuery, selectedLocation]);

  // 바코드 스캔 후 상품이 감지되었을 때 처리
  const handleProductDetectedFromBarcode = (portalProduct) => {
    setIsScannerOpen(false);
    setEditingItem({
      name: portalProduct.name,
      category: portalProduct.category,
      location: portalProduct.defaultLocation,
      quantity: 1,
      estimatedPrice: portalProduct.standardPrice,
      unit: portalProduct.unit,
      barcode: portalProduct.barcode,
      consumptionCycleDays: portalProduct.consumptionCycleDays || 30,
      imageUrl: portalProduct.imageUrl,
    });
    // Let the scanner modal finish closing before opening the product form.
    setTimeout(() => setIsProductModalOpen(true), 300);
  };

  const handleSaveProduct = (formData) => {
    if (formData.id) {
      updateItem(formData.id, formData);
    } else {
      addItem(formData);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsProductModalOpen(true);
  };

  const handleDeleteConfirm = (item) => {
    Alert.alert(
      '생필품 삭제',
      `'${item.name}' 항목을 정말 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 헤더 & 바코드 카메라 스캔 버튼 */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.appTitle}>SwipeStock 인벤토리</Text>
            <Text style={styles.appSubtitle}>
              15일 단위 자동 소모 주기 & 스마트 바코드 재고관리
            </Text>
          </View>
          <View style={styles.headerBtnRow}>
            {/* 바코드 스캔 버튼 */}
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => setIsScannerOpen(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="barcode-scan" size={20} color="#fff" />
              <Text style={styles.scanBtnText}>바코드 스캔</Text>
            </TouchableOpacity>

            {/* 새 품목 등록 버튼 */}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleOpenAddModal}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addBtnText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 15일 단위 자동 소모 시스템 안내 배너 */}
        <View style={styles.autoConsumeBanner}>
          <View style={styles.autoConsumeLeft}>
            <Ionicons name="time" size={18} color="#4F46E5" />
            <View>
              <Text style={styles.autoConsumeTitle}>
                15일 단위 자동 소모 주기 적용 중
              </Text>
              <Text style={styles.autoConsumeSub}>
                설정 주기가 지나면 자동으로 수량이 -1개씩 소모되어 부족 상태를 알립니다.
              </Text>
            </View>
          </View>
        </View>

        {/* 검색창 */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="생필품 이름, 카테고리 검색..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* 보관 위치 필터 칩 */}
        <View style={styles.locationFilterRow}>
          {locations.map((loc, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.filterChip,
                selectedLocation === loc && styles.filterChipActive,
              ]}
              onPress={() => setSelectedLocation(loc)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedLocation === loc && styles.filterChipTextActive,
                ]}
              >
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 재고 리스트 */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isWarning = item.quantity <= 1;
            const dDayInfo = getDDayInfo(item);

            return (
              <View style={[styles.stockCard, isWarning && styles.stockCardWarning]}>
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

                <View style={styles.cardContent}>
                  {/* 상단 태그 행 */}
                  <View style={styles.cardTagRow}>
                    <Text style={styles.categoryPill}>{item.category}</Text>
                    <Text style={styles.locationPill}>📍 {item.location}</Text>
                    {isWarning && (
                      <View style={styles.warningPill}>
                        <Text style={styles.warningPillText}>부족</Text>
                      </View>
                    )}
                  </View>

                  {/* 상품명 */}
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  {/* ★ 15일 단위 자동 소모 시기 및 D-Day 인디케이터 ★ */}
                  <View style={styles.cycleInfoBox}>
                    <View style={styles.cycleInfoLeft}>
                      <Ionicons name="timer-outline" size={14} color="#4F46E5" />
                      <Text style={styles.cycleText}>
                        <Text style={styles.cycleBold}>{item.consumptionCycleDays || 30}일</Text>
                        마다 1개 감소
                        {dDayInfo.nextDecreaseDate ? ` · ${dDayInfo.nextDecreaseDate}` : ''}
                      </Text>
                      <View
                        style={[
                          styles.dDayPill,
                          dDayInfo.daysLeft <= 5 ? styles.dDayPillUrgent : styles.dDayPillNormal,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dDayPillText,
                            dDayInfo.daysLeft <= 5 ? styles.dDayTextUrgent : styles.dDayTextNormal,
                          ]}
                        >
                          {dDayInfo.dDayText}
                        </Text>
                      </View>
                    </View>

                    {/* 15일 단위 빠른 조절 버튼 */}
                    <View style={styles.cycleAdjustRow}>
                      <TouchableOpacity
                        style={styles.cycleAdjustBtn}
                        onPress={() =>
                          updateItemConsumptionCycle(
                            item.id,
                            (item.consumptionCycleDays || 30) - 15
                          )
                        }
                        title="주기 -15일"
                      >
                        <Text style={styles.cycleAdjustBtnText}>-15일</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cycleAdjustBtn}
                        onPress={() =>
                          updateItemConsumptionCycle(
                            item.id,
                            (item.consumptionCycleDays || 30) + 15
                          )
                        }
                        title="주기 +15일"
                      >
                        <Text style={styles.cycleAdjustBtnText}>+15일</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 하단 수량 컨트롤 & 수정/삭제 버튼 */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Ionicons name="remove" size={14} color="#0F172A" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}개</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Ionicons name="add" size={14} color="#0F172A" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.actionRow}>
                      {/* 소모 시뮬레이션 버튼 */}
                      <TouchableOpacity
                        style={styles.simulateBtn}
                        onPress={() => simulateCycleDecrease(item.id)}
                        title="1회 소모 시뮬레이션"
                      >
                        <Text style={styles.simulateBtnText}>소모(-1)</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => handleOpenEditModal(item)}
                      >
                        <Ionicons name="create-outline" size={18} color="#475569" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => handleDeleteConfirm(item)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* 상품 등록/수정 모달 */}
        <ProductModal
          visible={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          initialData={editingItem}
          onOpenBarcodeScanner={() => setTimeout(() => setIsScannerOpen(true), 300)}
        />

        {/* 바코드 카메라 스캔 모달 */}
        <BarcodeScannerModal
          visible={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onProductDetected={handleProductDetectedFromBarcode}
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  autoConsumeBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  autoConsumeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoConsumeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3730A3',
  },
  autoConsumeSub: {
    fontSize: 10,
    color: '#4338CA',
    marginTop: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  locationFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 40,
  },
  stockCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stockCardWarning: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFDFD',
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPill: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locationPill: {
    fontSize: 10,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  warningPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  warningPillText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    marginVertical: 4,
  },
  cycleInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  cycleInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  cycleText: {
    fontSize: 11,
    color: '#475569',
  },
  cycleBold: {
    fontWeight: '800',
    color: '#334155',
  },
  dDayPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dDayPillNormal: {
    backgroundColor: '#EEF2FF',
  },
  dDayPillUrgent: {
    backgroundColor: '#FEF2F2',
  },
  dDayPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  dDayTextNormal: {
    color: '#4F46E5',
  },
  dDayTextUrgent: {
    color: '#DC2626',
  },
  cycleAdjustRow: {
    flexDirection: 'row',
    gap: 4,
  },
  cycleAdjustBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  cycleAdjustBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4F46E5',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 28,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simulateBtn: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  simulateBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  iconBtn: {
    padding: 4,
  },
});
