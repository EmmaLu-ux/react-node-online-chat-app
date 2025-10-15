import { useAppStore } from "@/store"
import { RiCloseFill } from "react-icons/ri"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HOST } from "@/utils/constants"
import { colors, getColor } from "@/lib/utils"
import type { AuthUserInfo } from "@/store/slices/auth-slice"
import type { GroupChatInfo } from "@/store/slices/chat-slice"

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore()

  const isContact = selectedChatType === "contact"
  const isGroup = selectedChatType === "group"

  const contact = (isContact ? selectedChatData : undefined) as
    | AuthUserInfo
    | undefined
  const group = (isGroup ? selectedChatData : undefined) as
    | GroupChatInfo
    | undefined

  const colorIndex = isContact
    ? contact?.color ?? 0
    : group?.name
    ? Array.from(group.name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
      colors.length
    : 0

  const displayInitial = isContact
    ? contact?.username?.[0] ?? contact?.email?.[0] ?? ""
    : group?.name?.[0] ?? ""

  const displayName = isContact
    ? contact?.username ?? contact?.email ?? ""
    : group?.name ?? ""

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        {/* TODO: 聊天框标题 */}
        <div className="flex gap-3 items-center justify-center">
          <div className="flex gap-3 items-center cursor-pointer">
            <div className="w-12 h-12 relative">
              {selectedChatType === "contact" ? (
                <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                  {selectedChatData?.image ? (
                    <AvatarImage
                      src={`${HOST}/${selectedChatData?.image}`}
                      alt="profile avatar"
                      className="object-cover bg-black w-full h-full"
                    />
                  ) : (
                    <div
                      className={`text-white uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                        colorIndex
                      )}`}>
                      {displayInitial}
                    </div>
                  )}
                </Avatar>
              ) : (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
            </div>

            <div>{displayName}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
            onClick={closeChat}>
            <RiCloseFill className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
