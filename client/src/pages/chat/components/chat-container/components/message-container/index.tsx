import { apiClient } from "@/lib/app-client"
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES } from "@/utils/constants"
import { useEffect, useRef } from "react"
import moment from "moment"
import type { ChatMessage } from "@/store/slices/chat-slice"

const MessageContainer = () => {
  const scrollRef = useRef(null)
  const {
    selectedChatData,
    selectedChatType,
    // userInfo,
    selectedChatMessage,
    setSelectedChatMessage,
  } = useAppStore()

  const renderMessages = () => {
    let lastDate: string | null = null
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate

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

  const renderDMMessage = (message: ChatMessage) => (
    <div
      className={`${
        message.sender === selectedChatData?.id ? "text-left" : "text-right"
      }`}>
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData?.id
              ? "bg-[#8417ff] text-[#fff]/70"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border-none inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}>
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-500">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  )

  useEffect(() => {
    if (scrollRef.current) {
      // @ts-expect-error 滚动失败
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
      } catch (error) {
        console.log("getAllMessages-error", error)
      }
    }

    if (selectedChatType === "contact") getAllMessages()
  }, [selectedChatData, selectedChatType, setSelectedChatMessage])

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  )
}

export default MessageContainer
