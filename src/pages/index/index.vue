<template>
  <view class="page">
    <view class="header">
      <view class="header-content">
        <text class="title">我的菜谱</text>
        <text class="subtitle">轻松做饭·分享灵感</text>
        <!-- AI 入口暂时隐藏
        <view class="ai-entry" @click="openAiEntry">
          <text class="ai-entry-icon">🤖</text>
          <text class="ai-entry-text">AI 识菜 · 输入文字或链接自动添加菜品</text>
        </view>
        -->
      </view>
    </view>

    <view class="content">
      <view class="sidebar">
        <view
          v-for="(cat, index) in sidebarEntries"
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: activeCategoryIndex === index }"
          @click="onCategoryChange(index)"
        >
          <text class="sidebar-item-text">{{ cat.name }}</text>
        </view>
      </view>

      <scroll-view class="list" scroll-y>
        <view v-if="filteredMenu.length === 0" class="list-empty">
          <text class="list-empty-text">暂无收藏，点击菜品卡片上的小心心添加</text>
        </view>
        <template v-else>
          <view v-for="item in filteredMenu" :key="item.id" class="food-card-wrapper">
            <view
              class="food-card"
              :class="{ 'food-card--swiped': swipedItemId === item.id }"
              :style="{ transform: `translateX(${getSwipeOffset(item.id)}px)` }"
              @click="onCardTap(item)"
              @touchstart="onTouchStart($event, item)"
              @touchmove="onTouchMove($event, item)"
              @touchend="onTouchEnd($event, item)"
              @longpress="onLongPress(item)"
            >
              <image class="thumb" :src="item.image" mode="aspectFill" />
              <view class="info">
                <text class="name">{{ item.name }}</text>
                <text class="desc">{{ item.desc }}</text>
              </view>
              <view class="card-actions" @click.stop>
                <view class="fav-btn" @click.stop="store.toggleFavorite(item.id)">
                  <text class="fav-icon" :class="{ 'fav-icon--on': store.isFavorite(item.id) }">{{
                    store.isFavorite(item.id) ? "♥" : "♡"
                  }}</text>
                </view>
                <view
                  class="add-btn"
                  @click.stop="onStepperChange(item, store.getCount(item.id) + 1)"
                >
                  <text class="add-btn-text">+</text>
                </view>
              </view>
            </view>
            <!-- 滑动删除按钮（仅自定义菜品显示） -->
            <view v-if="isCustomDish(item)" class="swipe-delete" @click.stop="confirmDelete(item)">
              <text class="swipe-delete-text">删除</text>
            </view>
          </view>
        </template>
      </scroll-view>
    </view>

    <view class="bottom">
      <text class="bottom-text" @click="openCartDrawer">已选 {{ store.totalCount }} 道菜</text>
      <view class="cart-btn" @click="openCartDrawer">
        <text class="cart-btn-text">分享今日菜单</text>
      </view>
    </view>

    <!-- Cart Drawer -->
    <view v-if="showDrawer" class="drawer-mask" @click="closeCartDrawer"></view>
    <view class="drawer" :class="{ 'drawer-open': showDrawer }">
      <!-- Drag indicator -->
      <view class="drawer-drag-indicator"></view>

      <view class="drawer-header">
        <text class="drawer-title">今日菜单</text>
        <view class="drawer-actions">
          <text v-if="store.state.cart.length > 0" class="drawer-clear-btn" @click="clearCart"
            >清空</text
          >
          <view class="drawer-close" @click="closeCartDrawer">
            <text class="drawer-close-text">✕</text>
          </view>
        </view>
      </view>

      <view class="drawer-divider"></view>

      <scroll-view class="drawer-content" scroll-y>
        <view v-if="store.state.cart.length === 0" class="drawer-empty">
          <text class="drawer-empty-text">今日菜单是空的</text>
        </view>

        <view v-else>
          <view v-for="line in store.state.cart" :key="line.id" class="drawer-line">
            <image class="drawer-thumb" :src="line.image" mode="aspectFill" />
            <view class="drawer-info">
              <text class="drawer-name">{{ line.name }}</text>
            </view>
            <view class="drawer-stepper">
              <view
                class="drawer-stepper-btn drawer-stepper-minus"
                :class="{ 'drawer-stepper-disabled': line.count <= 0 }"
                @click="onStepperChange(line, line.count - 1)"
              >
                <text class="drawer-stepper-btn-text">−</text>
              </view>
              <text class="drawer-stepper-value">{{ line.count }}</text>
              <view
                class="drawer-stepper-btn drawer-stepper-plus"
                @click="onStepperChange(line, line.count + 1)"
              >
                <text class="drawer-stepper-btn-text">+</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="drawer-bottom">
        <text class="drawer-total">已选 {{ store.totalCount }} 道菜</text>
        <view
          class="drawer-submit-btn"
          :class="{ 'drawer-submit-disabled': store.totalCount.value === 0 }"
          @click="goOrder"
        >
          <text class="drawer-submit-btn-text">去分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

