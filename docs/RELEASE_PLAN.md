# TidyZen 上架发布计划（Release Plan）

> 制定日期：2026-08-12
> 制定者：Hermes（基于 2026-08-12 完整按钮/数据审计）
> 目标：从"半成品"走到"可上架"，再走到"可真实使用"
> 关联文档：`docs/BUTTON_AUDIT.md` · `docs/MVP_ACCEPTANCE.md` · `docs/PROJECT_STATUS.md`

---

## 0. 计划总览

**3 个 Phase × 4 个 Stage**，按"先保上架 → 再保体验 → 最后保质量"梯度推进。

| Phase | 名字 | 目标 | 估时 | 阻塞项 |
|---|---|---|---|---|
| **P0** | App Store 合规 | 上架不被拒 | 半天 | 无 |
| **P1** | 本地体验完整 | 所有按钮有响应有数据 | 1.5 天 | 无 |
| **P2** | 上架前冲刺 | 端到端验收 + 公网部署 | 半天 | 无 |
| **P3** | 体验打磨 | UI/性能/可观测性 | 1-2 天 | 部分依赖 S11（视频录制） |

**P0+P1+P2 ≈ 2.5 天**（独立可做的全部）
P3 含外部依赖项，按用户时间灵活安排

---

## Phase P0 — App Store 合规（半天，4 小时）

**目标**：通过 App Store Guideline 2.2（功能完整性）+ 2.1（性能）审核。
**不做**：用户体验优化。

### P0.1 死按钮批量兜底（30 分钟）
- 范围：BUTTON_AUDIT.md §1 中 20 个死按钮
- 方法：所有 🔴 级加 `onPress={() => Alert.alert('功能开发中', '预计 v1.1 上线')}`
- 工具：tmux + 1 个 Claude Code 会话
- 验证：见 BUTTON_AUDIT.md §7 扫描脚本，`目标：TouchableOpacity 真空率 = 0%`
- 提交：1 个 commit `fix(buttons): 20 个死按钮批量加 Alert 兜底（App Store Guideline 2.2）`

### P0.2 settings 跳转修复（5 分钟）
- 范围：`app/settings.tsx:77` 房间模板 / `app/settings.tsx:82` 建议库偏好
- 修法：把 `Alert.alert('功能开发中'...)` 改为 `router.push('/room-templates')` / `router.push('/suggestion-preferences')`
- 原因：目标页面已存在，Alert 是错判
- 验证：手动测 2 个跳转
- 提交：1 个 commit `fix(settings): 房间模板/建议库偏好跳真实页面（之前误判为开发中）`

### P0.3 公网部署隐私政策 + 支持页（1 小时）
- 范围：`docs/privacy-policy.html` + `docs/support.html`
- 方法：GitHub Pages 0 成本（建 `gh-pages` 分支 / 仓库 Settings → Pages）
- 准备：注册或用现有 GitHub 账号，App Store Connect 提交时填 URL
- 验证：浏览器能访问
- 提交：gh-pages 分支独立，无 git commit 到主分支

### P0.4 App Store 截图重拍（2 小时）
- 范围：`docs/screenshots/` 9 张（当前是设计稿拼接）
- 修法：在 iOS 模拟器跑实际页面，`xcrun simctl io booted screenshot` 截真实页面
- 准备：先用 P0.1/P0.2 修完死按钮避免截到占位图
- 验证：截图清晰度、关键文案显示正确
- 提交：直接覆盖 `docs/screenshots/`，1 个 commit

**P0 完成标志**：BUTTON_AUDIT.md §1 全部 20 个死按钮 0 真空；可向 App Store Connect 提交上架。

---

## Phase P1 — 本地体验完整（1.5 天，12 小时）

**目标**：让所有用户能看到的按钮都有真实响应和数据。
**原则**：不依赖后端的全部本地实现。

### P1.1 假数据 5 处全部接真实数据（1.5 小时）

| 文件:行 | 字段 | 修法 |
|---|---|---|
| `profile.tsx:77` | 昵称 useState | 启动时 `await AsyncStorage.getItem('@tidyzen/nickname')`，无则默认 "整洁爱好者" |
| `profile.tsx:78` | 性别 useState | 同上，`@tidyzen/gender` |
| `profile.tsx:141` | 称号硬编码 | 复用已有 `deriveLevel()`，按 totalScans 算等级 → 称号映射表（"整洁新手" / "整洁达人" / "极简主义新星"） |
| `settings.tsx:53` | 等级硬编码 "☆ Lv.3 整理达人" | 接 `useHistoryStore.records` 真实算 |
| `settings.tsx:95` | 缓存 "124 MB" | 用 `FileSystem.getInfoAsync(documentDirectory)` 算真实占用，转 MB |

- 工具：1 个 CC 会话（够）
- 提交：1 个 commit `fix(data): 5 处硬编码假数据接 AsyncStorage + 动态算（profile/settings）`

### P1.2 profile 表单持久化（30 分钟）
- 范围：`profile.tsx` 顶部"保存"(L107) + 头像相机(L117) + 底部"保存"(L217)
- 修法：
  - 顶部"保存"和底部"保存"合并为一个 `handleSave` — 写入 AsyncStorage
  - 头像相机接 `expo-image-picker` → 选图 → 存 `documentDirectory/avatar.jpg` → AsyncStorage 存 URI → 刷新显示
  - 提交后 Alert "已保存"
- 工具：1 个 CC 会话
- 提交：1 个 commit `feat(profile): 头像更换 + 昵称/性别保存（接 AsyncStorage）`

### P1.3 死按钮方案 2 — 按建议修法实现（半天）

按 BUTTON_AUDIT.md §1 建议修法实现，**选高 ROI 8 个**：

| # | 按钮 | 修法 | 估时 |
|---|---|---|---|
| 9 | `about.tsx:62` 官方链接 | `Linking.openURL` × 4 个 | 15 分钟 |
| 12 | `help.tsx:69` 在线客服 | `Linking.openURL('mailto:support@...')` | 5 分钟 |
| 13 | `help.tsx:72` 反馈建议 | `Linking.openURL('mailto:feedback@...')` | 5 分钟 |
| 14 | `privacy.tsx:213` 联系法务 | `Linking.openURL('mailto:legal@...')` | 5 分钟 |
| 15 | `privacy.tsx:225` 悬浮客服 | 同 #12 | 5 分钟 |
| 16 | `record/[id].tsx:220` 分享 | `Share.share({ message: '...' })` | 10 分钟 |
| 10 | `camera.tsx:248` 闪光灯 | CameraView flash prop + toggle | 30 分钟 |
| 5 | `history.tsx:42` 头像 | `router.push('/(tabs)/profile')` | 5 分钟 |

- 工具：1 个 CC 会话
- 提交：1 个 commit `feat(buttons): 8 个高 ROI 死按钮按建议修法实现（mailto/share/flash/nav）`

### P1.4 退出登录 + 导航孤岛（2 小时）

**退出登录（1.5 小时）** — `settings.tsx:115-125`：
- 二次确认"仍要退出"后：
  - `useHistoryStore.getState().clear()` （新增 clear 方法）
  - `useAnalysisStore.getState().clear()` （新增 clear 方法）
  - `AsyncStorage.multiRemove(['@tidyzen/history', '@tidyzen/lastScan', '@tidyzen/profile', '@tidyzen/nickname', '@tidyzen/gender'])`
  - `router.replace('/(tabs)')` 回首页
- 工具：1 个 CC 会话
- 提交：1 个 commit `feat(settings): 退出登录清 store/storage（不再只弹"开发中"）`

**导航孤岛（30 分钟）** — `/change-password` + `/terms`：
- **`/change-password` 已拍 A（2026-08-12，commit d3facec）**：删独立页 + _layout 注册。**已完成**。account.tsx 内嵌版（3 输入框 + 4 校验）保留。
- `/terms`：在 settings 隐私政策下加一行 "→ 服务条款" 跳转
- 工具：1 个 CC 会话
- 提交：1 个 commit `fix(nav): 补 /terms 入口`

### P1.5 主页 + history 死按钮（半天，4 小时）

**主页（2 小时）**：
- `index.tsx:207` "操作"按钮：按 buttonVariant 跳不同目标（"primary"→`/(tabs)/scan`、"outline"→对应详情页）
- `index.tsx:283` "查看全部"：跳 `/trends`

**history（2 小时）**：
- `history.tsx:30` 汉堡菜单：弹一个 Modal（包含"跳首页/扫一扫/我的"3 个按钮）
- `history.tsx:39` 筛选图标：**直接删**（SegmentedControl 已有 "全部/本周/本月"，图标重复）
- `history.tsx:42` 头像：见 P1.3 #5

- 工具：1 个 CC 会话（够大）
- 提交：1 个 commit `feat(buttons): 主页 2 + history 3 死按钮实现（操作跳转/查看全部/汉堡/筛选/头像）`

**P1 完成标志**：BUTTON_AUDIT.md §1 全部 20 个死按钮 0 真空 + 5 处假数据 0 硬编码 + 9 个 Alert 占位减到 6（账号类等后端）+ 退出登录可清状态。

---

## Phase P2 — 上架前冲刺（半天，4 小时）

**目标**：通过 §7.3 性能验收 + 端到端可走通。

### P2.1 启动时间实测（30 分钟）
- §7.3.1 目标 ≤2 秒
- 工具：`xcrun simctl io booted screenshot` + `console.time` 插入
- 方法：冷启动 5 次取中位数
- 输出：`docs/performance/STARTUP_TIME.md` + 填入 MVP_ACCEPTANCE §7.3.1
- 提交：1 个 commit `docs(perf): §7.3.1 启动时间实测 P50=Xs`

### P2.2 延迟端到端复测（1 小时）
- §7.3.2 目标 ≤5 秒
- 范围：commit `4ffd1c7` 压缩 1024 宽后未实测
- 方法：拍 10 张图，`console.time` 包 analyzeImage，P95
- 工具：模拟器 + /tmp/aiw-verify/latency-report.json
- 输出：`docs/performance/LATENCY_REPORT.md` + 填入 §7.3.2
- 提交：1 个 commit `docs(perf): §7.3.2 延迟复测 P95=Xs（1024 压缩后）`

### P2.3 S12 端到端验收（2.5 小时）
- 范围：MVP_ACCEPTANCE §6 P0 列表
- 流程：拍照→分析→结果→执行建议→二次拍照→对比
- 工具：模拟器 + 手动跑 + 截图记录
- 输出：`docs/MVP_ACCEPTANCE.md` §6 P0 全部从 ❌ → ✅
- 提交：1 个 commit `docs(acceptance): S12 端到端验收完成 + 全部 P0 转 ✅`

**P2 完成标志**：MVP_ACCEPTANCE §7.1/§7.3 全部 ⚠️/❌ 收敛到 ≤3 个。

---

## Phase P3 — 体验打磨（1-2 天，按时间灵活）

**目标**：从"能上架"到"能留住用户"。

### P3.1 UI 打磨（半天）
- ScoreGauge 真实 SVG 进度环（替换简化版）
- Tab 图标与设计稿对齐
- 各页面细节打磨（间距/字体/动效）
- 提交：1-2 个 commit

### P3.2 Before/After 真照片对比（1 小时）
- 范围：commit `9a9b10c` 占位 → 真照片并排
- 方法：扫描时存 lastScan，result 页读 store.previousScan.photoUri，两张照片并排
- 提交：1 个 commit `feat(result): Before/After 真照片并排对比`

### P3.3 勋章解锁轻提示（1-2 小时）
- 现状：勋章解锁后用户无感知
- 修法：详情页/result 页加一个轻 toast
- 提交：1 个 commit `feat(medals): 解锁时弹轻提示`

