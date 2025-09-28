// 聊天容器底部的个人资料展示模块
// import { useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
import { HOST, LOGOUT } from "@/utils/constants"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiEdit2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { IoPowerSharp } from "react-icons/io5"
import { apiClient } from "@/lib/app-client"
import { toast } from "sonner"

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      const res = await apiClient.post(LOGOUT, {}, { withCredentials: true })
      if (res.status === 200) {
        setUserInfo(undefined)
        toast.success("退出登录成功")
        navigate("/auth")
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  return (
    <div className="flex items-center justify-between bottom-0 h-16 absolute px-10 w-full bg-[#2a2b33]">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo?.image}`}
                alt="profile avatar"
                className="object-cover bg-black w-full h-full"
              />
            ) : (
              <div
                className={`text-white uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo?.color ?? 0
                )}`}>
                {userInfo?.username
                  ? userInfo?.username.split("").shift()
                  : userInfo?.email?.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col">
          {userInfo?.username ? userInfo?.username : userInfo?.email}
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <FiEdit2
              className="text-purple-500 text-xl font-medium cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            <p>编辑个人资料</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <IoPowerSharp
              className="text-red-500 text-xl font-medium cursor-pointer"
              onClick={logout}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            <p>退出登录</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export default ProfileInfo
