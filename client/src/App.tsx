import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Auth from "@/pages/auth"
import Chat from "@/pages/chat"
import Profile from "@/pages/profile"
import { Toaster } from "@/components/ui/sonner"
import { useAppStore } from "./store"
import { useEffect, useState, type ReactNode } from "react"
import { apiClient } from "./lib/app-client"
import { GET_USER_INFO } from "./utils/constants"

type GuardProps = {
  children: ReactNode
}

const PrivateRoute = ({ children }: GuardProps) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />
}

const AuthRoute = ({ children }: GuardProps) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <Navigate to="/chat" /> : <>{children}</>
}
const App = () => {
  const [loading, setLoading] = useState(true)
  const { userInfo, setUserInfo } = useAppStore()

  const getUserData = async () => {
    try {
      const res = await apiClient.get(GET_USER_INFO, { withCredentials: true })
      console.log("res-app", res)
      if (res.status === 201 && res.data.id) {
        setUserInfo(res.data)
      } else {
        setUserInfo(undefined)
      }
    } catch (e) {
      console.log("e", e)
      setUserInfo(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>Loading....</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
