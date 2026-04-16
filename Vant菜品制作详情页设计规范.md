# Vant 菜品制作详情页设计规范

## 📱 页面概述

**页面名称**：菜品制作详情页  
**设计尺寸**：375 × 812px（标准移动端）  
**UI 框架**：Vant Weapp 1.11.7  
**技术栈**：Uni-app + Vue 3 + TypeScript

---

## 🎨 设计原则

### 1. **Vant UI 风格一致性**
- 使用 Vant 官方设计规范
- 颜色系统：主色调 `#7a5cfa`（紫色）
- 圆角：6px / 12px
- 间距：16px 页面边距 + 12px 元素间距

### 2. **信息层级清晰**
- 备菜区域：折叠面板 + 标签化展示
- 烹饪制作：垂直时间线 + 步骤卡片
- 状态指示：实时进度 + 预计完成时间

### 3. **交互友好**
- 移动端优先设计
- 触摸友好（按钮最小 44px）
- 视觉反馈清晰

---

## 📋 页面结构

### 1. **页面标题区域**
```vue
<template>
  <view class="page-header">
    <text class="page-title">菜品制作详情</text>
  </view>
</template>

<style>
.page-header {
  padding: 16px;
  background: #ffffff;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
</style>
```

### 2. **备菜准备区域**

#### 使用 Vant Collapse + Tag 组件
```vue
<template>
  <van-collapse v-model="activeNames" class="prep-section">
    <!-- 原材料折叠面板 -->
    <van-collapse-item title="🥩 原材料" name="1">
      <view class="tag-grid">
        <van-tag type="default" size="medium">牛肉饼 ×1</van-tag>
        <van-tag type="default" size="medium">面包胚 ×1</van-tag>
        <van-tag type="default" size="medium">生菜 ×2片</van-tag>
        <van-tag type="default" size="medium">番茄 ×3片</van-tag>
        <van-tag type="default" size="medium">鸡蛋 ×1个</van-tag>
        <van-tag type="default" size="medium">芝士 ×1片</van-tag>
      </view>
    </van-collapse-item>
    
    <!-- 调料折叠面板 -->
    <van-collapse-item title="🧂 调料" name="2">
      <view class="tag-grid">
        <van-tag type="default" size="medium">黑胡椒 2g</van-tag>
        <van-tag type="default" size="medium">盐 1g</van-tag>
        <van-tag type="default" size="medium">橄榄油 10ml</van-tag>
        <van-tag type="default" size="medium">汉堡酱 15g</van-tag>
        <van-tag type="default" size="medium">芥末酱 5g</van-tag>
      </view>
    </van-collapse-item>
  </van-collapse>
</template>

<script setup>
import { ref } from 'vue'
const activeNames = ref(['1', '2']) // 默认展开
</script>

<style>
.prep-section {
  margin: 16px;
  border-radius: 12px;
  overflow: hidden;
}
.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
}
</style>
```

### 3. **烹饪制作区域**

#### 使用 Vant Steps 垂直时间线
```vue
<template>
  <view class="cooking-section">
    <view class="section-title">🍳 烹饪制作</view>
    
    <van-steps :active="1" direction="vertical" active-color="#7a5cfa">
      <!-- 步骤1：预热烤箱 -->
      <van-step>
        <view class="step-content">
          <view class="step-title">预热烤箱至200°C</view>
          <view class="step-detail">
            <text class="time">⏱ 5分钟</text>
          </view>
        </view>
      </van-step>
      
      <!-- 步骤2：煎牛肉饼（进行中）-->
      <van-step>
        <view class="step-content">
          <view class="step-title">煎制牛肉饼至两面金黄</view>
          <view class="step-detail">
            <text class="time">⏱ 3分钟/面</text>
            <text class="heat">🔥 中火</text>
          </view>
        </view>
      </van-step>
      
      <!-- 步骤3：烤面包胚 -->
      <van-step>
        <view class="step-content">
          <view class="step-title">烤制面包胚至酥脆</view>
          <view class="step-detail">
            <text class="time">⏱ 2分钟</text>
            <text class="heat">🔥 小火</text>
          </view>
        </view>
      </van-step>
      
      <!-- 步骤4：煎鸡蛋 -->
      <van-step>
        <view class="step-content">
          <view class="step-title">煎制鸡蛋（可选）</view>
          <view class="step-detail">
            <text class="time">⏱ 2分钟</text>
            <text class="heat">🔥 小火</text>
          </view>
        </view>
      </van-step>
      
      <!-- 步骤5：组装汉堡 -->
      <van-step>
        <view class="step-content">
          <view class="step-title">组装所有食材完成制作</view>
          <view class="step-detail">
            <text class="time">⏱ 1分钟</text>
          </view>
        </view>
      </van-step>
    </van-steps>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const activeStep = ref(1) // 当前进行到第2步
</script>

<style>
.cooking-section {
  margin: 16px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}
.step-content {
  padding: 8px 0;
}
.step-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}
.step-detail {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6d7280;
}
.time {
  color: #7a5cfa;
}
.heat {
  color: #f59e0b;
}
</style>
```

