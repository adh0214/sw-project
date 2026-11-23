import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';

import { StockProvider, useStock } from './src/context/StockContext';
import { theme } from './src/styles/theme';

// 화면 컴포넌트 임포트
import InventoryScreen from './src/screens/InventoryScreen';
import SwipeStockScreen from './src/screens/SwipeStockScreen';
import StockStatusScreen from './src/screens/StockStatusScreen';
import RecommendationScreen from './src/screens/RecommendationScreen';
import SmartCartScreen from './src/screens/SmartCartScreen';

// 웹 브라우저 환경에서 react-native-screens 호환성 처리 (화면 꺼짐 및 빈 화면 방지)
if (Platform.OS === 'web') {
  enableScreens(false);
}

// 런타임 에러 캡처용 ErrorBoundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ 렌더링 에러 감지</Text>
          <Text style={styles.errorMessage}>{String(this.state.error?.message || this.state.error)}</Text>
          <ScrollView style={styles.errorScroll}>
            <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryBtnText}>새로고침</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { warningCount, cartCount } = useStock();

  return (
    <Tab.Navigator
      initialRouteName="스와이프홈"
      detachInactiveScreens={false}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          ...theme.shadows.soft,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === '스와이프홈') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === '스마트장바구니') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === '재고목록') {
            iconName = focused ? 'file-tray-stacked' : 'file-tray-stacked-outline';
          } else if (route.name === '재고현황') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === '제품추천') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="스와이프홈"
        component={SwipeStockScreen}
        options={{ tabBarLabel: '스와이프 홈' }}
      />
      <Tab.Screen
        name="재고목록"
        component={InventoryScreen}
        options={{ tabBarLabel: '재고 목록' }}
      />
      <Tab.Screen
        name="제품추천"
        component={RecommendationScreen}
        options={{
          tabBarLabel: '최저가 추천',
          tabBarBadge: warningCount > 0 ? warningCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#059669',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '800',
          },
        }}
      />
      <Tab.Screen
        name="스마트장바구니"
        component={SmartCartScreen}
        options={{
          tabBarLabel: '장바구니',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.danger,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '800',
          },
        }}
      />
      <Tab.Screen
        name="재고현황"
        component={StockStatusScreen}
        options={{
          tabBarLabel: '재고 현황',
        }}
      />
    </Tab.Navigator>
  );
}

// 웹에서 SafeAreaProvider의 초기 사이즈를 강제 지정 (높이 0px 방지)
const webMetrics = {
  frame: { x: 0, y: 0, width: 450, height: 900 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider initialMetrics={webMetrics} style={styles.safeAreaProvider}>
        <View style={styles.appRoot}>
          <View style={styles.phoneContainer}>
            <StockProvider>
              <NavigationContainer>
                <StatusBar style="dark" />
                <TabNavigator />
              </NavigationContainer>
            </StockProvider>
          </View>
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web' ? { minHeight: '100vh', display: 'flex' } : {}),
  },
  appRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { minHeight: '100vh', display: 'flex' } : {}),
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 460,
    height: '100%',
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderLeftWidth: 1,
          borderLeftColor: '#1E293B',
          borderRightWidth: 1,
          borderRightColor: '#1E293B',
        }
      : {}),
  },
  errorContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#B91C1C',
    fontWeight: '600',
    marginBottom: 16,
  },
  errorScroll: {
    maxHeight: 200,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 20,
  },
  errorStack: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#4B5563',
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
