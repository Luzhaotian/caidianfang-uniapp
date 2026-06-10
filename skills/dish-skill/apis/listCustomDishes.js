// 列出自定义菜品
const { getCustomDishes } = require("../utils/storage.js");

const CATEGORY_MAP = {
  1: "荤菜",
  2: "素菜",
  3: "主食",
  4: "饮品",
  5: "自定义",
  6: "AI拍照",
  7: "AI输入",
};

async function listCustomDishes() {
  try {
    const dishes = getCustomDishes();

    if (dishes.length === 0) {
      return {
        isError: false,
        content: [
          {
            type: "text",
            text: "当前没有自定义菜品。用户可以通过输入菜品描述或链接来添加新菜品。",
          },
        ],
        structuredContent: {
          dishes: [],
          total: 0,
        },
      };
    }

    const items = dishes.map((d) => ({
      dishId: d.id,
      name: d.name,
      desc: d.desc || "",
      categoryName: CATEGORY_MAP[d.categoryId] || "其他",
      cookTime: d.cookTime || "",
      difficulty: d.difficulty || "中等",
      source: d.source || "text",
    }));

    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `共有 ${dishes.length} 道自定义菜品。接下来为用户展示自定义菜品列表卡片。`,
        },
      ],
      structuredContent: {
        dishes: items,
        total: dishes.length,
      },
      _meta: {
        fullDishes: dishes,
      },
    };
  } catch (err) {
    console.error("[listCustomDishes] error", err);
    return {
      isError: true,
      content: [{ type: "text", text: `获取自定义菜品失败：${err.message || "未知错误"}。` }],
    };
  }
}

module.exports = listCustomDishes;
