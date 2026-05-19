# 菜点坊主题色系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为菜点坊小程序建立完整的语义化主题色 Token 系统，支持亮色/暗色模式切换，替代所有硬编码颜色。

**Architecture:** 三层分离 — 原始色板层（静态色阶）→ 语义 Token 层（运行时可切换映射）→ 组件层（只引用 Token）。通过 `data-theme` 属性切换亮色/暗色模式。

**Tech Stack:** CSS Custom Properties, SCSS (uni.scss 桥接), TypeScript (theme 工具), uni-app Vue 3

---

### Task 1: 创建原始色板文件

**Files:**
- Create: `src/styles/palette.css`

- [ ] **Step 1: 创建 palette.css**

```css
/* src/styles/palette.css */
/* 菜点坊原始色板 — 麦穗暖阳主题 */
/* 此文件定义基础色阶，供语义 Token 层引用，不可直接在组件中使用 */

:root {
  /* ═══ Amber（麦穗金）═══ */
  --amber-50: #fffbeb;
  --amber-100: #fef3c7;
  --amber-200: #fde68a;
  --amber-300: #fcd34d;
  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
  --amber-700: #b45309;
  --amber-800: #92400e;
  --amber-900: #78350f;

  /* ═══ Lime（草叶绿）═══ */
  --lime-50: #f7fee7;
  --lime-100: #ecfccb;
  --lime-200: #d9f99d;
  --lime-300: #bef264;
  --lime-400: #a3e635;
  --lime-500: #84cc16;
  --lime-600: #65a30d;
  --lime-700: #4d7c0f;
  --lime-800: #3f6212;
  --lime-900: #365314;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/styles/palette.css
git commit -m "feat(theme): add raw palette color scales"
```

---

### Task 2: 创建亮色模式 Token 文件

**Files:**
- Create: `src/styles/themes/light.css`

- [ ] **Step 1: 创建 light.css**

```css
/* src/styles/themes/light.css */
/* 菜点坊亮色模式 — 语义 Token 映射 */

:root {
  /* ═══ 主色 Amber ═══ */
  --color-primary: var(--amber-600);
  --color-primary-hover: var(--amber-500);
  --color-primary-pressed: var(--amber-700);
  --color-primary-bg: var(--amber-50);
  --color-primary-text: var(--amber-800);

  /* ═══ 辅色 Lime ═══ */
  --color-accent: var(--lime-600);
  --color-accent-hover: var(--lime-500);
  --color-accent-pressed: var(--lime-700);
  --color-accent-bg: var(--lime-100);
  --color-accent-text: var(--lime-700);

  /* ═══ 功能色 ═══ */
  --color-error: #ef4444;
  --color-error-bg: #fef2f2;
  --color-success: #22c55e;
  --color-success-bg: #f0fdf4;
  --color-info: #3b82f6;
  --color-info-bg: #eff6ff;
  --color-warning: #f97316;
  --color-warning-bg: #fff7ed;

  /* ═══ 收藏/红心 ═══ */
  --color-favorite: #ef4444;
  --color-favorite-muted: #d1d5db;

  /* ═══ 文字 ═══ */
  --color-text: #111827;
  --color-text-secondary: #374151;
  --color-text-tertiary: #6b7280;
  --color-text-disabled: #9ca3af;
  --color-text-inverse: #ffffff;

  /* ═══ 背景/边框 ═══ */
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  --color-fill: #f3f4f6;
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-mask: rgba(0, 0, 0, 0.5);

  /* ═══ Header 渐变 ═══ */
  --color-header-from: #fffbeb;
  --color-header-via: #fef3c7;
  --color-header-to: #fde68a;

  /* ═══ Header 装饰 ═══ */
  --color-header-decor-primary: rgba(217, 119, 6, 0.15);
  --color-header-decor-accent: rgba(132, 204, 22, 0.18);

  /* ═══ Header 文字 ═══ */
  --color-header-title: #92400e;
  --color-header-subtitle: #b45309;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/styles/themes/light.css
git commit -m "feat(theme): add light mode semantic tokens"
```

---

### Task 3: 创建暗色模式 Token 文件

**Files:**
- Create: `src/styles/themes/dark.css`

- [ ] **Step 1: 创建 dark.css**

