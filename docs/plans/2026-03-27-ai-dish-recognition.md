# AI 识菜功能实现计划

> **For agentic workers:** 使用 executing-plans 执行本计划，逐步实施。

**Goal:** 接入微信小程序 AI 开发模式，实现"AI 识菜"功能——用户通过小程序 AI 对话输入文字或链接，AI 自动分析是否为菜品，如果是则生成符合 MenuItem 数据结构的菜品对象并保存到缓存。

**Architecture:** 创建 `dish-skill` SKILL，包含 3 个原子接口（fetchUrl、saveCustomDish、listCustomDishes）和 2 个原子组件（dish-preview-card、custom-dishes-card）。SKILL 通过 `wx.setStorageSync` 将自定义菜品写入共享存储，主应用（uni-app 侧）从同一存储 key 读取并合并到菜单列表中。

**Tech Stack:** 微信小程序 AI 开发模式 (SKILL/MCP)、原生 JS（SKILL 环境）、uni-app + Vue 3 + TypeScript（主应用）

---

## 前置条件

1. 在微信公众平台「基础功能 - AI 能力」中申请「开发模式」内测权限
2. 下载安装微信开发者工具 **Nightly Electron Build 最新版本**
3. 项目 appid 需已开通 AI 开发模式

## 文件结构总览

```
src/                                # 主应用（uni-app）
├── data/menu/index.ts              # [修改] 合并自定义菜品
├── store/cart.ts                   # [修改] 加载自定义菜品
└── pages/index/index.vue           # [修改] 首页添加 AI 入口提示

skills/                             # [新建] SKILL 分包
└── dish-skill/
    ├── SKILL.md                    # 业务说明
    ├── mcp.json                    # 原子接口声明
    ├── index.js                    # 接口注册
    ├── apis/
    │   ├── fetchUrl.js             # 抓取网页内容
    │   ├── saveCustomDish.js       # 保存自定义菜品
    │   └── listCustomDishes.js     # 列出自定义菜品
    ├── components/
    │   ├── dish-preview-card/      # 菜品预览卡片
    │   │   ├── index.js
    │   │   ├── index.json
    │   │   ├── index.wxml
    │   │   └── index.wxss
    │   └── custom-dishes-card/     # 自定义菜品列表卡片
    │       ├── index.js
    │       ├── index.json
    │       ├── index.wxml
    │       └── index.wxss
    └── utils/
        └── storage.js              # 存储工具

app.json                            # [修改] 添加 agent 配置
page-meta.json                      # [新建] 页面元数据
```

## 存储方案

| Key                       | 读写方                  | 内容                        |
| ------------------------- | ----------------------- | --------------------------- |
| `quickbite_custom_dishes` | SKILL 写入 / 主应用读取 | `MenuItem[]` 自定义菜品数组 |
| `quickbite_cart_v1`       | 主应用读写              | 购物车（已有，不变）        |
| `quickbite_favorites_v1`  | 主应用读写              | 收藏（已有，不变）          |

SKILL 与主应用通过 **同一 storage key** 共享数据。SKILL 环境中使用 `wx.setStorageSync`，主应用中使用 `uni.getStorageSync`（底层均调用微信 storage API）。

---

## Task 1: 修改 app.json 注册 SKILL

**Files:**

- Modify: `app.json`

- [ ] **Step 1: 在 app.json 中添加 agent 配置和 skills 分包**

在 `app.json` 的 `pages` 字段后添加 `subPackages` 和 `agent` 配置。注意：当前项目没有 `app.json`（uni-app 使用 `src/manifest.json` 和 `src/pages.json`），但微信小程序编译后的产物在 `dist/build/mp-weixin/app.json`。对于 uni-app 项目，agent 配置需要在编译后的微信小程序 app.json 中添加。

**方案：** 在项目根目录创建 `app.json`，uni-app 编译时会合并此配置。或者在 `src/manifest.json` 的 `mp-weixin` 字段中配置（如果支持）。

实际操作：由于 uni-app 的 `manifest.json` 不直接支持 `agent` 字段，我们需要在构建后手动添加，或者使用 uni-app 的 `mp-weixin` 扩展配置。

**推荐方案：** 创建根目录 `app.json`（uni-app 会自动合并）：

```json
{
  "subPackages": [
    {
      "root": "skills",
      "pages": [],
      "independent": true
    }
  ],
  "agent": {
    "skills": [
      {
        "name": "dish",
        "description": "菜点坊 AI 识菜：分析用户输入的文字或链接，识别菜品信息并保存到菜单",
        "path": "skills/dish-skill"
      }
    ],
    "pageMetadata": "page-meta.json"
  }
}
```

- [ ] **Step 2: 创建 page-meta.json**

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "name": "菜点坊首页",
      "description": "菜谱浏览与点餐首页，展示菜品分类、搜索、收藏，支持 AI 识菜添加自定义菜品"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add app.json page-meta.json
git commit -m "feat: register dish-skill in app.json agent config"
```

---

## Task 2: 创建 SKILL 基础结构

**Files:**

- Create: `skills/dish-skill/SKILL.md`
- Create: `skills/dish-skill/mcp.json`
- Create: `skills/dish-skill/index.js`
- Create: `skills/dish-skill/utils/storage.js`

- [ ] **Step 1: 创建 SKILL.md**

```markdown
# dish-skill 菜点坊 AI 识菜

