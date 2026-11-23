import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getStoredApiKeys, saveApiKeys } from '../services/shoppingApiService';

export default function ApiConfigModal({ visible, onClose, onSaved }) {
  const [naverClientId, setNaverClientId] = useState('');
  const [naverClientSecret, setNaverClientSecret] = useState('');
  const [elevenStreetKey, setElevenStreetKey] = useState('');

  useEffect(() => {
    if (visible) {
      const keys = getStoredApiKeys();
      setNaverClientId(keys.naverClientId || '');
      setNaverClientSecret(keys.naverClientSecret || '');
      setElevenStreetKey(keys.elevenStreetApiKey || '');
    }
  }, [visible]);

  if (!visible) return null;

  const handleSave = () => {
    const updated = saveApiKeys({
      naverClientId: naverClientId.trim(),
      naverClientSecret: naverClientSecret.trim(),
      elevenStreetApiKey: elevenStreetKey.trim(),
    });
    Alert.alert('API 설정 완료', '쇼핑몰 실시간 API 연결 설정이 성공적으로 저장되었습니다.');
    if (onSaved) onSaved(updated);
    onClose();
  };

  const handleOpenNaverDev = () => {
    const url = 'https://developers.naver.com/apps/#/register';
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="hardware-chip-outline" size={22} color={theme.colors.primary} />
                <Text style={styles.headerTitle}>쇼핑몰 실시간 API 연동 설정</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
              <View style={styles.statusBox}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  현재 <Text style={styles.boldText}>실시간 스마트 API 커넥터</Text>가 활성화되어 있습니다.
                </Text>
              </View>

              <Text style={styles.sectionDesc}>
                네이버 개발자 센터에서 발급받은 Open API 키를 입력하시면 네이버 공식 쇼핑 검색 API와 직접 연동되어 실시간 최저가가 조회됩니다. (키가 없어도 실시간 피드로 자동 동작합니다)
              </Text>

              {/* 네이버 쇼핑 Open API 설정 */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>🟢 네이버 Client ID</Text>
                  <TouchableOpacity onPress={handleOpenNaverDev}>
                    <Text style={styles.linkText}>무료 키 발급 ↗</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="예: W1xY2zAbcDeFgHiJkLmN"
                  value={naverClientId}
                  onChangeText={setNaverClientId}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🟢 네이버 Client Secret</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: aBcDeFgHiJ"
                  value={naverClientSecret}
                  onChangeText={setNaverClientSecret}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* 11번가 Open API 설정 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🔴 11번가 Open API Key (선택)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: 11st-openapi-key"
                  value={elevenStreetKey}
                  onChangeText={setElevenStreetKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.tipBox}>
                <Ionicons name="bulb-outline" size={16} color="#D97706" />
                <Text style={styles.tipText}>
                  API 호출 시 <Text style={styles.boldTip}>sort=asc (낮은 가격순 최저가)</Text> 파라미터가 자동으로 전달되어, 사이트 최상단 1위 가격이 실시간 반영됩니다.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>설정 저장 및 실시간 적용</Text>
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
    maxWidth: 440,
    maxHeight: '85%',
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
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  body: {
    marginBottom: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 8,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: '#065F46',
  },
  boldText: {
    fontWeight: '800',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  linkText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 13,
    color: '#0F172A',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  boldTip: {
    fontWeight: '800',
    color: '#B45309',
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
    fontSize: 13,
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
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
