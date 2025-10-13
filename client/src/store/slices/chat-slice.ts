import type { StateCreator } from "zustand"

import type { AuthUserInfo } from "./auth-slice"

export type ChatType = "contact" | "group"

export interface GroupChatInfo {
  id: string
  name: string
  admin: string
  members: AuthUserInfo[]
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  image?: string
  description?: string
}

export interface ChatMessage {
  id: string
  // chatId: string
  sender: AuthUserInfo | string
  recipient: AuthUserInfo | string
  content: string
  messageType: "text" | "file"
  fileUrl?: string
  // createdAt: string
  // updatedAt?: string
  // status?: "sending" | "sent" | "delivered" | "seen"
  timestamp: string
}

export type SelectedChatData = AuthUserInfo | GroupChatInfo
export type SelectedChatMessage = ChatMessage[]

export interface ChatSlice {
  selectedChatType?: ChatType // 全局状态里当前选中的会话类型，可能是联系人或群组
  selectedChatData?: SelectedChatData // 全局状态里当前选中的会话的信息
  selectedChatMessage: SelectedChatMessage // 全局状态里当前选中的会话的消息列表
  directMessagesContacts: AuthUserInfo[] // 全局状态里直接消息的联系人列表
  isUploading: boolean
  isDownloading: boolean
  fileUploadProgress: number
  fileDownloadProgress: number
  groups: GroupChatInfo[]
  setGroups: (groups: []) => void
  setFileUploadProgress: (fileUploadProgress: number) => void
  setFileDownloadProgress: (fileDownloadProgress: number) => void
  setIsUploading: (isUploading: boolean) => void
  setIsDownloading: (isDownloading: boolean) => void
  setSelectedChatType: (selectedChatType: ChatType | undefined) => void
  setSelectedChatData: (selectedChatData: SelectedChatData | undefined) => void
  setSelectedChatMessage: (
    selectedChatMessage: SelectedChatMessage | undefined
  ) => void
  setDirectMessagesContacts: (directMessagesContacts: AuthUserInfo[]) => void
  closeChat: () => void
  addMessage: (message: ChatMessage) => void
  addGroup: (group: GroupChatInfo) => void
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set,
  get
) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],
  directMessagesContacts: [],
  isDownloading: false,
  isUploading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  groups: [],
  setGroups: groups => set({ groups }),
  setFileUploadProgress: fileUploadProgress => set({ fileUploadProgress }),
  setFileDownloadProgress: fileDownloadProgress =>
    set({ fileDownloadProgress }),
  setIsDownloading: isDownloading => set({ isDownloading }),
  setIsUploading: isUploading => set({ isUploading }),
  setSelectedChatType: selectedChatType => set({ selectedChatType }),
  setSelectedChatData: selectedChatData => set({ selectedChatData }),
  setSelectedChatMessage: selectedChatMessage => set({ selectedChatMessage }),
  setDirectMessagesContacts: directMessagesContacts =>
    set({ directMessagesContacts }),
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
  addGroup: (group: GroupChatInfo) => {
    const groups = get().groups
    set({ groups: [...groups, group] })
  },
})
