# App Store Connect 提交清单 — TidyZen

**最后更新**: 2026-08-25 · P0.3 部署完成

---

## 🌐 必备公网 URL（P0.3 ✅ 已完成）

| 字段 | URL | 状态 |
|---|---|---|
| 隐私政策 URL | https://tidyzen-app.vercel.app/privacy.html | ✅ 200 · 中文 8 节 |
| 技术支持 URL | https://tidyzen-app.vercel.app/support.html | ✅ 200 · 中文 8 FAQ + 联系方式 |
| Vercel 项目 | https://vercel.com/dashboard（项目名: tidyzen-app）| ✅ Hobby 计划免费 |

**部署方式**: GitHub 集成自动部署（push main 即部署）
**Vercel 配置**: `vercel.json` (3 行) + `public/privacy.html` + `public/support.html`
**.vercelignore**: 排除 ios/android/node_modules/源码，只 deploy public/

---

## 📝 App Store Connect 填写字段

### 1. App 信息

| 字段 | 值 |
|---|---|
| App 名称 | **TidyZen · 智能房间整洁助手** |
| 副标题 | 拍照即可，AI 帮你整理 |
| 主要语言 | 简体中文 |
| 主要类别 | 健康健美 / 生活 |
| 副类别 | 工具 / 效率 |
| Bundle ID | com.anonymous.tidy-zen |
| SKU | TIDYZEN-V1 |

### 2. 隐私政策 + 技术支持

| 字段 | 值 |
|---|---|
| 隐私政策 URL | https://tidyzen-app.vercel.app/privacy.html |
| 技术支持 URL | https://tidyzen-app.vercel.app/support.html |
| 营销 URL | （留空）|

### 3. 价格与销售范围

| 字段 | 值 |
|---|---|
| 价格 | 免费 |
| App 内购买 | ¥12 解锁无限扫描 + Before/After + 视频教程（待 P3 接入 IAP）|
| 销售范围 | 仅中国大陆（先 iOS）|

### 4. App 描述

来源: `docs/app-store/description.md`（1312 字节，已生成）

### 5. 关键词

来源: `docs/app-store/keywords.md`（221 字节，已生成）

### 6. 版本说明

来源: `docs/app-store/release-notes.md`（672 字节，已生成）

### 7. 截图

**9 张 PNG**（6.7" / 6.5" / 5.5" × 3 页面）
来源: `docs/screenshots/`（设计稿高清图 + letterbox 填充）
**P0.4 待办**: 真机调试完成后用模拟器截图替换一次

---

## ✅ 提交流程

1. [x] P0.3 — 隐私政策 + 技术支持页公网部署
2. [ ] P0.4 — App Store 截图重拍（真机/模拟器）
3. [ ] 苹果开发者账号登录 https://appstoreconnect.apple.com
4. [ ] 创建 App 记录（Bundle ID: com.anonymous.tidy-zen）
5. [ ] 填入上述 7 个字段
6. [ ] 上传 9 张截图
7. [ ] 选择构建版本（需要先 Archive + Upload）
8. [ ] 提交审核

---

## 📞 联系方式（已生效）

- 邮箱: 505569537@qq.com
- Apple ID: 505569537@qq.com
- GitHub: m505569537/TidyZen
- Apple Development Team: 9RBFTZ8C6Y

---

## 🚨 已知问题与待办

- [ ] P0.4: App Store 截图重拍（等真机/模拟器调试）
- [ ] P3: 体验打磨（UI/Before-After/勋章/北极星指标）
- [ ] P3: IAP 内购接入（¥12 解锁无限）
- [ ] S11: 20 条短视频录制
- [ ] S12: 端到端真机复测

---

**部署 commit**: 8f3b70b (P0.3 部署配置 + 邮箱替换)
**部署触发**: git push origin main
**回滚方式**: Vercel Dashboard → Deployments → 选历史版本 → Promote to Production
