// 建议库匹配逻辑
// 基于 AI 识别结果，按优先级排序匹配建议

import type { ClutterItem, ScenarioId, Suggestion, SuggestionType } from '../types/analysis';

/** 场景优先级排序 */
const PRIORITY_ORDER: ScenarioId[] = [
  'S04', // 地面杂物（动线安全，最高优先）
  'S08', // 食物残渣（卫生问题）
  'S01', // 衣物堆积
  'S02', // 纸箱/快递盒
  'S05', // 床上用品
  'S03', // 桌面杂物
  'S06', // 电线缠绕
  'S07', // 洗漱台瓶罐
  'S09', // 书籍/纸张
  'S10', // 光线/氛围（仅作附加建议）
];

/** 杂物标签到场景的映射 */
const CLUTTER_TO_SCENE: Record<string, ScenarioId> = {
  clothing: 'S01',
  cardboard_box: 'S02',
  book: 'S09',
  bottle: 'S07',
  food_container: 'S08',
  shoe: 'S04',
  pillow_blanket: 'S05',
  cable: 'S06',
  trash: 'S04',
  other_clutter: 'S03',
};

/** 建议库数据（从 docs/建议库.md 提取） */
const SUGGESTIONS_DB: Record<ScenarioId, Suggestion[]> = {
  S01: [
    {
      id: 'S01-A01', scenario_id: 'S01', type: 'must_do',
      difficulty: 'easy', time_cost: '3分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+40%',
      title: '椅子急救法',
      content: '1. 穿过的衣服全部挂进衣柜（哪怕只是挂着）\n2. 干净衣服叠成方块竖放（像摆书一样）\n3. 脏衣服直接踢进洗衣篮',
      acceptance_criteria: '椅子和床单露出 80% 原色',
    },
    {
      id: 'S01-A02', scenario_id: 'S01', type: 'optional',
      difficulty: 'easy', time_cost: '2分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+30%',
      title: '临时衣架墙',
      content: '在门后贴两个挂钩（若无，用衣架挂在门把手上），常穿外套挂上去。',
      acceptance_criteria: '椅面无衣物覆盖',
    },
  ],
  S02: [
    {
      id: 'S02-A01', scenario_id: 'S02', type: 'must_do',
      difficulty: 'easy', time_cost: '2分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+50%',
      title: '压扁隐身法',
      content: '1. 撕掉胶带\n2. 踩扁箱子\n3. 塞进沙发底/床底/柜子缝',
      acceptance_criteria: '地面视线内无大型纸箱阻挡',
    },
    {
      id: 'S02-A02', scenario_id: 'S02', type: 'optional',
      difficulty: 'medium', time_cost: '5分钟', items_needed: ['剪刀'],
      room_type: ['all'], expected_effect: '视觉整洁度+30% + 收纳功能',
      title: '抽屉分割器',
      content: '剪开侧面纸板，折成"田字格"放入抽屉装袜子/数据线。',
      acceptance_criteria: '抽屉内物品分隔整齐',
    },
  ],
  S03: [
    {
      id: 'S03-A01', scenario_id: 'S03', type: 'must_do',
      difficulty: 'easy', time_cost: '3分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+40%',
      title: '托盘归集法',
      content: '1. 找一个大托盘/硬纸板\n2. 把所有零碎全堆在上面\n3. 推到墙角',
      acceptance_criteria: '桌面露出 50% 以上空旷区域',
    },
    {
      id: 'S03-A02', scenario_id: 'S03', type: 'optional',
      difficulty: 'easy', time_cost: '2分钟', items_needed: ['厚字典或书×1-2'],
      room_type: ['all'], expected_effect: '视觉整洁度+30%',
      title: '书本护栏法',
      content: '用厚字典将桌面物品隔在墙边，留出工作区空白。',
      acceptance_criteria: '桌面中央区域空旷',
    },
  ],
  S04: [
    {
      id: 'S04-A01', scenario_id: 'S04', type: 'must_do',
      difficulty: 'easy', time_cost: '2分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+50%',
      title: '踢角法',
      content: '1. 地上东西全部踢到房间最不起眼的角落（床底/门后）\n2. 只留下必需品（如垃圾桶）',
      acceptance_criteria: '从门口到床边行走无遮挡',
    },
    {
      id: 'S04-A02', scenario_id: 'S04', type: 'optional',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+30%',
      title: '鞋尖朝外',
      content: '门口鞋子统一鞋尖朝外，排成一列。',
      acceptance_criteria: '鞋子排列整齐，鞋尖方向一致',
    },
  ],
  S05: [
    {
      id: 'S05-A01', scenario_id: 'S05', type: 'must_do',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+50%',
      title: '豆腐块平铺法',
      content: '1. 抓起被子抖一下\n2. 三边对齐床沿铺平\n3. 枕头拍松放床头正中',
      acceptance_criteria: '床铺颜色统一，无明显隆起',
    },
    {
      id: 'S05-A02', scenario_id: 'S05', type: 'optional',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+30%',
      title: '遮丑大法',
      content: '找大浴巾/床单盖住乱堆被褥，拉平四角。',
      acceptance_criteria: '床面颜色统一，无杂乱凸起',
    },
  ],
  S06: [
    {
      id: 'S06-A01', scenario_id: 'S06', type: 'must_do',
      difficulty: 'easy', time_cost: '3分钟', items_needed: ['长尾夹×2-3'],
      room_type: ['all'], expected_effect: '视觉整洁度+40%',
      title: '长尾夹理线',
      content: '1. 找废旧长尾夹\n2. 夹在桌子边缘\n3. 多余电线卷起穿过夹子金属圈',
      acceptance_criteria: '桌面看不到凌乱黑线团',
    },
    {
      id: 'S06-A02', scenario_id: 'S06', type: 'optional',
      difficulty: 'easy', time_cost: '2分钟', items_needed: ['空纸巾盒×1'],
      room_type: ['all'], expected_effect: '视觉整洁度+35%',
      title: '纸巾盒收纳',
      content: '插线板放进空纸巾盒，只露插头。',
      acceptance_criteria: '插线板不可见，只有插头露出',
    },
  ],
  S07: [
    {
      id: 'S07-A01', scenario_id: 'S07', type: 'must_do',
      difficulty: 'easy', time_cost: '2分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+40%',
      title: '靠墙排队法',
      content: '1. 瓶子全部拧好盖子\n2. 瓶身擦干水渍\n3. 统一靠墙排直线',
      acceptance_criteria: '所有瓶口朝向一致',
    },
    {
      id: 'S07-A02', scenario_id: 'S07', type: 'optional',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+25%',
      title: '牙刷入杯',
      content: '牙刷头朝上入杯，杯底擦干。',
      acceptance_criteria: '牙刷不在台面平躺',
    },
  ],
  S08: [
    {
      id: 'S08-A01', scenario_id: 'S08', type: 'must_do',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+60% + 卫生改善',
      title: '打包带走法',
      content: '1. 垃圾塞进最大袋子\n2. 系紧袋口\n3. 放到门口（出门必带）',
      acceptance_criteria: '桌面无任何食物残留',
    },
    {
      id: 'S08-A02', scenario_id: 'S08', type: 'optional',
      difficulty: 'easy', time_cost: '2分钟', items_needed: ['湿纸巾'],
      room_type: ['all'], expected_effect: '视觉整洁度+40% + 卫生改善',
      title: '清空桌面',
      content: '用湿纸巾擦一遍桌面油渍，外卖盒全部扔掉。',
      acceptance_criteria: '桌面无油渍、无食物包装',
    },
  ],
  S09: [
    {
      id: 'S09-A01', scenario_id: 'S09', type: 'must_do',
      difficulty: 'easy', time_cost: '3分钟', items_needed: [],
      room_type: ['all'], expected_effect: '视觉整洁度+40%',
      title: '书脊朝外',
      content: '1. 书全部立起来\n2. 书脊朝外\n3. 最高放两边，最矮放中间',
      acceptance_criteria: '书籍全部竖立，书脊朝外可见，顶部平整',
    },
    {
      id: 'S09-A02', scenario_id: 'S09', type: 'optional',
      difficulty: 'easy', time_cost: '2分钟', items_needed: ['快递纸箱×1'],
      room_type: ['all'], expected_effect: '视觉整洁度+30%',
      title: '杂志筐替代',
      content: '快递纸箱立着放书，挡住书脊，变废为宝。',
      acceptance_criteria: '书脊不可见，纸箱外观整洁',
    },
  ],
  S10: [
    {
      id: 'S10-A01', scenario_id: 'S10', type: 'must_do',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '氛围感+50%',
      title: '黄金比例法',
      content: '1. 窗帘拉开到窗户宽度的 2/3\n2. 打开主灯\n3. 关掉杂乱小台灯',
      acceptance_criteria: '房间无阴暗死角',
    },
    {
      id: 'S10-A02', scenario_id: 'S10', type: 'optional',
      difficulty: 'easy', time_cost: '1分钟', items_needed: [],
      room_type: ['all'], expected_effect: '氛围感+30%',
      title: '床铺采光',
      content: '枕头移到靠窗侧，让阳光照床。',
      acceptance_criteria: '床铺区域有自然光照射',
    },
  ],
};

