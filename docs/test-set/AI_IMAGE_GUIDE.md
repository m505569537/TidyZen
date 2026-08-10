# TidyZen 测试集 · AI 生成照片指南

> 生成日期：2026-08-08
> 用途：S2 测试集（AI 生成版）→ S3 准确率评估 → S4 prompt 调优
> 保存位置：已放入 `docs/test-set/photos/`（20 张已生成并重命名）
> 数量：20 张（每场景 2 张，覆盖 10 场景 × 多光线/房型）
> ⚠️ 实际文件为 PNG 无损保留（1728×2304），文件名扩展名统一为 .png（如下方清单）

---

## 一、生成要求（重要，先读）

1. **风格必须是「手机随手拍」**：所有 prompt 已内置真实感指令（smartphone snapshot / amateur / no professional lighting），不要用精修摄影感图片 —— 否则 AI 识别结果和真实使用场景偏差大。
2. **画幅**：竖屏 3:4 或 9:16（手机照片比例），分辨率 1024px 以上。
3. **每张图只聚焦一个场景**：不要一张图混 5 种杂物（AI 会识别混乱），最多 2-3 种相关杂物。
4. **不要出现人物**：负向 prompt 统一加 `no people, no hands, no person`。
5. **生成后自查**：每张图对照「验收要点」确认符合，不符合就重新生成，别将就 —— 坏图会污染准确率基线。

**统一负向 prompt（所有图都加）：**
```
no people, no hands, no person, no text, no watermark, no logo, no professional photography, no studio lighting, no beauty filter, no HD sharpening
```

---

## 二、清单总览（20 张）

| # | 文件名 | 场景 | 房间 | 光线 | 核心杂物 |
|---|--------|------|------|------|----------|
| 1 | S01-001-bedroom-normal.png | S01 衣物堆积 | 卧室 | normal | clothing |
| 2 | S01-002-bedroom-bright.png | S01 衣物堆积 | 卧室 | bright | clothing |
| 3 | S02-001-living_room-normal.png | S02 纸箱/快递 | 客厅 | normal | cardboard_box |
| 4 | S02-002-living_room-bright.png | S02 纸箱/快递 | 客厅 | bright | cardboard_box |
| 5 | S03-001-desk_area-bright.png | S03 桌面杂物 | 书桌区 | bright | other_clutter, book, bottle |
| 6 | S03-002-desk_area-normal.png | S03 桌面杂物 | 书桌区 | normal | other_clutter, bottle |
| 7 | S04-001-floor-normal.png | S04 地面杂物 | 卧室地面 | normal | shoe, trash, other_clutter |
| 8 | S04-002-living_room-bright.png | S04 地面杂物 | 客厅地面 | bright | shoe, other_clutter |
| 9 | S05-001-bedroom-normal.png | S05 床上用品 | 卧室 | normal | pillow_blanket, clothing |
| 10 | S05-002-bedroom-dim.png | S05 床上用品 | 卧室 | dim | pillow_blanket, clothing |
| 11 | S06-001-desk_area-normal.png | S06 电线缠绕 | 书桌区 | normal | cable |
| 12 | S06-002-desk_area-dim.png | S06 电线缠绕 | 书桌区 | dim | cable |
| 13 | S07-001-bathroom-bright.png | S07 洗漱台瓶罐 | 浴室 | bright | bottle |
| 14 | S07-002-bathroom-normal.png | S07 洗漱台瓶罐 | 浴室 | normal | bottle |
| 15 | S08-001-desk_area-normal.png | S08 食物/外卖 | 书桌区 | normal | food_container, trash, bottle |
| 16 | S08-002-living_room-dim.png | S08 食物/外卖 | 客厅 | dim | food_container, trash |
| 17 | S09-001-bedroom-normal.png | S09 书籍/纸张 | 卧室 | normal | book |
| 18 | S09-002-desk_area-bright.png | S09 书籍/纸张 | 书桌区 | bright | book |
| 19 | S10-001-bedroom-dim.png | S10 光线/氛围 | 卧室 | dim | 整体昏暗（测光线） |
| 20 | S10-002-living_room-dim.png | S10 光线/氛围 | 客厅 | dim | 整体昏暗（测光线） |