```css
/* src/styles/themes/dark.css */
/* 菜点坊暗色模式 — 语义 Token 映射 */
/* 通过 page[data-theme="dark"] 或 @media prefers-color-scheme 激活 */

page[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    /* ═══ 主色 Amber（暗色模式用浅色阶保证对比度）═══ */
    --color-primary: var(--amber-400);
    --color-primary-hover: var(--amber-300);
    --color-primary-pressed: var(--amber-500);
    --color-primary-bg: #422006;
    --color-primary-text: var(--amber-200);

    /* ═══ 辅色 Lime ═══ */
    --color-accent: var(--lime-400);
    --color-accent-hover: var(--lime-300);
    --color-accent-pressed: var(--lime-500);
    --color-accent-bg: #1a2e05;
    --color-accent-text: var(--lime-300);

    /* ═══ 功能色 ═══ */
    --color-error: #f87171;
    --color-error-bg: #450a0a;
    --color-success: #4ade80;
    --color-success-bg: #052e16;
    --color-info: #60a5fa;
    --color-info-bg: #172554;
    --color-warning: #fb923c;
    --color-warning-bg: #431407;

    /* ═══ 收藏/红心 ═══ */
    --color-favorite: #f87171;
    --color-favorite-muted: #78716c;

    /* ═══ 文字（stone 暖灰色系）═══ */
    --color-text: #f5f5f4;
    --color-text-secondary: #d6d3d1;
    --color-text-tertiary: #a8a29e;
    --color-text-disabled: #78716c;
    --color-text-inverse: #1c1917;

    /* ═══ 背景/边框 ═══ */
    --color-border: #44403c;
    --color-border-light: #292524;
    --color-fill: #292524;
    --color-bg: #1c1917;
    --color-surface: #292524;
    --color-mask: rgba(0, 0, 0, 0.7);

    /* ═══ Header 渐变 ═══ */
    --color-header-from: #292524;
    --color-header-via: #1c1917;
    --color-header-to: #1c1917;

    /* ═══ Header 装饰 ═══ */
    --color-header-decor-primary: rgba(251, 191, 36, 0.1);
    --color-header-decor-accent: rgba(163, 230, 53, 0.08);

    /* ═══ Header 文字 ═══ */
    --color-header-title: #fde68a;
    --color-header-subtitle: #fbbf24;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/styles/themes/dark.css
git commit -m "feat(theme): add dark mode semantic tokens"
```

---

### Task 4: 创建样式入口文件

**Files:**
- Create: `src/styles/index.css`

- [ ] **Step 1: 创建 index.css**

```css
/* src/styles/index.css */
/* 菜点坊主题样式入口 */

@import './palette.css';
@import './themes/light.css';
@import './themes/dark.css';
```

- [ ] **Step 2: 提交**

```bash
git add src/styles/index.css
git commit -m "feat(theme): add styles entry point"
```

---

### Task 5: 创建主题切换工具

**Files:**
- Create: `src/utils/theme.ts`

- [ ] **Step 1: 创建 theme.ts**

```typescript
// src/utils/theme.ts

const THEME_KEY = 'app-theme'

export type Theme = 'light' | 'dark' | 'system'

function applyTheme(theme: 'light' | 'dark') {
  // 微信小程序：通过 page 的 data-theme 属性切换
  // 利用 getCurrentPages 获取当前页面实例设置 data
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const page = pages[pages.length - 1]
    // @ts-ignore — 小程序页面实例的 setData 方法
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
```

- [ ] **Step 2: 提交**

```bash
git add src/utils/theme.ts
git commit -m "feat(theme): add theme switching utility"
```

---

### Task 6: 更新 uni.scss 桥接变量

**Files:**
- Modify: `src/uni.scss` (entire file replacement)

- [ ] **Step 1: 替换 uni.scss 全部内容**

