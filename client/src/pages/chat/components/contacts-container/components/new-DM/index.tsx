// 新建聊天的弹窗
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import Lottie from "react-lottie"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions } from "@/lib/utils"
import { apiClient } from "@/lib/app-client"
import { SEARCH_CONTACTS } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuthUserInfo } from "@/store/slices/auth-slice"
import { HOST } from "@/utils/constants"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
// import { toast } from "sonner"

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore()
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState([])

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        )
        // console.log("res-contacts-search", res)
        if (res.status === 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts)
        }
      } else {
        setSearchedContacts([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const selectNewContact = (contact: AuthUserInfo) => {
    setOpenNewContactModal(false)
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setSearchedContacts([])
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <FaPlus
            className="text-neutral-400 hover:text-neutral-100 font-light opacity-90 cursor-pointer transition-all duration-300"
            onClick={() => setOpenNewContactModal(true)}
          />
        </TooltipTrigger>
        <TooltipContent className="border-none bg-[#1c1b1e] text-white">
          创建新聊天
        </TooltipContent>
      </Tooltip>
      {/* 新增联系人弹窗 */}
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="bg-[#181920] border-none w-[400px] h-[400px] text-white flex flex-col">
          <DialogHeader>
            <DialogTitle>请选择一位联系人开始聊天</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* 搜索框 */}
          <div>
            <Input
              placeholder="搜索联系人"
              className="outline-none border-none rounded-lg p-6 bg-[#2c2e3b] focus-visible:ring-1 focus-visible:ring-offset-0"
              onChange={e => searchContacts(e.target.value)}
            />
          </div>
          {/* 搜索结果 */}
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact: AuthUserInfo) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}>
                    <div className="w-12 h-12 relative">
                      <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                        {contact?.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact?.image}`}
                            alt="profile avatar"
                            className="object-cover bg-black w-full h-full"
                          />
                        ) : (
                          <div
                            className={`text-white uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact?.color ?? 0
                            )}`}>
                            {contact?.username
                              ? contact?.username.split("").shift()
                              : contact?.email?.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact?.username ? contact?.username : contact?.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:flex flex-col items-center justify-center transition-all duration-100 hidden">
              <Lottie
                options={animationDefaultOptions}
                width={100}
                height={100}
                isClickToPauseDisabled={true}
              />
              <div className="flex flex-col items-center justify-center gap-2 text-white/80 mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  搜索新
                  <span className="text-purple-500">联系人</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewDM
