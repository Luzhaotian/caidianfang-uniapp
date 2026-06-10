// 保存自定义菜品
const { addCustomDish } = require("../utils/storage.js");

const CATEGORY_MAP = {
  1: "荤菜",
  2: "素菜",
  3: "主食",
  4: "饮品",
  5: "自定义",
  6: "AI拍照",
  7: "AI输入",
};

async function saveCustomDish(params = {}) {
  try {
    const {
      name,
      categoryId,
      desc,
      image,
      imagePath,
      cookTime,
      difficulty,
      ingredients,
      seasonings,
      steps,
      source,
    } = params;

    // 校验必填字段
    if (!name || typeof name !== "string" || !name.trim()) {
      return {
        isError: true,
        content: [{ type: "text", text: "菜品名称不能为空。请从分析结果中提取菜品名称后重试。" }],
      };
    }

    if (!categoryId || ![1, 2, 3, 4, 5, 6, 7].includes(categoryId)) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `无效的分类 ID：${categoryId}。允许的值为：1(荤菜)、2(素菜)、3(主食)、4(饮品)、6(AI拍照)、7(AI输入)。`,
          },
        ],
      };
    }

    // 构建菜品对象（优先使用 imagePath 拍照路径）
    const dishImage = (imagePath || image || "").trim();
    const dishSource = imagePath ? "camera" : source || "text";

    const dish = {
      name: name.trim(),
      categoryId: categoryId,
      desc: (desc || "").trim(),
      image: dishImage,
      cookTime: (cookTime || "").trim(),
      difficulty: difficulty || "中等",
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      seasonings: Array.isArray(seasonings) ? seasonings : [],
      steps: Array.isArray(steps) ? steps : [],
      source: dishSource,
    };

    const result = addCustomDish(dish);

    if (result.success) {
      const categoryName = CATEGORY_MAP[result.dish.categoryId] || "其他";
      return {
        isError: false,
        content: [
          {
            type: "text",
            text: `已成功将「${result.dish.name}」添加到${categoryName}分类中（ID: ${result.dish.id}）。接下来为用户展示菜品预览卡片，引导用户在首页查看新添加的菜品。`,
          },
        ],
        structuredContent: {
          success: true,
          dishId: result.dish.id,
          dishName: result.dish.name,
          categoryName: categoryName,
          message: `「${result.dish.name}」已添加到菜单`,
        },
        _meta: {
          dish: result.dish,
        },
      };
    } else {
      return {
        isError: true,
        content: [{ type: "text", text: result.message || "保存失败，请稍后重试。" }],
        structuredContent: {
          success: false,
          message: result.message,
        },
      };
    }
  } catch (err) {
    console.error("[saveCustomDish] error", err);
    return {
      isError: true,
      content: [{ type: "text", text: `保存菜品失败：${err.message || "未知错误"}。请稍后重试。` }],
    };
  }
}

module.exports = saveCustomDish;
