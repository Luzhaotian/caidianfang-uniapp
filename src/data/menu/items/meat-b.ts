import type { MenuItem } from "@/types/menu";

/** 荤菜：茄汁大虾、农家一碗香、麻婆豆腐 */
export const meatLateMenuItems: MenuItem[] = [
  {
    id: 17,
    categoryId: 1,
    name: "茄汁大虾",
    desc: "酸甜可口、虾皮酥脆，新手也能上的年夜菜",
    image: "/static/images/menu/qiezhi-daxia.jpg",
    cookTime: "约 25 分钟",
    difficulty: "中等",
    ingredients: [
      { name: "大虾", amount: "650g(大虾更气派，小虾更省事)" },
      { name: "大蒜", amount: "适量(切末)" },
      { name: "姜", amount: "适量(切片)" },
      { name: "大葱", amount: "适量(斜切段)" },
      { name: "小米辣", amount: "适量切圈(可选)" },
      { name: "香菜", amount: "少许(点缀)" },
    ],
    seasonings: [
      { name: "白糖", amount: "1勺" },
      { name: "生抽", amount: "4勺" },
      { name: "番茄沙司", amount: "4勺" },
      { name: "食用油", amount: "适量(约日常炒菜2倍量)" },
      { name: "清水", amount: "半碗" },
    ],
    steps: [
      {
        step: 1,
        content: "备料约650克大虾；大虾更气派，小虾食用更方便",
      },
      {
        step: 2,
        content:
          "剪去虾枪、虾眼、虾须、虾足与尾尖，挑掉沙包；从虾尾第二关节开背挑净虾线，厨房纸吸干表面水分防溅油",
      },
      {
        step: 3,
        content: "大蒜切末，姜切片，大葱切斜段，小米辣切圈增香（不吃辣可省略）",
      },
      {
        step: 4,
        content: "料汁：白糖1勺、生抽4勺、番茄沙司4勺搅匀备用，无需额外加盐",
      },
      {
        step: 5,
        content:
          "锅中加约双倍于平时的油，烧至冒烟，盖盖安全下入大虾，煎至两面泛白，可按压虾头挤出虾油，盛出备用",
      },
      {
        step: 6,
        content: "留底油炒香小料，倒入料汁与半碗清水，放回大虾大火收汁至汤汁粘稠即可，勿收干",
      },
      {
        step: 7,
        content: "虾头挨虾头摆盘，酱汁过滤料渣后淋在虾上，点缀香菜出锅",
      },
    ],
  },
  {
    id: 18,
    categoryId: 1,
    name: "农家一碗香（省油版）",
    desc: "焦香入味、不油腻，超下饭",
    image: "/static/images/menu/nongjia-yiwanxiang.jpg",
    cookTime: "约 20 分钟",
    difficulty: "中等",
    ingredients: [
      { name: "五花肉", amount: "150g" },
      { name: "鸡蛋", amount: "4个" },
      { name: "螺丝椒", amount: "3根" },
      { name: "小米辣", amount: "6根" },
      { name: "姜", amount: "适量(切片)" },
      { name: "蒜", amount: "适量(切片)" },
      { name: "葱", amount: "适量(葱花)" },
      { name: "豆豉", amount: "1勺" },
    ],
    seasonings: [
      { name: "生抽", amount: "适量" },
      { name: "老抽", amount: "适量" },
      { name: "蚝油", amount: "适量" },
      { name: "白糖", amount: "适量" },
      { name: "鸡精/味精", amount: "适量" },
      { name: "食用油", amount: "少量(煎蛋用)" },
    ],
    steps: [
      {
        step: 1,
        content:
          "主料：五花肉150克、鸡蛋4个；辅料：螺丝椒3根、小米辣6根、姜片、蒜片、葱花、豆豉1勺；备生抽、老抽、蚝油、白糖、鸡精或味精",
      },
      {
        step: 2,
        content: "空锅不放油，大火下螺丝椒，边按压边翻炒约1分钟，至表面起焦斑盛出备用",
      },
      {
        step: 3,
        content: "锅内加少量炒菜油，烧至冒烟后打入4个完整鸡蛋，煎至焦香凝固，铲成大块盛出",
      },
      {
        step: 4,
        content: "用锅底余油下五花肉煸炒至变色、微焦黄，逼出油脂",
      },
      {
        step: 5,
        content:
          "下葱姜蒜、小米辣、豆豉炒香，倒入螺丝椒，沿锅边淋生抽、老抽，加蚝油、白糖、鸡精或味精调味炒匀",
      },
      {
        step: 6,
        content: "倒入煎好的鸡蛋，大火翻炒均匀即可出锅，焦香入味、盘底少油",
      },
    ],
  },
  {
    id: 19,
    categoryId: 1,
    name: "麻婆豆腐",
    desc: "麻辣鲜香、嫩滑挂汁，正宗家常味",
    image: "/static/images/menu/mapo-doufu.jpg",
    cookTime: "约 30 分钟",
    difficulty: "中等",
    ingredients: [
      { name: "嫩豆腐/北豆腐", amount: "适量(切1cm见方丁)" },
      { name: "牛肉", amount: "适量(肥瘦切末)" },
      { name: "小葱或蒜苗", amount: "适量(切葱花)" },
      { name: "豆豉", amount: "适量(洗净)" },
      { name: "郫县豆瓣酱", amount: "适量(剁碎)" },
      { name: "花椒", amount: "适量" },
      { name: "麻椒", amount: "适量" },
      { name: "干辣椒", amount: "适量" },
      { name: "大蒜", amount: "适量" },
      { name: "清水或高汤", amount: "适量" },
    ],
    seasonings: [
      { name: "熟菜籽油", amount: "适量" },
      { name: "盐", amount: "适量(焯水+调味)" },
      { name: "料酒", amount: "适量" },
      { name: "生抽", amount: "适量" },
      { name: "老抽", amount: "适量" },
      { name: "白糖", amount: "适量" },
      { name: "水淀粉", amount: "适量(分三次勾芡)" },
    ],
    steps: [
      {
        step: 1,
        content:
          "豆腐切约1cm见方小块；小葱或蒜苗切葱花；牛肉切肥瘦相间肉末；豆豉洗净，豆瓣酱剁碎；花椒、麻椒、干辣椒小火炒香后碾碎，制成刀口辣椒",
      },
      {
        step: 2,
        content: "锅中加水放盐，下豆腐煮约1分钟捞出，去除豆腥味",
      },
      {
        step: 3,
        content:
          "热锅润油防粘，放熟菜籽油煸炒牛肉末至干香起酥；加豆瓣酱、豆豉炒出红油，下葱蒜爆香，加刀口辣椒、料酒、生抽炝香；盛出少量牛肉末留作点缀",
      },
      {
        step: 4,
        content: "加清水或高汤，放入豆腐，加盐、白糖、老抽调味，中小火煮2～3分钟入味",
      },
      {
        step: 5,
        content: "水淀粉分三次下锅勾芡，每次轻推豆腐、勿大力搅拌，使汤汁逐步挂牢、收至合适稠度",
      },
      {
        step: 6,
        content: "倒回备用的牛肉末推匀，将豆腐舀起“盖帽”装盘，撒刀口辣椒与葱花即可",
      },
    ],
  },
];
