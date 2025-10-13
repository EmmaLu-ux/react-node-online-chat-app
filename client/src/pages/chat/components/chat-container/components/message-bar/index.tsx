import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"
import EmojiPicker from "emoji-picker-react"
import type { EmojiClickData } from "emoji-picker-react"
import { useAppStore } from "@/store"
import { useSocket } from "@/context/use-socket"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/app-client"
import { UPLOAD_FILE } from "@/utils/constants"

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore()
  const socket = useSocket()

  const handleSendMessage = async () => {
    console.log("selectedChatType-handleSendMessage", selectedChatType)
    if (selectedChatType === "contact" && message.trim()) {
      socket?.emit("sendMessage", {
        sender: userInfo?.id,
        recipient: selectedChatData?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      })
    } else if (selectedChatType === "group" && message.trim()) {
      socket?.emit("sendGroupMessage", {
        sender: userInfo?.id,
        groupId: selectedChatData?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      })
      console.log("发送群消息", {
        sender: userInfo?.id,
        groupId: selectedChatData?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      })
    }
    setMessage("") // 发送后清空输入框
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setMessage(msg => msg + emoji.emoji)
    // setEmojiPickerOpen(false)
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log("file", event.target.files)
    try {
      const file = event.target.files?.[0]
      if (file) {
        const formData = new FormData()
        // 与服务端 multer.single('file') 保持一致
        formData.append("chat-file", file)
        setIsUploading(true)
        const res = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: progressEvent => {
            // 计算上传进度百分比
            // progressEvent.loaded: 已经上传的字节数
            // progressEvent.total: 文件的总字节数 (可能为 undefined)
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            )
            setFileUploadProgress(progress)
          },
        })
        // console.log("res", res)
        // res.data.filePath
        if (res.status === 200 && res.data.filePath) {
          setIsUploading(false)
          if (selectedChatType === "contact") {
            socket?.emit("sendMessage", {
              sender: userInfo?.id,
              recipient: selectedChatData?.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
            })
          } else if (selectedChatType === "group") {
            socket?.emit("sendGroupMessage", {
              sender: userInfo?.id,
              groupId: selectedChatData?.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
            })
          }
        }
      }
    } catch (error) {
      setIsUploading(false)
      console.log(error)
    }
  }

  // 监听外部点击来关闭表情面板
  useEffect(() => {
    if (!emojiPickerOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    // 表情面板关闭或者组件销毁时执行返回的函数
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiPickerOpen])

  return (
    <div className="bg-[#1c1d25] h-[10vh] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex items-center bg-[#2a2b33] rounded-md gap-5 pr-5">
        {/* 信息输入框 */}
        <input
          type="text"
          className="border-none flex-1 p-5 bg-transparent rounded-md focus:outline-none focus:border-none focus-visible:ring-1 focus-visible:ring-offset-0"
          placeholder="请输入消息"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        {/* 附件按钮 */}
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}>
          <GrAttachment className="text-2xl" />
        </button>
        <Input
          type="file"
          className="hidden"
          name="chat-file"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        {/* 表情div */}
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(prev => !prev)}>
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen ? (
            <div className="absolute bottom-16 right-0">
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          ) : null}
        </div>
      </div>
      {/* 发送按钮 */}
      <button
        className="bg-amber-300 rounded-md flex items-center justify-center p-5 hover:bg-amber-400 focus:bg-amber-400 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}>
        <IoSend className="text-2xl" />
      </button>
    </div>
  )
}

export default MessageBar
