import { create } from "zustand"
import { useAuthSlice, type AuthSlice } from "./slices/auth-slice"

/**
 * 多 slice 写法
 * 先走了“无参”分支，返回 createImpl，随后这一层再接收(...a) => ({ ...useAuthSlice(...a) })作为initializer
 * 在调用 initializer 时会传入三个参数：set、get、api。无论你把 rest 参数叫做 a、args 还是 tuple，再通过展开 ...useAuthSlice(...a) 得到的都是那三个值。
 */
export type AppStore = AuthSlice

export const useAppStore = create<AppStore>()((...a) => ({
  ...useAuthSlice(...a),
}))