## 业务流程图
```

用户意图
│
├─ 输入文字（"红烧肉怎么做"、"番茄炒蛋"）─→ Agent 直接分析文字内容
│ │
│ ├─ 是菜品 ─→ saveCustomDish → 菜品预览卡片
│ └─ 非菜品 ─→ 告知用户这不是菜品信息
│
├─ 输入链接（https://...）─→ fetchUrl → 获取网页内容
│ │
│ ├─ Agent 分析网页内容
│ │ ├─ 是菜品 ─→ saveCustomDish → 菜品预览卡片
│ │ └─ 非菜品 ─→ 告知用户该链接内容不是菜品
│ └─ 抓取失败 ─→ 告知用户无法访问该链接
│
├─ "看看我加的菜" / "自定义菜品" ─→ listCustomDishes → 自定义菜品列表卡片
│
└─ "推荐菜品" / "有什么菜" ─→ listCustomDishes → 自定义菜品列表卡片

````

> Agent 必须先通过 fetchUrl 获取链接内容后再分析，禁止猜测链接内容。
> Agent 必须在确认是菜品信息后才能调用 saveCustomDish，禁止将非菜品内容保存。
> saveCustomDish 返回成功后，必须展示菜品预览卡片，禁止以纯文本列出。

## 原子接口依赖关系

| 接口 | 作用 | 组件 | 前置条件 |
|------|------|------|----------|
| fetchUrl | 抓取网页/链接内容供 Agent 分析 | — | 用户提供了 URL |
| saveCustomDish | 保存自定义菜品到菜单 | dish-preview-card | Agent 已分析确认是菜品 |
| listCustomDishes | 列出已保存的自定义菜品 | custom-dishes-card | — |

## 用户意图分流

### 直接触发本 SKILL 的意图
- "帮我加一道菜"
- "这个链接里的菜不错" + URL
- "红烧排骨怎么做"（文字描述菜品）
- "看看我加的菜"
- "自定义菜品"
- "我收藏的菜"

### 意图分流规则
- 用户只说了菜名或描述（无链接）→ Agent 直接分析文字，调用 saveCustomDish
- 用户提供了链接 → 先调 fetchUrl 获取内容，再分析，调用 saveCustomDish
- 用户想查看自定义菜品 → 调用 listCustomDishes
- 用户意图不明确 → 反问用户是要添加菜品还是查看已有菜品

## 业务约束

### 1. 菜品数据结构
saveCustomDish 必须生成符合以下结构的菜品对象：
```json
{
  "id": "<自动生成的唯一 ID>",
  "categoryId": "<1=荤菜, 2=素菜, 3=主食, 4=饮品>",
  "name": "<菜品名称，必填>",
  "desc": "<简短描述，1-2句话>",
  "image": "<图片 URL 或空字符串>",
  "cookTime": "<烹饪时间，如 '约 30 分钟'>",
  "difficulty": "<难度：简单/中等/较难>",
  "ingredients": [{"name": "<食材名>", "amount": "<用量>"}],
  "seasonings": [{"name": "<调料名>", "amount": "<用量>"}],
  "steps": [{"step": <序号>, "content": "<步骤内容>"}]
}
````

### 2. ID 生成规则

自定义菜品 ID 必须从 10000 起始递增，避免与预设菜品 ID（1-13）冲突。
ID 计算方式：`10000 + 当前自定义菜品数量`

### 3. 分类判断规则

- 包含肉类（猪、牛、羊、鸡、鸭、鱼、虾等）→ categoryId: 1（荤菜）
- 主要为蔬菜、豆腐、蛋类 → categoryId: 2（素菜）
- 米饭、面条、饺子、馒头等主食类 → categoryId: 3（主食）
- 饮料、茶、酒、果汁等 → categoryId: 4（饮品）

### 4. 图片处理

- 如果用户输入中包含图片 URL，直接使用
- 如果是纯文字输入，image 字段设为空字符串
- 禁止编造图片 URL

````

- [ ] **Step 2: 创建 utils/storage.js**

