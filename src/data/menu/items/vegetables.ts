import type { MenuItem } from "@/types/menu";

export const vegetableMenuItems: MenuItem[] = [
  {
    id: 14,
    categoryId: 2,
    name: "西红柿炒鸡蛋",
    desc: "酸甜开胃、经典家常",
    image: "/static/images/menu/tomato-egg.jpg",
    cookTime: "约 10 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "西红柿", amount: "2个" },
      { name: "鸡蛋", amount: "3个" },
    ],
    seasonings: [
      { name: "食用油", amount: "适量" },
      { name: "盐", amount: "适量" },
      { name: "白糖", amount: "适量" },
      { name: "生抽", amount: "适量" },
      { name: "蚝油", amount: "适量" },
      { name: "香油", amount: "少许" },
      { name: "葱花", amount: "少许" },
    ],
    steps: [
      { step: 1, content: "西红柿切块备用，鸡蛋打散" },
      { step: 2, content: "锅烧热，热锅凉油，加入鸡蛋翻炒至凝固盛起备用" },
      { step: 3, content: "不用洗锅，直接加入西红柿翻炒，加入适量盐和适量糖" },
      { step: 4, content: "西红柿出水之后，加入生抽适量和蚝油适量" },
      {
        step: 5,
        content: "最后加入炒好的鸡蛋，翻炒均匀，撒上葱花，淋上香油出锅",
      },
    ],
  },
  {
    id: 15,
    categoryId: 2,
    name: "炒合菜",
    desc: "鲜香入味、快手家常",
    image: "/static/images/menu/chaohacai.jpg",
    cookTime: "约 15 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "粉条", amount: "1小捆" },
      { name: "韭菜", amount: "150g" },
      { name: "豆芽", amount: "150g" },
      { name: "鸡蛋", amount: "4个" },
    ],
    seasonings: [
      { name: "葱", amount: "适量" },
      { name: "姜", amount: "适量" },
      { name: "蒜", amount: "适量" },
      { name: "干辣椒段", amount: "适量" },
      { name: "老抽", amount: "适量" },
      { name: "生抽", amount: "适量" },
      { name: "蚝油", amount: "适量" },
      { name: "白糖", amount: "适量" },
      { name: "鸡精", amount: "适量" },
      { name: "盐", amount: "适量" },
    ],
    steps: [
      { step: 1, content: "粉条用开水烫至能掐断，过凉水防粘，加老抽拌匀上色" },
      {
        step: 2,
        content: "韭菜切寸段，豆芽洗净；葱切葱花、姜切丝、蒜切片，备干辣椒",
      },
      {
        step: 3,
        content: "鸡蛋打散，热锅冒烟多放油，边倒蛋液边搅成絮状，凝固盛出",
      },
      { step: 4, content: "大火爆香葱姜蒜干辣椒，下豆芽炒至微软" },
      {
        step: 5,
        content: "下粉条、鸡蛋炒匀，转小火加生抽、蚝油、白糖、鸡精、盐调味",
      },
      { step: 6, content: "大火翻匀，放韭菜炒至变色立刻出锅" },
    ],
  },
];
