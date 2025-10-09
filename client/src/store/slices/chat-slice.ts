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
  _id: string
  // chatId: string
  sender: string
  recipient: string | string[]
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
  selectedChatType?: ChatType
  selectedChatData?: SelectedChatData
  selectedChatMessage: ChatMessage[]
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