**覆盖统计：**
- 场景：S01-S10 各 2 张 ✅
- 房型：bedroom 6 · living_room 4 · desk_area 6 · bathroom 2 · floor 2 ✅
- 光线：bright 6 · normal 9 · dim 5 ✅
- 杂物标签：clothing / cardboard_box / cable / book / bottle / food_container / shoe / pillow_blanket / trash / other_clutter 全覆盖 ✅

---

## 三、逐张生成卡片（复制 prompt 即可）

### 1. S01-001-bedroom-normal.png
**中文说明**：卧室椅子（或床沿）上堆满穿过的外套和衣服，平视视角，普通室内光线。
**验收要点**：能明显看出 ≥4 件衣物堆积，衣服是穿过的褶皱状态。
```
Realistic smartphone photo of a messy bedroom, a wooden chair piled high with worn jackets and t-shirts in a crumpled heap, clothes draped over the chair back, ordinary home interior, eye-level shot, normal indoor lighting, slightly cluttered room, amateur casual photography, 3:4 vertical
```

### 2. S01-002-bedroom-bright.png
**中文说明**：白天靠窗的卧室，床上和床脚地面散落穿过的衣物，俯视角度。
**验收要点**：衣物分散在床上+地面，能看出多件、各自独立。
```
Realistic smartphone photo of a bedroom in bright daylight near a window, several worn clothes scattered on the unmade bed and on the floor beside it, t-shirts and jeans lying crumpled, natural sunlight, top-down slightly angled view, ordinary home interior, casual amateur snapshot
```

### 3. S02-001-living_room-normal.png
**中文说明**：客厅角落/玄关处堆着 3-5 个未拆或半拆的快递纸箱，能看到胶带。
**验收要点**：≥2 个完整纸箱 + 胶带痕迹明显，纸箱是这个画面的主角。
```
Realistic smartphone photo of a living room corner with 4 unopened cardboard delivery boxes stacked messily, one box half-open with packaging tape visible, boxes scattered on the floor near the entrance, normal indoor lighting, eye-level view, ordinary home interior, casual amateur snapshot
```

### 4. S02-002-living_room-bright.png
**中文说明**：白天客厅阳台边，几个快递纸箱叠放 + 一个空纸箱压扁，光线充足。
**验收要点**：纸箱数量清晰，至少一个明显未拆封。
```
Realistic smartphone photo of a bright living room near a balcony, several cardboard moving boxes stacked unevenly, one flattened empty box leaning against the wall, brown packaging tape on the boxes, bright natural daylight, casual amateur snapshot, ordinary home interior, eye-level view
```

### 5. S03-001-desk_area-bright.png
**中文说明**：白天书桌俯视，桌面堆满零碎：笔、遥控器、水杯、零食包装、几本书、数据线。
**验收要点**：≥5 件零碎小物件，俯视 45° 角，能看清每件是什么。
```
Realistic smartphone photo of a cluttered desk taken from above at a 45 degree angle, bright daylight, the desk surface covered with scattered small items: pens, a TV remote, a water bottle, snack wrappers, a few books, loose cables, messy study desk, ordinary home, casual amateur snapshot
```

### 6. S03-002-desk_area-normal.png
**中文说明**：普通光线的餐桌/书桌俯视，桌面杂物：杯子、瓶子、包装袋、小摆件。
**验收要点**：≥5 件零碎，杂物类型和 5 号图不同（避免两张一样）。
```
Realistic smartphone photo of a dining table cluttered with daily items, top-down 45 degree view, normal indoor lighting, a coffee mug, plastic bottles, snack bags, small trinkets and papers scattered across the surface, messy everyday home table, casual amateur snapshot
```

### 7. S04-001-floor-normal.png
**中文说明**：卧室地面俯视，地上散落：拖鞋、袜子、废纸团、水瓶。
**验收要点**：≥3 件地面杂物，俯视能看清每件，这图测地面场景识别。
```
Realistic smartphone photo of a bedroom floor viewed directly from above, scattered items on the floor: a pair of slippers, a couple of rolled-up socks, crumpled paper balls, an empty water bottle, normal indoor lighting, ordinary home interior, casual amateur snapshot
```

