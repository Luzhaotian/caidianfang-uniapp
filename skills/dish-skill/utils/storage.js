// storage 工具：管理自定义菜品的读写
const CUSTOM_DISHES_KEY = "quickbite_custom_dishes";

function getCustomDishes() {
  try {
    const raw = wx.getStorageSync(CUSTOM_DISHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[dish-skill][storage] getCustomDishes error", e);
    return [];
  }
}

function saveCustomDishes(dishes) {
  try {
    wx.setStorageSync(CUSTOM_DISHES_KEY, JSON.stringify(dishes));
    return true;
  } catch (e) {
    console.error("[dish-skill][storage] saveCustomDishes error", e);
    return false;
  }
}

function addCustomDish(dish) {
  const dishes = getCustomDishes();
  // 检查是否已存在同名菜品
  const existing = dishes.find((d) => d.name === dish.name);
  if (existing) {
    return { success: false, message: `菜品「${dish.name}」已存在，无需重复添加` };
  }
  // 生成唯一 ID
  const nextId = 10000 + dishes.length;
  const newDish = { ...dish, id: nextId };
  dishes.push(newDish);
  const saved = saveCustomDishes(dishes);
  if (saved) {
    return { success: true, dish: newDish };
  }
  return { success: false, message: "保存失败，请稍后重试" };
}

function removeCustomDish(dishId) {
  const dishes = getCustomDishes();
  const filtered = dishes.filter((d) => d.id !== dishId);
  return saveCustomDishes(filtered);
}

module.exports = {
  getCustomDishes,
  saveCustomDishes,
  addCustomDish,
  removeCustomDish,
  CUSTOM_DISHES_KEY,
};
