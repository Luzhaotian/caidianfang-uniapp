import type { CartLine, MenuItem } from "@/types/menu";

export interface CartState {
  cart: CartLine[];
}

export function createCartState(): CartState {
  return { cart: [] };
}

export function getLineCount(state: CartState, itemId: number): number {
  return state.cart.find((x) => x.id === itemId)?.count ?? 0;
}

export function setLineCount(state: CartState, item: MenuItem, count: number): void {
  const next = Math.max(0, Math.floor(count));
  const existing = state.cart.find((x) => x.id === item.id);

  if (!existing) {
    if (next === 0) return;
    state.cart.push({ ...item, count: next });
    return;
  }

  existing.count = next;
  if (existing.count === 0) {
    state.cart = state.cart.filter((x) => x.id !== item.id);
  }
}

export function totalCount(state: CartState): number {
  return state.cart.reduce((sum, x) => sum + x.count, 0);
}
