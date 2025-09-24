import { type StateCreator } from "zustand"

export interface AuthUserInfo {
  _id?: string
  email?: string
  username?: string
  image?: string
  color?: number
  profileSetup?: boolean
}

export interface AuthSlice {
  userInfo: AuthUserInfo | undefined
  setUserInfo: (userInfo: AuthUserInfo | undefined) => void
}

/**
 * 创建认证状态切片
 * @template {AuthSlice} S - 状态切片类型
 * @param {(partial: Partial<S> | ((state: S) => Partial<S>)) => void} set - Zustand 的 set 函数，用于更新状态
 * @returns {AuthSlice} 包含用户信息状态和更新方法的状态切片
 * @property {AuthUserInfo | null | undefined} userInfo - 当前用户信息
 * @property {(userInfo: AuthUserInfo | null | undefined) => void} setUserInfo - 更新用户信息的方法
 */
export const useAuthSlice: StateCreator<
  AuthSlice,
  [],
  [],
  AuthSlice
> = set => ({
  userInfo: undefined,
  setUserInfo: userInfo => set({ userInfo }),
})

/**
 * 创建认证状态切片
 * @param set - Zustand 的 set 函数
 * @returns 认证状态切片实例
 */
