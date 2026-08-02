# 智能房间整洁助手 (TidyZen) - MVP 开发计划 V2

> **技术栈**: React Native (Expo) + TypeScript + Zustand
> **设计系统**: TidyZen (Stitch 项目 12020854547316763944)
> **AI 后端**: doubao-seed-2.0-pro 视觉模型 API（火山引擎 Ark coding endpoint，2026-08-02 切换）
> **更新日期**: 2026-06-15

---

## 一、项目结构

```
storage/
├── app/                       # Expo Router 页面
│   ├── (tabs)/               # Tab 导航布局
│   │   ├── _layout.tsx       # Tab 配置（首页/扫描/记录/我的）
│   │   ├── index.tsx         # 首页
│   │   ├── scan.tsx          # 扫描入口（跳转到拍照页）
│   │   ├── history.tsx       # 历史记录列表
│   │   └── profile.tsx       # 我的（个人中心）
│   ├── _layout.tsx           # 根布局
│   ├── camera.tsx            # 拍照扫描（伪AR预览 + 拍照）
│   ├── analyzing.tsx         # AI 分析中（加载动画）
│   ├── result.tsx            # 分析结果（评分 + 杂物 + 建议 + 纠错入口）
│   ├── correction.tsx        # 纠错/场景选择（手动选择10个场景）
│   ├── detail/[id].tsx       # 建议详情（图文 + 视频入口）
│   ├── video/[id].tsx        # 视频教程播放
│   ├── record/[id].tsx       # 整理记录详情
│   ├── settings.tsx          # 设置
│   ├── help.tsx              # 帮助中心
│   ├── about.tsx             # 关于
│   ├── privacy.tsx           # 隐私政策
│   └── account.tsx           # 账号管理与安全
├── components/               # 可复用组件
│   ├── ui/                  # 基础 UI 组件（Button, Card, Tag, Input...）
│   ├── ScoreGauge.tsx       # 整洁度评分仪表盘（大号分数 + 圆形进度）
│   ├── ClutterCard.tsx      # 杂物识别卡片（类型 + 置信度标识）
│   ├── SuggestionItem.tsx   # 建议项（必做/备选，步骤 + 时间 + 成本）
│   ├── BoundingBox.tsx      # AI 边界框标注（叠加在照片上）
│   ├── SceneCard.tsx        # 场景选择卡片（纠错页用）
│   ├── RecordCard.tsx       # 历史记录卡片
│   ├── ConfidenceBadge.tsx  # 置信度标识（高置信/可能不太准）
│   ├── CameraPreview.tsx    # 伪AR相机预览（实时画面 + 引导文案）
│   ├── LoadingRing.tsx      # 圆形进度加载动画
│   ├── EmptyState.tsx       # 空状态占位组件
│   └── SegmentedControl.tsx # 分段控制器
├── services/                # API 服务层
│   ├── ai.ts               # AI 分析 API（doubao-seed-2.0-pro）
│   ├── suggestions.ts      # 建议库匹配逻辑
│   └── storage.ts          # 本地存储（SQLite/AsyncStorage）
├── stores/                 # Zustand 状态管理
│   ├── analysis.ts         # 分析流程状态（拍照→分析→结果）
│   └── history.ts          # 历史记录状态
├── constants/              # 常量与配置
│   ├── theme.ts            # TidyZen 设计系统 Token
│   ├── scenes.ts           # 10个场景定义（含图标、名称、描述）
│   └── suggestions.ts      # 建议库数据（35条建议）
├── types/                  # TypeScript 类型
│   └── analysis.ts         # 分析相关类型（API 请求/响应、杂物、建议）
└── assets/                 # 静态资源
    ├── videos/             # 教程短视频（15秒/条，本地离线播放）
    └── images/             # 图标、占位图等
```

---

## 二、页面路由与设计稿对照

### 核心流程（P0 - MVP 必须）