```scss
/**
 * 菜点坊主题 SCSS 变量桥接
 *
 * 这些 SCSS 变量用于编译时场景（如 pages.json 的 navigationBarBackgroundColor）
 * 运行时样式请使用 CSS 自定义属性（var(--color-xxx)）
 */

/* ═══ 主色 Amber ═══ */
$color-primary: #d97706;
$color-primary-hover: #f59e0b;
$color-primary-pressed: #b45309;
$color-primary-bg: #fffbeb;
$color-primary-text: #92400e;

/* ═══ 辅色 Lime ═══ */
$color-accent: #65a30d;
$color-accent-hover: #84cc16;
$color-accent-pressed: #4d7c0f;
$color-accent-bg: #ecfccb;
$color-accent-text: #4d7c0f;

/* ═══ 功能色 ═══ */
$color-error: #ef4444;
$color-success: #22c55e;
$color-info: #3b82f6;
$color-warning: #f97316;

/* ═══ 收藏 ═══ */
$color-favorite: #ef4444;
$color-favorite-muted: #d1d5db;

/* ═══ 文字 ═══ */
$color-text: #111827;
$color-text-secondary: #374151;
$color-text-tertiary: #6b7280;
$color-text-disabled: #9ca3af;
$color-text-inverse: #ffffff;

/* ═══ 背景/边框 ═══ */
$color-border: #e5e7eb;
$color-border-light: #f3f4f6;
$color-fill: #f3f4f6;
$color-bg: #f9fafb;
$color-surface: #ffffff;
$color-mask: rgba(0, 0, 0, 0.5);

/* ═══ uni-app 兼容变量映射 ═══ */
$uni-color-primary: $color-primary;
$uni-color-success: $color-success;
$uni-color-warning: $color-warning;
$uni-color-error: $color-error;
$uni-text-color: $color-text;
$uni-text-color-inverse: $color-text-inverse;
$uni-text-color-grey: $color-text-tertiary;
$uni-text-color-placeholder: $color-text-disabled;
$uni-text-color-disable: $color-text-disabled;
$uni-bg-color: $color-surface;
$uni-bg-color-grey: $color-bg;
$uni-bg-color-hover: $color-fill;
$uni-bg-color-mask: $color-mask;
$uni-border-color: $color-border;

/* ═══ 尺寸变量（保留原有）═══ */
$uni-font-size-sm: 12px;
$uni-font-size-base: 14px;
$uni-font-size-lg: 16px;
$uni-img-size-sm: 20px;
$uni-img-size-base: 26px;
$uni-img-size-lg: 40px;
$uni-border-radius-sm: 2px;
$uni-border-radius-base: 3px;
$uni-border-radius-lg: 6px;
$uni-border-radius-circle: 50%;
$uni-spacing-row-sm: 5px;
$uni-spacing-row-base: 10px;
$uni-spacing-row-lg: 15px;
$uni-spacing-col-sm: 4px;
$uni-spacing-col-base: 8px;
$uni-spacing-col-lg: 12px;
$uni-opacity-disabled: 0.3;
$uni-color-title: #2c405a;
$uni-font-size-title: 20px;
$uni-color-subtitle: #555;
$uni-font-size-subtitle: 18px;
$uni-color-paragraph: #3f536e;
$uni-font-size-paragraph: 15px;
```

- [ ] **Step 2: 提交**

```bash
git add src/uni.scss
git commit -m "feat(theme): update uni.scss with new semantic color variables"
```

---

### Task 7: 更新 App.vue 导入样式和初始化主题

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 更新 App.vue**

将整个文件替换为：

```vue
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { initTheme } from "@/utils/theme"
import "@/styles/index.css"

onLaunch(() => {
  console.log("App Launch")
  initTheme()
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})
</script>
```

- [ ] **Step 2: 提交**

```bash
git add src/App.vue
git commit -m "feat(theme): import theme styles and init theme in App.vue"
```

---

### Task 8: 更新 pages.json 导航栏颜色

**Files:**
- Modify: `src/pages.json`

- [ ] **Step 1: 更新 globalStyle 导航栏背景色**

将 `src/pages.json` 的 `globalStyle` 改为：

```json
"globalStyle": {
  "navigationBarTextStyle": "black",
  "navigationBarTitleText": "菜点坊",
  "navigationBarBackgroundColor": "#fef3c7",
  "backgroundColor": "#f9fafb"
}
```

说明：`navigationBarBackgroundColor` 改为 `amber-100`（`#fef3c7`），与暖色主题协调。`backgroundColor` 改为 `--color-bg` 值（`#f9fafb`）。

- [ ] **Step 2: 提交**

```bash
git add src/pages.json
git commit -m "feat(theme): update navigation bar colors to match new theme"
```

---

### Task 9: 迁移首页 (index.vue) 硬编码颜色

**Files:**
- Modify: `src/pages/index/index.vue`

- [ ] **Step 1: 替换 style 中的硬编码颜色**

将 `<style scoped>` 中的所有硬编码颜色替换为 CSS 自定义属性。完整替换内容如下：

