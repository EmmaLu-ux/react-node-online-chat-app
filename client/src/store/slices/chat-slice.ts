import type { StateCreator } from "zustand"

import type { AuthUserInfo } from "./auth-slice"

export type ChatType = "contact" | "group"

export interface GroupChatInfo {
  _id: string
  name: string
  image?: string
  description?: string
  members: AuthUserInfo[]
}

export interface ChatMessage {
  _id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
  updatedAt?: string
  status?: "sending" | "sent" | "delivered" | "seen"
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
}

export const createChatSlice: StateCreator<
  ChatSlice,
  [],
  [],
  ChatSlice
> = set => ({
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
})
