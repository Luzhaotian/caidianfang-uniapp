# 菜点坊主题色系统设计

## 概述

为「菜点坊」（今晚吃什么）微信小程序设计完整的主题色系统，采用**语义化 Token + 暗色模式**方案，解决当前颜色硬编码、命名混乱、无法切换暗色的问题。

### 设计方向

- **风格**：清新自然 — 健康有机，田园风
- **色系**：麦穗暖阳 — 金黄(Amber)+草绿(Lime)
- **浓度**：浓郁饱满 — 高饱和度，视觉冲击强，品牌感突出

## 架构

三层分离架构：

```
┌─────────────────────────────────────┐
│  组件层（各 .vue 文件）               │  ← 使用语义 Token
│  color: var(--color-primary)        │
├─────────────────────────────────────┤
│  语义 Token 层（token 映射）         │  ← 运行时可切换
│  --color-primary → --amber-600      │
├─────────────────────────────────────┤
│  原始色板层（色值定义）               │  ← 静态，不变
│  --amber-600: #d97706               │
└─────────────────────────────────────┘
```

- **原始色板**：定义所有基础色阶（amber-50 到 amber-900 等），静态不变
- **语义 Token**：将色阶映射到用途（primary、accent、surface 等），运行时通过 `data-theme` 切换
- **组件**：只引用语义 Token，不直接使用色值
- **暗色切换**：只需改变语义 Token 的映射，组件代码零改动

## 原始色板

### Amber（麦穗金）— 主色

| Token | 色值 | 用途 |
|-------|------|------|
| `--amber-50` | #fffbeb | 最浅背景 |
| `--amber-100` | #fef3c7 | 浅背景 |
| `--amber-200` | #fde68a | 浅色文字（暗色模式） |
| `--amber-300` | #fcd34d | hover 态（暗色模式） |
| `--amber-400` | #fbbf24 | 主色（暗色模式） |
| `--amber-500` | #f59e0b | hover 态（亮色模式） |
| `--amber-600` | #d97706 | 主色（亮色模式） |
| `--amber-700` | #b45309 | pressed 态（亮色模式） |
| `--amber-800` | #92400e | 主色文字（亮色模式） |
| `--amber-900` | #78350f | 最深色 |

### Lime（草叶绿）— 辅色

| Token | 色值 | 用途 |
|-------|------|------|
| `--lime-50` | #f7fee7 | 最浅背景 |
| `--lime-100` | #ecfccb | 浅背景 |
| `--lime-200` | #d9f99d | 浅色文字（暗色模式） |
| `--lime-300` | #bef264 | accent 文字（暗色模式） |
| `--lime-400` | #a3e635 | accent 色（暗色模式） |
| `--lime-500` | #84cc16 | — |
| `--lime-600` | #65a30d | accent 色（亮色模式） |
| `--lime-700` | #4d7c0f | accent 文字（亮色模式） |
| `--lime-800` | #3f6212 | — |
| `--lime-900` | #365314 | 最深色 |

### 功能色

| 名称 | 色值 |
|------|------|
| error | #ef4444 |
| error-light | #f87171 |
| error-bg | #fef2f2 |
| success | #22c55e |
| success-bg | #f0fdf4 |
| info | #3b82f6 |
| info-bg | #eff6ff |
| warning | #f97316 |
| warning-bg | #fff7ed |

### 中性色

| 名称 | 亮色值 | 暗色值 |
|------|--------|--------|
| text | #111827 | #f5f5f4 |
| text-secondary | #374151 | #d6d3d1 |
| text-tertiary | #6b7280 | #a8a29e |
| text-disabled | #9ca3af | #78716c |
| border | #e5e7eb | #44403c |
| fill | #f3f4f6 | #292524 |
| bg | #f9fafb | #1c1917 |
| surface | #ffffff | #292524 |
| mask | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) |

## 语义 Token 映射

### 亮色模式（默认）

