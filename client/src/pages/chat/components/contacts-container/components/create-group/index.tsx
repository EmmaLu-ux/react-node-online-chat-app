// 新建群聊的弹窗
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
import { Button } from "@/components/ui/button"
// import { toast } from "sonner"

const CreateGroup = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore()
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState([])
  const [groupName, setGroupName] = useState("")

  const searchContacts = async (searchTerm: string) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        )
        console.log("res-contacts-search", res)
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
    console.log("selectNewContact", contact)
    const normalized = { ...contact }
    setSelectedChatData(normalized)
    setSearchedContacts([])
  }
  const createGroup = async () => {}

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
            <DialogTitle>创建新群聊</DialogTitle>
            <DialogDescription>请为新群聊完善相关信息。</DialogDescription>
          </DialogHeader>
          {/* 搜索框 */}
          <div>
            <Input
              placeholder="群聊名称"
              className="outline-none border-none rounded-lg p-6 bg-[#2c2e3b] focus-visible:ring-1 focus-visible:ring-offset-0"
              onChange={e => setGroupName(e.target.value)}
              value={groupName}
            />
          </div>
          <div>{/* TODO:  */}</div>
          <div>
            <Button
              className="w-full bg-purple-700/70 hover:bg-purple-700 transition-all duration-300"
              onClick={createGroup}>
              创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateGroup
