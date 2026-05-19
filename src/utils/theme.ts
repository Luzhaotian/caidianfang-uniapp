// src/utils/theme.ts

const THEME_KEY = 'app-theme'

export type Theme = 'light' | 'dark' | 'system'

function applyTheme(theme: 'light' | 'dark') {
  // 微信小程序：通过 page 的 data-theme 属性切换
  // 利用 getCurrentPages 获取当前页面实例设置 data
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const page = pages[pages.length - 1]
    // @ts-expect-error — 小程序页面实例的 setData 方法
    if (typeof page.setData === 'function') {
      page.setData({ theme })
    }
  }
}

export function initTheme() {
  const saved = uni.getStorageSync(THEME_KEY) as Theme | ''
  if (saved && saved !== 'system') {
    applyTheme(saved)
  } else {
    const systemTheme = uni.getSystemInfoSync().theme || 'light'
    applyTheme(systemTheme as 'light' | 'dark')
  }

  // 监听系统主题变化
  uni.onThemeChange((result) => {
    const current = uni.getStorageSync(THEME_KEY) as Theme | ''
    if (!current || current === 'system') {
      applyTheme(result.theme as 'light' | 'dark')
    }
  })
}

export function setTheme(theme: Theme) {
  uni.setStorageSync(THEME_KEY, theme)
  if (theme === 'system') {
    const systemTheme = uni.getSystemInfoSync().theme || 'light'
    applyTheme(systemTheme as 'light' | 'dark')
  } else {
    applyTheme(theme)
  }
}

export function getCurrentTheme(): 'light' | 'dark' {
  const saved = uni.getStorageSync(THEME_KEY) as Theme | ''
  if (saved && saved !== 'system') {
    return saved as 'light' | 'dark'
  }
  return (uni.getSystemInfoSync().theme || 'light') as 'light' | 'dark'
}