```css
:root {
  /* 主色 */
  --color-primary: var(--amber-600);         /* #d97706 */
  --color-primary-hover: var(--amber-500);    /* #f59e0b */
  --color-primary-pressed: var(--amber-700);  /* #b45309 */
  --color-primary-bg: var(--amber-50);        /* #fffbeb */
  --color-primary-text: var(--amber-800);     /* #92400e */

  /* 辅色 */
  --color-accent: var(--lime-600);            /* #65a30d */
  --color-accent-hover: var(--lime-500);      /* #84cc16 */
  --color-accent-pressed: var(--lime-700);    /* #4d7c0f */
  --color-accent-bg: var(--lime-100);         /* #ecfccb */
  --color-accent-text: var(--lime-700);       /* #4d7c0f */

  /* 功能色 */
  --color-error: #ef4444;
  --color-error-bg: #fef2f2;
  --color-success: #22c55e;
  --color-success-bg: #f0fdf4;
  --color-info: #3b82f6;
  --color-info-bg: #eff6ff;
  --color-warning: #f97316;
  --color-warning-bg: #fff7ed;

  /* 收藏/红心 */
  --color-favorite: #ef4444;
  --color-favorite-muted: #d1d5db;

  /* 中性色 */
  --color-text: #111827;
  --color-text-secondary: #374151;
  --color-text-tertiary: #6b7280;
  --color-text-disabled: #9ca3af;
  --color-text-inverse: #ffffff;

  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;
  --color-fill: #f3f4f6;
  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-mask: rgba(0, 0, 0, 0.5);

  /* Header 渐变 */
  --color-header-from: #fffbeb;
  --color-header-via: #fef3c7;
  --color-header-to: #fde68a;

  /* Header 装饰 */
  --color-header-decor-primary: rgba(217, 119, 6, 0.15);
  --color-header-decor-accent: rgba(132, 204, 22, 0.18);

  /* Header 文字 */
  --color-header-title: #92400e;
  --color-header-subtitle: #b45309;
}
```

### 暗色模式

```css
:root[data-theme="dark"] {
  /* 主色 */
  --color-primary: var(--amber-400);          /* #fbbf24 */
  --color-primary-hover: var(--amber-300);    /* #fcd34d */
  --color-primary-pressed: var(--amber-500);  /* #f59e0b */
  --color-primary-bg: #422006;
  --color-primary-text: var(--amber-200);     /* #fde68a */

  /* 辅色 */
  --color-accent: var(--lime-400);            /* #a3e635 */
  --color-accent-hover: var(--lime-300);      /* #bef264 */
  --color-accent-pressed: var(--lime-500);    /* #84cc16 */
  --color-accent-bg: #1a2e05;
  --color-accent-text: var(--lime-300);       /* #bef264 */

  /* 功能色 */
  --color-error: #f87171;
  --color-error-bg: #450a0a;
  --color-success: #4ade80;
  --color-success-bg: #052e16;
  --color-info: #60a5fa;
  --color-info-bg: #172554;
  --color-warning: #fb923c;
  --color-warning-bg: #431407;

  /* 收藏/红心 */
  --color-favorite: #f87171;
  --color-favorite-muted: #78716c;

  /* 中性色 */
  --color-text: #f5f5f4;
  --color-text-secondary: #d6d3d1;
  --color-text-tertiary: #a8a29e;
  --color-text-disabled: #78716c;
  --color-text-inverse: #1c1917;

  --color-border: #44403c;
  --color-border-light: #292524;
  --color-fill: #292524;
  --color-bg: #1c1917;
  --color-surface: #292524;
  --color-mask: rgba(0, 0, 0, 0.7);

  /* Header 渐变 */
  --color-header-from: #292524;
  --color-header-via: #1c1917;
  --color-header-to: #1c1917;

  /* Header 装饰 */
  --color-header-decor-primary: rgba(251, 191, 36, 0.1);
  --color-header-decor-accent: rgba(163, 230, 53, 0.08);

  /* Header 文字 */
  --color-header-title: #fde68a;
  --color-header-subtitle: #fbbf24;
}
```

## 文件结构

```
src/
├── styles/
│   ├── themes/
│   │   ├── light.css       # 亮色模式 Token 定义（:root 选择器）
│   │   └── dark.css        # 暗色模式 Token 定义（:root[data-theme="dark"] 选择器）
│   ├── palette.css          # 原始色板（amber/lime 色阶）
│   └── index.css            # 汇总入口，导入以上文件
├── uni.scss                 # SCSS 变量桥接（引用 CSS 自定义属性）
└── App.vue                  # 导入 index.css，初始化主题
```

### 各文件职责

**`palette.css`**：原始色阶定义，静态不变，供 Token 层引用
**`themes/light.css`**：亮色语义 Token 映射，绑定在 `:root` 上
**`themes/dark.css`**：暗色语义 Token 映射，绑定在 `:root[data-theme="dark"]` 上
**`index.css`**：汇总入口，按顺序导入 palette → light → dark
**`uni.scss`**：SCSS 变量桥接，让编译时场景（如 `pages.json` 的 `navigationBarBackgroundColor`）也能使用语义色

## 暗色模式切换

### 触发方式

1. **跟随系统**：默认行为，通过 `uni.onThemeChange` 监听系统主题变化
2. **手动切换**：在设置页提供开关，覆盖系统偏好

### 实现逻辑

```typescript
// src/utils/theme.ts
const THEME_KEY = 'app-theme'

type Theme = 'light' | 'dark' | 'system'

export function initTheme() {
  const saved = uni.getStorageSync(THEME_KEY) as Theme | ''
  if (saved && saved !== 'system') {
    applyTheme(saved)
  } else {
    // 跟随系统
    const systemTheme = uni.getSystemInfoSync().theme || 'light'
    applyTheme(systemTheme)
  }

  // 监听系统主题变化
  uni.onThemeChange((result) => {
    const current = uni.getStorageSync(THEME_KEY) as Theme | ''
    if (!current || current === 'system') {
      applyTheme(result.theme)
    }
  })
}

export function setTheme(theme: Theme) {
  uni.setStorageSync(THEME_KEY, theme)
  if (theme === 'system') {
    const systemTheme = uni.getSystemInfoSync().theme || 'light'
    applyTheme(systemTheme)
  } else {
    applyTheme(theme)
  }
}

function applyTheme(theme: 'light' | 'dark') {
  // uni-app 中通过 page 的 style 设置
  // 小程序下使用 page[data-theme] 选择器
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const page = pages[pages.length - 1]
    // @ts-ignore
    page.$page?.setData?.({ theme })
  }
}
```

### 小程序兼容性

微信小程序不支持 `document.documentElement.setAttribute`，需要通过以下方式实现：

1. 在每个页面的最外层 `<view>` 上绑定 `:data-theme="theme"`
2. CSS 选择器改为 `view[data-theme="dark"]` 代替 `:root[data-theme="dark"]`
3. 或使用 `@media (prefers-color-scheme: dark)` 作为 fallback

## uni.scss 桥接

为保持 SCSS 编译时变量的兼容性（`pages.json` 等场景），`uni.scss` 同步更新：

```scss
// 主色（SCSS 变量，用于编译时场景）
$color-primary: #d97706;
$color-primary-hover: #f59e0b;
$color-primary-pressed: #b45309;
$color-primary-bg: #fffbeb;
$color-primary-text: #92400e;

// 辅色
$color-accent: #65a30d;
$color-accent-hover: #84cc16;
$color-accent-pressed: #4d7c0f;
$color-accent-bg: #ecfccb;
$color-accent-text: #4d7c0f;

// 功能色
$color-error: #ef4444;
$color-success: #22c55e;
$color-info: #3b82f6;
$color-warning: #f97316;

// 收藏
$color-favorite: #ef4444;
$color-favorite-muted: #d1d5db;

// 文字
$color-text: #111827;
$color-text-secondary: #374151;
$color-text-tertiary: #6b7280;
$color-text-disabled: #9ca3af;
$color-text-inverse: #ffffff;

// 背景/边框
$color-border: #e5e7eb;
$color-border-light: #f3f4f6;
$color-fill: #f3f4f6;
$color-bg: #f9fafb;
$color-surface: #ffffff;
$color-mask: rgba(0, 0, 0, 0.5);

// uni-app 兼容变量（保留，映射到新值）
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
```

## 现有颜色映射

各页面硬编码颜色到语义 Token 的映射关系：

| 现有硬编码值 | 出现位置 | 映射到 |
|-------------|---------|--------|
| `#f4a261` | 主按钮、侧边栏指示条、分享标签 | `--color-primary` |
| `#e8954f` | 按钮按下态 | `--color-primary-pressed` |
| `#e63946` | 收藏红心 | `--color-favorite` |
| `#f7f8fa` / `#f7f7fa` | 页面背景 | `--color-bg` |
| `#fef9f3` → `#fce8d5` | Header 渐变 | `--color-header-from/via/to` |
| `rgba(244,162,97,0.15)` | Header 装饰圆 | `--color-header-decor-primary` |
| `rgba(233,196,106,0.18)` | Header 装饰圆 | `--color-header-decor-accent` |
| `#fef6f0` | 侧边栏选中、标签背景 | `--color-primary-bg` |
| `#111827` / `#121726` | 主文字 | `--color-text`（统一） |
| `#6b7280` / `#6b7380` | 副文字 | `--color-text-tertiary`（统一） |
| `#8b5a3c` | Header 标题 | `--color-header-title` |
| `#b88a6b` | Header 副标题 | `--color-header-subtitle` |
| `#edf0f5` / `#edeff5` | 占位/分割线 | `--color-border-light`（统一） |
| `#e5e8ed` / `#dee0e5` | 卡片边框 | `--color-border`（统一） |
| `#d1d5db` | 未收藏心形 | `--color-favorite-muted` |
| `#ccc` | 禁用态 | `--color-text-disabled` |
| `rgba(0,0,0,0.5)` | 遮罩 | `--color-mask` |
| `#e0e0e0` | 拖动指示器 | `--color-border` |

## 迁移策略

1. **创建主题文件**：新建 `src/styles/` 目录及所有 CSS 文件
2. **更新 `uni.scss`**：替换为新的 SCSS 变量
3. **更新 `App.vue`**：导入 `index.css`，初始化主题
4. **逐页面替换**：将硬编码颜色替换为 `var(--color-xxx)`
5. **添加暗色模式切换**：实现 `theme.ts` 工具函数
6. **统一不一致色值**：消除 `#111827` vs `#121726` 等近似色差异
