import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { searchKcaProducts, fetchKcaPrices, mapKcaProduct } from '../data/kcaProducts';
import { fetchProductFromConsumerPortal } from '../data/consumerPortalDB';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from './html5QrcodeScanner';

export default function BarcodeScannerModal({ visible, onClose, onProductDetected }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [productCandidates, setProductCandidates] = useState([]);
  const [productPrices, setProductPrices] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const scanLockRef = useRef(false);
  const webScannerContainerRef = useRef(null);
  const webScannerRef = useRef(null);
  const barcodeHandlerRef = useRef(null);

  const startCamera = async () => {
    setCameraError(null);
    setLookupError(null);
    setScannedResult(null);
    scanLockRef.current = false;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.isSecureContext) {
      setIsCameraActive(false);
      setCameraError('브라우저 보안 설정으로 카메라를 사용할 수 없습니다. HTTPS 주소 또는 localhost에서 다시 열어주세요.');
      return;
    }
    if (Platform.OS === 'web') {
      setIsCameraActive(true);
      return;
    }
    try {
      const current = permission?.granted ? permission : await requestPermission();
      if (current?.granted) {
        setIsCameraActive(true);
      } else {
        setIsCameraActive(false);
        setCameraError('카메라 권한이 필요합니다. 브라우저 또는 기기 설정에서 카메라 접근을 허용해 주세요.');
      }
    } catch (err) {
      console.warn('Camera permission failed:', err);
      setIsCameraActive(false);
      setCameraError('이 기기에서 카메라를 열 수 없습니다. 아래에서 바코드를 입력해 주세요.');
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!visible) {
      stopCamera();
      scanLockRef.current = false;
      return;
    }
    setBarcodeInput('');
    setScannedResult(null);
    setLookupError(null);
    scanLockRef.current = false;
    startCamera();
    return () => {
      stopCamera();
    };
  }, [visible]);

  // 바코드 조회
  const handleLookup = async (queryToLookup) => {
    const query = String(queryToLookup || barcodeInput).trim();
    if (!query || query.length < 2) {
      setLookupError('상품명 또는 바코드를 입력해 주세요.');
      return;
    }
    if (/^\d+$/.test(query)) {
      setLoading(true);
      setLookupError(null);
      setProductCandidates([]);
      setProductPrices(null);
      setIsCameraActive(false);
      try {
        setScannedResult(await fetchProductFromConsumerPortal(query));
      } catch (error) {
        setLookupError(error.message || '소비자 포털에서 바코드를 조회하지 못했습니다.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setLookupError(null);
    setScannedResult(null);
    setProductCandidates([]);
    setProductPrices(null);
    setIsCameraActive(false);
    try {
      const items = await searchKcaProducts(query);
      if (!items.length) {
        setLookupError('참가격에서 일치하는 상품을 찾지 못했습니다. 상품명을 바꿔 검색해 주세요.');
      } else {
        setProductCandidates(items.slice(0, 30));
      }
    } catch (error) {
      setLookupError(error.message || '참가격 상품정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    const code = String(data || '').replace(/\s/g, '');
    if (!code || scanLockRef.current || loading || scannedResult) return;
    scanLockRef.current = true;
    setBarcodeInput(code);
    handleLookup(code).finally(() => {
      scanLockRef.current = false;
    });
  };

  barcodeHandlerRef.current = handleBarcodeScanned;

  // PC 웹에서는 html5-qrcode로 상품 바코드와 QR 코드를 판독합니다.
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible || !isCameraActive || scannedResult) return undefined;
    let cancelled = false;
    let scanner;
    let mirroredScanTimer;
    const startScanner = async () => {
      try {
        if (cancelled || !webScannerContainerRef.current) return;
        scanner = new Html5Qrcode('stockmate-web-barcode-scanner', {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          disableFlip: false,
          verbose: false,
          experimentalFeatures: { useBarCodeDetectorIfSupported: false },
        });
        webScannerRef.current = scanner;
        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (!cameras?.length) {
          setCameraError('PC에 연결된 웹캠을 찾을 수 없습니다.');
          setIsCameraActive(false);
          return;
        }
        const frontCamera = cameras.find((camera) => /front|user|selfie|전면|앞면/i.test(camera.label));
        const videoConstraints = {
          ...(frontCamera ? { deviceId: { exact: frontCamera.id } } : { facingMode: 'user' }),
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        };
        await scanner.start(
          frontCamera ? { deviceId: { exact: frontCamera.id } } : { facingMode: 'user' },
          {
            fps: 12,
            aspectRatio: 1.777778,
            videoConstraints,
          },
          (decodedText, decodedResult) => {
            if (cancelled) return;
            barcodeHandlerRef.current?.({ data: decodedText, result: decodedResult });
            if (scanner.isScanning) {
              scanner.pause(true);
              window.setTimeout(() => {
                if (!cancelled && scanner.isScanning) scanner.resume();
              }, 1500);
            }
          },
          () => {}
        );
        webScannerContainerRef.current
          ?.querySelectorAll('video')
          .forEach((video) => {
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.display = 'block';
            video.style.transform = 'scaleX(-1)';
            video.style.transformOrigin = 'center center';
            video.style.objectFit = 'cover';

            const BarcodeDetectorApi = window.BarcodeDetector;
            if (BarcodeDetectorApi?.getSupportedFormats) {
              BarcodeDetectorApi.getSupportedFormats().then((supportedFormats) => {
                const formats = ['ean_13', 'ean_8', 'code_128', 'qr_code']
                  .filter((format) => supportedFormats.includes(format));
                if (cancelled || formats.length === 0) return;

                const detector = new BarcodeDetectorApi({ formats });
                const mirroredFrame = document.createElement('canvas');
                const context = mirroredFrame.getContext('2d', { willReadFrequently: true });
                if (!context) return;

                const detectMirroredFrame = async () => {
                  if (cancelled) return;
                  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
                    mirroredFrame.width = video.videoWidth;
                    mirroredFrame.height = video.videoHeight;
                    context.setTransform(-1, 0, 0, 1, mirroredFrame.width, 0);
                    context.drawImage(video, 0, 0, mirroredFrame.width, mirroredFrame.height);
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    try {
                      let matches = await detector.detect(mirroredFrame);
                      let code = matches.find((match) => match.rawValue)?.rawValue;
                      if (!code && !cancelled) {
                        context.setTransform(1, 0, 0, 1, 0, 0);
                        context.drawImage(video, 0, 0, mirroredFrame.width, mirroredFrame.height);
                        matches = await detector.detect(mirroredFrame);
                        code = matches.find((match) => match.rawValue)?.rawValue;
                      }
                      if (code && !cancelled) {
                        barcodeHandlerRef.current?.({ data: code });
                        return;
                      }
                    } catch (error) {
                      // 일시적인 프레임 디코딩 오류는 다음 프레임에서 다시 시도합니다.
                    }
                  }
                  mirroredScanTimer = window.setTimeout(detectMirroredFrame, 120);
                };

                detectMirroredFrame();
              }).catch(() => {});
            }
          });
        if (cancelled && scanner.isScanning) {
          await scanner.stop();
          scanner.clear();
        }
      } catch (error) {
        if (!cancelled) {
          setCameraError(`웹캠을 시작하지 못했습니다: ${error?.message || error}`);
          setIsCameraActive(false);
        }
      }
    };

    startScanner();
    return () => {
      cancelled = true;
      if (mirroredScanTimer) window.clearTimeout(mirroredScanTimer);
      if (scanner?.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      } else if (scanner) {
        scanner.clear();
      }
      if (webScannerRef.current === scanner) webScannerRef.current = null;
    };
  }, [visible, isCameraActive, scannedResult]);

  const handleConfirmProduct = () => {
    if (scannedResult?.data) {
      onProductDetected(scannedResult.data);
      onClose();
    }
  };

  // 샘플 바코드 목록
  const sampleBarcodes = [
    { name: '크리넥스', code: '크리넥스' },
    { name: '헤드앤숄더', code: '헤드앤숄더' },
    { name: '오랄비', code: '오랄비' },
    { name: '햇반', code: '햇반' },
    { name: '생수', code: '생수' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <MaterialCommunityIcons name="barcode-scan" size={24} color={theme.colors.primary} />
              <Text style={styles.headerTitle}>바코드 카메라 스캔 등록</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 실제 카메라 비디오 뷰파인더 영역 */}
            <View style={[styles.scannerViewport, Platform.OS === 'web' && styles.webScannerViewport]}>
              {isCameraActive ? (
                Platform.OS === 'web' ? (
                  <View style={styles.webScannerContainer}>
                    <View
                      ref={webScannerContainerRef}
                      nativeID="stockmate-web-barcode-scanner"
                      style={styles.webScannerSurface}
                    />
                  </View>
                ) : <CameraView
                  nativeID="stockmate-barcode-camera"
                  style={styles.cameraFill}
                  facing="front"
                  barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'itf14'],
                  }}
                  onBarcodeScanned={handleBarcodeScanned}
                />
              ) : null}

              {/* 스캔 조준 가이드 박스 & 레이저 애니메이션 */}
              <View style={[styles.scanTargetBox, Platform.OS === 'web' && styles.webScanTargetBox]}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <View style={styles.redLaserLine} />
              </View>

              {cameraError ? (
                <View style={styles.cameraErrorBox}>
                  <Ionicons name="videocam-off" size={24} color="#EF4444" />
                  <Text style={styles.cameraErrorText}>{cameraError}</Text>
                  <TouchableOpacity style={styles.retryCameraBtn} onPress={startCamera}>
                    <Text style={styles.retryCameraBtnText}>카메라 다시 켜기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.cameraStatusPill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.cameraStatusText}>
                    {isCameraActive
                      ? '카메라 켜짐 · 바코드를 비추면 자동 조회'
                      : scannedResult
                        ? '바코드 인식 완료'
                        : '카메라 초기화 중...'}
                  </Text>
                </View>
              )}

              <Text style={styles.scannerHint}>
                생필품의 뒷면 또는 측면 바코드를 사각형 안에 비춰주세요
              </Text>
            </View>

            {/* 카메라 토글 및 시뮬레이션 빠른 테스트 */}
            <View style={styles.cameraControlRow}>
              <TouchableOpacity
                style={[styles.cameraToggleBtn, isCameraActive ? styles.cameraBtnActive : styles.cameraBtnInactive]}
                onPress={isCameraActive ? stopCamera : startCamera}
              >
                <Ionicons name={isCameraActive ? "videocam" : "videocam-outline"} size={16} color="#fff" />
                <Text style={styles.cameraToggleBtnText}>
                  {isCameraActive ? '카메라 끄기' : '카메라 켜기'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.cameraControlHint}>
              {Platform.OS === 'web' ? '전면 웹캠 · 좌우 반전 · 1080p 우선' : '전면 카메라 · 좌우 반전 스캔'}
              </Text>
            </View>

            {lookupError ? <Text style={styles.lookupError}>{lookupError}</Text> : null}

            {/* 등록 상품 샘플 바코드 */}
            <Text style={styles.sectionTitle}>등록 상품 바코드 예시</Text>
            <View style={styles.presetContainer}>
              {sampleBarcodes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.presetChip}
                  onPress={() => {
                  setScannedResult(null);
                    setBarcodeInput(item.code);
                    handleLookup(item.code);
                  }}
                >
                  <Text style={styles.presetChipText}>📷 {item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 수동 바코드 번호 직접 입력 */}
            <Text style={styles.sectionTitle}>바코드 번호 직접 입력</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="예: 8801046123456"
                placeholderTextColor={theme.colors.textMuted}
                value={barcodeInput}
                onChangeText={setBarcodeInput}
                keyboardType="default"
              />
              <TouchableOpacity
                style={styles.lookupButton}
                onPress={() => handleLookup()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.lookupButtonText}>조회</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* 조회 결과 카드 */}
            {productCandidates.length > 0 && (
              <View style={styles.resultCard}>
                <Text style={styles.sectionTitle}>참가격 검색 결과 ({productCandidates.length}개)</Text>
                {productCandidates.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.goodId || item.goodName}-${index}`}
                    style={styles.productRow}
                    onPress={async () => {
                      setScannedResult({ success: true, source: '한국소비자원 참가격 OpenAPI', data: mapKcaProduct(item) });
                      setProductCandidates([]);
                      try {
                        setProductPrices(await fetchKcaPrices(item.goodId));
                      } catch (error) {
                        setProductPrices({ error: error.message, items: [] });
                      }
                    }}
                  >
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.goodName || '상품명 없음'}</Text>
                      <Text style={styles.productMeta}>상품 ID: {item.goodId || '정보 없음'} · {item.goodTotal || item.goodUnit || '규격 정보 없음'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {scannedResult && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  <Text style={styles.resultTitle}>소비자포털 참가격 상품 확인됨</Text>
                </View>

                <View style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{scannedResult.data.name}</Text>
                    <Text style={styles.productMeta}>
                      분류: {scannedResult.data.category} • 기본 보관: {scannedResult.data.defaultLocation}
                    </Text>
                    <Text style={styles.productPrice}>
                      기준가 {scannedResult.data.standardPrice?.toLocaleString()}원 ({scannedResult.data.unit})
                    </Text>
                    {productPrices?.items?.length > 0 ? productPrices.items.map((price, index) => (
                      <Text key={`${price.entpId || price.entpName || 'store'}-${index}`} style={styles.productMeta}>
                        {price.entpName || '판매점'} · {Number(price.goodPrice || price.price || 0).toLocaleString()}원
                      </Text>
                    )) : (
                      <Text style={styles.productMeta}>
                        {productPrices?.error || (productPrices ? '해당 조사일 가격정보가 없습니다.' : '가격정보 조회 중…')}
                      </Text>
                    )}
                    <Text style={styles.productMeta}>
                      자동 소모: {scannedResult.data.consumptionCycleDays || 30}일마다 1개 감소
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleConfirmProduct}
                >
                  <Text style={styles.applyButtonText}>이 상품으로 등록하기</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  scannerViewport: {
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  webScannerViewport: {
    width: '100%',
    maxWidth: 860,
    height: undefined,
    maxHeight: 484,
    aspectRatio: 1.777778,
    alignSelf: 'center',
  },
  cameraFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    transform: [{ scaleX: -1 }],
  },
  webScannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  webScannerSurface: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  scanTargetBox: {
    width: 220,
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  webScanTargetBox: {
    width: '85%',
    maxWidth: 700,
    height: 140,
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#4F46E5',
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  redLaserLine: {
    width: '90%',
    height: 2,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  cameraStatusPill: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
    zIndex: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  cameraStatusText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  scannerHint: {
    position: 'absolute',
    bottom: 10,
    color: '#94A3B8',
    fontSize: 11,
    zIndex: 10,
    textAlign: 'center',
  },
  cameraErrorBox: {
    alignItems: 'center',
    padding: 14,
    zIndex: 10,
  },
  cameraErrorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryCameraBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryCameraBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cameraToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  cameraBtnActive: {
    backgroundColor: '#059669',
  },
  cameraBtnInactive: {
    backgroundColor: '#64748B',
  },
  cameraToggleBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraControlHint: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 4,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  presetChipText: {
    fontSize: 12,
    color: '#4338CA',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  lookupButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  lookupButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  lookupError: {
    color: '#B91C1C',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  productRow: {
    marginBottom: 12,
  },
  productInfo: {
    gap: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  productMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginTop: 2,
  },
  applyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
