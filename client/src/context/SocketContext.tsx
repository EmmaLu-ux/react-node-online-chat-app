import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants"
import { createContext, useContext, useRef, useEffect } from "react"
import { io } from "socket.io-client"

const SocketContext = createContext(null)

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvide = ({ children }) => {
  const socketRef = useRef()
  const { userInfo } = useAppStore()

  useEffect(() => {
    if (userInfo) {
      socketRef.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      })
    }
  }, [userInfo])
}
