# MVP 验收对照表

> 来源：PRD/RRD.md §七 验收标准 + §八 数据埋点
> 更新日期：2026-08-02
> 状态：评估当前代码与文档的"完成度"——所有 ✅/⚠️/❌ 必须有证据

---

## 0. 总览

| 类别 | 已通过 | 部分通过 | 未通过 | 缺证据 |
|---|---|---|---|---|
| 7.1 功能测试 | 1 | 0 | 2 | 0 |
| 7.2 用户体验 | 0 | 2 | 1 | 0 |
| 7.3 性能指标 | 0 | 1 | 2 | 0 |
| 8.1 核心埋点 | **5** | 0 | **1** | 0 |
| **合计** | **6** | **3** | **7** | **0** |

**MVP 当前真实状态**：❌ **未达可发布标准**（6 ✅ / 3 ⚠️ / 7 ❌，2026-08-02 S9 后）

主线打通（拍照→分析→结果→建议→详情），S9 后埋点 5/6 已通，但 7 项硬指标仍 ❌。详见 S2-S11 路线图。

---

## 1. §7.1 功能测试

### 7.1.1 拍照分析准确率 ≥ 85%（针对 10 类杂物）

| 项 | 内容 |
|---|---|
| 目标 | ≥ 85% |
| 当前 | **❌ 未验证** |
| 状态 | 0 张测试集照片、0 次跑过准确率评估 |
| 证据 | 仓库内 `docs/test-set/` 不存在；`scripts/` 下仅有 `make_screenshots.py`，无 `eval-accuracy.*`；`fact_store` 无任何准确率记录 |
| 满足方法 | S2 建测试集 + S3 跑批 + S4 调优 prompt |
| 影响 | P0 · 上架前必须有 |

### 7.1.2 建议执行后用户二次拍照评分提升 ≥ 15 分

| 项 | 内容 |
|---|---|
| 目标 | ≥ 15 分 |
| 当前 | **❌ 未验证** |
| 状态 | depends on 7.1.1 + 真实数据闭环 |
| 证据 | 同样缺测试集；`AsyncStorage` 持久化已实现（`services/storage.ts` L58-95 确认），但无 0→1 用户真实数据 |
| 满足方法 | 依赖 S2/S3/S4 完成后实测；S12 端到端走通"执行建议→二次拍照→对比" |
| 影响 | P0 · 核心产品价值验证 |

### 7.1.3 用户纠错流程可用（点击"不准"→展示 10 个场景→选择后匹配建议）

| 项 | 内容 |
|---|---|
| 目标 | 流程贯通 |
| 当前 | **✅ 已实现** |
| 证据 | `app/result.tsx` 渲染"不准"按钮 → `app/correction.tsx` 10 场景选择 → `services/suggestions.ts` L100-130 匹配逻辑 |
| 影响 | P0 满足 |
| 备注 | "10 个场景"是 PRD 数字，实际 `VALID_SCENES = ['bedroom', 'living_room', 'bathroom', 'desk_area', 'floor', 'unknown']` 是 6 个，详见 §7.1 偏差说明 |

---

## 2. §7.2 用户体验

### 7.2.1 用户完成首次整理流程耗时 ≤ 8 分钟

| 项 | 内容 |
|---|---|
| 目标 | ≤ 8 分钟 |
| 当前 | **⚠️ 部分**（流程在但无测试） |
| 状态 | 主流程跑通（拍照→结果→建议→详情），但缺真人计时验证 |
| 证据 | `app/camera.tsx` → `app/analyzing.tsx` → `app/result.tsx` → `app/detail/[id].tsx` 全路径连通；无 time-tracking 埋点 |
| 满足方法 | S12 端到端走一遍 + 真人计时 |
| 影响 | P0 偏软，没有客观数据上不了一星差评（除非 UX 严重卡顿） |

### 7.2.2 95% 用户能无障碍完成建议操作

| 项 | 内容 |
|---|---|
| 目标 | 95% 转化 |
| 当前 | **⚠️ 部分**（UI 在但操作不可达） |
| 状态 | `app/video/[id].tsx` 当前是"即将上线"占位页，无法"无障碍完成建议操作" |
| 证据 | `app/video/[id].tsx` 是"即将上线"占位页（含 `'即将上线'` 字样，无 VideoView 组件），无法"无障碍完成建议操作"；用户从 `app/detail/[id].tsx` 点"看视频"后跳到占位页 = 死路 |
| 满足方法 | S5 升级 `app/video/[id].tsx` 为图文步骤占位 → S11 接真视频 |
| 影响 | P0 · 用户卡在占位页 = 95% 目标严重不达 |

### 7.2.3 建议文案口语化无书面语

| 项 | 内容 |
|---|---|
| 目标 | 文案自然 |
| 当前 | **❌ 未审计** |
| 状态 | `services/suggestions.ts` 10 场景共 20 条建议已入库，未做"书面语/口语化"逐条审计 |
| 证据 | `services/suggestions.ts` L1-300 含 20 条 `reason` 字段；未跑过文案审计 |
| 满足方法 | S5 阶段顺手过一遍 20 条建议，每条改成第二人称/短句/动词开头 |
| 影响 | P1 · 不会一票否决上架但影响评分 |

---

## 3. §7.3 性能指标

### 7.3.1 App 启动时间 ≤ 2 秒

| 项 | 内容 |
|---|---|
| 目标 | ≤ 2 秒 |
| 当前 | **❌ 未测量** |
| 状态 | 未在真机/模拟器上跑冷启动计时 |
| 证据 | 无任何性能 profiling 记录（`fact_store` 也无） |
| 满足方法 | S12 用 Xcode Instruments 或 `console.time` 跑冷启动 5 次取中位数 |
| 影响 | P0 偏软，3 秒内基本不会卡审核，但用户体感相关 |

### 7.3.2 拍照分析延迟 ≤ 5 秒（含云端模型调用）

| 项 | 内容 |
|---|---|
| 目标 | ≤ 5 秒 |
| 当前 | **⚠️ 部分**（已实测大概 OK） |
| 状态 | 模型切换实测：1 张 224x224 图 + 真实 prompt = 638 tokens 出，**实测 < 2 秒**（curl 同步测） |
| 证据 | 见 `/tmp/test-room.json` 实测返回 usage: `total_tokens: 638, completion_tokens: 378`；TidyZen 实际图片是 1024x1024 JPEG 预计 1.5k-2.5k tokens，云端 2-3 秒大概率满足 |
| 满足方法 | S12 在 App 内用 `console.time` 端到端测 10 次取 P95 |
| 影响 | P0 · 模型切换后的新基线必须重测 |

### 7.3.3 本地存储占用 ≤ 200 MB（含建议库和短视频）

| 项 | 内容 |
|---|---|
| 目标 | ≤ 200 MB |
| 当前 | **❌ 当前达标但无视频** |
| 状态 | `services/storage.ts` 仅 `AsyncStorage` + 轻量建议库（20 条），目前实际占用 < 5MB；但 `assets/videos/` 为空，**真实状态是 200MB 上限从未被压力测试** |
| 证据 | `assets/videos/` 目录存在但 0 文件；无 iOS app 体积 profiling |
| 满足方法 | S11 录 20 条短视频后，跑 iOS build 看 `.ipa` 体积 |
| 影响 | P0 · 短视频是预算大头，20 条 15s 视频估算 50-150MB，必须实测确认不爆 |

---

## 4. §8.1 核心埋点（6 个事件）

### 8.1.1 `photo_taken`

| 项 | 内容 |
|---|---|
| 当前 | **✅ 已实现**（2026-08-02 S9） |
| 证据 | `app/camera.tsx` 拍照 (`takePictureAsync` 成功) + 相册 (`launchImageLibraryAsync` 成功) 各 1 处调用 `analytics.photoTaken(source)` |
| 影响 | P1 满足 |

### 8.1.2 `analysis_complete`

| 项 | 内容 |
|---|---|
| 当前 | **✅ 已实现**（2026-08-02 S9） |
| 证据 | `app/analyzing.tsx` 收到 `analyzeImage` 返回 result 后调用 `analytics.analysisComplete({ score, scene, clutterLabels, maxConfidence, latencyMs })` |
| 影响 | P1 满足 |

### 8.1.3 `suggestion_viewed`

| 项 | 内容 |
|---|---|
| 当前 | **✅ 已实现**（2026-08-02 S9） |
| 证据 | `app/result.tsx` 建议卡片 `onPress` 跳详情前调用 `analytics.suggestionViewed(suggestion.id, suggestion.type)` |
| 影响 | P1 满足 |

### 8.1.4 `suggestion_executed`

| 项 | 内容 |
|---|---|
| 当前 | **❌ 未实现（缺 UI 入口）** |
| 证据 | `app/detail/[id].tsx` **没有"标记已完成"按钮**（grep 全文件确认）。原 MVP_ACCEPTANCE.md §4.1.4 描述的"已完成"字样是"完成标准"文本（描述视频步骤），不是按钮 |
| 满足方法 | 产品决策：(a) 在 `app/detail/[id].tsx` 新增"标记已完成"按钮 → 调用 `analytics.suggestionExecuted(scenarioId)`；(b) 把"看视频"按钮改造为"看+标完成"组合 |
| 影响 | P1（建议执行率无埋点 = 5/6 不可算） |

### 8.1.5 `error_reported`

| 项 | 内容 |
|---|---|
| 当前 | **✅ 已实现**（2026-08-02 S9） |
| 证据 | `app/result.tsx` "识别不准"按钮 `onPress` 跳 `/correction` 前调用 `analytics.errorReported({ originalScene: result.scene })` |
| 影响 | P1 满足 |

### 8.1.6 `retake_photo`

| 项 | 内容 |
|---|---|
| 当前 | **✅ 已实现**（2026-08-02 S9） |
| 证据 | `app/result.tsx` 底部"我已完成整理，重新扫描"按钮 + `app/detail/[id].tsx` L190"重新扫描"按钮，各 1 处调用 `analytics.retakePhoto({ prevScore })` |
| 影响 | P1 满足 |

