<template>
  <view v-if="!src" class="empty">
    <text class="empty-text">链接无效</text>
  </view>
  <web-view v-else :src="src" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"

const src = ref("")

onLoad((options) => {
  const raw = (options as { url?: string } | undefined)?.url
  if (!raw) return
  try {
    src.value = decodeURIComponent(raw)
  } catch {
    src.value = raw
  }
})
</script>

<style scoped>
.empty {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7fa;
}

.empty-text {
  font-size: 28rpx;
  color: #6b7380;
}
</style>
