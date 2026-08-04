# TidyZen 项目状态

> 最后更新: 2026-08-04
> Stitch 设计稿项目: `projects/12020854547316763944`（小徐的整理助手）

---

## 一、项目概览

| 指标 | 数值 |
|---|---|
| 页面文件 | 26 个 |
| 组件 | 11 个 |
| Store/Service | 5 个 |
| 总代码行数 | ~8,700 行 |
| 设计稿 | 44 张，100% 覆盖 |
| Git commits | 20+ |

---

## 二、设计稿 → 代码 精确映射

### Tab 页面

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/(tabs)/index.tsx` | `/(tabs)/index` | 首页 - 整洁助手 | `ca284524557a40e79220171599fcc11f` |
| `app/(tabs)/scan.tsx` | `/(tabs)/scan` | 拍照扫描入口（双按钮版） | `10_拍照扫描分析` |
| `app/(tabs)/history.tsx` | `/(tabs)/history` | 整理记录列表 - TidyZen (新版) | `f3fd2c6f83c44f06a213eea248dd70f2` |
| `app/(tabs)/settings.tsx` | `/(tabs)/settings` | 设置 - TidyZen | `2ba523f848774f48ad89bc058bfaa6a5` |

### 核心分析流程

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/camera.tsx` | `/camera` | 拍照分析 - 引导拍摄版 (v3) | `1a02ba1985654622bf39162d1c95ac0e` |
| `app/analyzing.tsx` | `/analyzing` | AI 分析中 - 简洁加载版 | `baa4e1732037422db425fd251005266e` |
| `app/result.tsx` | `/result` | 分析结果 - 含置信度与纠错功能 | `23ede24a3f3c44529b83bb953da374f8` |
| `app/correction.tsx` | `/correction` | 纠错与场景选择 - TidyZen | `2ad02696ccaf4e8db1ed3729cb6dba50` |
| `app/detail/[id].tsx` | `/detail/[id]` | 分析详情 - 图文指引版 | `a00a8045e0fc4cc4bbdbe651744246af` |
| `app/video/[id].tsx` | `/video/[id]` | 视频教程播放界面 | `64da993e9bc4415d9256f83d333179fe` |

### 历史与趋势

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/record/[id].tsx` | `/record/[id]` | 整理记录详情 | `ea9d2aa084ef415c98ee55962324f797` |
| `app/trends.tsx` | `/trends` | 整理足迹与趋势分析 | `764872ed823646fa9bd78cac5a8884f5` |

### 辅助页面

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/profile.tsx` | `/profile` | 个人资料 - TidyZen | `608e6018d5ac475694f77ee7315e034e` |
| `app/help.tsx` | `/help` | 常见问题 - 帮助中心 | `cce82e5029da401e8abcb1841c0aa087` |
| `app/about.tsx` | `/about` | 关于 TidyZen | `5ed3f5382e4c45aa891b0d5c3f44aff2` |
| `app/privacy.tsx` | `/privacy` | 隐私政策与服务协议 | `e5a9b6f546ab46a6aa114dbef6691c52` |
| `app/account.tsx` | `/account` | 账号管理与安全 | `0a66e8f3ed8a4acd89a510721abe492a` |
| `app/notification-preferences.tsx` | `/notification-preferences` | 通知偏好设置 (v2) | `44_通知偏好设置` |
| `app/room-templates.tsx` | `/room-templates` | 房间模板管理 | `e0c84393752945698654ee40b07c9e34` |
| `app/suggestion-preferences.tsx` | `/suggestion-preferences` | 建议库偏好 | `b5199e56d46f419e94ed689b09551153` |
| `app/terms.tsx` | `/terms` | 服务条款 | `42_服务条款` |
| `app/change-password.tsx` | `/change-password` | 修改密码 | `29_修改密码_TidyZen` |
| `app/medals.tsx` | `/medals` | 我的勋章墙 | `34_我的勋章墙_TidyZen` |