```javascript
// storage 工具：管理自定义菜品的读写
const CUSTOM_DISHES_KEY = 'quickbite_custom_dishes'

function getCustomDishes() {
  try {
    const raw = wx.getStorageSync(CUSTOM_DISHES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('[dish-skill][storage] getCustomDishes error', e)
    return []
  }
}

function saveCustomDishes(dishes) {
  try {
    wx.setStorageSync(CUSTOM_DISHES_KEY, JSON.stringify(dishes))
    return true
  } catch (e) {
    console.error('[dish-skill][storage] saveCustomDishes error', e)
    return false
  }
}

function addCustomDish(dish) {
  const dishes = getCustomDishes()
  // 检查是否已存在同名菜品
  const existing = dishes.find(d => d.name === dish.name)
  if (existing) {
    return { success: false, message: `菜品「${dish.name}」已存在，无需重复添加` }
  }
  // 生成唯一 ID
  const nextId = 10000 + dishes.length
  const newDish = { ...dish, id: nextId }
  dishes.push(newDish)
  const saved = saveCustomDishes(dishes)
  if (saved) {
    return { success: true, dish: newDish }
  }
  return { success: false, message: '保存失败，请稍后重试' }
}

function removeCustomDish(dishId) {
  const dishes = getCustomDishes()
  const filtered = dishes.filter(d => d.id !== dishId)
  return saveCustomDishes(filtered)
}

module.exports = {
  getCustomDishes,
  saveCustomDishes,
  addCustomDish,
  removeCustomDish,
  CUSTOM_DISHES_KEY
}
````

- [ ] **Step 3: 创建 mcp.json**

```json
{
  "apis": [
    {
      "name": "fetchUrl",
      "description": "抓取指定 URL 的网页内容，返回文本供 Agent 分析。\n调用前置条件：用户提供了一个 URL 链接。\n【严禁场景】用户未提供 URL 时禁止调用本接口。Agent 禁止猜测 URL 内容，必须先调用本接口获取实际内容。",
      "inputSchema": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "用户提供的 URL 链接，必须以 http:// 或 https:// 开头。取值来源：用户原话中的链接。【禁止编造】用户未提供 URL 时禁止填写。"
          }
        },
        "required": ["url"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "description": "是否成功获取内容" },
          "content": {
            "type": "string",
            "description": "网页文本内容（已去除 HTML 标签，保留纯文本）"
          },
          "title": { "type": "string", "description": "网页标题" },
          "imageUrl": { "type": "string", "description": "网页中的主图 URL（如有）" },
          "errorMessage": { "type": "string", "description": "失败时的错误信息" }
        }
      }
    },
    {
      "name": "saveCustomDish",
      "description": "将分析确认的菜品信息保存为自定义菜品（业务对象：菜品预览卡片）。\n调用前置条件：Agent 已通过文字分析或 fetchUrl 获取的内容确认这是一道菜品，并已提取出完整的菜品信息。\n【严禁场景】禁止在未确认是菜品的情况下调用本接口；禁止保存缺少 name 字段的菜品。",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "菜品名称，必填。取值来源：从用户输入或网页内容中提取。【禁止编造】必须来自实际分析结果。"
          },
          "desc": {
            "type": "string",
            "description": "菜品简短描述，1-2 句话。取值来源：从分析结果中提取。"
          },
          "categoryId": {
            "type": "number",
            "description": "菜品分类 ID。1=荤菜, 2=素菜, 3=主食, 4=饮品。根据菜品内容自动判断。"
          },
          "image": {
            "type": "string",
            "description": "菜品图片 URL。取值来源：从网页内容中提取的图片 URL。无图片时传空字符串。【禁止编造】禁止生成不存在的图片 URL。"
          },
          "cookTime": {
            "type": "string",
            "description": "烹饪时间，如 '约 30 分钟'。从分析结果中提取，无信息时传空字符串。"
          },
          "difficulty": {
            "type": "string",
            "description": "难度：'简单' / '中等' / '较难'。从分析结果中推断，无信息时传 '中等'。",
            "enum": ["简单", "中等", "较难"]
          },
          "ingredients": {
            "type": "array",
            "description": "原材料列表。从分析结果中提取。",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "description": "食材名称" },
                "amount": { "type": "string", "description": "用量" }
              }
            }
          },
          "seasonings": {
            "type": "array",
            "description": "调料列表。从分析结果中提取。",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "description": "调料名称" },
                "amount": { "type": "string", "description": "用量" }
              }
            }
          },
          "steps": {
            "type": "array",
            "description": "制作步骤。从分析结果中提取。",
            "items": {
              "type": "object",
              "properties": {
                "step": { "type": "number", "description": "步骤序号，从 1 开始" },
                "content": { "type": "string", "description": "步骤内容" }
              }
            }
          }
        },
        "required": ["name", "categoryId"]
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "description": "是否保存成功" },
          "dishId": { "type": "number", "description": "保存后的菜品 ID" },
          "dishName": { "type": "string", "description": "菜品名称" },
          "categoryName": { "type": "string", "description": "分类名称" },
          "message": { "type": "string", "description": "结果消息" }
        }
      },
      "_meta": { "ui": { "componentPath": "components/dish-preview-card/index" } }
    },
    {
      "name": "listCustomDishes",
      "description": "列出用户已保存的所有自定义菜品（业务对象：自定义菜品列表卡片）。\n调用前置条件：用户想查看自己添加的自定义菜品。\n【严禁场景】无特殊限制。",
      "inputSchema": {
        "type": "object",
        "properties": {}
      },
      "outputSchema": {
        "type": "object",
        "properties": {
          "dishes": {
            "type": "array",
            "description": "自定义菜品列表",
            "items": {
              "type": "object",
              "properties": {
                "dishId": { "type": "number", "description": "菜品 ID" },
                "name": { "type": "string", "description": "菜品名称" },
                "desc": { "type": "string", "description": "菜品描述" },
                "categoryName": { "type": "string", "description": "分类名称" },
                "cookTime": { "type": "string", "description": "烹饪时间" },
                "difficulty": { "type": "string", "description": "难度" }
              }
            }
          },
          "total": { "type": "number", "description": "自定义菜品总数" }
        }
      },
      "_meta": { "ui": { "componentPath": "components/custom-dishes-card/index" } }
    }
  ],
  "components": [
    { "path": "components/dish-preview-card/index" },
    { "path": "components/custom-dishes-card/index" }
  ]
}
```

- [ ] **Step 4: 创建 index.js（接口注册）**

```javascript
// 注册所有原子接口
const fetchUrl = require("./apis/fetchUrl.js");
const saveCustomDish = require("./apis/saveCustomDish.js");
const listCustomDishes = require("./apis/listCustomDishes.js");

