# TidyZen 项目状态

> 最后更新: 2026-06-17
> Stitch 设计稿项目: `projects/12020854547316763944`（小徐的整理助手）

---

## 一、设计稿 → 代码 精确映射

### Tab 页面

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/(tabs)/index.tsx` | `/(tabs)/index` | 首页 - 整洁助手 | `ca284524557a40e79220171599fcc11f` |
| `app/(tabs)/scan.tsx` | `/(tabs)/scan` | （无独立设计稿，纯跳转逻辑） | — |
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

---

## 二、各页面开发状态

| 页面 | 路由 | UI 完成度 | 数据流 | 备注 |
|---|---|---|---|---|
| 首页 | `/(tabs)/index` | ✅ 完成 | ✅ 完成 | 从 history store 读取最新得分 |
| 扫描 Tab | `/(tabs)/scan` | ✅ 完成 | ✅ 完成 | 纯跳转逻辑 |
| 记录 Tab | `/(tabs)/history` | ✅ 完成 | ✅ 完成 | 从 store/storage 加载真实记录 |
| 设置 Tab | `/(tabs)/settings` | ✅ 完成 | ⚠️ 部分 | 开关有本地状态，清除功能未接 |
| 拍照 | `/camera` | ✅ 完成 | ✅ 完成 | 权限 + 拍照 + base64 |
| 分析中 | `/analyzing` | ✅ 完成 | ⚠️ Mock | 1.5s 延时后调 mock AI |
| 分析结果 | `/result` | ✅ 完成 | ✅ 完成 | 分析完自动保存到 storage + store |
| 纠错/场景 | `/correction` | ✅ 完成 | ⚠️ Mock | 选场景后重调 mock AI |
| 建议详情 | `/detail/[id]` | ✅ 完成 | ❌ Mock | `suggestion` 对象硬编码 |
| 视频教程 | `/video/[id]` | ⚠️ 占位 | ❌ 无 | 只有播放图标，无视频 |
| 记录详情 | `/record/[id]` | ✅ 完成 | ✅ 完成 | 从 store 按 id 查找 |
| 整理足迹 | `/trends` | ✅ 完成 | ✅ 完成 | 从 store 计算趋势数据 |
| 个人资料 | `/profile` | ✅ 完成 | ❌ Mock | 统计数据硬编码 |
| 帮助中心 | `/help` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 关于 | `/about` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 隐私政策 | `/privacy` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 账号安全 | `/account` | ✅ 完成 | ❌ 无 | 所有按钮无功能 |
| 通知偏好 | `/notification-preferences` | ✅ 完成 v2 | ⚠️ 本地状态 | 2026-06-17 CC 复刻 v2 设计稿 |
| 房间模板 | `/room-templates` | ✅ 完成 | ❌ Mock | 按设计稿 27 实现 |
| 建议偏好 | `/suggestion-preferences` | ✅ 完成 | ❌ Mock | 按设计稿 11 实现 |

---

## 三、服务层状态

| 模块 | 文件 | 状态 | 说明 |
|---|---|---|---|
| AI 分析 | `services/ai.ts` | ⚠️ Mock | API 调用代码已写好但注释，使用硬编码 mock |
| 建议匹配 | `services/suggestions.ts` | ✅ 完成 | 10场景 × 20条建议，按优先级匹配 |
| 本地存储 | `services/storage.ts` | ✅ 完成 | 已接入 result/history/index/record/trends |
| 分析 Store | `stores/analysis.ts` | ✅ 完成 | Zustand，流程状态管理 |
| 历史 Store | `stores/history.ts` | ✅ 完成 | Zustand，已通过 result.tsx 接入 storage |

---

## 四、设计稿复刻进度

**设计稿总数**: 44 张  |  **已映射**: 42 张  |  **页面文件**: 23 个

### ✅ 已复刻完成（20 个页面）

| 页面 | 代码文件 | 对应设计稿 |
|---|---|---|
| 首页 | `app/(tabs)/index.tsx` | 38_首页_整洁助手 |
| 扫描 | `app/(tabs)/scan.tsx` | 无独立设计稿 |
| 记录 | `app/(tabs)/history.tsx` | 05/06/19/21/32/33 (6个变体，采用新版) |
| 设置 | `app/(tabs)/settings.tsx` | 12_设置_TidyZen |
| 拍照 | `app/camera.tsx` | 10/28/37/39 (v1-v3，采用v3) |
| 分析中 | `app/analyzing.tsx` | 14/24 (过渡页 vs 简洁版，采用简洁版) |
| 分析结果 | `app/result.tsx` | 09/20/35 (含置信度版) |
| 纠错/场景 | `app/correction.tsx` | 01/23/31 (纠错版) |
| 建议详情 | `app/detail/[id].tsx` | 02/13/17/36/40 (图文指引版) |
| 视频教程 | `app/video/[id].tsx` | 07_视频教程播放界面 |
| 记录详情 | `app/record/[id].tsx` | 22/43 (整理记录详情) |
| 整理足迹 | `app/trends.tsx` | 26_整理足迹与趋势分析 |
| 个人资料 | `app/profile.tsx` | 15_个人资料_TidyZen |
| 帮助中心 | `app/help.tsx` | 03_常见问题_帮助中心 |
| 关于 | `app/about.tsx` | 18_关于_TidyZen |
| 隐私政策 | `app/privacy.tsx` | 08/41 (隐私政策与服务协议) |
| 账号安全 | `app/account.tsx` | 16_账号管理与安全 |
| 通知偏好 | `app/notification-preferences.tsx` | 44_通知偏好设置 (v2, 2026-06-17) |
| 房间模板 | `app/room-templates.tsx` | 27_房间模板管理 |
| 建议偏好 | `app/suggestion-preferences.tsx` | 11_建议库偏好 |

### ❌ 未实现（4 个设计稿页面）

| 设计稿 | 说明 | 优先级 |
|---|---|---|
| 29_修改密码_TidyZen | 独立页面 | 🟢 增强 |
| 34_我的勋章墙_TidyZen | 全新页面，成就/勋章系统 | 🟢 增强 |
| 42_服务条款 | 独立页面（privacy.tsx 只覆盖隐私政策） | 🟢 增强 |
| 25_图文整理秘籍弹窗 | 弹窗组件，可嵌入 history.tsx | 🟢 增强 |

---

## 五、开发路线图（2026-06-17 更新）

### P0 — 补齐缺失页面（设计稿 100% 覆盖）✅ 完成
> 纯 UI，无后端依赖，CC 半天搞定

- [x] **服务条款页面** — app/terms.tsx, 318 行 (ad795b5)
- [x] **修改密码页面** — app/change-password.tsx, 210 行 (ad795b5)
- [x] **整理秘籍弹窗** — components/TipsModal.tsx, 317 行 (ad795b5)
- [x] **勋章墙** — app/medals.tsx, 514 行 (ad795b5)

### P1 — 打通数据流（从"能看"到"能用"）✅ 完成
> 让拍照结果能持久化，App 算真正可用

- [x] **result.tsx → storage → history store 串联** — 分析完成后自动保存到 AsyncStorage + 更新 store (448e589)
- [x] **首页接入真实评分** — latestScore = records[0]?.score ?? 85 (448e589)
- [x] **record/[id] + trends 接入 store** — 从 useHistoryStore 读取，不再硬编码 (448e589)

### P2 — 核心能力对齐（AI 对接）
> 依赖后端服务就绪

- [ ] **services/ai.ts 对接真实 AI API** — 配置 `EXPO_PUBLIC_AI_API_URL` / `EXPO_PUBLIC_AI_API_KEY`
- [ ] **视频教程内容** — 接入真实视频资源或拍摄 15s 教程

### P3 — 上架准备
- [ ] App Store 图标 / 启动屏 / 截图
- [ ] ScoreGauge 真实 SVG 进度环（当前为简化版）
- [ ] 各页面细节打磨

### ✅ 已完成增强

- [x] 建议库偏好页面（设计稿 `11_建议库偏好`）— 2026-06-16 实现
- [x] 房间模板管理（设计稿 `27_房间模板管理`）— 2026-06-16 实现
- [x] 通知偏好页面 v2（设计稿 `44_通知偏好设置`）— 2026-06-17 CC 复刻

---

## 六、Git 历史

| Commit | 说明 |
|---|---|
| `4146f2e` | Initial commit |
| `2b0ba3e` | fix: CameraView ForwardRef 错误 |
| `dd0b5f8` | fix: camera fullScreenModal 导航 |
| `2734a90` | fix: 去掉 fullScreenModal，用普通 stack 导航 |
| `076df7f` | fix: scan tab 用 router.push 替代 Redirect |

---

## 七、设计稿迭代版本（参考）

这些是 Stitch 中的历史版本，已废弃但保留参考：

| 页面 | 当前采用 | 废弃版本 |
|---|---|---|
| 拍照 | v3 (`1a02ba19`) | v2 (`5b7efe35`)、v1 (`f932ac2c`)、无引导版 (`2082189d`) |
| 分析中 | 简洁加载版 (`baa4e173`) | 过渡页 (`f3a4005f`) |
| 分析结果 | 含置信度版 (`23ede24a`) | 旧版 (`47545b7e`)、深度版 (`23c06919`/`a8ccfbce`) |
| 场景选择 | 纠错版 (`2ad02696`) | 旧版 × 2 (`430a9abb`/`44d83b4e`) |
| 记录列表 | 新版 (`f3fd2c6f`) | 旧版 × 5 |
| 建议详情 | 图文版 (`a00a8045`) | 含视频版 (`d70ff7e5`)、放大版 × 2 |
| 通知偏好 | v2 (`44_通知偏好设置`) | v1 (旧版 Switch 样式 + 3入口导航) |
