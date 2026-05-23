// src/utils/theme.ts

// 主题工具函数 - 简化版，用于 SCSS 变量编译
// 动态主题切换功能已简化，使用编译时 SCSS 变量

export function getSystemTheme(): "light" | "dark" {
  return (uni.getSystemInfoSync().theme || "light") as "light" | "dark";
}

// 主题状态工具函数
export function getCurrentTheme(): "light" | "dark" {
  return getSystemTheme();
}
