import type { MenuItem } from "@/types/menu";

export const noodleMenuItems: MenuItem[] = [
  {
    id: 16,
    categoryId: 3,
    name: "皮蛋擂椒茄子拌面",
    desc: "擂椒飘香、茄糯面爽，保姆级拌面",
    image: "/static/images/menu/pidan-leijiao-banmian.jpg",
    videoUrl:
      "https://www.bilibili.com/video/BV1J2cBzbEXc/?spm_id_from=333.1387.favlist.content.click&vd_source=d40b3d956dbd357c3858a5e27ca3765b",
    cookTime: "约 35 分钟",
    difficulty: "中等",
    ingredients: [
      { name: "嫩长茄子", amount: "适量" },
      { name: "皮蛋", amount: "适量" },
      { name: "螺丝椒", amount: "适量" },
      { name: "鲜面条", amount: "适量" },
      { name: "大蒜", amount: "适量" },
      { name: "小米辣(辣椒圈)", amount: "适量" },
    ],
    seasonings: [
      { name: "盐", amount: "适量(煸椒+补味)" },
      { name: "粗/细辣椒面", amount: "适量" },
      { name: "花椒", amount: "适量" },
      { name: "食用油", amount: "适量(泼油)" },
      { name: "生抽", amount: "适量" },
      { name: "陈醋", amount: "适量" },
      { name: "蚝油", amount: "适量" },
      { name: "白糖", amount: "适量" },
      { name: "味精", amount: "适量" },
      { name: "芝麻香油", amount: "适量" },
    ],
    steps: [
      {
        step: 1,
        content: "嫩长茄子去根劈四瓣，水开后上锅大火蒸10分钟",
      },
      {
        step: 2,
        content:
          "茄子蒸至约5分钟时，皮蛋放入碗中一并再蒸5分钟，不要直接放在蒸屉盖帘上",
      },
      {
        step: 3,
        content:
          "螺丝椒去根拍扁，无油无水干锅加盐，大火边按压边翻炒至出虎皮、软塌，盛出晾凉",
      },
      {
        step: 4,
        content: "茄子撕成条并挤干水分，辣椒撕条，皮蛋剪块，切蒜末与辣椒圈",
      },
      {
        step: 5,
        content: "鲜面条煮熟，过凉水沥干，装入大碗",
      },
      {
        step: 6,
        content:
          "面上放粗细辣椒面，冷油下花椒炸香后捞出花椒，趁热将油泼在辣椒面上激香",
      },
      {
        step: 7,
        content:
          "加生抽、陈醋、蚝油、白糖、味精、芝麻香油，抓拌均匀，尝咸淡后再决定是否补盐",
      },
    ],
  },
];
