# TidyZen 按钮 / 数据真实性审计

> 审计时间：2026-08-12
> 审计方式：grep + 逐行读 + 行号定位（非凭印象/文档推断）
> 审计范围：app/ 下 24 个 .tsx 页面 + components/
> 审计口径：分四类——死按钮 / Alert 占位 / 假数据 / 导航孤岛
> 上次更新：无（首次完整审计）
> 触发原因：用户 2026-08-12 指出 settings 页"好多按钮没实现"，本审计证明这只是冰山一角

---

## 0. 概览

| 类别 | 数量 | 严重度 | 修法 |
|---|---|---|---|
| **A. 死按钮**（点了完全没反应） | **20** | 🔴 App Store 红线 | 批量加 Alert / 路由跳转 |
| **B. Alert 占位**（弹"功能开发中"） | **9** | 🟡 已合规不阻塞 | 真实实现 / 保留 Alert |
| **C. 假数据**（硬编码冒充真实值） | **5** | 🟡 严重误导用户 | 接 AsyncStorage / 动态算 |
| **D. 导航孤岛**（页面有但 push 不到） | **≥1** | 🟡 隐藏功能 | 补 router.push |

**总计 35 处问题**（比之前 MVP_ACCEPTANCE §7.4 漏报的 8 个多 27 个）。

**修复总估时**：约 1-1.5 天本地可做的工作 + 后端依赖 5 个（见 §5）。

---

## 1. A 类：死按钮（20 个）— App Store 审核 Guideline 2.2 红线

**判定标准**：`<TouchableOpacity>` / `<Pressable>` 节点**完全没有 onPress**（既不路由、不弹 Alert、不 setState、不调函数）。

| # | 文件:行 | 元素 | 用户预期 | 建议修法 |
|---|---|---|---|---|
| 1 | `app/(tabs)/index.tsx:207` | 核心功能卡片"操作"按钮 | 进入对应功能 | 跳 `/scan` 或按 buttonVariant 路由 |
| 2 | `app/(tabs)/index.tsx:283` | "查看全部" 链接 | 展开全部卡片 | 跳 `/trends` 或弹 Modal 列表 |
| 3 | `app/(tabs)/history.tsx:30` | 汉堡菜单 | 打开侧边栏 | 跳 `/settings` 或临时弹 Modal |
| 4 | `app/(tabs)/history.tsx:39` | 筛选图标 | 弹出筛选 | 已实现 SegmentedControl，icon 跳转可加或删 |
| 5 | `app/(tabs)/history.tsx:42` | 头像 | 跳"我的" | `router.push('/(tabs)/profile')` |
| 6 | `app/(tabs)/profile.tsx:107` | 顶部"保存" | 保存昵称/性别 | `onPress={handleSave}` |
| 7 | `app/(tabs)/profile.tsx:117` | 头像相机 | 换头像 | `expo-image-picker` + AsyncStorage 存 URI |
| 8 | `app/(tabs)/profile.tsx:217` | 底部"保存" | 保存表单 | 同 #6 |
| 9 | `app/about.tsx:62` | 官方链接卡片 | 跳官网/邮件 | 4 个链接 → 4 个 `Linking.openURL` |
| 10 | `app/camera.tsx:248` | 闪光灯 | 切换 flash mode | 接 CameraView flash prop + toggle state |
| 11 | `app/detail/[id].tsx:67` | 右上角 info | 显示建议元信息 | 弹 Modal 显示 suggestion 数据 |
| 12 | `app/help.tsx:69` | "在线联系客服" | 联系客服 | `Linking.openURL('mailto:support@...')` |
| 13 | `app/help.tsx:72` | "反馈建议" | 反馈 | `Linking.openURL('mailto:feedback@...')` |
| 14 | `app/privacy.tsx:213` | "联系法务团队" | 联系法务 | `Linking.openURL('mailto:legal@...')` |
| 15 | `app/privacy.tsx:225` | 悬浮客服按钮 | 客服 | 同 #12 |
| 16 | `app/record/[id].tsx:220` | "分享清理成果" | 分享 | `Share.share()` API |
| 17 | `app/result.tsx:90` | 右上角 info | 显示置信度说明 | 弹 Modal 解释置信度分级 |
| 18 | `app/suggestion-preferences.tsx:139` | 搜索图标 | 搜建议 | 弹搜索 Modal / 跳搜索页 |
| 19 | `app/suggestion-preferences.tsx:142` | 头像 | 跳"我的" | `router.push('/(tabs)/profile')` |
| 20 | `app/settings.tsx:62` | "账号绑定" 整行 | 跳账号绑定 | 弹 Alert / 跳 `/account` |

