// TidyZen 设计系统 Token
// 与 Stitch 项目 (12020854547316763944) 设计稿严格对齐
// 基于 Material Design 3 色彩体系 + TidyZen 品牌定制

export const colors = {
  // ── 主色（Forest Green）──
  primary: '#2d6a4f',           // primary-container（主按钮、主操作）
  primaryDark: '#0f5238',       // primary（最深主色）
  primaryLight: '#95d4b3',      // primary-fixed-dim
  primaryContainer: '#b1f0ce',  // primary-fixed（浅绿背景）
  onPrimary: '#FFFFFF',         // on-primary / on-primary-container
  onPrimaryContainer: '#a8e7c5', // on-primary-container（主色卡片上的浅色文字）

  // ── 表面层次（Surface Hierarchy）──
  surface: '#f8f9fa',           // surface / background
  surfaceDim: '#d9dadb',        // surface-dim
  surfaceContainer: '#edeeef',  // surface-container
  surfaceContainerLow: '#f3f4f5', // surface-container-low
  surfaceContainerHigh: '#e7e8e9', // surface-container-high
  paperWhite: '#FFFFFF',        // surface-container-lowest（卡片底色）

  // ── 功能色（Functional Accents）──
  healingGreen: '#52B788',      // 成功/高置信
  softBlue: '#A9D6E5',          // AI 边框/技术覆盖层
  warmAmber: '#FFB347',         // 氛围提示/难度/中置信
  tatamiBeige: '#F1E3D3',       // 日式暖色点缀

  // ── 文字 ──
  onSurface: '#191c1d',         // 主文字（深炭灰，非纯黑）
  onSurfaceVariant: '#404943',  // 次级文字

  // ── 边框 ──
  outline: '#707973',           // 常规边框
  outlineVariant: '#bfc9c1',    // 浅色边框/分割线

  // ── 错误 ──
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000a',

  // ── 反色（Inverse）──
  inverseSurface: '#2e3132',
  inverseOnSurface: '#f0f1f2',
} as const;

export const typography = {
  displayHero: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.72 },
  headlineLg: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  headlineLgMobile: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  headlineMd: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  labelCaps: { fontSize: 12, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 0.6 },
  scoreDisplay: { fontSize: 64, fontWeight: '800' as const, lineHeight: 72 },
} as const;

export const radius = {
  sm: 4,
  md: 8,       // 标准元素（按钮、输入框）
  lg: 16,      // 卡片/内容块
  xl: 24,      // 大圆角
  full: 9999,
} as const;

export const spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pageMargin: 24,  // 页面边距
  gutter: 16,      // 列间距
} as const;

export const shadows = {
  card: {
    shadowColor: '#2d6a4f',     // 绿色调阴影（设计系统要求）
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