| 路由 | 页面 | Stitch 设计稿 | 说明 |
|------|------|:---:|------|
| `/(tabs)/index` | 首页 | ✅ 已修改 | 整洁得分卡片、核心功能区、最近对比、Tab"首页/扫描/记录/我的" |
| `/camera` | 拍照扫描 | ✅ 引导拍摄版 v3 | 伪AR实时预览 + 引导文案 + 拍照快门 |
| `/analyzing` | AI 分析中 | ✅ 简洁加载版 | 单圈进度环 + "预计还需3-5秒" |
| `/result` | 分析结果 | ✅ 含置信度与纠错 | 评分 + 杂物标签(含置信度) + 必做/备选建议 + 纠错按钮 + 氛围提示 |
| `/correction` | 纠错/场景选择 | ✅ 新增 | 10场景2列网格，多选（最多2个），确认重新分析 |
| `/detail/[id]` | 建议详情（视频版） | ✅ 原有 | 步骤图文 + 视频播放入口 |
| `/detail/[id]` | 建议详情（图文版） | ✅ 原有 | 纯图文指引 |

### 重要功能（P1）

| 路由 | 页面 | Stitch 设计稿 | 说明 |
|------|------|:---:|------|
| `/(tabs)/history` | 历史记录列表 | ✅ 新增 | 分段控制器（全部/本周/本月），记录卡片含缩略图+分数+趋势 |
| `/record/[id]` | 整理记录详情 | ✅ 原有 | 单条记录完整信息 |
| `/trends` | 整理足迹与趋势 | ✅ 原有 | 趋势图表 |
| `/video/[id]` | 视频教程播放 | ✅ 原有 | 15秒短视频播放器 |

### 辅助功能（P2）

| 路由 | 页面 | Stitch 设计稿 |
|------|------|:---:|
| `/(tabs)/profile` | 我的（个人中心） | ✅ 原有 |
| `/settings` | 设置 | ✅ 原有 |
| `/help` | 帮助中心 | ✅ 原有 |
| `/about` | 关于 | ✅ 原有 |
| `/privacy` | 隐私政策 | ✅ 原有 |
| `/account` | 账号管理 | ✅ 原有 |

---

## 三、用户主流程

```
首页（整洁得分 + 最近对比）
  │
  ├─ 点击"开始扫描" 或 Tab"扫描"
  │     │
  │     ▼
  │  拍照扫描（伪AR预览：实时画面 + 引导文案）
  │     │
  │     ▼ 点击拍照
  │  AI 分析中（旋转进度环 + "预计3-5秒"）
  │     │
  │     ▼ 分析完成
  │  分析结果（评分 + 杂物标签[含置信度] + 建议卡片）
  │     │
  │     ├─ 结果准确 → 查看建议详情 → 视频教程 → 执行建议
  │     │                                      │
  │     │                                      ▼
  │     │                            "我已完成整理，重新扫描"
  │     │                                      │
  │     │                                      ▼
  │     │                              回到拍照扫描 → 二次拍照验证
  │     │
  │     └─ 结果不准 → 点击"识别不准" → 纠错/场景选择
  │                                          │
  │                                          ▼
  │                                    手动选1-2个场景 → 重新分析
  │
  ├─ Tab"记录" → 历史记录列表 → 点击卡片 → 整理记录详情
  │
  └─ Tab"我的" → 个人中心 → 设置/帮助/关于/隐私/账号
```

---

## 四、开发阶段与任务分解

### Phase 1: 项目初始化（Day 1）

- [ ] 创建 Expo (SDK 52+) TypeScript 项目
- [ ] 配置 Expo Router 文件路由
- [ ] 配置 TidyZen 设计系统 Token（`constants/theme.ts`）
  - 颜色：primary #2d6a4f, surface #f8f9fa, warmAmber #FFB347, softBlue #A9D6E5...
  - 字体：Be Vietnam Pro（加载 Google Fonts）
  - 圆角：sm=4, md=8, lg=16, full=9999
  - 间距：8px 基础单位
- [ ] 集成 Zustand 状态管理
- [ ] 搭建 TypeScript 类型定义（`types/analysis.ts`）
- [ ] 配置 ESLint + Prettier

### Phase 2: 基础 UI 组件（Day 2-3）

- [ ] Button（主按钮 pill / 次按钮 outline）
- [ ] Card（白色背景 + 8px圆角 + 微妙阴影）
- [ ] Tag / Chip（杂物类型标签、置信度标签）
- [ ] SegmentedControl（分段控制器）
- [ ] EmptyState（空状态占位）
- [ ] LoadingRing（圆形进度动画）
- [ ] ConfidenceBadge（置信度标识：高置信 ✓ / 可能不太准 ⚠）
- [ ] ScoreGauge（大号分数 + 圆形仪表盘）
- [ ] CameraPreview（相机实时预览 + 引导文案叠加层）
- [ ] BoundingBox（AI边界框，半透明soft-blue/healing-green填充 + 2px描边）