### 修复路径（两选一）

**方案 1：批量补 Alert**（30 分钟）— 把所有 🔴 级加 `onPress={() => Alert.alert(...)}` 保住审核
**方案 2：按建议修法实现**（1-1.5 天）— 多数能本地做（`Linking.openURL` / `router.push` / `Share.share`）

**推荐**：先方案 1（保住 App Store），再按高 ROI 挑几个做方案 2。

---

## 2. B 类：Alert 占位（9 个）— 弹"功能开发中 v1.1 上线"

**判定标准**：`Alert.alert('功能开发中', ...)` 模式出现位置。

| # | 文件:行 | 按钮 | 真实依赖 | 备注 |
|---|---|---|---|---|
| 1 | `app/account.tsx:36` | 手机·修改 | **后端**（短信验证） | 必弹 Alert |
| 2 | `app/account.tsx:49` | 微信·解绑 | **后端**（OAuth） | 必弹 Alert |
| 3 | `app/account.tsx:62` | 邮箱·绑定 | **后端**（邮件验证） | 必弹 Alert |
| 4 | `app/account.tsx:128-132` | 改密码·提交 | **后端** | 已加 4 条本地校验，提交后弹 |
| 5 | `app/account.tsx:150-159` | 注销账号 | **后端**（云端删除） | 已加二次确认 |
| 6 | `app/settings.tsx:77` | 房间模板管理 | ✅ **页面已存在** | 立即可修：换 `router.push('/room-templates')` |
| 7 | `app/settings.tsx:82` | 建议库偏好 | ✅ **页面已存在** | 立即可修：换 `router.push('/suggestion-preferences')` |
| 8 | `app/settings.tsx:121` | 退出登录 | ⚠️ **本地可做** | 弹 Alert 前可清 store/storage + 回首页 |
| 9 | `app/settings.tsx:115-123` | 退出登录·二次确认 | ⚠️ **本地可做** | 同上 |

**注意**：`#6 #7` 是文档里说"功能开发中 v1.1 上线"但页面文件已存在的情况 — 是我之前判断错"功能做完了"的关键证据。

---

## 3. C 类：假数据（5 处）— 硬编码冒充真实值

**判定标准**：`useState` 初始值 / 渲染时直接写死的"看起来像数据"的字符串。

| # | 文件:行 | 字段 | 当前值 | 真实修法 |
|---|---|---|---|---|
| 1 | `app/(tabs)/profile.tsx:77` | 昵称 | `useState('陈洁')` | 从 AsyncStorage `@tidyzen/profile` 读，无则用默认 |
| 2 | `app/(tabs)/profile.tsx:78` | 性别 | `useState('male')` | 同上 |
| 3 | `app/(tabs)/profile.tsx:141` | 称号 | `'极简主义新星'` 硬编码 | 按 `deriveLevel(totalScans)` 动态算（已有 deriveLevel 函数！） |
| 4 | `app/settings.tsx:53` | 等级标签 | `☆ Lv.3 整理达人` 硬编码 | 接 store.records 真实算 |
| 5 | `app/settings.tsx:95` | 缓存大小 | `124 MB` 字符串 | 用 `FileSystem.getInfoAsync` 算 `documentDirectory/` 实际占用 |

**隐藏 bug**：`profile.tsx` 已有 `useFocusEffect` 从 `getHistoryRecords` 读真实数据生成 stats，但昵称/性别却是 useState 初始值 → 用户改了不存 → 切走就丢。这与 stats 的真实数据流割裂。

---

## 4. D 类：导航孤岛（≥1 个）— 页面有但 push 不到

**判定方法**：列所有 page 文件，对比所有 `router.push('/xxx')` 调用。

| 页面 | router.push 引用 | 状态 |
|---|---|---|
| `/change-password` | 0 | 🔴 **孤儿页**：account.tsx 跳到 `/account` 复用表单，但 `/change-password` 文件还在 |
| `/terms` | 0 | 🔴 **孤儿页**：settings 没跳，account 没跳 |
| `/trends` | 1 | ✅ profile.tsx 入口存在 |
| 其他详见 `docs/设计稿→代码映射` | — | — |

**待用户拍板**：
- `/change-password` 是删除（account 已集成）还是补入口？
- `/terms` 是补入口（加到 settings/隐私政策旁）还是删除？