### 组件

| 代码文件 | 说明 |
|---|---|
| `components/ScoreGauge.tsx` | 整洁度评分仪表盘（简化版） |
| `components/BoundingBox.tsx` | AI 边界框标注 |
| `components/SceneCard.tsx` | 场景选择卡片 |
| `components/RecordCard.tsx` | 历史记录卡片（含缩略图） |
| `components/ConfidenceBadge.tsx` | 置信度标识 |
| `components/TipsModal.tsx` | 整理秘籍弹窗 (25_图文整理秘籍弹窗) |
| `components/ui/Button.tsx` | 通用按钮 |
| `components/ui/Card.tsx` | 通用卡片 |
| `components/ui/EmptyState.tsx` | 空状态 |
| `components/ui/SegmentedControl.tsx` | 分段控制器 |
| `components/ui/Tag.tsx` | 标签 |

---

## 三、各页面开发状态

| 页面 | 路由 | UI | 数据流 | 备注 |
|---|---|---|---|---|
| 首页 | `/(tabs)/index` | ✅ | ✅ | 从 history store 读取最新得分+缩略图 |
| 扫描 | `/(tabs)/scan` | ✅ | ✅ | 双入口：拍照扫描 + 从相册选择 |
| 记录 | `/(tabs)/history` | ✅ | ✅ | 从 store/storage 加载真实记录 + TipsModal |
| 设置 | `/(tabs)/settings` | ✅ | ✅ | 清除缓存/退出登录已接入 storage (2026-06-22) |
| 拍照 | `/camera` | ✅ | ✅ | 权限+拍照+相册选图+HEIC转JPEG |
| 分析中 | `/analyzing` | ✅ | ✅ | 真实 AI API 调用 (mimo-v2.5) |
| 分析结果 | `/result` | ✅ | ✅ | 分析完自动保存到 storage + store |
| 纠错/场景 | `/correction` | ✅ | ⚠️ | 选场景后重调 AI |
| 建议详情 | `/detail/[id]` | ✅ | ⚠️ | suggestion 对象从 store 读取 |
| 视频教程 | `/video/[id]` | ⚠️ | ❌ | 只有播放图标，无视频资源 |
| 记录详情 | `/record/[id]` | ✅ | ✅ | 从 store 按 id 查找 |
| 整理足迹 | `/trends` | ✅ | ✅ | 从 store 计算趋势数据 |
| 个人资料 | `/profile` | ✅ | ✅ | 真实统计数据 (2026-06-22) |
| 帮助中心 | `/help` | ✅ | ✅ | 纯静态 |
| 关于 | `/about` | ✅ | ✅ | 纯静态 |
| 隐私政策 | `/privacy` | ✅ | ✅ | 纯静态 |
| 账号安全 | `/account` | ✅ | ❌ | 所有按钮无功能 |
| 通知偏好 | `/notification-preferences` | ✅ | ⚠️ | v2 复刻，本地状态 |
| 房间模板 | `/room-templates` | ✅ | ✅ | 5 个模板 + 持久化 (2026-06-22) |
| 建议偏好 | `/suggestion-preferences` | ✅ | ✅ | 开关状态持久化 (2026-06-22) |
| 服务条款 | `/terms` | ✅ | ✅ | 纯静态 |
| 修改密码 | `/change-password` | ✅ | ✅ | 表单校验+提交 (2026-06-22) |
| 勋章墙 | `/medals` | ✅ | ✅ | 真实解锁逻辑 (2026-06-22) |

---

## 四、服务层状态