```css
<style scoped>
.page {
  height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, var(--color-header-from) 0%, var(--color-header-via) 40%, var(--color-header-to) 100%);
}

.header::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -15%;
  width: 350rpx;
  height: 350rpx;
  background: radial-gradient(circle, var(--color-header-decor-primary) 0%, transparent 65%);
  border-radius: 50%;
}

.header::after {
  content: '';
  position: absolute;
  bottom: -25%;
  left: -5%;
  width: 280rpx;
  height: 280rpx;
  background: radial-gradient(circle, var(--color-header-decor-accent) 0%, transparent 60%);
  border-radius: 50%;
}

.header-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 32rpx 28rpx 0;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-header-title);
  position: relative;
  z-index: 1;
  display: block;
}

.subtitle {
  font-size: 20rpx;
  color: var(--color-header-subtitle);
  position: relative;
  z-index: 1;
  margin-top: 6rpx;
  display: block;
}

.content {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 160rpx;
  background: var(--color-surface);
  border-right: 2rpx solid var(--color-border-light);
}

.sidebar-item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sidebar-item.active {
  background-color: var(--color-primary-bg);
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5rpx;
  height: 32rpx;
  background-color: var(--color-primary);
  border-radius: 0 3rpx 3rpx 0;
}

.sidebar-item-text {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.sidebar-item.active .sidebar-item-text {
  color: var(--color-text);
  font-weight: 700;
}

.list {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
  min-height: 0;
}

.list-empty {
  padding: 80rpx 32rpx;
  display: flex;
  justify-content: center;
}

.list-empty-text {
  font-size: 24rpx;
  color: var(--color-text-disabled);
  text-align: center;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  flex-shrink: 0;
  width: 60rpx;
}

.fav-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-btn:active {
  opacity: 0.7;
}

.fav-icon {
  font-size: 30rpx;
  color: var(--color-favorite-muted);
  line-height: 1;
}

.fav-icon--on {
  color: var(--color-favorite);
}

.food-card {
  background: var(--color-surface);
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  background: var(--color-fill);
  display: block;
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
}

.desc {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  margin-top: 6rpx;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn:active {
  background: var(--color-primary-pressed);
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
  line-height: 1;
}

.bottom {
  height: 140rpx;
  padding: 0 28rpx;
  background: var(--color-surface);
  border-top: 2rpx solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.bottom-text {
  color: var(--color-text);
  font-size: 20rpx;
  font-weight: 500;
}

.bottom-text:active {
  opacity: 0.7;
}

.cart-btn {
  width: 180rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn:active {
  background: var(--color-primary-pressed);
}

.cart-btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}

/* Drawer Styles */
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-mask);
  z-index: 1000;
}

.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: calc(100vh - 100rpx);
  background: var(--color-surface);
  border-radius: 20rpx 20rpx 0 0;
  z-index: 1001;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.drawer.drawer-open {
  transform: translateY(0);
}

.drawer-drag-indicator {
  width: 40rpx;
  height: 3rpx;
  background: var(--color-border);
  border-radius: 2rpx;
  align-self: center;
  margin-top: 6rpx;
}

.drawer-header {
  padding: 16rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.drawer-clear-btn {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.drawer-clear-btn:active {
  background: var(--color-fill);
  color: var(--color-text);
}

.drawer-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
}

.drawer-close {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close-text {
  font-size: 40rpx;
  color: var(--color-text-tertiary);
  line-height: 1;
}

.drawer-divider {
  height: 2rpx;
  background: var(--color-border-light);
  margin: 0 32rpx;
}

.drawer-content {
  flex: 1;
  padding: 12rpx 28rpx;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
}

.drawer-empty {
  padding: 80rpx 0;
  display: flex;
  justify-content: center;
}

.drawer-empty-text {
  color: var(--color-text-tertiary);
  font-size: 28rpx;
}

.drawer-line {
  background: var(--color-surface);
  border: 2rpx solid var(--color-border-light);
  border-radius: 20rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.drawer-thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 14rpx;
  background: var(--color-fill);
  flex-shrink: 0;
}

.drawer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.drawer-name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text);
}

.drawer-stepper {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.drawer-stepper-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-stepper-minus {
  background: var(--color-fill);
}

.drawer-stepper-minus.drawer-stepper-disabled {
  opacity: 0.5;
}

.drawer-stepper-plus {
  background: var(--color-primary);
}

.drawer-stepper-plus:active {
  background: var(--color-primary-pressed);
}

.drawer-stepper-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
}

.drawer-stepper-minus .drawer-stepper-btn-text {
  color: var(--color-text);
}

.drawer-stepper-plus .drawer-stepper-btn-text {
  color: var(--color-text-inverse);
}

.drawer-stepper-value {
  min-width: 28rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
}

.drawer-bottom {
  padding: 16rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-total {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
}

.drawer-submit-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-submit-disabled {
  background: var(--color-text-disabled);
}

.drawer-submit-btn:active:not(.drawer-submit-disabled) {
  background: var(--color-primary-pressed);
}

.drawer-submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/index/index.vue
git commit -m "feat(theme): migrate index page to CSS custom properties"
```

