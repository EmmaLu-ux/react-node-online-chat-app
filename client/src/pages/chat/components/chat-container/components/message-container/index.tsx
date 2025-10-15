import { apiClient } from "@/lib/app-client"
import { useAppStore } from "@/store"
import { GET_GROUP_MESSAGES, GET_ALL_MESSAGES, HOST } from "@/utils/constants"
import { useEffect, useRef, useState } from "react"
import moment from "moment"
import type { ChatMessage } from "@/store/slices/chat-slice"
import type { AuthUserInfo } from "@/store/slices/auth-slice"
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessage,
    setSelectedChatMessage,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore()
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  // console.log("selectedChatData", selectedChatData)

  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|gmp|tiff|tif|webp|svg|ico|heic|heif)$/i
    return imageRegex.test(filePath)
  }
  const downLoadFile = async (fileUrl: string | undefined) => {
    try {
      if (fileUrl === undefined) return
      setIsDownloading(true)
      setFileDownloadProgress(0)
      const res = await apiClient.get(`${HOST}/${fileUrl}`, {
        withCredentials: true,
        responseType: "blob", // 重要：指定响应类型为 blob
        onDownloadProgress: progressEvent => {
          const { loaded, total } = progressEvent
          if (total) {
            const percentCompleted = Math.round((loaded / total) * 100)
            setFileDownloadProgress(percentCompleted)
            // console.log(`下载进度: ${percentCompleted}%`)
          }
        },
      })
      // 创建一个临时的 URL 对象
      const url = window.URL.createObjectURL(new Blob([res.data]))
      // 创建一个临时的 <a> 元素
      const link = document.createElement("a")
      link.href = url
      // 设置下载文件的名称
      const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
      link.setAttribute("download", filename || "download")
      // 将 <a> 元素添加到文档中
      document.body.appendChild(link)
      // 触发点击事件，开始下载
      link.click()
      // 下载完成后，移除 <a> 元素和释放 URL 对象
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setIsDownloading(false)
      setFileDownloadProgress(0)
    } catch (error) {
      setIsDownloading(false)
      console.log("download-error", error)
    }
  }

  // 类型守卫与工具：兼容 sender 为 string 或 AuthUserInfo
  const isAuthUserInfo = (s: AuthUserInfo | string): s is AuthUserInfo =>
    typeof s === "object" && s !== null && "id" in s
  const getSenderId = (s: AuthUserInfo | string) =>
    typeof s === "string" ? s : s.id
  const renderMessages = () => {
    let lastDate: string | null = null
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      // console.log("message", message)
      // console.log("selectedChatType", selectedChatType)

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "group" && renderGroupMessage(message)}
        </div>
      )
    })
  }

  /**
   * 渲染一条私聊（点对点）消息。
   *
   * 行为说明：
   * - 通过比较消息 `sender` 与当前对话对象 `selectedChatData?.id`，决定消息气泡左右对齐：
   *   - 左侧：来自对方（`sender === otherId`）
   *   - 右侧：来自自己
   * - 根据 `message.messageType` 渲染：
   *   - `text`：直接显示文本内容。
   *   - `file`：若 `fileUrl` 为图片（`checkIfImage` 判断），展示缩略图并支持点击预览；否则显示文件名并提供下载按钮（`downLoadFile`）。
   * - 底部展示消息时间（`timestamp`）。
   *
   * 依赖状态：`selectedChatData`、`setShowImage`、`setImageUrl`。
   *
   * @param message 私聊消息对象
   * @returns JSX.Element 消息对应的 JSX 结构
   */
  const renderDMMessage = (message: ChatMessage) => {
    console.log("message-renderDMMessage", message, selectedChatData)
    const senderId = getSenderId(message.sender)
    const otherId = selectedChatData?.id
    return (
      <div
        // 聊天框内左侧为对方消息，右侧为自己消息
        className={`${senderId === otherId ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              senderId !== otherId
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#303030] text-white/80"
            } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}>
            {/* 消息内容 */}
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              senderId !== otherId
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#303030] text-white/80"
            } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}>
            {/* 消息内容 */}
            {checkIfImage(message.fileUrl ?? "") ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true)
                  setImageUrl(message.fileUrl)
                }}>
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl?.split("/").pop()}</span>
                <span
                  className="bg-balck/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() =>
                    message.fileUrl && downLoadFile(message.fileUrl)
                  }>
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {/* 消息发送时间 */}
        <div className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  }

  const renderGroupMessage = (message: ChatMessage) => {
    // console.log("message-renderGroupMessage", message, userInfo)
    const senderId = getSenderId(message.sender)
    const isSelf = senderId === userInfo?.id
    const senderObj = isAuthUserInfo(message.sender)
      ? message.sender
      : undefined
    return (
      <div
        // text-left为非本登录用户发送的消息样式
        // text-right为本登录用户发送的消息样式
        className={`mt-5 ${!isSelf ? "text-left" : "text-right"}`}>
        {/* 文本消息渲染 */}
        {message.messageType === "text" && (
          <div
            className={`${
              isSelf
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#303030] text-white/70"
            } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words ml-9`}>
            {/* 消息内容 */}
            {message.content}
          </div>
        )}
        {/* 文件消息渲染 */}
        {message.messageType === "file" && (
          <div
            className={`${
              isSelf
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#2a2b33]/5 text-white/80"
            } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}>
            {/* 消息内容 */}
            {checkIfImage(message.fileUrl ?? "") ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true)
                  setImageUrl(message.fileUrl)
                }}>
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl?.split("/").pop()}</span>
                <span
                  className="bg-balck/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() =>
                    message.fileUrl && downLoadFile(message.fileUrl)
                  }>
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {!isSelf ? (
          <div className="flex items-center justify-start gap-3">
            {/* 群聊中的头像，非当前登录用户 */}
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
              {/* 图片头像 */}
              {senderObj?.image && (
                <AvatarImage
                  src={`${HOST}/${senderObj.image}`}
                  alt="profile avatar"
                  className="object-cover bg-black w-full h-full"
                />
              )}
              {/* 默认头像 */}
              <AvatarFallback
                className={`text-white uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  (senderObj?.color as number) ?? 0
                )}`}>
                {senderObj?.username
                  ? senderObj.username.split("").shift()
                  : senderObj?.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            {/* 用户名 */}
            <span className="text-sm text-white/60">
              {senderObj?.username ?? senderObj?.email}
            </span>
            <div className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessage])

  useEffect(() => {
    const getAllMessages = async () => {
      console.log("selectedChatData-useEffect", selectedChatData)
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES,
          {
            id: selectedChatData?.id,
          },
          { withCredentials: true }
        )
        // console.log("🚀 ~ index.tsx:281 ~ getAllMessages ~ res:", res)
        if (res.status === 200 && res.data.messages) {
          setSelectedChatMessage(res.data.messages)
        }
      } catch (error) {
        console.log("getAllMessages-error", error)
      }
    }

    const getAllGroupMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_GROUP_MESSAGES}/${selectedChatData?.id}`,
          {
            withCredentials: true,
          }
        )
        console.log("🚀 ~ index.tsx:315 ~ getAllGroupMessages ~ res:", res)
        if (res.status === 200 && res.data.messages) {
          setSelectedChatMessage(res.data.messages)
        }
      } catch (error) {
        console.log("getAllGroupMessages-error", error)
      }
    }

    if (selectedChatData?.id) {
      if (selectedChatType === "contact") getAllMessages()
      else if (selectedChatType === "group") getAllGroupMessages()
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessage])

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        // backdrop-blur-lg: 模糊度为lg
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-4 fixed top-0 mt-5">
            <button
              className="bg-balck/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downLoadFile(imageUrl)}>
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-balck/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false)
                setImageUrl(undefined)
              }}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageContainer
