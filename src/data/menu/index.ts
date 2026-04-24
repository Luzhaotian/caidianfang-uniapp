import type { MenuItem } from "@/types/menu";

export { categories } from "./categories";
import { drinkMenuItems } from "./items/drinks";
import { meatEarlyMenuItems } from "./items/meat-a";
import { meatLateMenuItems } from "./items/meat-b";
import { noodleMenuItems } from "./items/noodles";
import { riceMenuItems } from "./items/rice";
import { vegetableMenuItems } from "./items/vegetables";

/** 与拆分前 `menu.ts` 相同的展示顺序（侧边栏分类内 `filter` 顺序不受影响） */
export const menuItems: MenuItem[] = [
  ...meatEarlyMenuItems,
  ...drinkMenuItems,
  ...riceMenuItems,
  ...vegetableMenuItems,
  ...noodleMenuItems,
  ...meatLateMenuItems,
];
