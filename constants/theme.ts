// TidyZen 设计系统 Token
// 与 Stitch 项目 (12020854547316763944) 设计稿严格对齐

export const colors = {
  // 主色
  primary: '#2d6a4f',
  primaryDark: '#0f5238',
  primaryLight: '#95d4b3',
  primaryContainer: '#b1f0ce',

  // 表面
  surface: '#f8f9fa',
  paperWhite: '#FFFFFF',
  surfaceContainer: '#edeeef',

  // 功能色
  healingGreen: '#52B788',
  softBlue: '#A9D6E5',
  warmAmber: '#FFB347',
  tatamiBeige: '#F1E3D3',

  // 文字
  onSurface: '#191c1d',
  onSurfaceVariant: '#404943',
  onPrimary: '#FFFFFF',

  // 边框
  outline: '#707973',
  outlineVariant: '#bfc9c1',

  // 错误
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#FFFFFF',
} as const;

export const typography = {
  displayHero: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.72 },
  headlineLg: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  headlineMd: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  labelCaps: { fontSize: 12, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 0.6 },
  scoreDisplay: { fontSize: 64, fontWeight: '800' as const, lineHeight: 72 },
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export const spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pageMargin: 24,
  gutter: 16,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
