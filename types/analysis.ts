// 分析相关 TypeScript 类型定义

/** AI 模型返回的杂物项 */
export interface ClutterItem {
  label: ClutterLabel;
  display_name: string;
  count: number;
  bbox: [number, number, number, number]; // [x, y, w, h] 归一化坐标 0-1
  area_ratio: number;
  confidence: number;
}

/** 杂物标签类型 */
export type ClutterLabel =
  | 'clothing'
  | 'cardboard_box'
  | 'cable'
  | 'book'
  | 'bottle'
  | 'food_container'
  | 'shoe'
  | 'pillow_blanket'
  | 'trash'
  | 'other_clutter';

/** 场景类型 */
export type SceneLabel =
  | 'bedroom'
  | 'living_room'
  | 'bathroom'
  | 'desk_area'
  | 'floor';

/** 光线条件 */
export type Lighting = 'bright' | 'normal' | 'dim';

/** 场景 ID（10个预设场景） */
export type ScenarioId =
  | 'S01' // 衣物堆积
  | 'S02' // 纸箱/快递盒
  | 'S03' // 桌面杂物
  | 'S04' // 地面杂物
  | 'S05' // 床上用品
  | 'S06' // 电线缠绕
  | 'S07' // 洗漱台瓶罐
  | 'S08' // 食物残渣/外卖
  | 'S09' // 书籍/纸张
  | 'S10'; // 光线/氛围

/** 建议类型 */
export type SuggestionType = 'must_do' | 'optional';

/** 难度等级 */
export type Difficulty = 'easy' | 'medium';

/** 房型 */
export type RoomType = 'small' | 'medium' | 'all';

/** 建议元数据 */
export interface SuggestionMeta {
  id: string;
  difficulty: Difficulty;
  time_cost: string;
  items_needed: string[];
  room_type: RoomType[];
  expected_effect: string;
  type: SuggestionType;
}

/** 单条建议 */
export interface Suggestion extends SuggestionMeta {
  scenario_id: ScenarioId;
  title: string;
  content: string; // 步骤描述（含 markdown）
  acceptance_criteria: string;
  video_id?: string;
  image_url?: string;
}

/** AI 分析 API 请求 */
export interface AnalysisRequest {
  imageBase64: string;
  roomType?: SceneLabel;
}

/** AI 分析 API 响应（云端模型返回的原始 JSON） */
export interface AnalysisRawResponse {
  scene: string;
  clutter_items: ClutterItem[];
  lighting: Lighting;
  overall_notes: string;
}

/** 分析结果（经过后处理） */
export interface AnalysisResult {
  id: string;
  score: number; // 0-100
  scene: SceneLabel;
  lighting: Lighting;
  clutterItems: ClutterItem[];
  overallNotes: string;
  suggestions: Suggestion[];
  // 置信度相关
  maxConfidence: number; // 所有识别项中的最高置信度
  needsCorrection: boolean; // 是否需要用户纠错（最高置信度 < 0.6）
  // 时间戳
  createdAt: string;
  // 照片
  photoUri: string; // 本地照片路径
  thumbnailUri?: string; // 缩略图路径
}

/** 历史记录摘要（用于列表展示） */
export interface HistoryRecord {
  id: string;
  score: number;
  createdAt: string;
  thumbnailUri?: string;
  clutterTags: string[]; // 杂物标签中文名列表
  scoreChange?: number; // 与上次的分数差（正=提升，负=下降，undefined=首次）
}

/** 杂物类型权重（用于评分计算） */
export const CLUTTER_WEIGHTS: Record<ClutterLabel, number> = {
  clothing: 1.2,
  cardboard_box: 1.5,
  food_container: 1.3,
  trash: 1.4,
  cable: 0.8,
  book: 0.7,
  bottle: 0.6,
  shoe: 0.7,
  pillow_blanket: 1.0,
  other_clutter: 1.0,
};

/** 杂物标签中文映射 */
export const CLUTTER_LABEL_CN: Record<ClutterLabel, string> = {
  clothing: '衣物',
  cardboard_box: '纸箱/快递盒',
  cable: '电线',
  book: '书籍/纸张',
  bottle: '瓶罐',
  food_container: '外卖/食物',
  shoe: '鞋子',
  pillow_blanket: '被褥/枕头',
  trash: '垃圾',
  other_clutter: '其他杂物',
};
