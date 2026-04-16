import type { DefineComponent } from "vue"

declare module "vue" {
  interface GlobalComponents {
    VanButton: DefineComponent
    VanSidebar: DefineComponent
    VanSidebarItem: DefineComponent
    VanStepper: DefineComponent
  }
}