### 8. S04-002-living_room-bright.png
**中文说明**：白天客厅地面，站着斜视角度：鞋子、玩具、杂物散落地毯上。
**验收要点**：≥3 件地面杂物，含鞋（shoe 标签）。
```
Realistic smartphone photo of a living room floor in bright daylight, standing view angled down, a pair of shoes left on the carpet, children's toys, a backpack and assorted clutter scattered on the floor, bright natural light, ordinary home interior, casual amateur snapshot
```

### 9. S05-001-bedroom-normal.png
**中文说明**：卧室床铺未整理，俯视：被子揉成一团、枕头歪斜、床单起皱，旁边堆一件睡衣。
**验收要点**：被子明显未叠 + 枕头位置乱 + 床单皱，这是 pillow_blanket 场景。
```
Realistic smartphone photo of an unmade bed viewed from above, duvet crumpled in a heap in the middle, pillows crooked and out of place, wrinkled bedsheet, a folded pajama top left on the corner of the bed, normal indoor lighting, ordinary home interior, casual amateur snapshot
```

### 10. S05-002-bedroom-dim.png
**中文说明**：晚上卧室，暖色小台灯下，床铺未整理 + 一堆衣物堆在床尾。
**验收要点**：昏暗光线下的床铺+衣物，测 dim 光下 pillow_blanket/clothing 识别。
```
Realistic smartphone photo of an unmade bed in a dim bedroom at night, warm small lamp light only, duvet twisted in a heap, several clothes piled at the foot of the bed, dark room corners, cozy dim lighting, ordinary home interior, casual amateur snapshot
```

### 11. S06-001-desk_area-normal.png
**中文说明**：书桌后方/电脑桌底，电线缠绕成团：充电线、网线、插排线交叉。
**验收要点**：≥3 条电线 + 至少一处明显缠绕/打结，平视。
```
Realistic smartphone photo behind a desk showing a tangle of cables, phone charger cables, a network cable and a power strip cord twisted and knotted together on the floor and against the wall, normal indoor lighting, eye-level close shot, ordinary home interior, casual amateur snapshot
```

### 12. S06-002-desk_area-dim.png
**中文说明**：晚上书桌区，台灯照亮桌底，电线缠绕在桌腿和插排之间。
**验收要点**：昏暗下仍能看清电线缠绕结构，测 dim 光下 cable 识别。
```
Realistic smartphone photo of a desk area in dim evening light, a desk lamp illuminating the floor under the desk, tangled cables wrapped around the desk leg and power strip, dark shadowy background, moody dim lighting, ordinary home interior, casual amateur snapshot
```

### 13. S07-001-bathroom-bright.png
**中文说明**：浴室洗手台俯视，台面堆满瓶罐：牙杯、洗面奶、护肤品、洗手液 ≥4 个。
**验收要点**：≥4 个瓶罐，俯视，这是 bottle 场景。
```
Realistic smartphone photo of a bathroom sink counter viewed from above in bright light, cluttered with at least four bottles and containers: a toothbrush cup, face wash, skincare lotion bottles, hand soap pump, water splashes on the counter, bright clean lighting, ordinary home bathroom, casual amateur snapshot
```

### 14. S07-002-bathroom-normal.png
**中文说明**：浴室台面平视，瓶罐挤在镜前：洗发水、沐浴露、护肤品、水杯。
**验收要点**：≥4 个瓶罐，平视角度，和 13 号图视角不同。
```
Realistic smartphone photo of a bathroom counter with bottles crowded in front of a mirror, shampoo bottle, body wash, skincare jars and a plastic cup standing in a row, normal indoor lighting, eye-level view, damp counter surface, ordinary home bathroom, casual amateur snapshot
```

### 15. S08-001-desk_area-normal.png
**中文说明**：书桌/茶几上：一个外卖盒（未收）、果皮、饮料瓶、零食袋。
**验收要点**：≥1 个外卖盒 + ≥1 个瓶子，这是 food_container/trash 场景。
```
Realistic smartphone photo of a desk top with a leftover takeout food container still open, orange peels, a plastic drink bottle and empty snack bags sitting on the desk, normal indoor lighting, 45 degree view, messy everyday home, casual amateur snapshot
```

