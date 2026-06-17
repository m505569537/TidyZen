import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// ── 颜色规范（per docs/designs/terms_design.md） ──
const PAGE_BG = '#FFFFFF';
const PRIMARY = '#0F5238';
const HEADING = '#191C1D';
const BODY = '#404943';
const META = '#707973';
const DIVIDER = '#E1E3E4';

// ── 服务条款数据 ──
type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

type Section = {
  title: string;
  blocks: Block[];
};

const SECTIONS: Section[] = [
  {
    title: '一、服务说明',
    blocks: [
      {
        type: 'paragraph',
        text: '欢迎使用 TidyZen 应用。在使用本应用前，请仔细阅读以下服务条款。本条款适用于您对 TidyZen 移动应用、网站及相关服务的使用。一旦您开始使用本服务，即视为您已充分理解并同意接受本条款的全部约定。',
      },
      {
        type: 'paragraph',
        text: 'TidyZen 是一款基于 AI 视觉识别技术的房间整洁度分析与整理建议工具，旨在帮助用户识别居住空间中的杂物、提供个性化整理建议，并通过历史记录追踪整理进度。本服务仅作为辅助参考工具使用。',
      },
    ],
  },
  {
    title: '二、用户责任',
    blocks: [
      {
        type: 'paragraph',
        text: '使用本服务时，您应承诺并保证：',
      },
      {
        type: 'list',
        items: [
          '所拍摄并上传的照片内容合法，不侵犯任何第三方的隐私权、肖像权或其他合法权益。',
          '不利用本服务进行任何违反国家法律法规、社会公序良俗或社区准则的行为。',
          '自行判断并验证 AI 提供的整理建议在您具体场景下的适用性与安全性。',
          '妥善保管账户信息，对您账户下发生的所有活动承担责任。',
        ],
      },
    ],
  },
  {
    title: '三、知识产权',
    blocks: [
      {
        type: 'paragraph',
        text: 'TidyZen 应用本身、相关图标、商标、文案、设计、代码及 AI 模型的所有知识产权归 TidyZen Inc. 及其关联方所有，受相关法律法规保护。',
      },
      {
        type: 'paragraph',
        text: '您在使用过程中所创建的内容（如拍摄的照片、整理记录），其原始权利归您所有。为提供并优化服务之必要，您授予我们对相关数据进行处理与展示的有限许可。',
      },
    ],
  },
  {
    title: '四、免责声明',
    blocks: [
      {
        type: 'list',
        items: [
          'TidyZen 不保证 AI 分析结果的绝对准确性，分析结果仅供参考，不构成任何形式的承诺或建议。',
          '您因依赖 AI 建议进行整理而产生的任何后果，应由您自行承担。',
          '因网络故障、设备问题、不可抗力或第三方服务中断等原因导致服务无法正常使用的，我们在法律允许的范围内不承担相应责任。',
          '在任何情况下，我们对因使用或无法使用本服务而产生的间接、偶然或后果性损失均不承担责任。',
        ],
      },
    ],
  },
  {
    title: '五、服务变更与终止',
    blocks: [
      {
        type: 'paragraph',
        text: '我们保留根据业务发展需要，对本服务的全部或部分功能进行新增、调整、暂停或终止的权利。如发生重大变更，我们将通过应用内通知或其他合理方式提前告知您。',
      },
      {
        type: 'paragraph',
        text: '若您违反本条款的任何约定，我们有权在不另行通知的情况下暂停或终止向您提供服务，并保留追究相关责任的权利。',
      },
    ],
  },
  {
    title: '六、条款修订',
    blocks: [
      {
        type: 'paragraph',
        text: '我们可能根据法律法规更新或业务调整对本条款进行不定期修订。修订后的条款将在应用内公布，并自公布之日起生效。如您不同意修订内容，应停止使用本服务；继续使用即视为您接受修订后的条款。',
      },
    ],
  },
  {
    title: '七、法律适用与争议解决',
    blocks: [
      {
        type: 'paragraph',
        text: '本条款的订立、解释、履行及争议解决均适用中华人民共和国法律。因本条款引发的任何争议，双方应首先通过友好协商解决；协商不成的，任何一方均可向 TidyZen Inc. 注册地有管辖权的人民法院提起诉讼。',
      },
    ],
  },
];

export default function TermsScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@tidyzen.app');
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <SafeAreaView edges={['top']} style={styles.navSafeArea}>
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>服务条款</Text>
          {/* 右侧占位，保持标题居中 */}
          <View style={styles.navRightPlaceholder} />
        </View>
        <View style={styles.navDivider} />
      </SafeAreaView>

      {/* 主体内容滚动区 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 页面主标题 */}
        <Text style={styles.pageTitle}>TidyZen 服务条款</Text>

        {/* 更新日期 */}
        <Text style={styles.metaDate}>最后更新日期：2026年6月1日</Text>

        {/* 正文章节 */}
        {SECTIONS.map((section, i) => (
          <View key={i}>
            <Text style={[styles.sectionTitle, i === 0 && styles.sectionTitleFirst]}>
              {section.title}
            </Text>
            {section.blocks.map((block, j) => {
              if (block.type === 'paragraph') {
                return (
                  <Text key={j} style={styles.paragraph}>
                    {block.text}
                  </Text>
                );
              }
              return (
                <View key={j} style={styles.list}>
                  {block.items.map((item, k) => (
                    <View key={k} style={styles.listItem}>
                      <View style={styles.listDot} />
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        ))}

        {/* 联系方式 */}
        <Text style={styles.contactText}>
          如有疑问，请联系我们：
          <Text style={styles.contactLink} onPress={handleEmailPress}>
            support@tidyzen.app
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  // 顶部导航栏
  navSafeArea: {
    backgroundColor: PAGE_BG,
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: HEADING,
  },
  navRightPlaceholder: {
    width: 44,
    height: 44,
  },
  navDivider: {
    height: 1,
    backgroundColor: DIVIDER,
  },

  // 主体内容
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // 主标题
  pageTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 24,
    lineHeight: 32,
    color: HEADING,
    marginBottom: 8,
  },

  // 更新日期
  metaDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: META,
    marginBottom: 24,
  },

  // 章节标题
  sectionTitle: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: HEADING,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleFirst: {
    marginTop: 0,
  },

  // 段落
  paragraph: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: BODY,
    marginBottom: 16,
  },

  // 列表
  list: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    marginBottom: 8,
  },
  listDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PRIMARY,
    marginTop: 9,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: BODY,
  },

  // 联系方式
  contactText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: BODY,
    marginTop: 24,
  },
  contactLink: {
    fontFamily: 'BeVietnamPro_400Regular',
    color: PRIMARY,
  },
});
