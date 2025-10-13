import { useAppStore } from "@/store"
import type { AuthUserInfo } from "@/store/slices/auth-slice"
import { AvatarImage, Avatar } from "./ui/avatar"
import { HOST } from "@/utils/constants"
import { getColor } from "@/lib/utils"
import type { GroupChatInfo } from "@/store/slices/chat-slice"

// NOTE: 可判别联合，根据 isGroup 属性区分 contacts 的类型
type Props =
  | { isGroup: true; contacts: GroupChatInfo[] }
  | { isGroup?: false; contacts: AuthUserInfo[] }

const Row = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <div
    className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
      active ? "bg-[#8417ff] hover:bg-[#8417ff]/60" : "hover:bg-[#f1f1f111]"
    }`}
    onClick={onClick}>
    <div className="flex gap-5 items-center justify-start text-neutral-300">
      {children}
    </div>
  </div>
)

const ContactList = (props: Props) => {
  console.log("props", props)
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessage,
  } = useAppStore()

  const isActive = (id: string) => selectedChatData?.id === id

  const handleClick = (
    contact: AuthUserInfo | GroupChatInfo,
    type: "contact" | "group"
  ) => {
    setSelectedChatType(type)
    setSelectedChatData(contact)
    if (selectedChatData && selectedChatData.id !== contact.id) {
      setSelectedChatMessage([])
    }
  }

  if (props.isGroup) {
    return (
      <div className="mt-5">
        {props.contacts.map(contact => (
          <Row
            key={contact.id}
            active={isActive(contact.id)}
            onClick={() => handleClick(contact, "group")}>
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
              #
            </div>
            <span>{contact.name}</span>
          </Row>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-5">
      {props.contacts.map(contact => (
        <Row
          key={contact.id}
          active={isActive(contact.id)}
          onClick={() => handleClick(contact, "contact")}>
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            {contact?.image ? (
              <AvatarImage
                src={`${HOST}/${contact?.image}`}
                alt="profile avatar"
                className="object-cover bg-black w-full h-full"
              />
            ) : (
              <div
                className={`${
                  selectedChatData && selectedChatData.id === contact.id
                    ? "bg-[#ffffff22] border border-white/70"
                    : getColor(contact?.color as number)
                } text-white uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}>
                {contact?.username?.[0] ?? contact?.email?.[0] ?? ""}
              </div>
            )}
          </Avatar>
          <span>{contact.username ?? contact.email}</span>
        </Row>
      ))}
    </div>
  )
}

export default ContactList
