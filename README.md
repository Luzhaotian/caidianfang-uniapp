# 菜点坊

简约便捷的微信小程序菜单分享工具，快速点餐，一键分享给好友。

## 项目介绍

菜点坊是一款面向餐饮场景的微信小程序，帮助用户：

- **快速点餐** - 浏览菜单，轻松添加菜品到购物车
- **一键分享** - 将点好的菜单快速分享给微信好友
- **多人协作** - 好友可查看、补充订单，方便聚餐点餐

## 项目架构

基于 **uni-app + Vue 3 + TypeScript** 构建：

```
src/
├── pages/           # 页面目录
│   ├── index/       # 首页 - 菜单浏览
│   ├── cart/        # 购物车
│   ├── order/       # 订单详情
│   ├── share/       # 分享页面
│   └── detail/      # 菜品详情
├── store/           # 状态管理
├── styles/          # 主题样式
│   ├── palette.css  # 原始色板（Amber/Lime 色阶）
│   ├── index.css    # 样式入口
│   └── themes/      # 亮色/暗色模式 Token
├── utils/           # 工具函数（含主题切换）
├── data/            # 静态数据
├── types/           # TypeScript 类型定义
├── static/          # 静态资源
├── uni.scss         # SCSS 主题变量
├── App.vue          # 应用入口
└── pages.json       # 页面配置
```

## 主题色系统

采用 **麦穗暖阳** 主题色方案（Amber 金黄 + Lime 草绿），通过 SCSS 变量管理：

- **主色**：`$color-primary: #d97706`（麦穗金 amber-600）
- **辅色**：`$color-accent: #65a30d`（草叶绿 lime-600）
- **完整变量**：参见 `src/uni.scss`

组件中使用 `<style lang="scss" scoped>` 即可直接引用 `$color-xxx` 变量，无需手动 import。

## 技术栈

- **框架**: uni-app (Vue 3)
- **语言**: TypeScript
- **样式**: SCSS
- **构建**: Vite
- **测试**: Vitest

## 运行项目

```bash
# 安装依赖
npm install

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 H5
npm run dev:h5
```

## 打包发布

```bash
# 打包微信小程序
npm run build:mp-weixin

# 打包 H5
npm run build:h5
```
