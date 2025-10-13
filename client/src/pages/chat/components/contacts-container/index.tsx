// 联系人容器
import { useCallback, useEffect } from "react"
import NewDM from "./components/new-DM"
import ProfileInfo from "./components/profile-info"
import { apiClient } from "@/lib/app-client"
import { GET_CONTACTS_FOR_DM_LIST, GET_USER_GROUPS } from "@/utils/constants"
import { useAppStore } from "@/store"
import ContactList from "@/components/contact-list.tsx"
import CreateGroup from "./components/create-group"

// import
const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    groups,
    setGroups,
  } = useAppStore()

  const getContacts = useCallback(async () => {
    const res = await apiClient.get(GET_CONTACTS_FOR_DM_LIST, {
      withCredentials: true,
    })
    // console.log("res-contacts-getContacts", res)
    if (res.status === 200 && res.data.contacts) {
      setDirectMessagesContacts(res.data.contacts)
    } else {
      console.error("获取联系人失败，请稍后重试")
    }
  }, [setDirectMessagesContacts])

  const getGroups = useCallback(async () => {
    try {
      const res = await apiClient.get(GET_USER_GROUPS, {
        withCredentials: true,
      })
      console.log("res-contacts-getGroups", res)
      if (res.status === 201 && res.data.groups) {
        setGroups(res.data.groups)
      }
    } catch (error) {
      console.error("获取群聊失败，请稍后重试", error)
    }
  }, [setGroups])

  useEffect(() => {
    getContacts()
    getGroups()
  }, [getContacts, getGroups])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      {/* 顶部 LOGO + 公司名称 */}
      <div className="pt-1">
        <Logo />
      </div>
      {/* 标题 */}
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="最近聊天" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      {/* 标题 */}
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="群聊" />
          <CreateGroup />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={groups} isGroup />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

const Logo = () => {
  return (
    <div className="flex items-center justify-start p-5 gap-2">
      {/* svg */}
      <div className="bg-emerald-600 w-10 h-10 rounded-2xl"></div>
      {/* span */}
      <span className="text-3xl font-semibold">Ronca</span>
    </div>
  )
}

const Title = ({ text }: { text: string }) => {
  return (
    <div className="text-neutral-300/90 pl-10 uppercase font-light text-sm tracking-widest">
      {text}
    </div>
  )
}

export default ContactsContainer