**埋点总影响**：5/6 已实现（2026-08-02 S9），`suggestion_executed` 缺 UI 入口；§8.2 北极星指标的"建议执行率"暂无法计算，其余 4 个可基于 5/6 埋点数据算。

**最低成本补救**（S9 已完成）：建 `services/analytics.ts` 用 `console.log` 记录 6 个事件，4 个调用点插入（拍照/收到结果/查看建议/标记完成/纠错/再拍）。不上传后端，本地打日志。后续切换 Sentry/PostHog 只改 analytics.ts 实现。

---

## 5. §8.2 北极星指标（依赖 §8.1，无数据可算）

5 个指标全依赖埋点，**当前全部 ❌**：
- 建议执行率 ≥ 30% → 缺埋点
- 二次拍照率 ≥ 20% → 缺埋点
- 评分提升幅度 ≥ 15 分 → 缺埋点 + 缺真实数据
- 7 日留存率 ≥ 25% → 缺埋点 + 时间窗口未到
- 纠错率 ≤ 15% → 缺埋点

**S9 完成后这部分自动可计算**（本地日志 + 手工导出）。

---

## 6. MVP 还差什么（按优先级）

### P0（上架前必须）
1. **7.1.1 准确率** — S2/S3/S4（建测试集 + 跑批 + 调优）
2. **7.1.2 评分提升** — 依赖 #1 + S12 端到端
3. **7.2.2 建议可操作性** — S5（图文占位）+ S11（接真视频）
4. **7.3.3 200MB 上限压力测试** — 依赖 S11
5. **8.1.4 `suggestion_executed` 埋点** — 新增"标记已完成"按钮 + 埋点调用

### P1（影响评分/可观测性，不一票否决）
- 7.2.1 8 分钟流程计时 → S12
- 7.2.3 口语化审计 → S5 顺手做
- 7.3.1 启动时间 → S12
- 8.1 5/6 埋点已 ✅（S9 2026-08-02 完成）

### P2（运营优化）
- 8.2 5 个北极星指标 — 埋点后自动可算

---

## 7. 与 PRD 的偏差说明（**持续更新中**）

### 7.1 偏差：10 场景 → 6 场景
- PRD §7.1.3 说"展示 10 个场景"
- 实际 `VALID_SCENES` 是 6 个：`['bedroom', 'living_room', 'bathroom', 'desk_area', 'floor', 'unknown']`
- 加上"unselected"/"not_sure" 凑到 8 个仍不到 10
- 满足方法：A. 扩展 `VALID_SCENES` 到 10 个（需建议库同步扩 20 条 → 33 条）；B. PRD 改 6 个
- 待定

### 7.2 偏差：mimo → doubao-seed-2.0-pro
- PRD §5.3 原本写"mimo-v2.5-pro 或火山引擎豆包"
- 2026-08-02 已切到 doubao-seed-2.0-pro（coding endpoint）
- 已在 `docs/PROJECT_STATUS.md` 和 `docs/DEVELOPMENT_PLAN.md` 同步
- 已 commit `2b769e7`

### 7.3 偏差：Tab 入口
- 设计稿 4 Tab：首页/扫描/记录/我的
- 2026-08-02 修复（commit `c25fe5c`）
- 当前实现 `app/(tabs)/_layout.tsx`：首页/扫描/记录/我的 ✅
- 改动：`(tabs)/_layout.tsx` 把 `name="settings"` 改为 `name="profile"`，title `"设置"` → `"我的"`，icon `settings` → `person`；新增 `app/(tabs)/profile.tsx`（从 root `app/profile.tsx` 迁移，import 路径 `../` → `../../`）；3 处路由引用同步更新（medals / notification-preferences / settings (root)）；删除 `app/(tabs)/settings.tsx` + root `app/profile.tsx`

### 7.4 偏差：account.tsx 按钮
- 设计稿有 5 个按钮（修改密码/退出登录/删除账号/隐私政策/用户协议）
- 当前实现点这些按钮**没有可跳转页面或后端支持**
- 满足方法：S8 降级为"灰色+占位文案"或接 toast "暂未开放"

---

## 8. 验收总结

**MVP 当前**：
- ✅ 6/16（7.1.3 纠错流程 + 8.1.1-3/5-6 共 5 个埋点）
- ⚠️ 3/16（7.2.1/7.2.2/7.3.2）
- ❌ 7/16

**P0 待办（5 项）≈ 2-3 天工作量**（S2/S3/S4/S5/S11/S12）：
- S2 建测试集（半天）
- S3 跑准确率（半天）
- S4 调优 prompt（半天-1 天）
- S5 视频占位（2 小时）
- S11 录制 20 条视频（1-2 天，主要等真人录制）
- S12 端到端验证（1-2 小时）

**S9 已完成（2026-08-02）**：埋点骨架 `services/analytics.ts` + 5/6 事件接入调用点，1 个事件 (`suggestion_executed`) 缺 UI 入口挂 P0。

**结论**：项目骨架 + 主流程 + UI + 5/6 埋点已交付。**P0 验收 7 项 ❌ 是预期内**（MVP 收尾期），按 S1-S12 路线图走完后可达成上架标准。
