import { describe, expect, it } from "vitest"

import type { MenuItem } from "@/types/menu"

import { createCartState, getLineCount, setLineCount, totalCount } from "./cart-core"

const burger: MenuItem = {
  id: 1,
  categoryId: 1,
  name: "招牌牛肉汉堡",
  desc: "多汁牛肉饼 + 特制酱",
  image: "https://example.com/burger.png",
}

describe("cart-core", () => {
  it("adds a line when setting count > 0", () => {
    const state = createCartState()
    setLineCount(state, burger, 1)
    expect(getLineCount(state, burger.id)).toBe(1)
    expect(totalCount(state)).toBe(1)
  })

  it("removes a line when setting count to 0", () => {
    const state = createCartState()
    setLineCount(state, burger, 2)
    setLineCount(state, burger, 0)
    expect(getLineCount(state, burger.id)).toBe(0)
    expect(totalCount(state)).toBe(0)
  })

  it("clamps negative counts to 0", () => {
    const state = createCartState()
    setLineCount(state, burger, -3)
    expect(getLineCount(state, burger.id)).toBe(0)
    expect(totalCount(state)).toBe(0)
  })

  it("updates an existing line count", () => {
    const state = createCartState()
    setLineCount(state, burger, 1)
    setLineCount(state, burger, 3)
    expect(getLineCount(state, burger.id)).toBe(3)
    expect(totalCount(state)).toBe(3)
  })
})

