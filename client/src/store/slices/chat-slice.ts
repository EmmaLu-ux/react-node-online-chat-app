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
  sender: AuthUserInfo
  recipient?: AuthUserInfo
  content: string
  messageType: "text" | "file"
  fileUrl?: string
  // createdAt: string
  // updatedAt?: string
  // status?: "sending" | "sent" | "delivered" | "seen"
  timestamp?: string
  groupId?: string
}

export type SelectedChatData = AuthUserInfo | GroupChatInfo
export type SelectedChatMessage = ChatMessage[]

export interface ChatSlice {
  selectedChatType?: ChatType // 全局状态里当前选中的会话类型，可能是联系人或群组
  selectedChatData?: SelectedChatData // 全局状态里当前选中的会话的信息
  selectedChatMessage: SelectedChatMessage // 全局状态里当前选中的会话的消息列表
  directMessagesContacts: AuthUserInfo[] // 全局状态里直接消息的联系人列表
  isUploading: boolean // 全局状态里是否正在上传文件
  isDownloading: boolean // 全局状态里是否正在下载文件
  fileUploadProgress: number // 全局状态里文件上传的进度
  fileDownloadProgress: number // 全局状态里文件下载的进度
  groups: GroupChatInfo[] // 全局状态里群组列表
  setGroups: (groups: []) => void // 设置群组列表
  setFileUploadProgress: (fileUploadProgress: number) => void // 设置文件上传的进度
  setFileDownloadProgress: (fileDownloadProgress: number) => void // 设置文件下载的进度
  setIsUploading: (isUploading: boolean) => void // 设置是否正在上传
  setIsDownloading: (isDownloading: boolean) => void // 设置是否正在下载
  setSelectedChatType: (selectedChatType: ChatType | undefined) => void // 设置当前选中的会话类型
  setSelectedChatData: (selectedChatData: SelectedChatData | undefined) => void // 设置当前选中的会话的信息
  setSelectedChatMessage: (
    selectedChatMessage: SelectedChatMessage | undefined
  ) => void // 设置当前选中的会话的消息
  setDirectMessagesContacts: (directMessagesContacts: AuthUserInfo[]) => void // 设置直接消息的联系人列表
  closeChat: () => void // 关闭会话
  addMessage: (message: ChatMessage) => void // 添加消息
  addGroup: (group: GroupChatInfo) => void // 添加群组
  addGroupInGroupList: (message: ChatMessage) => void // 添加群组到群组列表
  addContactsInContactsList: (message: ChatMessage, userId: string) => void // 添加联系人到联系人列表
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
  addMessage: (message: ChatMessage) => {
    const selectedChatMessage = get().selectedChatMessage
    const selectedChatType = get().selectedChatType
    console.log("message-store-addMessage", message, selectedChatType)

    set({
      selectedChatMessage: [
        ...selectedChatMessage,
        {
          ...message,
          recipient:
            selectedChatType === "group"
              ? message.recipient
              : message?.recipient?.id,
          sender:
            selectedChatType === "group" ? message.sender : message.sender.id,
        },
      ],
    })
  },
  addGroup: (group: GroupChatInfo) => {
    const groups = get().groups
    set({ groups: [...groups, group] })
  },
  addGroupInGroupList: (message: ChatMessage) => {
    // console.log("🚀 ~ chat-slice.ts:119 ~ createChatSlice ~ message:", message)

    if (!message.groupId) return

    const groups = get().groups
    const data = groups.find(group => group.id === message.groupId)
    const index = groups.findIndex(group => group.id === message.groupId)

    if (index < 0) return

    if (index !== -1 && index !== undefined) {
      groups.splice(index, 1)
      groups.unshift(data)
    }
  },
  addContactsInContactsList: (message: ChatMessage, userId: string) => {
    const formId =
      message.sender.id === userId ? message.recipient?.id : message.sender.id
    const fromData =
      message.sender.id === userId ? message.recipient : message.sender

    const dmContacts = get().directMessagesContacts
    const data = dmContacts.find(contact => contact.id === formId)
    const index = dmContacts.findIndex(contact => contact.id === formId)
    if (index !== -1 && index !== undefined) {
      dmContacts.splice(index, 1)
      dmContacts.unshift(data)
    } else {
      dmContacts.unshift(fromData)
    }
    set({ directMessagesContacts: dmContacts })
  },
})
