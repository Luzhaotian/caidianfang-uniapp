<template>
  <view class="page">
    <view class="header">
      <text class="title">菜品制作详情</text>
      <view v-if="item" class="header-fav" @tap.stop="onToggleFavorite">
        <text
          class="header-fav-icon"
          :class="{ 'header-fav-icon--on': store.isFavorite(item.id) }"
          >{{ store.isFavorite(item.id) ? "♥" : "♡" }}</text
        >
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="hero-card">
        <image class="food-image" :src="item?.image" mode="aspectFill" />
      </view>

      <view class="food-info">
        <view class="food-main">
          <text class="food-name">{{ item?.name }}</text>
          <view class="food-tags">
            <view class="tag">
              <text class="tag-text">⏱ {{ item?.cookTime }}</text>
            </view>
            <view class="tag">
              <text class="tag-text">{{ item?.difficulty }}难度</text>
            </view>
          </view>
        </view>
        <text class="food-desc">{{ item?.desc }}</text>
      </view>

      <view class="card">
        <text class="card-title">备菜准备</text>
        <view class="divider" />

        <view class="section">
          <text class="section-label">原材料</text>
          <view class="ingredient-list">
            <view v-for="ing in item?.ingredients" :key="ing.name" class="ingredient-tag">
              <text class="ingredient-text">{{ ing.name }} {{ ing.amount }}</text>
            </view>
          </view>
        </view>

        <view v-if="item?.seasonings && item.seasonings.length > 0" class="section">
          <text class="section-label">调料</text>
          <view class="ingredient-list">
            <view v-for="s in item?.seasonings" :key="s.name" class="ingredient-tag">
              <text class="ingredient-text">{{ s.name }} {{ s.amount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">制作步骤</text>
        <view class="divider" />
        <view class="steps">
          <view v-for="s in item?.steps" :key="s.step" class="step">
            <text class="step-text">{{ s.step }}. {{ s.content }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useQuickBiteStore } from "@/store/cart";
import type { MenuItem } from "@/types/menu";

const store = useQuickBiteStore();

const itemId = ref<number>(0);
const item = ref<MenuItem | null>(null);

onLoad((options) => {
  const opts = options as { id?: string } | undefined;
  const id = opts?.id;
  if (id) {
    itemId.value = Number(id);
    item.value = store.state.menu.find((m) => m.id === itemId.value) || null;
  }
});

const onToggleFavorite = () => {
  if (item.value) store.toggleFavorite(item.value.id);
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
  display: flex;
  flex-direction: column;
}

.header {
  min-height: 200rpx;
  padding: 32rpx 28rpx 0;
  background: $color-surface;
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
  color: $color-text;
  flex: 1;
  min-width: 0;
}

.header-fav {
  padding: 4rpx 0 4rpx 12rpx;
  flex-shrink: 0;
}

.header-fav-icon {
  font-size: 40rpx;
  color: $color-favorite-muted;
  line-height: 1;
}

.header-fav-icon--on {
  color: $color-favorite;
}

.content {
  flex: 1;
  padding: 28rpx;
  box-sizing: border-box;
}

.hero-card {
  border-radius: 24rpx;
  overflow: hidden;
  background: $color-fill;
}

.food-image {
  width: 100%;
  height: 320rpx;
  display: block;
  background: $color-fill;
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
  color: $color-text;
}

.food-tags {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6rpx;
}

.tag {
  padding: 6rpx 12rpx;
  background: $color-primary-bg;
  border-radius: 6rpx;
}

.tag-text {
  font-size: 20rpx;
  color: $color-text-tertiary;
}

.food-desc {
  font-size: 20rpx;
  color: $color-text-tertiary;
  margin-top: 12rpx;
  display: block;
}

.card {
  background: $color-surface;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-top: 28rpx;
}

.card-title {
  font-size: 24rpx;
  font-weight: 700;
  color: $color-text;
  display: block;
}

.divider {
  height: 2rpx;
  background: $color-border-light;
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
  color: $color-text-tertiary;
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
  background: $color-bg;
  border-radius: 6rpx;
}

.ingredient-text {
  font-size: 24rpx;
  color: $color-text;
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
  color: $color-text;
  line-height: 1.6;
}
</style>
