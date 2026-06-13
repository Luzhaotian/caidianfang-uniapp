/// <reference types="@dcloudio/types" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
}

// 微信小程序 AI 开发模式 API 类型声明（AI 功能启用后取消注释）
// declare namespace WechatMiniprogram {
//   interface OpenAgentOptions {
//     followUpMessage?: string;
//     context?: string;
//     success?: (res: unknown) => void;
//     fail?: (err: unknown) => void;
//   }
//
//   interface CheckIsSupportAgentOptions {
//     success?: (res: { isSupport: boolean }) => void;
//     fail?: (err: unknown) => void;
//   }
// }
//
// interface Wx {
//   openAgent(options: WechatMiniprogram.OpenAgentOptions): void;
//   checkIsSupportAgent(options: WechatMiniprogram.CheckIsSupportAgentOptions): void;
// }
//
// declare const wx: Wx & typeof import("@dcloudio/types").wx;
