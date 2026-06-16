# TidyZen 项目状态

> 最后更新: 2026-06-16
> Stitch 设计稿项目: `projects/12020854547316763944`（小徐的整理助手）

---

## 一、设计稿 → 代码 精确映射

### Tab 页面

| 代码文件 | 路由 | 设计稿名称 | 设计稿 ID |
|---|---|---|---|
| `app/(tabs)/index.tsx` | `/(tabs)/index` | 首页 - 整洁助手 | `ca284524557a40e79220171599fcc11f` |
| `app/(tabs)/scan.tsx` | `/(tabs)/scan` | （无独立设计稿，纯跳转逻辑） | — |
| `app/(tabs)/history.tsx` | `/(tabs)/history` | 整理记录列表 - TidyZen (新版) | `f3fd2c6f83c44f06a213eea248dd70f2` |
| `app/(tabs)/profile.tsx` | `/(tabs)/profile` | 个人资料 - TidyZen | `608e6018d5ac475694f77ee7315e034e` |

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
| `app/settings.tsx` | `/settings` | 设置 - TidyZen | `2ba523f848774f48ad89bc058bfaa6a5` |
| `app/help.tsx` | `/help` | 常见问题 - 帮助中心 | `cce82e5029da401e8abcb1841c0aa087` |
| `app/about.tsx` | `/about` | 关于 TidyZen | `5ed3f5382e4c45aa891b0d5c3f44aff2` |
| `app/privacy.tsx` | `/privacy` | 隐私政策与服务协议 | `e5a9b6f546ab46a6aa114dbef6691c52` |
| `app/account.tsx` | `/account` | 账号管理与安全 | `0a66e8f3ed8a4acd89a510721abe492a` |

---

## 二、各页面开发状态

| 页面 | 路由 | UI 完成度 | 数据流 | 备注 |
|---|---|---|---|---|
| 首页 | `/(tabs)/index` | ✅ 完成 | ⚠️ Mock | 评分卡片显示 `--`，无真实数据 |
| 扫描 Tab | `/(tabs)/scan` | ✅ 完成 | ✅ 完成 | 纯跳转逻辑 |
| 记录 Tab | `/(tabs)/history` | ✅ 完成 | ❌ Mock | `MOCK_RECORDS` 硬编码，未接 store |
| 我的 Tab | `/(tabs)/profile` | ✅ 完成 | ❌ Mock | 统计数据硬编码 |
| 拍照 | `/camera` | ✅ 完成 | ✅ 完成 | 权限 + 拍照 + base64 |
| 分析中 | `/analyzing` | ✅ 完成 | ⚠️ Mock | 1.5s 延时后调 mock AI |
| 分析结果 | `/result` | ✅ 完成 | ⚠️ Mock | mock 数据，无真实 API |
| 纠错/场景 | `/correction` | ✅ 完成 | ⚠️ Mock | 选场景后重调 mock AI |
| 建议详情 | `/detail/[id]` | ✅ 完成 | ❌ Mock | `suggestion` 对象硬编码 |
| 视频教程 | `/video/[id]` | ⚠️ 占位 | ❌ 无 | 只有播放图标，无视频 |
| 记录详情 | `/record/[id]` | ✅ 完成 | ❌ Mock | `record` 对象硬编码 |
| 整理足迹 | `/trends` | ✅ 完成 | ❌ Mock | `TREND_DATA` 硬编码 |
| 设置 | `/settings` | ✅ 完成 | ⚠️ 部分 | 开关有本地状态，清除功能未接 |
| 帮助中心 | `/help` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 关于 | `/about` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 隐私政策 | `/privacy` | ✅ 完成 | ✅ 完成 | 纯静态 |
| 账号安全 | `/account` | ✅ 完成 | ❌ 无 | 所有按钮无功能 |

---

## 三、服务层状态

| 模块 | 文件 | 状态 | 说明 |
|---|---|---|---|
| AI 分析 | `services/ai.ts` | ⚠️ Mock | API 调用代码已写好但注释，使用硬编码 mock |
| 建议匹配 | `services/suggestions.ts` | ✅ 完成 | 10场景 × 20条建议，按优先级匹配 |
| 本地存储 | `services/storage.ts` | ✅ 完成 | AsyncStorage CRUD，但页面未接入 |
| 分析 Store | `stores/analysis.ts` | ✅ 完成 | Zustand，流程状态管理 |
| 历史 Store | `stores/history.ts` | ✅ 完成 | Zustand，但未接入 storage service |

---

## 四、待办事项

### 🔴 阻塞项

- [ ] **对接真实 AI API** — `services/ai.ts` 中取消注释并配置 `EXPO_PUBLIC_AI_API_URL` / `EXPO_PUBLIC_AI_API_KEY`
- [ ] **打通历史记录数据流** — `history.tsx` 替换 `MOCK_RECORDS` 为 store + storage
- [ ] **首页接入真实数据** — 显示最新分析评分

### 🟡 重要

- [ ] **视频内容** — 拍摄/制作 15 秒教程短视频
- [ ] **record/[id] 接入真实数据** — 从 store/storage 读取而非硬编码
- [ ] **trends 接入真实数据** — 从 storage 读取历史记录计算趋势
- [ ] **detail/[id] 接入真实数据** — 从 result 的 suggestions 数组读取而非硬编码
- [ ] **设置页功能** — 清除记录、建议偏好选择

### 🟢 增强

- [ ] 修改密码页面（设计稿 `8b89e986e67b4075aec03d775f952ed8`）
- [ ] 勋章墙（设计稿 `da4f99bb7fca45ab8e478d93c2d756c4`）
- [ ] 建议库偏好页面（设计稿 `b5199e56d46f419e94ed689b09551153`）
- [ ] 房间模板管理（设计稿 `e0c84393752945698654ee40b07c9e34`）
- [ ] 深度分析结果增强版（设计稿 `23c06919277841dd9ee70b79c50bc145`）
- [ ] 图文整理秘籍弹窗（设计稿 `a1fdeba492f342daae83bb97aa24b9dd`）
- [ ] 细节诊断放大查看（设计稿 `819c212c652141258cbf15ba9933deb3`）
- [ ] ScoreGauge 真实 SVG 进度环（当前为简化版）

---

## 五、Git 历史

| Commit | 说明 |
|---|---|
| `4146f2e` | Initial commit |
| `2b0ba3e` | fix: CameraView ForwardRef 错误 |
| `dd0b5f8` | fix: camera fullScreenModal 导航 |
| `2734a90` | fix: 去掉 fullScreenModal，用普通 stack 导航 |
| `076df7f` | fix: scan tab 用 router.push 替代 Redirect |

---

## 六、设计稿迭代版本（参考）

这些是 Stitch 中的历史版本，已废弃但保留参考：

| 页面 | 当前采用 | 废弃版本 |
|---|---|---|
| 拍照 | v3 (`1a02ba19`) | v2 (`5b7efe35`)、v1 (`f932ac2c`)、无引导版 (`2082189d`) |
| 分析中 | 简洁加载版 (`baa4e173`) | 过渡页 (`f3a4005f`) |
| 分析结果 | 含置信度版 (`23ede24a`) | 旧版 (`47545b7e`)、深度版 (`23c06919`/`a8ccfbce`) |
| 场景选择 | 纠错版 (`2ad02696`) | 旧版 × 2 (`430a9abb`/`44d83b4e`) |
| 记录列表 | 新版 (`f3fd2c6f`) | 旧版 × 5 |
| 建议详情 | 图文版 (`a00a8045`) | 含视频版 (`d70ff7e5`)、放大版 × 2 |
