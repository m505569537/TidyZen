// 10个预设场景定义
import { type ScenarioId } from '../types/analysis';

export interface SceneInfo {
  id: ScenarioId;
  name: string;
  description: string;
  icon: string; // Material Icons name
  category: 'clutter' | 'ambiance'; // 杂物类 or 氛围类
}

export const SCENES: SceneInfo[] = [
  {
    id: 'S01',
    name: '衣物堆积',
    description: '椅子/床上散落衣物',
    icon: 'checkroom',
    category: 'clutter',
  },
  {
    id: 'S02',
    name: '纸箱/快递盒',
    description: '地面或桌面的快递包装',
    icon: 'inventory-2',
    category: 'clutter',
  },
  {
    id: 'S03',
    name: '桌面杂物',
    description: '书桌/餐桌零碎物品',
    icon: 'table-bar',
    category: 'clutter',
  },
  {
    id: 'S04',
    name: '地面杂物',
    description: '鞋子、散落物件阻碍走动',
    icon: 'stairs',
    category: 'clutter',
  },
  {
    id: 'S05',
    name: '床上用品',
    description: '被子没叠、枕头歪斜',
    icon: 'bed',
    category: 'clutter',
  },
  {
    id: 'S06',
    name: '电线缠绕',
    description: '数据线/插线板一团乱',
    icon: 'cable',
    category: 'clutter',
  },
  {
    id: 'S07',
    name: '洗漱台瓶罐',
    description: '卫生间瓶瓶罐罐倒伏',
    icon: 'soap',
    category: 'clutter',
  },
  {
    id: 'S08',
    name: '食物残渣/外卖',
    description: '外卖盒、零食包装',
    icon: 'fastfood',
    category: 'clutter',
  },
  {
    id: 'S09',
    name: '书籍/纸张',
    description: '书本平躺堆叠',
    icon: 'menu-book',
    category: 'clutter',
  },
  {
    id: 'S10',
    name: '光线/氛围',
    description: '房间太暗，想改善氛围',
    icon: 'light-mode',
    category: 'ambiance',
  },
];
