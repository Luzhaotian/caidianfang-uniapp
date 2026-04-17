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
├── store/           # 状态管理（Pinia）
├── data/            # 静态数据
├── types/           # TypeScript 类型定义
├── static/          # 静态资源
├── App.vue          # 应用入口
└── pages.json       # 页面配置
```

## 技术栈

- **框架**: uni-app (Vue 3)
- **语言**: TypeScript
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
