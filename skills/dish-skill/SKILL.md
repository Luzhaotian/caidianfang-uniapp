# dish-skill 菜点坊 AI 识菜

## 业务流程图

```
用户意图
  │
  ├─ 发送图片（拍照识别）─→ Agent 分析图片内容
  │     │
  │     ├─ 是菜品 ─→ saveCustomDish(source="camera") → 菜品预览卡片
  │     └─ 非菜品 ─→ 告知用户图片中没有识别到菜品
  │
  ├─ 输入文字（"红烧肉怎么做"、"番茄炒蛋"）─→ Agent 直接分析文字内容
  │     │
  │     ├─ 是菜品 ─→ saveCustomDish(source="text") → 菜品预览卡片
  │     └─ 非菜品 ─→ 告知用户这不是菜品信息
  │
  ├─ 输入链接（https://...）─→ fetchUrl → 获取网页内容
  │     │
  │     ├─ Agent 分析网页内容
  │     │     ├─ 是菜品 ─→ saveCustomDish(source="text") → 菜品预览卡片
  │     │     └─ 非菜品 ─→ 告知用户该链接内容不是菜品
  │     └─ 抓取失败 ─→ 告知用户无法访问该链接
  │
  ├─ "看看我加的菜" / "自定义菜品" ─→ listCustomDishes → 自定义菜品列表卡片
  │
  └─ "推荐菜品" / "有什么菜" ─→ listCustomDishes → 自定义菜品列表卡片
```

> Agent 必须先通过 fetchUrl 获取链接内容后再分析，禁止猜测链接内容。
> Agent 必须在确认是菜品信息后才能调用 saveCustomDish，禁止将非菜品内容保存。
> Agent 支持分析用户发送的图片，识别其中的菜品并生成结构化数据。
> saveCustomDish 返回成功后，必须展示菜品预览卡片，禁止以纯文本列出。

## 原子接口依赖关系

| 接口             | 作用                           | 组件               | 前置条件               |
| ---------------- | ------------------------------ | ------------------ | ---------------------- |
| fetchUrl         | 抓取网页/链接内容供 Agent 分析 | —                  | 用户提供了 URL         |
| saveCustomDish   | 保存自定义菜品到菜单           | dish-preview-card  | Agent 已分析确认是菜品 |
| listCustomDishes | 列出已保存的自定义菜品         | custom-dishes-card | —                      |

## 用户意图分流

### 直接触发本 SKILL 的意图

- "帮我加一道菜"
- "这个链接里的菜不错" + URL
- "红烧排骨怎么做"（文字描述菜品）
- "看看我加的菜"
- "自定义菜品"
- "我收藏的菜"
- 发送图片 + "识别这道菜" / "这是什么菜"

### 意图分流规则

- 用户发送图片 → Agent 分析图片内容，调用 saveCustomDish (source="camera", categoryId=6)
- 用户只说了菜名或描述（无链接）→ Agent 直接分析文字，调用 saveCustomDish (source="text", categoryId=7)
- 用户提供了链接 → 先调 fetchUrl 获取内容，再分析，调用 saveCustomDish (source="text", categoryId=7)
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
```

### 2. ID 生成规则

自定义菜品 ID 必须从 10000 起始递增，避免与预设菜品 ID（1-13）冲突。
ID 计算方式：`10000 + 当前自定义菜品数量`

### 3. 分类判断规则

- 包含肉类（猪、牛、羊、鸡、鸭、鱼、虾等）→ categoryId: 1（荤菜）
- 主要为蔬菜、豆腐、蛋类 → categoryId: 2（素菜）
- 米饭、面条、饺子、馒头等主食类 → categoryId: 3（主食）
- 饮料、茶、酒、果汁等 → categoryId: 4（饮品）

### 4. 来源标记

- 文字输入分析 → source: "text", categoryId: 7（AI输入）
- 链接内容分析 → source: "text", categoryId: 7（AI输入）
- 拍照识别（未来扩展） → source: "camera", categoryId: 6（AI拍照）

### 4. 图片处理

- 如果用户输入中包含图片 URL，直接使用
- 如果是纯文字输入，image 字段设为空字符串
- 禁止编造图片 URL
