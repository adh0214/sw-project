export const theme = {
  colors: {
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    surface: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // 브랜드 & 포인트
    primary: '#4F46E5', // 인디고 블루
    primaryLight: '#EEF2FF',
    accent: '#6366F1',
    
    // 상태 색상
    danger: '#EF4444', // 경고/다씀 (레드)
    dangerLight: '#FEF2F2',
    dangerBorder: '#FECACA',
    
    success: '#10B981', // 여유/넉넉함 (그린)
    successLight: '#ECFDF5',
    successBorder: '#A7F3D0',
    
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    
    // 쇼핑몰 브랜드 색상
    coupang: '#0074E9',
    naver: '#03C75A',
    eleventh: '#FA0050',
    gmarket: '#1E88E5',
    ssg: '#FF5A5F'
  },
  
  shadows: {
    soft: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    hover: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.2,
      shadowRadius: 30,
      elevation: 12,
    }
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  }
};
