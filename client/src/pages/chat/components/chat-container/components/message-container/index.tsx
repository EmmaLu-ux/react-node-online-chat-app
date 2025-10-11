import { apiClient } from "@/lib/app-client"
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES, HOST } from "@/utils/constants"
import { useEffect, useRef, useState } from "react"
import moment from "moment"
import type { ChatMessage } from "@/store/slices/chat-slice"
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5"

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const {
    selectedChatData,
    selectedChatType,
    // userInfo,
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
  const renderMessages = () => {
    let lastDate: string | null = null
    // console.log("selectedChatMessage-renderMessages", selectedChatMessage)
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      // console.log("message", message)

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
        </div>
      )
    })
  }

  const renderDMMessage = (message: ChatMessage) => {
    // console.log("message", message, selectedChatData)
    return (
      <div
        // 聊天框内左侧为对方消息，右侧为自己消息
        className={`${
          message.sender.id === selectedChatData?.id
            ? "text-left"
            : "text-right"
        }`}>
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender.id !== selectedChatData?.id
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}>
            {/* 消息内容 */}
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender.id !== selectedChatData?.id
                ? "bg-[#8417ff] text-[#fff]/70"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessage])

  useEffect(() => {
    const getAllMessages = async () => {
      console.log("selectedChatData", selectedChatData)
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES,
          {
            id: selectedChatData?.id,
          },
          { withCredentials: true }
        )
        console.log("res-getAllMessages", res)
        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages)
        }
      } catch (error) {
        console.log("getAllMessages-error", error)
      }
    }

    if (selectedChatData?.id) {
      if (selectedChatType === "contact") getAllMessages()
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