---

### Task 10: 迁移购物车页 (cart.vue) 硬编码颜色

**Files:**
- Modify: `src/pages/cart/cart.vue`

- [ ] **Step 1: 替换 style 中的硬编码颜色**

```css
<style scoped>
.page {
  height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  padding: 32rpx 28rpx 0;
  background: var(--color-surface);
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-text);
}

.list {
  flex: 1;
  min-height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.empty {
  padding: 160rpx 0;
  display: flex;
  justify-content: center;
}

.empty-text {
  color: var(--color-text-tertiary);
  font-size: 24rpx;
}

.line {
  background: var(--color-surface);
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 20rpx;
  background: var(--color-fill);
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text);
}

.stepper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-shrink: 0;
}

.stepper-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-btn.minus {
  background: var(--color-fill);
}

.stepper-btn.minus.disabled {
  opacity: 0.5;
}

.stepper-btn.plus {
  background: var(--color-primary);
}

.stepper-btn.plus:active {
  background: var(--color-primary-pressed);
}

.stepper-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

.stepper-btn.minus .stepper-btn-text {
  color: var(--color-text);
}

.stepper-btn.plus .stepper-btn-text {
  color: var(--color-text-inverse);
}

.stepper-value {
  min-width: 32rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: var(--color-text);
  text-align: center;
}

.bottom {
  padding: 24rpx;
  background: var(--color-surface);
  border-top: 2rpx solid var(--color-border);
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn.disabled {
  background: var(--color-text-disabled);
}

.submit-btn:active:not(.disabled) {
  background: var(--color-primary-pressed);
}

.submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/cart/cart.vue
git commit -m "feat(theme): migrate cart page to CSS custom properties"
```

---

### Task 11: 迁移详情页 (detail.vue) 硬编码颜色

**Files:**
- Modify: `src/pages/detail/detail.vue`

- [ ] **Step 1: 替换 style 中的硬编码颜色**

```css
<style scoped>
.page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.header {
  min-height: 200rpx;
  padding: 32rpx 28rpx 0;
  background: var(--color-surface);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-text);
  flex: 1;
  min-width: 0;
}

.header-fav {
  padding: 4rpx 0 4rpx 12rpx;
  flex-shrink: 0;
}

.header-fav-icon {
  font-size: 40rpx;
  color: var(--color-favorite-muted);
  line-height: 1;
}

.header-fav-icon--on {
  color: var(--color-favorite);
}

.content {
  flex: 1;
  padding: 28rpx;
  box-sizing: border-box;
}

.hero-card {
  border-radius: 24rpx;
  overflow: hidden;
  background: var(--color-fill);
}

.food-image {
  width: 100%;
  height: 320rpx;
  display: block;
  background: var(--color-fill);
}

.food-info {
  margin-top: 28rpx;
}

.food-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.food-name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
}

.food-tags {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
}

.tag {
  padding: 6rpx 12rpx;
  background: var(--color-primary-bg);
  border-radius: 6rpx;
}

.tag-text {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}

.food-desc {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  margin-top: 12rpx;
  display: block;
}

.card {
  background: var(--color-surface);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-top: 28rpx;
}

.card-title {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
  display: block;
}

.divider {
  height: 2rpx;
  background: var(--color-border-light);
  margin: 20rpx 0;
}

.section {
  margin-bottom: 20rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  display: block;
  margin-bottom: 12rpx;
}

.ingredient-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.ingredient-tag {
  padding: 12rpx 16rpx;
  background: var(--color-bg);
  border-radius: 6rpx;
}

.ingredient-text {
  font-size: 24rpx;
  color: var(--color-text);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.step {
  display: flex;
  align-items: flex-start;
}

.step-text {
  font-size: 24rpx;
  color: var(--color-text);
  line-height: 1.6;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/detail/detail.vue
git commit -m "feat(theme): migrate detail page to CSS custom properties"
```