import { FAVORITES_CATEGORY_ID, useQuickBiteStore } from "@/store/cart";
import type { MenuItem } from "@/types/menu";

const store = useQuickBiteStore();

const activeCategoryIndex = ref(0);
const showDrawer = ref(false);

// === 滑动手势状态 ===
const swipedItemId = ref<number | null>(null);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchDeltaX = ref(0);
const isSwiping = ref(false);
const SWIPE_THRESHOLD = 80; // 滑动多少像素触发删除按钮

const sidebarEntries = computed(() => [
  ...store.state.categories,
  { id: FAVORITES_CATEGORY_ID, name: "收藏" },
]);

const activeCategoryId = computed(
  () => sidebarEntries.value[activeCategoryIndex.value]?.id ?? store.state.categories[0]?.id ?? 1,
);

const filteredMenu = computed(() => {
  const id = activeCategoryId.value;
  if (id === FAVORITES_CATEGORY_ID) {
    const fav = new Set(store.state.favoriteIds);
    return store.state.menu.filter((x) => fav.has(x.id));
  }
  return store.state.menu.filter((x) => x.categoryId === id);
});

function onCategoryChange(index: number) {
  activeCategoryIndex.value = index;
}

// === 判断是否为自定义菜品 ===
function isCustomDish(item: MenuItem): boolean {
  return item.source === "camera" || item.source === "text";
}

// === 滑动手势处理 ===
function onTouchStart(e: TouchEvent, _item: MenuItem) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  touchDeltaX.value = 0;
  isSwiping.value = false;
}

function onTouchMove(e: TouchEvent, item: MenuItem) {
  const deltaX = e.touches[0].clientX - touchStartX.value;
  const deltaY = e.touches[0].clientY - touchStartY.value;

  // 如果垂直滑动距离更大，则不是左右滑动
  if (Math.abs(deltaY) > Math.abs(deltaX) && !isSwiping.value) return;

  isSwiping.value = true;

  // 只允许自定义菜品左滑
  if (isCustomDish(item)) {
    if (swipedItemId.value === item.id) {
      // 已经打开的卡片，向右滑动关闭
      touchDeltaX.value = Math.min(0, Math.max(-SWIPE_THRESHOLD, deltaX));
    } else {
      // 未打开的卡片，只允许左滑
      touchDeltaX.value = Math.min(0, deltaX);
    }
  }
}

function onTouchEnd(e: TouchEvent, item: MenuItem) {
  if (!isSwiping.value) {
    // 没有滑动，执行点击
    goDetail(item.id);
    return;
  }

  if (isCustomDish(item)) {
    if (swipedItemId.value === item.id) {
      // 当前已打开，根据滑动距离决定关闭还是保持
      if (touchDeltaX.value > -SWIPE_THRESHOLD / 2) {
        swipedItemId.value = null; // 关闭
      }
    } else {
      // 当前未打开，根据滑动距离决定是否打开
      if (touchDeltaX.value < -SWIPE_THRESHOLD / 2) {
        swipedItemId.value = item.id; // 打开
      }
    }
  }

  touchDeltaX.value = 0;
  isSwiping.value = false;
}

function getSwipeOffset(itemId: number): number {
  if (swipedItemId.value === itemId) {
    return -SWIPE_THRESHOLD; // 已打开，偏移
  }
  return 0; // 未打开
}

function onCardTap(item: MenuItem) {
  // 如果有卡片处于滑动打开状态，先关闭
  if (swipedItemId.value !== null) {
    swipedItemId.value = null;
    return;
  }
  goDetail(item.id);
}

// === 长按删除 ===
function onLongPress(item: MenuItem) {
  if (!isCustomDish(item)) return;

  uni.showActionSheet({
    itemList: ["删除这道菜"],
    success(res) {
      if (res.tapIndex === 0) {
        confirmDelete(item);
      }
    },
  });
}

function confirmDelete(item: MenuItem) {
  uni.showModal({
    title: "确认删除",
    content: `确定要删除「${item.name}」吗？`,
    confirmColor: "#ef4444",
    success(res) {
      if (res.confirm) {
        store.deleteCustomDish(item.id);
        swipedItemId.value = null;
        uni.showToast({ title: "已删除", icon: "success" });
      }
    },
  });
}

function onStepperChange(item: MenuItem, count: number) {
  store.setCount(item, count);
}

function openCartDrawer() {
  showDrawer.value = true;
}

function closeCartDrawer() {
  showDrawer.value = false;
}

function clearCart() {
  store.clearCart();
}

function goOrder() {
  if (store.totalCount.value === 0) return;
  closeCartDrawer();
  const data = encodeURIComponent(JSON.stringify(store.state.cart));
  uni.navigateTo({ url: `/pages/order/order?data=${data}` });
}

function goDetail(id: number) {
  // 点击详情时关闭滑动状态
  if (swipedItemId.value !== null) {
    swipedItemId.value = null;
    return;
  }
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
}

