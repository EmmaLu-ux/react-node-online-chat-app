import { Avatar } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
import { AvatarImage } from "@radix-ui/react-avatar"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { FaTrash, FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getColor, colors } from "@/lib/utils"
import { apiClient } from "@/lib/app-client"
import {
  UPDATE_PROFILE,
  ADD_PROFILE_IMAGE,
  HOST,
  REMOVE_PROFILE_IMAGE,
} from "@/utils/constants"

const Profile = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore()
  const [username, setUsername] = useState("")
  // const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [selectedColor, setSelectedColor] = useState(0)
  const [hovered, setHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (userInfo?.profileSetup) {
      // 非空断言 "!"
      setUsername(userInfo.username!)
      setSelectedColor(userInfo.color!)
    }
    setImage(userInfo?.image ? `${HOST}/${userInfo.image}` : "")
  }, [userInfo])

  const validateProfile = () => {
    if (!username) {
      toast.error("请输入用户名！")
      return false
    }
    return true
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE,
          {
            username,
            color: selectedColor,
          },
          { withCredentials: true }
        )
        if (res.status === 201 && res.data) {
          setUserInfo({ ...res.data })
          toast.success("个人资料更新成功！")
          navigate("/chat")
        }
        console.log("saveChanges-res", res)
      } catch (error) {
        console.log("error", error)
      }
    }
  }
  // 返回箭头 --- 点击事件
  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat")
    } else {
      toast.error("请完善个人资料！")
    }
  }
  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // console.log("handleImageChange-event", event)
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("profile-image", file)
      const res = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
        withCredentials: true,
      })
      console.log("handleImageChange-res", res)
      if (res.status === 201 && res.data.image) {
        setUserInfo({ ...userInfo, image: res.data.image })
        toast.success("用户头像更新成功！")
      }
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          setImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }
  const handleImageDelete = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      })
      console.log("res", res)
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: "" })
        setImage("")
        toast.success("删除成功！")
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-8">
      <div className="flex flex-col gap-8 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-white/90 text-4xl lg:text-6xl cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            {/* 头像 */}
            <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile avatar"
                  className="object-cover bg-black w-full h-full"
                />
              ) : (
                <div
                  className={`text-white uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}>
                  h
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                // inset-0 意味着 top: 0; right: 0; bottom: 0; left: 0
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={image ? handleImageDelete : handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-white text-3xl " />
                ) : (
                  <FaPlus className="text-white text-3xl " />
                )}
              </div>
            )}
            <Input
              name="profile-image"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept=".png, .jpeg, .jpg, .webp, .svg"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-5 min-w-32 md:min-w-64 text-white">
            <div className="w-full">
              <Input
                placeholder="请输入邮箱"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-lg bg-[#2c2e3b] border-none p-6"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="请输入用户名"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="rounded-lg bg-[#2c2e3b] border-none p-6"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? " outline-white/50 outline-1" : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-10 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}>
            确认
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
