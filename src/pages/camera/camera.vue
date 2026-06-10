<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">AI 拍照识菜</text>
    </view>

    <!-- 拍照模式 -->
    <view v-if="mode === 'camera'" class="camera-area">
      <camera
        v-if="hasCameraPermission && pageVisible"
        :key="cameraKey"
        class="camera-view"
        device-position="back"
        flash="auto"
        :style="{ height: '100%' }"
      >
        <cover-view class="camera-overlay">
          <cover-view class="camera-hint">对准菜品拍照</cover-view>
        </cover-view>
      </camera>

      <!-- 无权限时显示提示 -->
      <view v-else class="no-permission">
        <text class="no-permission-icon">📷</text>
        <text class="no-permission-text">需要相机权限才能拍照识菜</text>
        <view class="permission-btn" @click="requestCameraPermission">
          <text class="permission-btn-text">授权相机</text>
        </view>
      </view>

      <!-- 底部拍照按钮 -->
      <view class="camera-bottom">
        <view class="capture-btn" @click="takePhoto">
          <view class="capture-btn-inner"></view>
        </view>
      </view>
    </view>

    <!-- 拍照完成 - 引导去 AI 对话 -->
    <view v-if="mode === 'done'" class="done-area">
      <image class="done-image" :src="photoPath" mode="aspectFill" />

      <view class="done-card">
        <text class="done-icon">📸</text>
        <text class="done-title">照片已拍好</text>
        <text class="done-desc">请在 AI 对话中发送这张照片，AI 会自动识别并生成菜品信息</text>

        <view class="done-steps">
          <view class="step">
            <text class="step-num">1</text>
            <text class="step-text">点击右上角「...」</text>
          </view>
          <view class="step">
            <text class="step-num">2</text>
            <text class="step-text">选择「AI 对话」</text>
          </view>
          <view class="step">
            <text class="step-num">3</text>
            <text class="step-text">发送照片并说「识别这道菜」</text>
          </view>
        </view>

        <view class="done-actions">
          <view class="action-btn secondary" @click="retakePhoto">
            <text class="action-btn-text">重拍</text>
          </view>
          <view class="action-btn primary" @click="goToMenu">
            <text class="action-btn-text">去菜单看看</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";

type Mode = "camera" | "done";

const mode = ref<Mode>("camera");
const hasCameraPermission = ref(false);
const photoPath = ref("");
const cameraKey = ref(0);
const pageVisible = ref(true); // 页面是否可见

// ========== 权限 ==========

function checkCameraPermission() {
  // #ifdef MP-WEIXIN
  uni.authorize({
    scope: "scope.camera",
    success() {
      hasCameraPermission.value = true;
    },
    fail() {
      hasCameraPermission.value = false;
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  hasCameraPermission.value = true;
  // #endif
}

function requestCameraPermission() {
  // #ifdef MP-WEIXIN
  uni.openSetting({
    success(res) {
      if (res.authSetting["scope.camera"]) {
        hasCameraPermission.value = true;
      }
    },
  });
  // #endif
}

onShow(() => {
  pageVisible.value = true;
  if (mode.value === "done") {
    resetCamera();
  }
  cameraKey.value++;
  checkCameraPermission();
});

// 页面隐藏时关闭相机
onHide(() => {
  pageVisible.value = false;
});

// ========== 拍照 ==========

function takePhoto() {
  // #ifdef MP-WEIXIN
  const camera = uni.createCameraContext();
  camera.takePhoto({
    quality: "high",
    success(res) {
      photoPath.value = res.tempImagePath;
      // 保存照片路径到 storage，供 AI 对话时读取
      uni.setStorageSync("quickbite_last_photo", res.tempImagePath);
      // 直接打开 AI 对话，带上照片
      openAiDialog(res.tempImagePath);
    },
    fail(err) {
      console.error("拍照失败:", err);
      uni.showToast({ title: "拍照失败", icon: "none" });
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["camera"],
    success(res) {
      photoPath.value = res.tempFilePaths[0];
      uni.setStorageSync("quickbite_last_photo", res.tempFilePaths[0]);
      openAiDialog(res.tempFilePaths[0]);
    },
  });
  // #endif
}

// 打开 AI 对话
function openAiDialog(imagePath: string) {
  // #ifdef MP-WEIXIN
  // 检查是否支持 AI 功能
  if (wx.checkIsSupportAgent) {
    wx.checkIsSupportAgent({
      success(res) {
        if (res.isSupport) {
          // 打开 AI 对话，带上照片路径
          wx.openAgent({
            followUpMessage: `请识别这张照片中的菜品：${imagePath}`,
          });
        } else {
          uni.showToast({ title: "当前设备不支持 AI 对话", icon: "none" });
          mode.value = "done";
        }
      },
      fail() {
        // 降级：显示引导页
        mode.value = "done";
      },
    });
  } else {
    // 无 checkIsSupportAgent 接口，降级显示引导页
    mode.value = "done";
  }
  // #endif
  // #ifndef MP-WEIXIN
  mode.value = "done";
  // #endif
}

// ========== 操作 ==========

function retakePhoto() {
  photoPath.value = "";
  mode.value = "camera";
}

function resetCamera() {
  photoPath.value = "";
  mode.value = "camera";
}

function goToMenu() {
  uni.switchTab({ url: "/pages/index/index" });
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: #1c1917;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  padding-top: 88rpx;
  padding-bottom: 20rpx;
  background: #1c1917;
  text-align: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #f5f5f4;
}

/* ===== 拍照模式 ===== */
.camera-area {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.camera-view {
  flex: 1;
}

.camera-overlay {
  position: absolute;
  bottom: 200rpx;
  left: 0;
  right: 0;
  text-align: center;
}

.camera-hint {
  font-size: 28rpx;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
}

.no-permission {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.no-permission-icon {
  font-size: 80rpx;
}

.no-permission-text {
  font-size: 28rpx;
  color: #a8a29e;
}

.permission-btn {
  margin-top: 20rpx;
  padding: 16rpx 48rpx;
  background: #d97706;
  border-radius: 40rpx;
}

.permission-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}

.camera-bottom {
  padding: 40rpx 0 80rpx;
  display: flex;
  justify-content: center;
}

.capture-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 6rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-btn:active {
  opacity: 0.7;
}

.capture-btn-inner {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: #fff;
}

.capture-btn:active .capture-btn-inner {
  background: #d1d5db;
}

/* ===== 拍照完成 ===== */
.done-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.done-image {
  width: 100%;
  height: 400rpx;
}

.done-card {
  flex: 1;
  background: #f9fafb;
  border-radius: 24rpx 24rpx 0 0;
  margin-top: -24rpx;
  padding: 32rpx 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.done-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.done-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8rpx;
}

.done-desc {
  font-size: 24rpx;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.done-steps {
  width: 100%;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 24rpx;
}

.step {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 10rpx 0;
}

.step-num {
  width: 36rpx;
  height: 36rpx;
  border-radius: 18rpx;
  background: #d97706;
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  font-size: 26rpx;
  color: #374151;
}

.done-actions {
  width: 100%;
  display: flex;
  gap: 20rpx;
  margin-top: auto;
  padding-bottom: 40rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:active {
  opacity: 0.8;
}

.action-btn.primary {
  background: #d97706;
}

.action-btn.secondary {
  background: #e5e7eb;
}

.action-btn-text {
  font-size: 28rpx;
  font-weight: 700;
}

.action-btn.primary .action-btn-text {
  color: #fff;
}

.action-btn.secondary .action-btn-text {
  color: #374151;
}
</style>
