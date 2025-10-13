// 新建群聊的弹窗
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
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
import { apiClient } from "@/lib/app-client"
import { GET_ALL_CONTACTS, CREATE_GROUP } from "@/utils/constants"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store"
import MultipleSelector, { type Option } from "@/components/ui/multi-select"

const CreateGroup = () => {
  const { setSelectedChatType, setSelectedChatData, addGroup } = useAppStore()
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false)
  // const [searchedContacts, setSearchedContacts] = useState([])
  const [groupName, setGroupName] = useState("")
  const [allContacts, setAllContacts] = useState<Option[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Option[]>([])
  const getData = async () => {
    const res = await apiClient.get(GET_ALL_CONTACTS, {
      withCredentials: true,
    })
    setAllContacts((res.data.contacts as Option[]) || [])
  }

  useEffect(() => {
    getData()
  }, [])

  const createGroup = async () => {
    console.log("selectedContacts", selectedContacts)
    try {
      if (groupName.length > 0 && selectedContacts.length > 0) {
        const res = await apiClient.post(
          CREATE_GROUP,
          {
            name: groupName,
            members: selectedContacts.map(contact => contact.value),
          },
          { withCredentials: true }
        )
        console.log("res-createGroup", res)
        if (res.status === 201) {
          // 关闭弹窗
          setOpenNewGroupModal(false)
          // 清空已选择的联系人
          setSelectedContacts([])
          setGroupName("")
          // 将新建的群聊添加到左侧列表中
          addGroup(res.data.group)
          // 选中该群聊
          setSelectedChatType("group")
          setSelectedChatData(res.data.group)
        }
      }
    } catch (error) {
      console.error("创建群聊失败，请稍后重试", error)
    }
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <FaPlus
            className="text-neutral-400 hover:text-neutral-100 font-light opacity-90 cursor-pointer transition-all duration-300"
            onClick={() => setOpenNewGroupModal(true)}
          />
        </TooltipTrigger>
        <TooltipContent className="border-none bg-[#1c1b1e] text-white">
          创建新群聊
        </TooltipContent>
      </Tooltip>
      {/* 新增群聊弹窗 */}
      <Dialog open={openNewGroupModal} onOpenChange={setOpenNewGroupModal}>
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
          <div>
            <MultipleSelector
              defaultOptions={allContacts}
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              placeholder="搜索联系人"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  暂无联系人
                </p>
              }
            />
          </div>
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
