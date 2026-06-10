import { reactive, computed } from "vue";

import type { CartLine, MenuItem } from "@/types/menu";
import { getLineCount, type CartState } from "@/store/cart-core";
import { categories, menuItems } from "@/data/menu";

const STORAGE_KEY = "quickbite_cart_v1";
const FAVORITES_KEY = "quickbite_favorites_v1";
const CUSTOM_DISHES_KEY = "quickbite_custom_dishes";

/** 侧边栏「收藏」与真实 categoryId 区分 */
export const FAVORITES_CATEGORY_ID = -1;

// 加载 AI 识菜 SKILL 写入的自定义菜品
function loadCustomDishes(): MenuItem[] {
  try {
    const raw = uni.getStorageSync(CUSTOM_DISHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error loading custom dishes:", e);
    return [];
  }
}

const state = reactive({
  categories,
  menu: [...menuItems, ...loadCustomDishes()],
  cart: [] as CartLine[],
  favoriteIds: [] as number[],
});

function loadCart(): void {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    console.log("Load cart from storage:", raw);
    if (!raw) {
      state.cart = [];
      console.log("Cart is empty");
      return;
    }
    const parsed = JSON.parse(raw) as CartLine[];
    state.cart = Array.isArray(parsed) ? parsed : [];
    console.log("Loaded cart:", state.cart);
  } catch (e) {
    console.error("Error loading cart:", e);
    state.cart = [];
  }
}

function persistCart(): void {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(state.cart));
}

function loadFavorites(): void {
  try {
    const raw = uni.getStorageSync(FAVORITES_KEY);
    if (!raw) {
      state.favoriteIds = [];
      return;
    }
    const parsed = JSON.parse(raw as string) as unknown;
    state.favoriteIds = Array.isArray(parsed)
      ? parsed.filter((x): x is number => typeof x === "number")
      : [];
  } catch {
    state.favoriteIds = [];
  }
}

function persistFavorites(): void {
  uni.setStorageSync(FAVORITES_KEY, JSON.stringify(state.favoriteIds));
}

function toggleFavorite(id: number): void {
  const ids = state.favoriteIds;
  const i = ids.indexOf(id);
  if (i >= 0) ids.splice(i, 1);
  else ids.push(id);
  persistFavorites();
}

function isFavorite(id: number): boolean {
  return state.favoriteIds.includes(id);
}

function cartCoreState(): CartState {
  return state as unknown as CartState;
}

function setCount(item: MenuItem, count: number): void {
  const next = Math.max(0, Math.floor(count));
  const existing = state.cart.find((x) => x.id === item.id);

  if (!existing) {
    if (next === 0) return;
    state.cart.push({ ...item, count: next });
  } else {
    existing.count = next;
    if (existing.count === 0) {
      const index = state.cart.indexOf(existing);
      if (index > -1) {
        state.cart.splice(index, 1);
      }
    }
  }

  persistCart();
}

function getCount(itemId: number): number {
  return getLineCount(cartCoreState(), itemId);
}

let didLoad = false;

export function useQuickBiteStore() {
  if (!didLoad) {
    didLoad = true;
    loadCart();
    loadFavorites();
  }

  // 确保 computed 正确追踪 state.cart 的变化
  const cartTotalCount = computed(() => {
    // 直接引用 state.cart 以确保响应式追踪
    const cart = state.cart;
    const count = cart.reduce((sum, x) => sum + x.count, 0);
    return count;
  });

  function clearCart(): void {
    state.cart.splice(0, state.cart.length);
    persistCart();
  }

  /** 刷新自定义菜品（从 SKILL 写入的 storage 中重新读取） */
  function refreshCustomDishes(): void {
    const fresh = loadCustomDishes();
    state.menu = [...menuItems, ...fresh];
  }

  /** 删除自定义菜品 */
  function deleteCustomDish(dishId: number): void {
    // 从菜单中移除
    const idx = state.menu.findIndex((x) => x.id === dishId);
    if (idx > -1) state.menu.splice(idx, 1);
    // 从 storage 中移除
    try {
      const raw = uni.getStorageSync(CUSTOM_DISHES_KEY);
      if (raw) {
        const dishes = JSON.parse(raw);
        if (Array.isArray(dishes)) {
          const filtered = dishes.filter((d: MenuItem) => d.id !== dishId);
          uni.setStorageSync(CUSTOM_DISHES_KEY, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.error("Error deleting custom dish:", e);
    }
  }

  return {
    state,
    totalCount: cartTotalCount,
    loadCart,
    setCount,
    getCount,
    clearCart,
    toggleFavorite,
    isFavorite,
    refreshCustomDishes,
    deleteCustomDish,
  };
}