// 创建 skill 实例，path 需与 app.json 中 agent.skills[].path 一致
const skill = wx.modelContext.createSkill("skills/dish-skill");

// 注册原子接口，name 需与 mcp.json 中声明的一致
skill.registerAPI("fetchUrl", fetchUrl);
skill.registerAPI("saveCustomDish", saveCustomDish);
skill.registerAPI("listCustomDishes", listCustomDishes);

console.log("[dish-skill] APIs registered via createSkill");
```

- [ ] **Step 5: Commit**

```bash
git add skills/dish-skill/
git commit -m "feat: create dish-skill SKILL structure with SKILL.md, mcp.json, storage utils"
```

---

## Task 3: 实现原子接口

**Files:**

- Create: `skills/dish-skill/apis/fetchUrl.js`
- Create: `skills/dish-skill/apis/saveCustomDish.js`
- Create: `skills/dish-skill/apis/listCustomDishes.js`

- [ ] **Step 1: 创建 fetchUrl.js**

```javascript
// 抓取网页内容供 Agent 分析
// 返回纯文本内容、标题和主图 URL

async function fetchUrl({ url } = {}) {
  try {
    if (!url || typeof url !== "string") {
      return {
        isError: true,
        content: [{ type: "text", text: "缺少 URL 参数。请用户提供要分析的链接。" }],
      };
    }

    // 校验 URL 格式
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "URL 格式无效，必须以 http:// 或 https:// 开头。请用户提供有效的链接。",
          },
        ],
      };
    }

    // 使用 wx.request 抓取网页内容
    const pageContent = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: "GET",
        header: {
          "User-Agent": "Mozilla/5.0 (compatible; WeChatMiniProgram/1.0)",
        },
        timeout: 10000,
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        },
        fail(err) {
          reject(new Error(err.errMsg || "网络请求失败"));
        },
      });
    });

    // 提取文本内容（简单 HTML 去标签处理）
    let textContent = "";
    let title = "";
    let imageUrl = "";

    if (typeof pageContent === "string") {
      // 提取 title
      const titleMatch = pageContent.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch) title = titleMatch[1].trim();

      // 提取第一张有意义的图片
      const imgMatches = pageContent.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
      if (imgMatches && imgMatches.length > 0) {
        for (const imgTag of imgMatches) {
          const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
          if (srcMatch && !srcMatch[1].includes("icon") && !srcMatch[1].includes("logo")) {
            imageUrl = srcMatch[1];
            break;
          }
        }
      }

      // 去除 HTML 标签，保留纯文本
      textContent = pageContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // 限制内容长度（避免过大的内容影响 Agent 推理）
      if (textContent.length > 3000) {
        textContent = textContent.substring(0, 3000) + "...(内容已截断)";
      }
    } else if (typeof pageContent === "object") {
      // JSON 响应，转为字符串
      textContent = JSON.stringify(pageContent, null, 2);
      if (textContent.length > 3000) {
        textContent = textContent.substring(0, 3000) + "...(内容已截断)";
      }
    }

    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `已成功获取链接内容（标题：${title || "无标题"}）。接下来分析网页内容是否包含菜品信息。如果确认是菜品，请调用 saveCustomDish 保存；如果不是菜品，请告知用户。`,
        },
      ],
      structuredContent: {
        success: true,
        content: textContent,
        title: title,
        imageUrl: imageUrl,
      },
    };
  } catch (err) {
    console.error("[fetchUrl] error", err);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `无法获取链接内容：${err.message || "未知错误"}。请确认链接是否有效，或让用户直接输入菜品描述文字。`,
        },
      ],
      structuredContent: {
        success: false,
        errorMessage: err.message || "未知错误",
      },
    };
  }
}

module.exports = fetchUrl;
```

- [ ] **Step 2: 创建 saveCustomDish.js**

```javascript
// 保存自定义菜品
const { addCustomDish } = require("../utils/storage.js");

const CATEGORY_MAP = {
  1: "荤菜",
  2: "素菜",
  3: "主食",
  4: "饮品",
};

async function saveCustomDish(params = {}) {
  try {
    const { name, categoryId, desc, image, cookTime, difficulty, ingredients, seasonings, steps } =
      params;

    // 校验必填字段
    if (!name || typeof name !== "string" || !name.trim()) {
      return {
        isError: true,
        content: [{ type: "text", text: "菜品名称不能为空。请从分析结果中提取菜品名称后重试。" }],
      };
    }

    if (!categoryId || ![1, 2, 3, 4].includes(categoryId)) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `无效的分类 ID：${categoryId}。允许的值为：1(荤菜)、2(素菜)、3(主食)、4(饮品)。`,
          },
        ],
      };
    }

    // 构建菜品对象
    const dish = {
      name: name.trim(),
      categoryId: categoryId,
      desc: (desc || "").trim(),
      image: (image || "").trim(),
      cookTime: (cookTime || "").trim(),
      difficulty: difficulty || "中等",
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      seasonings: Array.isArray(seasonings) ? seasonings : [],
      steps: Array.isArray(steps) ? steps : [],
    };

    const result = addCustomDish(dish);

    if (result.success) {
      const categoryName = CATEGORY_MAP[result.dish.categoryId] || "其他";
      return {
        isError: false,
        content: [
          {
            type: "text",
            text: `已成功将「${result.dish.name}」添加到${categoryName}分类中（ID: ${result.dish.id}）。接下来为用户展示菜品预览卡片，引导用户在首页查看新添加的菜品。`,
          },
        ],
        structuredContent: {
          success: true,
          dishId: result.dish.id,
          dishName: result.dish.name,
          categoryName: categoryName,
          message: `「${result.dish.name}」已添加到菜单`,
        },
        _meta: {
          dish: result.dish,
        },
      };
    } else {
      return {
        isError: true,
        content: [{ type: "text", text: result.message || "保存失败，请稍后重试。" }],
        structuredContent: {
          success: false,
          message: result.message,
        },
      };
    }
  } catch (err) {
    console.error("[saveCustomDish] error", err);
    return {
      isError: true,
      content: [{ type: "text", text: `保存菜品失败：${err.message || "未知错误"}。请稍后重试。` }],
    };
  }
}