| 模块 | 文件 | 状态 | 说明 |
|---|---|---|---|
| AI 分析 | `services/ai.ts` | ✅ 真实 | 对接 mimo-v2.5 视觉模型，含场景校验+markdown strip |
| 建议匹配 | `services/suggestions.ts` | ✅ 完成 | 10 场景 × 20 条建议，按优先级匹配 |
| 本地存储 | `services/storage.ts` | ✅ 完成 | AsyncStorage CRUD，已接入 5 个页面 |
| 分析 Store | `stores/analysis.ts` | ✅ 完成 | Zustand，流程状态管理 |
| 历史 Store | `stores/history.ts` | ✅ 完成 | Zustand，已通过 result.tsx 接入 storage |

---

## 五、开发路线图

### P0 — 补齐缺失页面 ✅ 完成 (2026-06-17)

- [x] 服务条款 — app/terms.tsx (ad795b5)
- [x] 修改密码 — app/change-password.tsx (ad795b5)
- [x] 整理秘籍弹窗 — components/TipsModal.tsx (ad795b5)
- [x] 勋章墙 — app/medals.tsx (ad795b5)
- [x] 通知偏好 v2 — app/notification-preferences.tsx (3ccfcce)

### P1 — 打通数据流 ✅ 完成 (2026-06-17)

- [x] result → storage → history store 串联 (448e589)
- [x] 首页接入真实评分 + 缩略图 (448e589, 3ccfcce)
- [x] record/[id] + trends 接入 store (448e589)

### P2 — AI 对接 ✅ 完成 (2026-06-22)

- [x] mimo-v2.5 API 对接 (cd16b03)
- [x] HEIC→JPEG 转码 — expo-image-manipulator (5e3e5e5)
- [x] markdown 代码块 strip (69cab31)
- [x] 场景校验 — 非房间照片拦截 (a8c89bb)
- [x] scan.tsx 双入口 — 拍照+相册 (281d906)
- [x] 相机返回导航修正 (1d2357a)
- [x] **端到端验证** — 拍照+相册选图 → AI 分析 → 结果展示，流程已通 (2026-06-22)
- [x] **AI 分析准确度优化** — Prompt 逐区域扫描 + 宁可多报不漏报 + Confidence 0.7→0.4 (2325d2d)
- [x] **精准扫描模式** — scan.tsx 新增第三按钮，用户先选场景再拍照，AI prompt 带场景信息 (2325d2d)
- [x] **建议数量优化** — 从 1-2 条扩展到 3-5 条，第一条标"先做这个" (2325d2d)
- [ ] **视频教程内容** — 接入真实视频资源

### P3 — 上架准备 ✅ 完成 (2026-06-22)

