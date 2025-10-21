import { useRef, useEffect } from "react"
import type { ReactNode } from "react"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"

import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants"
import { SocketContext } from "./use-socket"
import type { ChatMessage } from "@/store/slices/chat-slice"

const getParticipantId = (
  participant: ChatMessage["sender"] | ChatMessage["recipient"]
) => (typeof participant === "string" ? participant : participant?.id)

export const SocketProvide = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const { userInfo, addGroupInGroupList, addContactsInContactsList } =
    useAppStore()

  useEffect(() => {
    console.log(
      "🚀 ~ SocketContext.tsx:14 ~ SocketProvide ~ userInfo:",
      userInfo
    )
    if (userInfo) {
      socketRef.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      })
      // NOTE: 向服务端建立连接
      socketRef.current.on("connect", () => {
        console.log("已连接到Socket服务", socketRef.current?.id)
      })
      const handleReceiveMessage = (message: ChatMessage) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState()
        const senderId = getParticipantId(message.sender)
        const recipientId = getParticipantId(message.recipient)

        if (
          selectedChatType !== undefined &&
          (selectedChatData?.id === senderId ||
            selectedChatData?.id === recipientId)
        ) {
          console.log("收到消息", message)
          addMessage(message)
        }
        if (userInfo?.id) addContactsInContactsList(message, userInfo.id)
      }
      const handleReceiveGroupMessage = (message: ChatMessage) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState()

        // 仅在当前打开的是群聊且群ID匹配时，才追加消息
        if (
          selectedChatType === "group" &&
          selectedChatData?.id === message.groupId
        ) {
          console.log("收到群消息", message)
          addMessage(message)
        }
        addGroupInGroupList(message)
      }

      socketRef.current.on("receiveMessage", handleReceiveMessage)
      socketRef.current.on("receiveGroupMessage", handleReceiveGroupMessage)
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