module.exports = saveCustomDish;
```

- [ ] **Step 3: 创建 listCustomDishes.js**

```javascript
// 列出自定义菜品
const { getCustomDishes } = require("../utils/storage.js");

const CATEGORY_MAP = {
  1: "荤菜",
  2: "素菜",
  3: "主食",
  4: "饮品",
};

async function listCustomDishes() {
  try {
    const dishes = getCustomDishes();

    if (dishes.length === 0) {
      return {
        isError: false,
        content: [
          {
            type: "text",
            text: "当前没有自定义菜品。用户可以通过输入菜品描述或链接来添加新菜品。",
          },
        ],
        structuredContent: {
          dishes: [],
          total: 0,
        },
      };
    }

    const items = dishes.map((d) => ({
      dishId: d.id,
      name: d.name,
      desc: d.desc || "",
      categoryName: CATEGORY_MAP[d.categoryId] || "其他",
      cookTime: d.cookTime || "",
      difficulty: d.difficulty || "中等",
    }));

    return {
      isError: false,
      content: [
        {
          type: "text",
          text: `共有 ${dishes.length} 道自定义菜品。接下来为用户展示自定义菜品列表卡片。`,
        },
      ],
      structuredContent: {
        dishes: items,
        total: dishes.length,
      },
      _meta: {
        fullDishes: dishes,
      },
    };
  } catch (err) {
    console.error("[listCustomDishes] error", err);
    return {
      isError: true,
      content: [{ type: "text", text: `获取自定义菜品失败：${err.message || "未知错误"}。` }],
    };
  }
}

module.exports = listCustomDishes;
```

- [ ] **Step 4: Commit**

```bash
git add skills/dish-skill/apis/
git commit -m "feat: implement fetchUrl, saveCustomDish, listCustomDishes atomic APIs"
```

---

## Task 4: 实现原子组件

**Files:**

- Create: `skills/dish-skill/components/dish-preview-card/index.js`
- Create: `skills/dish-skill/components/dish-preview-card/index.json`
- Create: `skills/dish-skill/components/dish-preview-card/index.wxml`
- Create: `skills/dish-skill/components/dish-preview-card/index.wxss`
- Create: `skills/dish-skill/components/custom-dishes-card/index.js`
- Create: `skills/dish-skill/components/custom-dishes-card/index.json`
- Create: `skills/dish-skill/components/custom-dishes-card/index.wxml`
- Create: `skills/dish-skill/components/custom-dishes-card/index.wxss`

- [ ] **Step 1: 创建 dish-preview-card 组件**

**index.json:**

```json
{
  "component": true
}
```

**index.js:**

```javascript
// 菜品预览卡片组件
// 展示 AI 识别并保存的菜品信息
Component({
  data: {
    dishId: 0,
    name: "",
    desc: "",
    categoryName: "",
    cookTime: "",
    difficulty: "",
    ingredients: [],
    seasonings: [],
    steps: [],
    image: "",
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this);
      this._viewCtx = wx.modelContext.getViewContext(this);
      const { NotificationType } = wx.modelContext;
      this._modelCtx.on(NotificationType.Result, (data) => {
        const result = data && data.result ? data.result : {};
        const sc = result.structuredContent || {};
        const meta = result._meta || {};
        const dish = meta.dish || {};

        this.setData({
          dishId: sc.dishId || dish.id || 0,
          name: sc.dishName || dish.name || "",
          desc: dish.desc || "",
          categoryName: sc.categoryName || "",
          cookTime: dish.cookTime || "",
          difficulty: dish.difficulty || "中等",
          ingredients: dish.ingredients || [],
          seasonings: dish.seasonings || [],
          steps: dish.steps || [],
          image: dish.image || "",
        });
      });
    },
  },
  methods: {
    onTapViewMenu() {
      this._viewCtx.openDetailPage({
        url: "/pages/index/index",
      });
    },
  },
});
```

**index.wxml:**

```xml
<view class="dp-card">
  <view class="dp-header">
    <view class="dp-badge">AI 识别</view>
    <view class="dp-title">菜品已添加</view>
  </view>

  <view wx:if="{{image}}" class="dp-image-wrap">
    <image class="dp-image" src="{{image}}" mode="aspectFill"></image>
  </view>

  <view class="dp-info">
    <view class="dp-name">{{name}}</view>
    <view wx:if="{{desc}}" class="dp-desc">{{desc}}</view>

    <view class="dp-tags">
      <view class="dp-tag dp-tag-cat">{{categoryName}}</view>
      <view wx:if="{{cookTime}}" class="dp-tag">⏱ {{cookTime}}</view>
      <view class="dp-tag">{{difficulty}}</view>
    </view>
  </view>

  <view wx:if="{{ingredients.length > 0}}" class="dp-section">
    <view class="dp-section-title">原材料</view>
    <view class="dp-tag-list">
      <view wx:for="{{ingredients}}" wx:key="name" class="dp-ing-tag">
        {{item.name}} {{item.amount}}
      </view>
    </view>
  </view>

  <view wx:if="{{steps.length > 0}}" class="dp-section">
    <view class="dp-section-title">制作步骤</view>
    <view class="dp-steps">
      <view wx:for="{{steps}}" wx:key="step" class="dp-step">
        <text class="dp-step-num">{{item.step}}.</text>
        <text class="dp-step-text">{{item.content}}</text>
      </view>
    </view>
  </view>

  <view class="dp-actions">
    <view class="dp-btn dp-btn-primary" hover-class="dp-btn-hover" bind:tap="onTapViewMenu">
      <view class="dp-btn-text">去首页看看</view>
    </view>
  </view>
