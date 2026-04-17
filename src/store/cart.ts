import { reactive, computed } from "vue";

import type { CartLine, MenuItem } from "@/types/menu";
import { getLineCount, type CartState } from "@/store/cart-core";
import { categories, menuItems } from "@/data/menu";

const STORAGE_KEY = "quickbite_cart_v1";

const state = reactive({
  categories,
  menu: menuItems,
  cart: [] as CartLine[],
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

  return {
    state,
    totalCount: cartTotalCount,
    loadCart,
    setCount,
    getCount,
    clearCart,
  };
}