/** 根据 AI 识别结果匹配建议 */
export function matchSuggestions(
  items: ClutterItem[],
  scene: string,
  lighting: string
): Suggestion[] {
  // 确定匹配的场景
  const matchedScenes = new Set<ScenarioId>();

  for (const item of items) {
    const sceneId = CLUTTER_TO_SCENE[item.label];
    if (sceneId) matchedScenes.add(sceneId);
  }

  // 按优先级排序
  const sortedScenes = PRIORITY_ORDER.filter((s) => matchedScenes.has(s));

  const suggestions: Suggestion[] = [];

  // 主建议：优先级最高的场景
  if (sortedScenes.length > 0) {
    const primaryScene = sortedScenes[0];
    const primarySuggestion = SUGGESTIONS_DB[primaryScene]?.find((s) => s.type === 'must_do');
    if (primarySuggestion) suggestions.push(primarySuggestion);
  }

  // 备选建议：第二优先场景
  if (sortedScenes.length > 1) {
    const secondaryScene = sortedScenes[1];
    const secondarySuggestion = SUGGESTIONS_DB[secondaryScene]?.find((s) => s.type === 'optional');
    if (secondarySuggestion) suggestions.push(secondarySuggestion);
  }

  // 光线/氛围建议（附加，不占主/备选名额）
  if (lighting === 'dim' && !sortedScenes.includes('S10')) {
    const ambianceSuggestion = SUGGESTIONS_DB.S10.find((s) => s.type === 'must_do');
    if (ambianceSuggestion) suggestions.push(ambianceSuggestion);
  }

  return suggestions;
}

/** 根据用户手动选择的场景匹配建议 */
export function matchSuggestionsByScenarios(scenarioIds: ScenarioId[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (let i = 0; i < Math.min(scenarioIds.length, 2); i++) {
    const sceneId = scenarioIds[i];
    const type: SuggestionType = i === 0 ? 'must_do' : 'optional';
    const suggestion = SUGGESTIONS_DB[sceneId]?.find((s) => s.type === type);
    if (suggestion) suggestions.push(suggestion);
  }

  return suggestions;
}
