import { useRef, useEffect } from "react"
import type { ReactNode } from "react"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"

import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants"
import { SocketContext } from "./use-socket"
import type { MessageInfo } from "@/store/slices/chat-slice"

export const SocketProvide = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const { userInfo } = useAppStore()

  useEffect(() => {
    console.log("userInfo", userInfo)
    if (userInfo) {
      socketRef.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      })
      // NOTE: 向服务端建立连接
      socketRef.current.on("connect", () => {
        console.log("已连接到Socket服务", socketRef.current?.id)
      })
      const handleReceiveMessage = (message: MessageInfo) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState()

        if (
          selectedChatType !== undefined &&
          (selectedChatData?.id === message.sender.id ||
            selectedChatData?.id === message.recipient.id)
        ) {
          console.log("收到消息", message)
          addMessage(message)
        }
      }
      socketRef.current.on("receiveMessage", handleReceiveMessage)
      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [userInfo])
  return (
    // 声明一个上下文提供者，包住的 {children} 都能读取这个上下文
    // 有了 value={socketRef.current}，子组件可通过 useContext(SocketContext) 或封装好的 useSocket() 获取它。
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  )
}