</view>
```

**index.wxss:**

```css
.dp-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin: 16rpx 0;
  border: 1rpx solid #f0f0f0;
}

.dp-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.dp-badge {
  background: #fef3c7;
  color: #d97706;
  font-size: 20rpx;
  font-weight: 700;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.dp-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.dp-image-wrap {
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.dp-image {
  width: 100%;
  height: 280rpx;
  display: block;
}

.dp-info {
  margin-bottom: 20rpx;
}

.dp-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8rpx;
}

.dp-desc {
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 12rpx;
}

.dp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.dp-tag {
  font-size: 20rpx;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.dp-tag-cat {
  background: #fef3c7;
  color: #d97706;
}

.dp-section {
  margin-bottom: 20rpx;
}

.dp-section-title {
  font-size: 22rpx;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12rpx;
}

.dp-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.dp-ing-tag {
  font-size: 22rpx;
  color: #374151;
  background: #f9fafb;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
}

.dp-steps {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.dp-step {
  display: flex;
  gap: 8rpx;
}

.dp-step-num {
  font-size: 22rpx;
  color: #d97706;
  font-weight: 600;
  flex-shrink: 0;
}

.dp-step-text {
  font-size: 22rpx;
  color: #374151;
  line-height: 1.6;
}

.dp-actions {
  margin-top: 20rpx;
}

.dp-btn {
  height: 72rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dp-btn-primary {
  background: #d97706;
}

.dp-btn-hover {
  opacity: 0.8;
}

.dp-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}
```

- [ ] **Step 2: 创建 custom-dishes-card 组件**

**index.json:**

```json
{
  "component": true
}
```

**index.js:**

```javascript
// 自定义菜品列表卡片组件
Component({
  data: {
    dishes: [],
    total: 0,
  },
  lifetimes: {
    created() {
      this._modelCtx = wx.modelContext.getContext(this);
      this._viewCtx = wx.modelContext.getViewContext(this);
      const { NotificationType } = wx.modelContext;
      this._modelCtx.on(NotificationType.Result, (data) => {
        const result = data && data.result ? data.result : {};
        const sc = result.structuredContent || {};

        this.setData({
          dishes: sc.dishes || [],
          total: sc.total || 0,
        });
      });
    },
  },
  methods: {
    onTapDish(e) {
      const dish = e.currentTarget.dataset.dish;
      if (!dish) return;
      this._modelCtx.sendFollowUpMessage({
        content: [
          { type: "text", text: `查看「${dish.name}」详情` },
          { type: "api/call", data: { name: "listCustomDishes", arguments: {} } },
        ],
      });
    },
  },
});
```

**index.wxml:**

```xml
<view class="cd-card">
  <view class="cd-header">
    <view class="cd-title">我的自定义菜品</view>
    <view wx:if="{{total > 0}}" class="cd-count">{{total}} 道</view>
  </view>

  <block wx:if="{{dishes.length > 0}}">
    <view class="cd-list">
      <view
        wx:for="{{dishes}}"
        wx:key="dishId"
        class="cd-item"
        hover-class="cd-item-hover"
        bind:tap="onTapDish"
        data-dish="{{item}}"
      >
        <view class="cd-item-main">
          <view class="cd-item-name">{{item.name}}</view>
          <view wx:if="{{item.desc}}" class="cd-item-desc">{{item.desc}}</view>
        </view>
        <view class="cd-item-meta">
          <view class="cd-item-cat">{{item.categoryName}}</view>
          <view wx:if="{{item.cookTime}}" class="cd-item-time">⏱ {{item.cookTime}}</view>
        </view>
      </view>
    </view>
  </block>

  <block wx:else>
    <view class="cd-empty">
      <view class="cd-empty-title">还没有自定义菜品</view>
      <view class="cd-empty-desc">输入菜品描述或链接，AI 帮你添加</view>
    </view>
  </block>
</view>
```

**index.wxss:**

```css
.cd-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin: 16rpx 0;
  border: 1rpx solid #f0f0f0;
}

.cd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.cd-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.cd-count {
  font-size: 22rpx;
  color: #6b7280;
}

.cd-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.cd-item {
  background: #f9fafb;
  border-radius: 12rpx;
  padding: 20rpx;
}

.cd-item-hover {
  background: #f3f4f6;
}

.cd-item-main {
  margin-bottom: 8rpx;
}

.cd-item-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
}

.cd-item-desc {
  font-size: 22rpx;
  color: #6b7280;
  margin-top: 4rpx;
}

.cd-item-meta {
  display: flex;
  gap: 12rpx;
}

.cd-item-cat {
  font-size: 20rpx;
  color: #d97706;
  background: #fef3c7;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}

.cd-item-time {
  font-size: 20rpx;
  color: #6b7280;
}

.cd-empty {
  padding: 40rpx 0;
  text-align: center;
}

.cd-empty-title {
  font-size: 26rpx;
  color: #6b7280;
}

.cd-empty-desc {
  font-size: 22rpx;
  color: #9ca3af;
  margin-top: 8rpx;
}
```

- [ ] **Step 3: Commit**

```bash
git add skills/dish-skill/components/
git commit -m "feat: implement dish-preview-card and custom-dishes-card atomic components"
```

---

## Task 5: 主应用侧数据读取改造

**Files:**

- Modify: `src/data/menu/index.ts`
- Modify: `src/store/cart.ts`
- Modify: `src/types/menu.ts`

- [ ] **Step 1: 添加自定义菜品存储工具函数**

在 `src/store/cart.ts` 中添加自定义菜品的加载逻辑。由于 SKILL 通过 `wx.setStorageSync('quickbite_custom_dishes')` 写入数据，主应用需要从同一 key 读取。

修改 `src/store/cart.ts`，在 `loadCart` 函数附近添加：

```typescript
// === 自定义菜品（AI 识菜 SKILL 写入，主应用读取）===
const CUSTOM_DISHES_KEY = "quickbite_custom_dishes";

function loadCustomDishes(): MenuItem[] {
  try {
    const raw = uni.getStorageSync(CUSTOM_DISHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error loading custom dishes:", e);
    return [];
  }
}
```

- [ ] **Step 2: 修改 store 中的 state 初始化**

在 `src/store/cart.ts` 中，修改 `state` 的初始化逻辑，将自定义菜品合并到菜单列表中：

```typescript
// 原来的 state 初始化：
// const state = reactive({
//   categories,
//   menu: menuItems,
//   cart: [] as CartLine[],
//   favoriteIds: [] as number[],
// });

// 改为：
const customDishes = loadCustomDishes();

const state = reactive({
  categories,
  menu: [...menuItems, ...customDishes],
  cart: [] as CartLine[],
  favoriteIds: [] as number[],
});
```

- [ ] **Step 3: 添加刷新自定义菜品的方法**

在 `useQuickBiteStore()` 返回对象中添加：

```typescript
function refreshCustomDishes(): void {
  const fresh = loadCustomDishes();
  // 合并：保留预设菜品 + 最新的自定义菜品
  state.menu = [...menuItems, ...fresh];
}
```

并在 return 中导出：

```typescript
return {
  state,
  totalCount: cartTotalCount,
  loadCart,
  setCount,
  getCount,
  clearCart,
  toggleFavorite,
  isFavorite,
  refreshCustomDishes, // 新增
};
```

- [ ] **Step 4: Commit**

```bash
git add src/store/cart.ts
git commit -m "feat: integrate custom dishes from AI SKILL into store"
```

---

## Task 6: 首页添加 AI 入口提示

**Files:**

- Modify: `src/pages/index/index.vue`

- [ ] **Step 1: 在首页 header 区域添加 AI 入口**

在 `src/pages/index/index.vue` 的 `<template>` 中，在 `.header-content` 内 `.subtitle` 后面添加 AI 入口：

```html
<!-- 在 subtitle 后面添加 -->
<view class="ai-entry" @click="openAiEntry">
  <text class="ai-entry-icon">🤖</text>
  <text class="ai-entry-text">AI 识菜 · 输入文字或链接自动添加菜品</text>
</view>
```

- [ ] **Step 2: 添加 AI 入口点击逻辑**

在 `<script setup>` 中添加：

```typescript
function openAiEntry() {
  uni.showModal({
    title: "AI 识菜",
    content:
      "请在小程序 AI 对话界面中输入菜品描述或链接，AI 会自动识别并添加到菜单中。\n\n打开方式：点击小程序右上角「...」→ AI 对话",
    showCancel: false,
    confirmText: "知道了",
  });
}
```

- [ ] **Step 3: 添加 onShow 生命周期刷新自定义菜品**

在 `<script setup>` 中添加页面显示时刷新自定义菜品：

```typescript
import { onShow } from "@dcloudio/uni-app";

onShow(() => {
  // 页面显示时刷新自定义菜品（从 SKILL 写入的 storage 中读取）
  store.refreshCustomDishes();
});
```

- [ ] **Step 4: 添加 AI 入口样式**

在 `<style lang="scss" scoped>` 中添加：

```scss
.ai-entry {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 12rpx;
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20rpx;
  width: fit-content;
}

.ai-entry:active {
  opacity: 0.7;
}

.ai-entry-icon {
  font-size: 24rpx;
}

.ai-entry-text {
  font-size: 18rpx;
  color: $color-primary-text;
  font-weight: 500;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/index/index.vue
git commit -m "feat: add AI entry hint on homepage header"
```

---

## Task 7: 侧边栏添加自定义菜品分类

**Files:**

- Modify: `src/store/cart.ts`
- Modify: `src/pages/index/index.vue`

- [ ] **Step 1: 在 categories 中添加自定义菜品分类**

在 `src/data/menu/categories.ts` 中添加第 5 个分类：

```typescript
import type { Category } from "@/types/menu";

export const categories: Category[] = [
  { id: 1, name: "荤菜" },
  { id: 2, name: "素菜" },
  { id: 3, name: "主食" },
  { id: 4, name: "饮品" },
  { id: 5, name: "自定义" }, // 新增：AI 识菜添加的菜品
];
```

- [ ] **Step 2: 确保自定义菜品 categoryId 为 5**

修改 `skills/dish-skill/apis/saveCustomDish.js` 中的分类映射和 `SKILL.md` 中的分类判断规则，将自定义菜品的 `categoryId` 默认设为 5。

在 `saveCustomDish.js` 中修改：

```javascript
const CATEGORY_MAP = {
  1: "荤菜",
  2: "素菜",
  3: "主食",
  4: "饮品",
  5: "自定义",
};
```

在 `mcp.json` 的 `saveCustomDish` 接口 `categoryId` 描述中更新：

```json
"categoryId": {
  "type": "number",
  "description": "菜品分类 ID。1=荤菜, 2=素菜, 3=主食, 4=饮品, 5=自定义(AI添加)。从用户输入或网页内容无法明确分类时，默认使用 5(自定义)。"
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/menu/categories.ts
git commit -m "feat: add custom dishes category (id=5)"
```

---

## Task 8: 完整数据流验证

**Files:** 无新增文件，验证全流程

- [ ] **Step 1: 验证 SKILL 文件结构完整**

确认 `skills/dish-skill/` 目录包含：

```
skills/dish-skill/
├── SKILL.md
├── mcp.json
├── index.js
├── apis/
│   ├── fetchUrl.js
│   ├── saveCustomDish.js
│   └── listCustomDishes.js
├── components/
│   ├── dish-preview-card/
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── custom-dishes-card/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
└── utils/
    └── storage.js
```

- [ ] **Step 2: 验证 app.json 配置**

确认 `app.json` 包含：

```json
{
  "subPackages": [
    {
      "root": "skills",
      "pages": [],
      "independent": true
    }
  ],
  "agent": {
    "skills": [
      {
        "name": "dish",
        "description": "菜点坊 AI 识菜...",
        "path": "skills/dish-skill"
      }
    ],
    "pageMetadata": "page-meta.json"
  }
}
```

- [ ] **Step 3: 验证主应用能读取自定义菜品**

在微信开发者工具中手动写入测试数据：

```javascript
wx.setStorageSync(
  "quickbite_custom_dishes",
  JSON.stringify([
    {
      id: 10000,
      categoryId: 5,
      name: "测试菜品",
      desc: "这是一个测试菜品",
      image: "",
      cookTime: "约 10 分钟",
      difficulty: "简单",
      ingredients: [{ name: "测试食材", amount: "适量" }],
      seasonings: [],
      steps: [{ step: 1, content: "测试步骤" }],
    },
  ]),
);
```

刷新首页，确认侧边栏出现「自定义」分类，点击后显示测试菜品。

- [ ] **Step 4: 在微信开发者工具中测试 AI 对话**

1. 编译运行到微信小程序
2. 点击右上角「...」→ AI 对话
3. 输入"帮我加一道番茄炒蛋"
4. 验证 AI 调用 saveCustomDish 并展示菜品预览卡片
5. 返回首页，验证「自定义」分类中出现新菜品

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete AI dish recognition feature with SKILL integration"
```

---

## 注意事项和限制

### 1. 内测限制

- 微信小程序 AI 开发模式当前处于 **beta 内测阶段**
- 无法提交审核，代码不能合入正式版本
- 需要在微信公众平台单独申请开通

### 2. 开发工具要求

- 必须使用 **微信开发者工具 Nightly Electron Build 最新版本**
- 普通稳定版不支持 AI 模式调试

### 3. 运行环境隔离

- SKILL 的原子接口运行在 **独立 JS 环境** 中，与小程序主运行时隔离
- 不能直接 import/require 小程序主包的模块
- 只能通过 `wx.*` API（如 `wx.setStorageSync`）进行数据共享

### 4. URL 抓取限制

- `wx.request` 受域名白名单限制，部分链接可能无法抓取
- 某些网站可能返回动态渲染的内容（SPA），抓取到的可能是空壳 HTML
- 建议用户优先输入文字描述而非链接

### 5. 图片处理

- SKILL 环境中无法访问 uni-app 的本地图片路径（如 `/static/images/menu/xxx.jpg`）
- 自定义菜品的图片只能使用网络 URL
- 无图片时使用空字符串，主应用侧需要处理空图片的显示

### 6. 数据同步时机

- SKILL 写入 storage 后，主应用需要通过 `onShow` 生命周期触发刷新
- 不支持实时跨环境监听 storage 变更