### 4. **状态指示器**
```vue
<template>
  <view class="status-indicator">
    <view class="status-card">
      <view class="status-title">📊 制作进度</view>
      <view class="status-content">
        <text class="current-step">当前步骤：煎制牛肉饼（步骤 2/5）</text>
        <text class="estimated-time">预计完成时间：3分钟</text>
      </view>
      <van-progress 
        :percentage="40" 
        stroke-width="4px"
        color="#7a5cfa"
        track-color="#e5e7eb"
      />
    </view>
  </view>
</template>

<style>
.status-indicator {
  margin: 16px;
}
.status-card {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 12px;
}
.status-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}
.status-content {
  margin-bottom: 12px;
}
.current-step {
  display: block;
  font-size: 14px;
  color: #7a5cfa;
  margin-bottom: 4px;
}
.estimated-time {
  display: block;
  font-size: 12px;
  color: #6d7280;
}
</style>
```

### 5. **操作按钮区域**
```vue
<template>
  <view class="action-buttons">
    <van-button 
      type="primary" 
      block
      color="#7a5cfa"
      size="large"
      @click="onCompleteOrder"
    >
      完成制作
    </van-button>
  </view>
</template>

<script setup>
const onCompleteOrder = () => {
  // 完成制作的逻辑
  uni.showToast({
    title: '制作完成！',
    icon: 'success'
  })
}
</script>

<style>
.action-buttons {
  padding: 16px;
  background: #ffffff;
}
</style>
```

---

## 🎯 设计亮点

### 1. **备菜区域优化**
- ✅ **标签化展示**：解决文字过长问题
- ✅ **折叠面板**：节省空间，默认展开
- ✅ **网格布局**：3列布局，清晰美观
- ✅ **名称+用量**：如"牛肉饼 ×1"、"黑胡椒 2g"

### 2. **烹饪制作时间线**
- ✅ **Vant Steps 组件**：原生垂直时间线
- ✅ **固定格式**：动作 + 用时 + 火候
- ✅ **状态区分**：已完成（紫色）、进行中（紫色）、待完成（灰色）
- ✅ **视觉清晰**：圆形节点 + 垂直连接线

### 3. **响应式设计**
- ✅ **移动端适配**：375px 标准宽度
- ✅ **触摸友好**：按钮 ≥ 44px
- ✅ **颜色系统**：
  - 主色调：`#7a5cfa`（紫色）
  - 文字色：`#111827`（主文本）/ `#6d7280`（辅助文本）
  - 背景色：`#ffffff`（卡片）/ `#f7f8fa`（区域）

---

## 📚 组件依赖

### Vant Weapp 组件
```json
{
  "dependencies": {
    "@vant/weapp": "^1.11.7"
  }
}
```

### 使用的组件
- `van-collapse` - 折叠面板
- `van-collapse-item` - 折叠项
- `van-tag` - 标签组件
- `van-steps` - 步骤条
- `van-step` - 步骤项
- `van-progress` - 进度条
- `van-button` - 按钮

---

## 🚀 实现建议

### 1. **开发顺序**
1. 创建页面基础结构
2. 实现备菜区域（Collapse + Tag）
3. 实现烹饪制作区域（Steps）
4. 添加状态指示器
5. 实现操作按钮
6. 添加样式优化

### 2. **状态管理**
```typescript
interface CookingStep {
  id: number
  title: string
  description: string
  time: string
  heat?: string
  status: 'completed' | 'active' | 'pending'
}

const cookingSteps = ref<CookingStep[]>([
  {
    id: 1,
    title: '预热烤箱至200°C',
    description: '⏱ 5分钟',
    time: '5分钟',
    status: 'completed'
  },
  // ...更多步骤
])
```

### 3. **样式变量**
```css
:root {
  --primary-color: #7a5cfa;
  --text-primary: #111827;
  --text-secondary: #6d7280;
  --background-light: #f7f8fa;
  --border-radius: 12px;
  --spacing-base: 16px;
}
```

这个设计规范提供了完整的Vant UI实现方案，你可以直接基于这个文档进行开发，无需依赖Figma设计稿。