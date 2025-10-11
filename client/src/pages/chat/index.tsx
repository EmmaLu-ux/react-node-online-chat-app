import { useAppStore } from "@/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import ContactsContainer from "./components/contacts-container"
import EmptyChatContainer from "./components/empty-chat-container"
import ChatContainer from "./components/chat-container"

const Chat = () => {
  const navigate = useNavigate()
  const {
    userInfo,
    selectedChatType,
    isDownloading,
    isUploading,
    fileDownloadProgress,
    fileUploadProgress,
  } = useAppStore()

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast.warning("请先完善个人资料")
      navigate("/profile")
    }
  }, [userInfo, navigate])

  return (
    <div className="flex text-white h-[100vh] overflow-hidden">
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg gap-5 flex items-center justify-center text-white">
          <h5 className="text-5xl animate-pulse">File Uploading</h5>
          <span>{fileUploadProgress}%</span>
        </div>
      )}
      {isDownloading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg gap-5 flex items-center justify-center text-white">
          <h5 className="text-5xl animate-pulse">File Downloading</h5>
          <span>{fileDownloadProgress}%</span>
        </div>
      )}
      {/* 左侧联系人菜单、应用信息以及用户信息 */}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        // 空白聊天容器
        <EmptyChatContainer />
      ) : (
        // 右侧聊天框部分
        <ChatContainer />
      )}
    </div>
  )
}

export default Chat
