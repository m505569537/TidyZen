# App Store 截图

本目录包含 App Store Connect 上传所需的截图。

## 尺寸覆盖

| 文件前缀 | 设备 | 像素尺寸 | App Store 必填位 |
|---|---|---|---|
| `6.7_iPhone15ProMax__*` | iPhone 15 Pro Max | 1290 × 2796 | 6.7" |
| `6.5_iPhone14Plus__*`   | iPhone 14 Plus    | 1284 × 2778 | 6.5" |
| `5.5_iPhone8Plus__*`    | iPhone 8 Plus     | 1242 × 2208 | 5.5" |

## 截图内容（每个尺寸 3 张）

| 后缀 | 内容 | 来源设计稿 |
|---|---|---|
| `01_home_score`      | 首页 / 趋势分析（展示整洁度评分曲线） | `docs/designs/26_整理足迹与趋势分析.png` |
| `02_analysis_result` | 分析结果页（识别框 + 整理建议列表） | `docs/designs/17_深度分析结果_TidyZen.png` |
| `03_before_after`    | 整理记录详情（Before/After 对比） | `docs/designs/22_整理记录详情.png` |

## 生成方式

截图由 `scripts/make_screenshots.py`（脚本草稿位于 `/tmp/make_screenshots.py`）
基于 `docs/designs/` 中的高保真原型生成，使用 TidyZen 主题绿
（`#2d6a4f`）做 letterbox 填充以匹配 Apple 的精确像素尺寸——保持原型
比例，不做拉伸。

> 注：在正式提交 App Store Connect 之前，建议在真机或 iOS 模拟器
> （iPhone 15 Pro Max / iPhone 14 Plus / iPhone 8 Plus）启动 App 后
> 重新截取一组真实运行截图，以替换本目录中的原型截图。
