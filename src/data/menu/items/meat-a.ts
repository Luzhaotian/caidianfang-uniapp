import type { MenuItem } from "@/types/menu";

/** 荤菜：猪蹄鸡爪煲、红烧牛肉、鸡公煲 */
export const meatEarlyMenuItems: MenuItem[] = [
  {
    id: 7,
    categoryId: 1,
    name: "猪蹄鸡爪煲",
    desc: "酱香浓郁、软烂脱骨",
    image: "/static/images/menu/zhutui-jizhua.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV1LrXvBoEvM/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 2 小时",
    difficulty: "中等",
    ingredients: [
      { name: "猪蹄", amount: "1只" },
      { name: "鸡爪", amount: "8-10只" },
    ],
    seasonings: [
      { name: "葱段", amount: "3根" },
      { name: "姜片", amount: "5片" },
      { name: "蒜瓣", amount: "6瓣" },
      { name: "干辣椒", amount: "5-6个" },
      { name: "小米辣", amount: "适量" },
      { name: "八角", amount: "1颗" },
      { name: "桂皮", amount: "1小段" },
      { name: "香叶", amount: "2片" },
      { name: "料酒", amount: "2勺" },
      { name: "生抽", amount: "3勺" },
      { name: "老抽", amount: "1勺" },
      { name: "冰糖", amount: "5-6颗" },
      { name: "盐", amount: "适量" },
    ],
    steps: [
      {
        step: 1,
        content: "猪蹄剁块、鸡爪剪指甲，冷水下锅加姜料酒焯水3分钟，捞出洗净",
      },
      {
        step: 2,
        content: "热油爆香姜蒜葱、干辣椒、八角桂皮香叶，下猪蹄大火翻炒2分钟",
      },
      {
        step: 3,
        content:
          "加生抽老抽冰糖炒至上色，倒入开水没过猪蹄，加1小勺醋，大火烧开转中小火炖1.5小时",
      },
      {
        step: 4,
        content:
          "放入鸡爪继续炖30分钟至软烂，大火收汁，加盐调味，撒小米辣和葱段出锅",
      },
    ],
  },
  {
    id: 8,
    categoryId: 1,
    name: "红烧牛肉",
    desc: "香辣软烂、酱香浓郁",
    image: "/static/images/menu/hongshao-niurou.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV1ZukYYPEUu/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 2.5 小时",
    difficulty: "中等",
    ingredients: [
      { name: "牛腩/牛肋条", amount: "2.5斤" },
      { name: "干辣椒", amount: "40g" },
    ],
    seasonings: [
      { name: "郫县豆瓣酱", amount: "1.5勺" },
      { name: "葱", amount: "适量" },
      { name: "姜", amount: "适量" },
      { name: "蒜", amount: "适量" },
      { name: "香叶", amount: "适量" },
      { name: "薄桂皮", amount: "1小段" },
      { name: "草果", amount: "1个(去籽)" },
      { name: "八角", amount: "适量" },
      { name: "山奈", amount: "适量" },
      { name: "小茴香", amount: "适量" },
      { name: "花椒", amount: "适量" },
      { name: "生抽", amount: "适量" },
      { name: "白胡椒粉", amount: "适量" },
      { name: "鸡精", amount: "适量" },
      { name: "味精", amount: "适量" },
      { name: "冰糖", amount: "适量" },
      { name: "盐", amount: "出锅前加" },
    ],
    steps: [
      { step: 1, content: "牛肉切两指宽大块，冷水下锅焯水，捞出温水洗净沥干" },
      {
        step: 2,
        content:
          "干辣椒40g开水泡5分钟切碎成糍粑辣椒（糍粑辣椒没有可以不放），豆瓣酱1.5勺切碎备用",
      },
      {
        step: 3,
        content:
          "热油下葱姜蒜大火炒香，转中火炸至微黄，转小火下糍粑辣椒+豆瓣酱炒2分钟至无生味",
      },
      {
        step: 4,
        content: "下香料炒香，倒入牛肉大火翻炒2分钟炒干水汽，沿锅边加开水煮沸",
      },
      {
        step: 5,
        content:
          "转入高压锅，加水没过牛肉，加生抽、白胡椒粉、鸡精、味精、冰糖(暂不加盐)",
      },
      {
        step: 6,
        content:
          "电高压锅选牛羊肉模式；燃气高压锅上汽后小火30分钟；无高压锅则小火炖2小时以上",
      },
      {
        step: 7,
        content:
          "捞出牛肉过滤汤汁去料渣，汤汁回锅加盐调味，牛肉浸汤汁里，撒香菜出锅",
      },
    ],
  },
  {
    id: 9,
    categoryId: 1,
    name: "鸡公煲",
    desc: "香辣入味、肉质滑嫩",
    image: "/static/images/menu/jigongbao.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV1E1421r7hn/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 30 分钟",
    difficulty: "中等",
    ingredients: [
      { name: "去骨鸡腿", amount: "4个" },
      { name: "青红辣椒", amount: "适量" },
      { name: "香芹", amount: "适量" },
      { name: "洋葱", amount: "适量" },
      { name: "香菇", amount: "适量" },
      { name: "大蒜", amount: "适量" },
      { name: "姜片", amount: "适量" },
    ],
    seasonings: [
      { name: "十三香", amount: "适量" },
      { name: "香叶", amount: "适量" },
      { name: "白芷", amount: "适量" },
      { name: "花椒", amount: "适量" },
      { name: "柱侯酱", amount: "2勺" },
      { name: "海鲜酱", amount: "1勺" },
      { name: "蚝油", amount: "3勺" },
      { name: "老抽", amount: "半勺" },
      { name: "鸡精", amount: "1茶勺" },
      { name: "食用油", amount: "1勺(腌制用)" },
      { name: "火锅底料", amount: "1/3块" },
    ],
    steps: [
      { step: 1, content: "鸡腿去骨洗净吸干水分，切成3cm见方块状" },
      {
        step: 2,
        content:
          "加十三香、香叶、白芷、花椒、柱侯酱2勺、海鲜酱1勺、蚝油3勺、老抽半勺、鸡精1茶勺抓匀，加1勺食用油腌20分钟",
      },
      {
        step: 3,
        content: "青红辣椒、香芹、洋葱、香菇、大蒜切好备用，姜片单独放置",
      },
      { step: 4, content: "起锅烧油，姜片煎至焦边，加1/3块火锅底料融化" },
      { step: 5, content: "放入鸡肉中火翻炒4分钟至紧实滑嫩，全程不加水" },
      { step: 6, content: "加5勺清水或啤酒，小火焖3分钟" },
      {
        step: 7,
        content:
          "倒入配菜大火翻炒1分钟即成干锅鸡公煲（加开水可煮配菜和方便面）",
      },
    ],
  },
];
