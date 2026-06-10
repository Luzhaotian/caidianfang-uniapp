export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface CookStep {
  step: number;
  content: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  desc: string;
  image: string;
  cookTime?: string;
  difficulty?: string;
  ingredients?: Ingredient[];
  seasonings?: Ingredient[];
  steps?: CookStep[];
  /** 来源：preset=预设, camera=拍照识别, text=文字输入 */
  source?: "preset" | "camera" | "text";
}

export interface CartLine extends MenuItem {
  count: number;
}
