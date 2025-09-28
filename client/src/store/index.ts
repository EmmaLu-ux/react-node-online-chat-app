import { create } from "zustand"
import { useAuthSlice, type AuthSlice } from "./slices/auth-slice"
import { createChatSlice, type ChatSlice } from "./slices/chat-slice"

export type AppStore = AuthSlice & ChatSlice

/**
 * 多 slice 写法
 * 先走了“无参”分支，返回 createImpl，随后这一层再接收(...a) => ({ ...useAuthSlice(...a) })作为initializer
 * 在调用 initializer 时会传入三个参数：set、get、api。无论你把 rest 参数叫做 a、args 还是 tuple，再通过展开 ...useAuthSlice(...a) 得到的都是那三个值。
 *
 * <AppStore> 的意思：这个 store 里会有哪些字段、这些字段的类型是什么
 */
export const useAppStore = create<AppStore>()((...a) => ({
  ...useAuthSlice(...a),
  ...createChatSlice(...a),
}))
