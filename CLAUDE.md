@AGENTS.md

## TidyZen Design System Knowledge (2026-06-16)

### Theme System
All styling uses `constants/theme.ts` tokens:
- Colors: `colors.primary` (#2d6a4f), `colors.healingGreen` (#52B788), `colors.warmAmber` (#FFB347), `colors.softBlue` (#A9D6E5), etc.
- Typography: BeVietnamPro font family (400/500/600/700/800 weights)
- Radius: sm=4, md=8, lg=16, xl=24, full=9999
- Spacing: xs=4, sm=8, md=16, lg=24, xl=32, pageMargin=24, gutter=16
- Shadows: `shadows.card` (green-tinted, shadowColor '#2d6a4f', opacity 0.08, radius 8, elevation 2)

### Component Library
- `components/ui/`: Button, Card, Tag, SegmentedControl, EmptyState
- `components/`: ScoreGauge, RecordCard, ConfidenceBadge, BoundingBox, SceneCard

### Page Architecture (after redesign task a1e99335)

**app/(tabs)/history.tsx** — Record list with:
- Dark green navbar with hamburger menu, title "整理记录", filter icon + avatar
- SegmentedControl (全部/本周/本月) in pill-shaped container (#EFEFEF, borderRadius 24)
- RecordCard list with 80x80 thumbnails (borderRadius 12), score with change pills, tags

**app/result.tsx** — Analysis result page with:
- Top bar: back arrow + "整洁得分：{score}" + info icon
- Photo with BoundingBox overlay + semi-transparent white bottom info bar
- Gold correction banner (#FFC940) when needsCorrection
- Optimization checklist items with circular 40x40 icons, confidence badges, type pills
- Ambiance tip card with title "氛围提示：黄金比例法" (condition: dim lighting)
- Capsule rescan button (borderRadius 24)

**app/record/[id].tsx** — Record detail page with:
- White header: back + "{scene}清理详情" + score badge
- Before/After comparison images side-by-side with labels
- Score improvement card (+25 points) with date/time
- AI analysis notes card with psychology icon
- Execution checklist with circular checkboxes
- Clutter items list with ConfidenceBadge
- Suggestions list with type badges
- Motivational quote card (#F0EBE5 background, large quote mark)
- Achievement badges (3 circles, unlocked/locked states)
- Share button at bottom

**app/(tabs)/index.tsx** — Home page with:
- Top bar with score display + avatar
- Circular progress ring (85%)
- Clutter alert (errorContainer background)
- Horizontal feature cards with gradient tops
- Before/After comparison card

### Store Architecture
- `stores/analysis.ts` — Zustand store for analysis flow (idle → captured → analyzing → result → correcting)
- `stores/history.ts` — Zustand store for history filter state