- [x] App Store 截图 — 9 张 PNG (6.7"/6.5"/5.5" × 3 页面) (8ac9655)
- [x] App 描述和关键词 — docs/app-store/ (8ac9655)
- [x] 隐私政策和支持页面 — docs/privacy-policy.html + docs/support.html (8ac9655)
- [x] app.json 配置 — splash、buildNumber、versionCode (8ac9655)
- [ ] ScoreGauge 真实 SVG 进度环
- [ ] Tab 导航对齐设计稿（4 入口）
- [ ] 各页面细节打磨

### P4 — MVP 收尾期 ✅ 完成 (2026-08-04)

**S5 video 图文步骤**（commit 03f11c5 + fbbe014）
- 升级 `app/video/[id].tsx` 从"视频即将上线"死路占位 → 图文步骤页（L1 方案）
- 新增"操作步骤"卡片（从 `suggestion.content.split('\n')` 拿步骤）
- 新增"完成标准"卡片（复用 `suggestion.acceptance_criteria`）
- §7.2.2 转化估算：L0 占位 0% → L1 图文 60-70%（L2 视频 S11 待真人录制）

**S6 Tab 入口**（commit c25fe5c + 6339a57）
- 4 Tab 改 首页/扫描/记录/我的（`app/(tabs)/_layout.tsx` `name="settings"` → `name="profile"`，title "设置" → "我的"）
- 3 处路由引用同步（medals / notification-preferences / settings root → (tabs)/profile）
- 删 `app/(tabs)/settings.tsx` + root `app/profile.tsx`
- 修复 PRD §7.3 偏差

**S8 按钮修复**（commit 26972d5 + d29b996 + 1f4deb5 + 9e04ce9）
- `app/account.tsx` 5 个无 onPress 按钮加 Alert：手机·修改 / 微信·解绑 / 邮箱·去绑定 / 改密码·提交 / 注销账号
- `app/settings.tsx` 3 个无 onPress 按钮加 Alert：房间模板管理 / 建议库偏好 / 退出登录
- 修复 PRD §7.4 偏差（App Store 审核 Guideline 2.2）

**S7 文案审计**（commit dc07aed + ebce386）
- `docs/SUGGESTIONS_AUDIT.md` 9103 字节逐条审计 20 条建议
- 审计口径：第二人称 / 短句 / 动词开头 / 无书面化连接词
- 结论：✅ 12/20 无需改 · ⚠️ 8/20 建议改 · ❌ 0/20 硬伤
- 待用户拍 4 选 1：① 不改 ② 全改 ③ 挑改 ④ 重写

**S9 埋点骨架**（commit f31611a + MVP_ACCEPTANCE.md 同步 commit 6339a57）
- `services/analytics.ts` 113 行，console.log 实现
- 5/6 埋点事件已接入：photo_taken / analysis_complete / suggestion_viewed / error_reported / retake_photo
- suggestion_executed 待产品决策（无对应 UI 按钮）

**AI 模型切换**（commit 2b769e7）
- mimo-v2.5 → 火山引擎 doubao-seed-2.0-pro（coding endpoint）
- 端到端实测通过

### P5 — MVP 上架前 P0 待办（2026-08-04）

- [ ] S2 建测试集（10-15 张真实房间照片，等用户提供）
- [ ] S3 跑准确率评估
- [ ] S4 prompt 调优
- [ ] S11 录制 20 条视频（L2 升级，等真人出镜）
- [ ] S12 端到端验收（App Store Guideline 2.1/2.2）
- [ ] SUGGESTIONS_AUDIT 待用户拍 4 选 1

**当前总览**（详见 `docs/MVP_ACCEPTANCE.md`）：6 ✅ / 4 ⚠️ / 6 ❌（未达可发布标准）

---

## 六、Git 历史

| Commit | 说明 |
|---|---|
| `4146f2e` | Initial commit |
| `2b0ba3e` | fix: CameraView ForwardRef 错误 |
| `dd0b5f8` | fix: camera fullScreenModal 导航 |
| `2734a90` | fix: 去掉 fullScreenModal，用普通 stack 导航 |
| `076df7f` | fix: scan tab 用 router.push 替代 Redirect |
| `ad795b5` | feat: P0 完成 — 补齐 4 个缺失设计稿页面 |
| `1d2357a` | fix: 相机返回直接回首页 |
| `281d906` | fix: 扫描流程全链路打通 |
| `32d3bc8` | fix: 移除 allowsEditing 修复相册选图卡死 |
| `448e589` | feat: P1 完成 — 打通数据流 |
| `3ccfcce` | feat: 历史记录和首页显示缩略图 |
| `cd16b03` | feat: P2 对接真实 AI API — mimo-v2.5 |
| `e446442` | fix: AI API 模型名修正 + 移除 response_format |
| `a8c89bb` | fix: AI 分析增加场景校验 |
| `e90c83f` | fix: AI 模型改为 mimo-v2-omni + reasoning fallback |
| `69cab31` | fix: AI 响应去掉 markdown 代码块 |
| `8654b77` | fix: 相册图片 HEIC→JPEG 转码 |
| `5e3e5e5` | fix: 恢复 expo-image-manipulator，修复 Ruby 2.6 pod |
| `66e6c81` | docs: 更新开发路线图 |
| `2b769e7` | feat(ai): 切换 mimo → 火山引擎豆包 doubao-seed-2.0-pro |
| `f31611a` | feat(analytics): 接入 5/6 PRD §8.1 埋点 + MVP_ACCEPTANCE.md |
| `c25fe5c` | feat(nav): 4 Tab 改 首页/扫描/记录/我的 |
| `26972d5` | fix(account): 5 个无 onPress 按钮加 Alert |
| `1f4deb5` | fix(account): settings.tsx 3 个无 onPress 按钮加 Alert |
| `03f11c5` | feat(video): 升级占位为图文步骤页（S5 L1） |
| `dc07aed` | docs(acceptance): S7 文案审计 + SUGGESTIONS_AUDIT.md |

---

## 七、环境配置

| 项目 | 值 |
|---|---|
| AI API | doubao-seed-2.0-pro（火山引擎 Ark VLM，coding endpoint） |
| API URL | `https://ark.cn-beijing.volces.com/api/coding/v1/chat/completions` |
| API Key | `.env` 文件 (EXPO_PUBLIC_AI_API_KEY) |
| Bundle ID | `com.anonymous.tidy-zen` |
| iOS 模拟器 | iPhone 17 Pro (EC2A677A-33E9-4EF7-92AB-12438A662697) |
| Ruby (CocoaPods) | brew Ruby 4.0.5 (系统 Ruby 2.6 不兼容 filter_map) |

---

## 八、已知问题

1. **AI 分析准确度** — ✅ 已优化 (2325d2d)：逐区域扫描 + 宁可多报不漏报 + Confidence 0.7→0.4 + 精准扫描模式
2. **相册 HEIC→JPEG** — expo-image-manipulator 刚重新构建好，待端到端验证
3. **视频教程** — 只有占位 UI，无实际视频资源
4. **账号安全页** — 所有按钮无功能
5. **通知偏好** — 本地状态，没有真实推送

---

## 九、产品方向 (2026-06-22 Grill 总结)

### 核心定位
| 维度 | 决策 |
|---|---|
| 目标用户 | 整理困难户（房间很乱，不知道从哪下手） |
| 核心价值 | 给可执行的行动建议（不是评分本身） |
| 评分定位 | "钩子"，吸引用户往下看建议 |
| 建议定位 | 主角，3-5 条，第一条标"先做这个" |

### AI 优化方向 (2026-06-22 已改)
- [x] Prompt：逐区域扫描（地面→桌面→椅子→床铺→角落→其他）
- [x] 策略：宁可多报不要漏报（原：宁可漏报也不要误报）
- [x] Confidence 过滤：0.7 → 0.4
- [x] 建议数量：1-2 条 → 3-5 条
- [x] 第一条建议加"先做这个"标签 + 绿色边框高亮

### 待做功能
- [x] 房间模板生效 — 精准扫描模式，拍照前选场景，影响 AI 分析 (2325d2d)
- [x] Before/After 对比 — 重新扫描时保存上一张照片，并排对比 + 分数变化 (9a9b10c)
- [x] 成就系统 — 勋章墙已有完整触发逻辑，基于历史记录自动解锁
- [x] 建议库预留 sponsor 字段 — Suggestion 接口新增 sponsor 字段 (0f85300)
- [x] 视频教程入口预留 — 20个建议全部配置 video_id，页面显示"即将上线"占位符 (9286a36)
- [ ] 数据持久化 — 等有用户后做 iCloud 同步

### 商业模式
| 模式 | 说明 |
|---|---|
| 免费 + 内购 | 每天 3 次免费扫描，¥12 解锁无限扫描 + 视频教程 + Before/After 对比 |
| 品牌合作 | 预留 sponsor 字段，10,000 DAU 后谈（如宜家家具植入） |
| 平台策略 | 先 iOS，后 Android |

### 验收标准
- AI 识别：漏识别率 < 10%（通过逐区域扫描 + 宁可多报策略）
- 建议质量：用户能直接执行，不需要额外搜索
- 用户留存：勋章系统 + Before/After 对比提供坚持动力