---

### Task 12: 迁移订单页 (order.vue) 硬编码颜色

**Files:**
- Modify: `src/pages/order/order.vue`

- [ ] **Step 1: 替换 style 中的硬编码颜色**

```css
<style scoped>
.container {
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: 28rpx;
  box-sizing: border-box;
}

.header {
  height: 200rpx;
  padding: 32rpx 0 0;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--color-text);
}

.order-card {
  background-color: var(--color-surface);
  border-radius: 32rpx;
  padding: 40rpx 28rpx;
}

.section-title {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
  display: block;
  margin-bottom: 28rpx;
}

.divider {
  height: 2rpx;
  background: var(--color-border-light);
  margin-bottom: 28rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid var(--color-border-light);
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 24rpx;
  font-weight: 500;
  color: var(--color-text);
}

.item-count {
  font-size: 24rpx;
  font-weight: 500;
  color: var(--color-text);
}

.action-area {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.primary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn:active {
  background: var(--color-primary-pressed);
}

.primary-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text-inverse);
}

.secondary-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: var(--color-surface);
  border: 2rpx solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.secondary-btn:active {
  background: var(--color-bg);
}

.secondary-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/order/order.vue
git commit -m "feat(theme): migrate order page to CSS custom properties"
```

---

### Task 13: 迁移分享页 (share.vue) 硬编码颜色

**Files:**
- Modify: `src/pages/share/share.vue`

- [ ] **Step 1: 替换 style 中的硬编码颜色**

```css
<style scoped>
.page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 28rpx;
  box-sizing: border-box;
  position: relative;
}

.bg-tint {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 300rpx;
  background: var(--color-primary-bg);
}

.ticket {
  position: relative;
  background: var(--color-surface);
  border-radius: 16rpx;
  border: 1rpx solid var(--color-border);
  padding: 28rpx;
  margin-top: 100rpx;
}

.cutout {
  position: absolute;
  top: 220rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background: var(--color-bg);
  border: 1rpx solid var(--color-border);
}

.cutout.left {
  left: -16rpx;
}

.cutout.right {
  right: -16rpx;
}

.h1 {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--color-text);
  display: block;
}

.sub {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: var(--color-text-tertiary);
  display: block;
}

.tag {
  margin-top: 12rpx;
  align-self: flex-start;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: var(--color-primary-bg);
  display: inline-flex;
}

.tag-text {
  font-size: 20rpx;
  font-weight: 700;
  color: var(--color-primary);
}

.divider {
  margin-top: 20rpx;
  height: 1rpx;
  background: var(--color-border-light);
}

.rows {
  margin-top: 14rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 0;
  border-bottom: 1rpx solid var(--color-border-light);
}

.row:last-child {
  border-bottom: none;
}

.row-name {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-text);
}

.row-name:active {
  color: var(--color-primary);
}

.row-qty {
  font-size: 24rpx;
  font-weight: 900;
  color: var(--color-primary);
}

.footer {
  margin-top: 22rpx;
}

.footer-note {
  font-size: 20rpx;
  color: var(--color-text-tertiary);
}

.signature {
  margin-top: 14rpx;
  background: var(--color-primary-bg);
  border-radius: 12rpx;
  padding: 14rpx;
}

.signature-text {
  font-size: 20rpx;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/share/share.vue
git commit -m "feat(theme): migrate share page to CSS custom properties"
```

---

### Task 14: 验证构建与视觉检查

- [ ] **Step 1: 运行构建，确保无报错**

```bash
cd /Users/luzhaotian/Draft/Github/caidianfang-uniapp && npm run build:mp-weixin
```

Expected: 构建成功，无错误

- [ ] **Step 2: 运行 H5 开发服务器，目视检查**

```bash
cd /Users/luzhaotian/Draft/Github/caidianfang-uniapp && npm run dev:h5
```

Expected: 所有页面正常渲染，颜色从暖橙 `#f4a261` 变为麦穗金 `#d97706`，视觉风格保持一致

- [ ] **Step 3: 修复任何构建或样式问题**

如果发现问题，修复后提交。

- [ ] **Step 4: 最终提交**

```bash
git add -A
git commit -m "feat(theme): complete theme color system migration"
```
