<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { initTheme } from "@/utils/theme"
import "@/styles/index.css"

onLaunch(() => {
  console.log("App Launch")
  initTheme()
})
onShow(() => {
  console.log("App Show")
})
onHide(() => {
  console.log("App Hide")
})
</script>