### 16. S08-002-living_room-dim.png
**中文说明**：晚上客厅茶几：外卖盒、薯片袋、饮料瓶、餐巾纸，昏暗灯光。
**验收要点**：昏暗下仍能看出外卖残留物，测 dim 光下 food_container/trash 识别。
```
Realistic smartphone photo of a living room coffee table in dim evening light, leftover takeout boxes, a crumpled chip bag, drink bottles and used napkins left on the table, dark cozy room, warm dim lamp lighting, ordinary home interior, casual amateur snapshot
```

### 17. S09-001-bedroom-normal.png
**中文说明**：卧室书架平视，书摆放混乱：有横放的、书脊没朝外的、堆叠的、斜靠的。
**验收要点**：≥5 本书 + 至少一本书脊未朝外（横放/堆叠），这是 book 场景。
```
Realistic smartphone photo of a bedroom bookshelf viewed at eye level, books arranged messily: some lying flat, some stacked horizontally, some leaning diagonally with spines not facing out, a few papers tucked between books, normal indoor lighting, ordinary home interior, casual amateur snapshot
```

### 18. S09-002-desk_area-bright.png
**中文说明**：白天书桌上一摞书 + 散开纸张、笔记本，俯视 45°。
**验收要点**：≥5 本书 + 纸张散落，测书桌场景下的 book 识别。
```
Realistic smartphone photo of a desk in bright daylight, a messy stack of books and notebooks, loose papers and documents scattered around them, 45 degree top-down view, bright natural light near a window, ordinary home study desk, casual amateur snapshot
```

### 19. S10-001-bedroom-dim.png
**中文说明**：晚上卧室整体：主灯关闭，只有小台灯亮，窗帘半拉，房间昏暗，可见床和杂物轮廓。
**验收要点**：整体昏暗氛围，测 dim 光线识别（lighting=dim），杂物可有可无，重点是氛围。
```
Realistic smartphone photo of a dim bedroom at night, main ceiling light off, only a small warm desk lamp glowing, curtains half drawn, dark shadowy room with the bed and some clutter faintly visible in the low light, moody night atmosphere, casual amateur snapshot
```

### 20. S10-002-living_room-dim.png
**中文说明**：晚上客厅整体昏暗：电视柜、沙发、茶几轮廓可见，角落里堆着杂物，只有一盏落地灯亮。
**验收要点**：昏暗客厅全景，测 dim 光线识别 + 角落杂物（other_clutter）。
```
Realistic smartphone photo of a dim living room at night, only a floor lamp turned on, dark room with the sofa and TV stand visible as silhouettes, a pile of clutter in the corner, low warm lighting, moody night atmosphere, ordinary home interior, casual amateur snapshot
```

---

## 四、生成后处理

1. 把图片保存为 `docs/test-set/photos/<文件名>`（文件名严格按上方清单，不要改名）。
2. 生成工具如果只输出正方形，可以接受（AI 会 resize），但优先竖屏。
3. 全部 20 张齐了之后告诉我，我会：
   - 写 S3 评估脚本（`/tmp/aiw-verify/e2e-accuracy.py` 模式）
   - 每张图跑 AI 分析，统计：场景识别率、杂物检出率、漏识别/误识别
   - 出准确率基线报告（目标 ≥85%）
   - 根据结果做 S4 prompt 调优

---

## 五、常见问题

**Q: AI 生成图识别不准确怎么办？**
A: 优先检查是否真的符合「验收要点」。AI 生图常见问题：杂物画得太抽象（一堆色块）、光线太完美、物品太规整。不符合就重新生成，不要将就。

**Q: 可以用不同生成工具吗？**
A: 可以。prompt 是通用英文，Midjourney / Stable Diffusion / DALL-E / 即梦 / 豆包绘图都能用。工具差异会导致风格差异，混用没问题，只要每张图本身符合验收要点。

**Q: 20 张太多了，能少点吗？**
A: 最少也要 15 张（每场景 1.5 张会不均衡）。AI 生成质量参差，20 张留了挑图余量 —— 生成后发现坏图可以只重新生成那几张，不用全重来。
