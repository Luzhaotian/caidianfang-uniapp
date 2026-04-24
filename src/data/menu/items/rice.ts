import type { MenuItem } from "@/types/menu";

export const riceMenuItems: MenuItem[] = [
  {
    id: 13,
    categoryId: 3,
    name: "香喷喷大米饭",
    desc: "粒粒分明、香软可口",
    image: "/static/images/menu/rice.jpg",
    cookTime: "约 30 分钟",
    difficulty: "简单",
    ingredients: [
      { name: "大米", amount: "2杯" },
      { name: "清水", amount: "适量" },
    ],
    seasonings: [
      { name: "食用油", amount: "几滴(可选)" },
      { name: "盐", amount: "少许(可选)" },
    ],
    steps: [
      { step: 1, content: "大米用清水淘洗2-3遍，去除表面淀粉" },
      {
        step: 2,
        content: "米和水按1:1.2比例放入电饭煲（或手指测法：水没过米约1节指节）",
      },
      { step: 3, content: "浸泡20分钟让米粒充分吸水（可选）" },
      { step: 4, content: "开始煮饭，煮好后焖10分钟再开盖" },
      { step: 5, content: "用饭勺轻轻松散米饭，盛出即可" },
    ],
  },
];
