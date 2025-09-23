import { Avatar } from "@/components/ui/avatar"
import { getColor, colors } from "@/lib/utils"
import { useAppStore } from "@/store"
import { AvatarImage } from "@radix-ui/react-avatar"
import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { FaTrash, FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

const Profile = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [selectedColor, setSelectedColor] = useState(0)
  const [hovered, setHovered] = useState(false)
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-8">
      <div className="flex flex-col gap-8 w-[80vw] md:w-max">
        <div>
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
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
      </div>
    </div>
  )
}

export default Profile
