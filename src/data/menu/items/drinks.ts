import type { MenuItem } from "@/types/menu";

export const drinkMenuItems: MenuItem[] = [
  {
    id: 10,
    categoryId: 4,
    name: "草莓风味调酒",
    desc: "甜香好喝、颜值超高",
    image: "/static/images/menu/strawberry-cocktail.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV14b421J7xa/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 2 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "草莓类预调酒/果酒", amount: "1瓶" },
      { name: "搭配基底饮料", amount: "适量" },
    ],
    seasonings: [],
    steps: [
      { step: 1, content: "准备草莓类预调酒或果酒一瓶" },
      { step: 2, content: "按喜好加入适量基底饮料调配" },
      { step: 3, content: "加冰摇匀或搅拌均匀即可饮用" },
    ],
  },
  {
    id: 11,
    categoryId: 4,
    name: "冰川气泡酒",
    desc: "清爽气泡、冰川颜值",
    image: "/static/images/menu/glacier-sparkling.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV14b421J7xa/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 2 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "气泡酒", amount: "1瓶" },
      { name: "奶/乳类饮品", amount: "适量" },
    ],
    seasonings: [],
    steps: [
      { step: 1, content: "准备气泡酒一瓶" },
      { step: 2, content: "按喜好加入适量奶或乳类饮品" },
      { step: 3, content: "轻轻搅拌，加冰即可呈现冰川效果" },
    ],
  },
  {
    id: 12,
    categoryId: 4,
    name: "茉莉椰青",
    desc: "茉莉清香、清甜不腻",
    image: "/static/images/menu/jasmine-coconut.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV14b421J7xa/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 1 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "茉莉花茶", amount: "1瓶" },
      { name: "椰青", amount: "1个" },
    ],
    seasonings: [],
    steps: [
      { step: 1, content: "准备茉莉花茶饮料一瓶" },
      { step: 2, content: "打开新鲜椰青，倒出椰汁" },
      { step: 3, content: "将茉莉花茶与椰青按1:1混合，加冰即可" },
    ],
  },
];