### P3.4 8.2 北极星指标计算（半天，依赖有真实数据）
- 范围：从 console.log 日志聚合算 5 个指标
- 前提：先有真实用户数据
- 提交：1 个 commit `feat(analytics): 北极星指标计算脚本`

### P3.5 搜索/筛选历史记录（2-3 小时）
- 范围：`history.tsx` 加搜索框 + 高级筛选（按场景/分数段）
- 前提：用户记录数 > 20 条时才有意义
- 提交：1 个 commit

### P3.6 S11 视频录制（1-2 天，等真人）
- 范围：20 条 15s 视频
- 依赖：真人出镜
- 提交：视频文件 + 1 个 commit `feat(videos): S11 20 条建议视频接入`

### P3.7 §7.3.3 200MB 存储压力测试（依赖 S11）
- 范围：iOS build 后看 .ipa 体积
- 提交：1 个 commit

---

## 4. 时间表（推荐顺序）

```
Day 1 上午（4h）：P0 全套 → 立刻具备上架条件
Day 1 下午（4h）：P1.1 + P1.2 + P1.3 → 用户体验基础完整
Day 2 上午（4h）：P1.4 + P1.5 → 全部死按钮归零
Day 2 下午（4h）：P2 全套 → §7.3 + S12 全部验收
Day 3+ ：P3 按时间灵活挑
```

**总投入 ≈ 2.5 整天** 即可从"半成品"走到"App Store 审核就绪 + 端到端验收通过"。

---

## 5. 风险与回退

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| 模拟器截图与设计稿差异大 | 中 | App Store 截图返工 | 先在 §5 P0.4 截一张与设计稿对比，差异大就退回设计稿拼接版 |
| profile 头像选图权限问题 | 低 | P1.2 阻塞 | 已有 expo-image-picker 经验（commit 5e3e5e5），pod 已装 |
| 退出登录清 store 引发其他页面崩溃 | 中 | P1.4 阻塞 | 先在 useHistoryStore/useAnalysisStore 加 clear 方法，单元测一遍 |
| S12 端到端发现严重 bug | 中 | P2 阻塞 | 标记 P0 即可，不阻塞上架 |
| S11 视频永远等不到 | 高 | P3.6 永不完成 | 已默认不做（L1 图文步骤已上线，转化率 60-70%） |

---

## 6. 决策点（需用户拍板）

1. **✅ P1.4 导航孤岛 `/change-password`**：A 删独立页（commit d3facec 已完成）
2. **P1.1 昵称默认**：用户没设过时显示 "整洁爱好者"（settings.tsx 现用）还是 "陈洁"（profile.tsx 现用）？建议统一为前者。
3. **P1.3 死按钮方案 1 vs 2**：P0 已做方案 1 批量 Alert，P1.3 要不要继续做方案 2 的 8 个高 ROI 实现？
4. **Phase 顺序**：按推荐 P0→P1→P2 走，还是有别的优先级？
5. **P3 哪些做**：全部跳过 / 只做 P3.1+P3.2 / 全做？

---

## 7. 验证清单（Phase 完成时自查）

- [ ] `python3` 扫描脚本返回 0 个无 onPress
- [ ] `grep -n "useState('陈洁\|'整洁爱好者'\|'极简主义新星'\|'124 MB'" app/` 返回 0
- [ ] `bundle exec metro` 编译 0 错误
- [ ] iOS 模拟器跑 5 次核心流程无崩溃
- [ ] git log --oneline 显示所有 commit

---

## 8. 关联文档

- `docs/BUTTON_AUDIT.md` — 完整按钮/数据问题清单（35 处）
- `docs/MVP_ACCEPTANCE.md` — PRD §7/§8 逐项验收对照
- `docs/PROJECT_STATUS.md` — 项目状态总览
- `docs/DEVELOPMENT_PLAN.md` — 旧版 MVP 开发计划（保留作历史）