// AI 入口弹窗（功能启用后取消注释）
// function openAiEntry() {
//   uni.showModal({
//     title: "🤖 AI 识菜使用说明",
//     content:
//       "1. 点击小程序右上角「...」\n2. 选择「AI 对话」\n3. 输入菜品描述或链接\n\n例如：\n• 帮我加一道番茄炒蛋\n• https://xxx.com/红烧肉做法\n• 看看我加的菜",
//     showCancel: false,
//     confirmText: "我知道了",
//   });
// }

// 页面显示时刷新自定义菜品（从 SKILL 写入的 storage 中读取）
onShow(() => {
  store.refreshCustomDishes();
});
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: $color-bg;
  display: flex;
  flex-direction: column;
}

.header {
  height: 200rpx;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    $color-header-from 0%,
    $color-header-via 40%,
    $color-header-to 100%
  );
}

.header::before {
  content: "";
  position: absolute;
  top: -40%;
  right: -15%;
  width: 350rpx;
  height: 350rpx;
  background: radial-gradient(circle, $color-header-decor-primary 0%, transparent 65%);
  border-radius: 50%;
}

.header::after {
  content: "";
  position: absolute;
  bottom: -25%;
  left: -5%;
  width: 280rpx;
  height: 280rpx;
  background: radial-gradient(circle, $color-header-decor-accent 0%, transparent 60%);
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
  color: $color-header-title;
  position: relative;
  z-index: 1;
  display: block;
}

.subtitle {
  font-size: 20rpx;
  color: $color-header-subtitle;
  position: relative;
  z-index: 1;
  margin-top: 6rpx;
  display: block;
}

.ai-entry {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 12rpx;
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20rpx;
  width: fit-content;
  position: relative;
  z-index: 1;
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

.content {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 160rpx;
  background: $color-surface;
  border-right: 2rpx solid $color-border-light;
}

.sidebar-item {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sidebar-item.active {
  background-color: $color-primary-bg;
}

.sidebar-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5rpx;
  height: 32rpx;
  background-color: $color-primary;
  border-radius: 0 3rpx 3rpx 0;
}

.sidebar-item-text {
  font-size: 24rpx;
  color: $color-text-tertiary;
  font-weight: 500;
}

.sidebar-item.active .sidebar-item-text {
  color: $color-text;
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
  color: $color-text-disabled;
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
  color: $color-favorite-muted;
  line-height: 1;
}

.fav-icon--on {
  color: $color-favorite;
}

.food-card-wrapper {
  position: relative;
  margin-bottom: 24rpx;
  overflow: hidden;
  border-radius: 24rpx;
}

.food-card {
  background: $color-surface;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  transition: transform 0.25s ease;
  position: relative;
  z-index: 1;
}

.food-card--swiped {
  z-index: 2;
}

.swipe-delete {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 160rpx;
  background: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 24rpx 24rpx 0;
  z-index: 0;
}

.swipe-delete:active {
  background: #dc2626;
}

.swipe-delete-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
}

.thumb {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  background: $color-fill;
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
  color: $color-text;
}

.desc {
  font-size: 20rpx;
  color: $color-text-tertiary;
  margin-top: 6rpx;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn:active {
  background: $color-primary-pressed;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: $color-text-inverse;
  line-height: 1;
}

.bottom {
  height: 140rpx;
  padding: 0 28rpx;
  background: $color-surface;
  border-top: 2rpx solid $color-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.bottom-text {
  color: $color-text;
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
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn:active {
  background: $color-primary-pressed;
}

.cart-btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: $color-text-inverse;
}

/* Drawer Styles */
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-mask;
  z-index: 1000;
}

.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: calc(100vh - 100rpx);
  /* Leave some space at top */
  background: $color-surface;
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
  background: $color-border;
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
  color: $color-text-tertiary;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
}

.drawer-clear-btn:active {
  background: $color-fill;
  color: $color-text;
}

.drawer-title {
  font-size: 28rpx;
  font-weight: 700;
  color: $color-text;
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
  color: $color-text-tertiary;
  line-height: 1;
}

.drawer-divider {
  height: 2rpx;
  background: $color-border-light;
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
  color: $color-text-tertiary;
  font-size: 28rpx;
}

.drawer-line {
  background: $color-surface;
  border: 2rpx solid $color-border-light;
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
  background: $color-fill;
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
  color: $color-text;
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
  background: $color-fill;
}

.drawer-stepper-minus.drawer-stepper-disabled {
  opacity: 0.5;
}

.drawer-stepper-plus {
  background: $color-primary;
}

.drawer-stepper-plus:active {
  background: $color-primary-pressed;
}

.drawer-stepper-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1;
}

.drawer-stepper-minus .drawer-stepper-btn-text {
  color: $color-text;
}

.drawer-stepper-plus .drawer-stepper-btn-text {
  color: $color-text-inverse;
}

.drawer-stepper-value {
  min-width: 28rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text;
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
  color: $color-text-tertiary;
}

.drawer-submit-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-submit-disabled {
  background: $color-text-disabled;
}

.drawer-submit-btn:active:not(.drawer-submit-disabled) {
  background: $color-primary-pressed;
}

.drawer-submit-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: $color-text-inverse;
}
</style>