---

## 5. 后端依赖（必等后端才能完整实现的 5 个按钮）

| 按钮 | 真实依赖 | 当前状态 | 何时可做 |
|---|---|---|---|
| 修改手机号 | 短信验证码 | Alert 占位 | 后端 + 短信网关 |
| 微信绑定/解绑 | OAuth 2.0 | Alert 占位 | 后端 + 微信开放平台 |
| 邮箱绑定 | 邮件验证 | Alert 占位 | 后端 + SMTP |
| 修改密码 | 后端 auth API | 4 条本地校验 + Alert | 后端 |
| 注销账号 | 后端 + 云端数据删除 | 二次确认 + Alert | 后端 + GDPR 合规流程 |

**当前 MVP 不做这 5 个**（用户曾说"没用户不做后端"）。Alert 占位是合规方案。

---

## 6. 修复路径与建议

### 第一批：保 App Store 审核（30 分钟）
- 把 §1 中所有死按钮加 `onPress={() => Alert.alert('功能开发中', '预计 v1.1 上线')}` 兜底
- 特别处理 #1 #2 #3 #5（主页 0 反馈的，体验最差）
- 顺便把 §2 #6 #7 改成 `router.push`（页面已存在，5 分钟）

### 第二批：本地可做的高 ROI（1-1.5 天）
- §3 全部 5 处假数据（1-2 小时，profile/settings 两个文件搞定）
- §1 #6 #7 #8（profile 头像/保存/顶部保存，30 分钟）
- §1 #9 #12 #13 #14 #15（about/help/privacy 邮箱/客服/法务，`Linking.openURL` 一行解决，30 分钟）
- §1 #16（record 分享，`Share.share()` 10 分钟）
- §1 #10（camera 闪光灯，30 分钟）
- §2 #8 #9（退出登录清 store/storage + 回首页，1-2 小时）
- §4 导航孤岛拍板后修（10 分钟）

### 第三批：需要小功能新增的（半天）
- §1 #1 #2（主页"操作"按钮 + "查看全部"，需思考跳哪里 / 弹什么）
- §1 #17（result info 弹 Modal，10 分钟）
- §1 #4（history 筛选图标，建议直接干掉，筛选用 SegmentedControl 已有）

### 不做（等后端）
- §5 全部 5 个

---

## 7. 验证清单

修完后用以下命令再次扫描，**目标 TouchableOpacity 真空率 = 0%**：

```bash
cd ~/web/ll/proving-ground/TidyZen
python3 -c "
import re, pathlib
APP = pathlib.Path('app')
for p in sorted(APP.rglob('*.tsx')):
    if p.name == '_layout.tsx': continue
    c = p.read_text(encoding='utf-8', errors='ignore')
    touch = len(re.findall(r'<TouchableOpacity\b', c)) + len(re.findall(r'<Pressable\b', c))
    press = len(re.findall(r'\bonPress=', c))
    if touch > 0 and touch > press:
        print(f'{p.relative_to(APP.parent)}: {touch-press} 个无 onPress ({touch-press}/{touch})')
"
```

---

## 8. 修复记录（边修边回填）

| Commit | 内容 | 状态 |
|---|---|---|
| （待） | 修复 #1-#20 死按钮（方案 1 批量 Alert） | ⏳ |
| （待） | 修复 #6 #7 (settings→templates/prefs) | ⏳ |
| （待） | 修复 §3 假数据 5 处 | ⏳ |
| （待） | 修复 #6 #7 #8 profile 头像/保存 | ⏳ |
| （待） | 修复 #9 #12-15 邮箱/mailto | ⏳ |
| （待） | 修复 #16 record 分享 | ⏳ |
| （待） | 修复 #10 camera 闪光灯 | ⏳ |
| （待） | 修复退出登录清状态 | ⏳ |
| （待） | 修复 #1 #2 主页按钮 | ⏳ |
| （待） | 修复 #4 history 筛选图标 | ⏳ |

---

## 9. 相关文档

- `docs/MVP_ACCEPTANCE.md` §7.4 — 历史审计（只覆盖 account 5 + settings 3 = 8 个，漏 27 个）
- `docs/PROJECT_STATUS.md` 八 — 已知问题（4 条，全部相关）
- `docs/DEVELOPMENT_PLAN.md` — 待更新到 RELEASE_PLAN.md
- `docs/RELEASE_PLAN.md` — 即将新建的开发计划
