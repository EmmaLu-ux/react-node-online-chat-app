import { useAppStore } from "@/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Chat = () => {
  const navigate = useNavigate()
  const { userInfo } = useAppStore()
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast.warning("请先完善个人资料")
      navigate("/profile")
    }
  }, [userInfo, navigate])
  return <div>Chat</div>
}

export default Chat
