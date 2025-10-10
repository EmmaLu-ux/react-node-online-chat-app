// import { Auth } from "@/pages/auth"
import type { StateCreator } from "zustand"

import type { AuthUserInfo } from "./auth-slice"

export type ChatType = "contact" | "group"

export interface GroupChatInfo {
  id: string
  name: string
  image?: string
  description?: string
  members: AuthUserInfo[]
}

export interface ChatMessage {
  id: string
  // chatId: string
  sender: AuthUserInfo
  recipient: AuthUserInfo
  content: string
  messageType: "text" | "file"
  fileUrl?: string
  // createdAt: string
  // updatedAt?: string
  // status?: "sending" | "sent" | "delivered" | "seen"
  timestamp: string
}

export interface MessageInfo {
  id: string
  sender: AuthUserInfo
  recipient: AuthUserInfo | GroupChatInfo
  content: string
  messageType: "text" | "file"
  fileUrl?: string
  timestamp: string
}

export type SelectedChatData = AuthUserInfo | GroupChatInfo
export type SelectedChatMessage = ChatMessage[]

export interface ChatSlice {
  selectedChatType?: ChatType // 全局状态里当前选中的会话类型，可能是联系人或群组
  selectedChatData?: SelectedChatData // 全局状态里当前选中的会话的信息
  selectedChatMessage: ChatMessage[] // 全局状态里当前选中的会话的消息列表
  directMessagesContacts: AuthUserInfo[] // 全局状态里直接消息的联系人列表
  setSelectedChatType: (selectedChatType: ChatType | undefined) => void
  setSelectedChatData: (selectedChatData: SelectedChatData | undefined) => void
  setSelectedChatMessage: (
    selectedChatMessage: SelectedChatMessage | undefined
  ) => void
  closeChat: () => void
  addMessage: (message: MessageInfo) => void
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set,
  get
) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],
  directMessagesContacts: [],
  setSelectedChatType: selectedChatType => set({ selectedChatType }),
  setSelectedChatData: selectedChatData => set({ selectedChatData }),
  setSelectedChatMessage: selectedChatMessage => set({ selectedChatMessage }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessage: [],
    }),
  addMessage: message => {
    const selectedChatMessage = get().selectedChatMessage
    const selectedChatType = get().selectedChatType
    console.log("message-store-addMessage", message, selectedChatType)

    set({
      selectedChatMessage: [
        ...selectedChatMessage,
        {
          ...message,
          recipient:
            selectedChatType === "contact"
              ? message.recipient
              : message.recipient.id,
          sender:
            selectedChatType === "contact" ? message.sender : message.sender.id,
        },
      ],
    })
  },
})
