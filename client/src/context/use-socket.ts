import { createContext, useContext } from "react"
import type { Socket } from "socket.io-client"

// 创建socket上下文对象，该对象包含 Provider 和 Consumer 两个组件
export const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => {
  // 返回当前 Context 的值，由最近的 Provider 的 value prop 决定
  return useContext(SocketContext)
}