### Phase 3: 核心页面（Day 4-7）

- [ ] **首页** `(tabs)/index.tsx`
  - 整洁得分卡片（最新分析结果 or 空态引导）
  - 核心功能区（必做/备选任务卡片，含时间/标签/操作按钮）
  - 最近对比（Before/After + 分数变化）
  - 底部 Tab 导航（首页/扫描/记录/我的）

- [ ] **拍照扫描** `camera.tsx`
  - expo-camera 实时预览（伪AR：纯画面 + 无实时分析）
  - 引导文案叠加层："将镜头对准房间杂乱区域，点击拍照开始分析"
  - 大圆形快门按钮（森林绿描边）+ 相册按钮 + 闪光灯控制
  - 拍照后压缩至 1024×1024 → Base64

- [ ] **AI 分析中** `analyzing.tsx`
  - 居中旋转进度环 + 百分比数字
  - 主文案："AI 正在分析你的房间..."
  - 副文案："预计还需 3-5 秒"
  - 底部隐私提示

- [ ] **分析结果** `result.tsx`
  - 整洁度评分（大号数字 + 圆形仪表盘）
  - 检测杂物标签行（含置信度标识）
  - 必做建议卡片（步骤列表 + 时间 + 成本元数据）
  - 备选建议卡片
  - 纠错按钮："识别不准？点这里手动选择场景"（warm-amber #FFB347）
  - 氛围提示（S10，如适用）
  - 底部按钮："我已完成整理，重新扫描"

- [ ] **纠错/场景选择** `correction.tsx`
  - 10个场景卡片（2列网格）
  - 卡片选中态：绿色边框 + 浅绿背景
  - 最多选2个，超出提示
  - 底部按钮："确认场景，重新分析"

- [ ] **建议详情** `detail/[id].tsx`
  - 图文指引（步骤编号 + 文字说明）
  - 元数据展示（难度⭐、时间、成本、适用房型）
  - 视频播放入口（跳转到 `/video/[id]`）

- [ ] **视频播放** `video/[id].tsx`
  - 简洁播放器（16px圆角，无复杂控制条）
  - 15秒短视频，支持离线播放

### Phase 4: AI 集成（Day 8-9）

- [ ] 封装 doubao-seed-2.0-pro API 调用（`services/ai.ts`）
  - 构建结构化 Prompt（含 scene/clutter_items/lighting JSON Schema）
  - 图片压缩（expo-image-manipulator）→ Base64
  - 请求发送 + 超时处理（≤5秒）
- [ ] 解析 AI 返回 JSON → TypeScript 类型
  - 过滤置信度 < 0.6 的低质量结果
- [ ] 计算整洁度评分（`score = 100 - Σ(area_ratio × weight × 100) - lighting_penalty`）
  - 10类杂物权重表
  - 光线惩罚（dim 扣5分）
  - 边界情况（满分100 / 最低5分）
- [ ] 建议库匹配逻辑（`services/suggestions.ts`）
  - 按场景 ID 匹配主建议 + 备选建议
  - 场景优先级排序（S04地面 > S08食物 > S01衣物 > ...）
  - 一次最多展示2条（1主 + 1备）+ 1条氛围附加

### Phase 5: 数据持久化（Day 10-11）

- [ ] 本地存储分析结果（AsyncStorage / expo-sqlite）
  - 分数、杂物类型、建议、时间戳
  - 照片本地路径（不存储原图，仅缩略图路径）
- [ ] 历史记录列表（`history.tsx`）
  - 分段筛选（全部/本周/本月）
  - 记录卡片（缩略图 + 分数 + 日期 + 标签 + 趋势指示）
  - 空状态（引导首次拍照）
- [ ] 整理记录详情（`record/[id].tsx`）
  - 完整分析结果回顾
- [ ] 整理足迹与趋势（`trends.tsx`）
  - 分数趋势折线图

### Phase 6: 辅助页面（Day 12-13）

