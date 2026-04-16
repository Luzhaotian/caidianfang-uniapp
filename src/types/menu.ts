export interface Category {
  id: number
  name: string
}

export interface Ingredient {
  name: string
  amount: string
}

export interface CookStep {
  step: number
  content: string
}

export interface MenuItem {
  id: number
  categoryId: number
  name: string
  desc: string
  image: string
  cookTime?: string
  difficulty?: string
  ingredients?: Ingredient[]
  seasonings?: Ingredient[]
  steps?: CookStep[]
}

export interface CartLine extends MenuItem {
  count: number
}