- [ ] 我的/个人中心（`profile.tsx`）
- [ ] 设置（`settings.tsx`）
- [ ] 帮助中心（`help.tsx`）
- [ ] 关于（`about.tsx`）
- [ ] 隐私政策（`privacy.tsx`）
- [ ] 账号管理（`account.tsx`）

### Phase 7: 联调测试与优化（Day 14-15）

- [ ] 全流程联调（拍照→分析→结果→纠错→建议→重拍）
- [ ] 性能优化（图片压缩、API 超时处理、列表虚拟化）
- [ ] 错误处理（网络异常、AI 返回异常、权限拒绝）
- [ ] 空状态覆盖（首次使用各页面空态）
- [ ] 无障碍适配（语义标签、对比度）

---

## 五、关键技术决策

| 决策项 | 方案 | 原因 |
|--------|------|------|
| 拍照模式 | 伪AR（实时预览 + 拍照后云端分析） | MVP 成本低，准确率高 |
| AI 模型 | doubao-seed-2.0-pro 云端 API | 已有 coding 订阅，VLM 多模态支持 |
| 图片处理 | 拍照后压缩至 1024×1024 → Base64 | 平衡画质与传输速度 |
| 分析延迟 | 目标 ≤ 5秒 | PRD 性能要求 |
| 状态管理 | Zustand | 轻量，适合中等复杂度 |
| 路由 | Expo Router（文件路由） | Expo 官方推荐，支持 Tab + Stack |
| 本地存储 | AsyncStorage（MVP） / expo-sqlite（后续） | MVP 快速实现，后续迁移 |
| 设计系统 | 直接引用 constants/theme.ts Token | 与 Stitch TidyZen 对齐 |
| 字体加载 | expo-font + Google Fonts (Be Vietnam Pro) | 免费、符合设计稿 |

---

## 六、TidyZen 设计系统快速参考

```typescript
// constants/theme.ts
export const colors = {
  primary: '#2d6a4f',        // 森林绿 - 主按钮、主色调
  primaryDark: '#0f5238',    // 深绿 - 状态栏
  surface: '#f8f9fa',        // 页面背景
  paperWhite: '#FFFFFF',     // 卡片背景
  healingGreen: '#52B788',   // 成功/高置信标识
  softBlue: '#A9D6E5',       // AI边界框
  warmAmber: '#FFB347',      // 纠错按钮、氛围建议、难度星级
  tatamiBeige: '#F1E3D3',    // 暖色强调
  onSurface: '#191c1d',      // 主文字色
  onSurfaceVariant: '#404943', // 次要文字色
  outline: '#707973',        // 边框
  error: '#ba1a1a',          // 错误/下降趋势
};

export const typography = {
  displayHero:  { size: 36, weight: '700' as const, lineHeight: 44 },  // 大标题
  headlineLg:   { size: 28, weight: '600' as const, lineHeight: 36 },  // 页面标题
  headlineMd:   { size: 22, weight: '600' as const, lineHeight: 28 },  // 卡片标题
  bodyLg:       { size: 18, weight: '400' as const, lineHeight: 28 },  // 大段文字
  bodyMd:       { size: 16, weight: '400' as const, lineHeight: 24 },  // 正文
  labelCaps:    { size: 12, weight: '700' as const, lineHeight: 16, letterSpacing: 0.6 }, // 标签
  scoreDisplay: { size: 64, weight: '800' as const, lineHeight: 72 },  // 分数展示
};

export const radius = { sm: 4, md: 8, lg: 16, full: 9999 };
export const spacing = { unit: 4, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
```

---

## 七、依赖清单

```json
{
  "dependencies": {
    "expo": "~52.x",
    "expo-router": "~4.x",
    "expo-camera": "~16.x",
    "expo-image-manipulator": "~13.x",
    "expo-font": "~13.x",
    "expo-av": "~15.x",
    "expo-file-system": "~18.x",
    "@expo/vector-icons": "latest",
    "zustand": "^5.x",
    "react-native-safe-area-context": "latest",
    "react-native-screens": "latest",
    "react-native-reanimated": "~3.x"
  },
  "devDependencies": {
    "typescript": "~5.x",
    "@types/react": "~18.x"
  }
}
```

---

**下一步**: 执行 Phase 1 — 创建 Expo 项目并配置设计系统。
