import { useState } from "react"
import Victory from "@/assets/fingle.webp"
import Background from "@/assets/background-login.webp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiClient } from "@/lib/app-client"
import { SIGNUP_ROUTE } from "@/utils/constants"

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validValues = () => {
    if (!email.length) {
      toast.error("请输入邮箱！")
      return false
    }
    if (!password.length) {
      toast.error("请输入密码！")
      return false
    }
    if (!confirmPassword.length) {
      toast.error("请再次输入密码！")
      return false
    }
    if (password !== confirmPassword) {
      toast.error("输入的密码不一致！")
      return false
    }
    return true
  }

  const handleLogin = async () => {}

  const handleSignup = async () => {
    if (validValues()) {
      const res = await apiClient.post(SIGNUP_ROUTE, { email, password })
      console.log("res", res)
    }
  }
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] bg-white border-2 border-white text-black/90 shadow-2xl rounded-3xl grid xl:grid-cols-2">
        <div className="flex items-center justify-center flex-col gap-6 p-8">
          {/* 标题和描述部分 */}
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold md:text-3xl">登 录</h1>
              <img
                src={Victory}
                alt="lucky fingle"
                className="h-[35px] ml-[20px]"
              />
            </div>
            <p className="text-sm font-medium text-center text-black/25 mt-3">
              请输入账号和密码，开启流畅的在线聊天体验！
            </p>
          </div>
          {/* 表单部分 */}
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black/90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 data-[state=active]:shadow-none p-3 transition-all duration-300">
                  登 录
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black/90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 data-[state=active]:shadow-none p-3 transition-all duration-300">
                  注 册
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-8">
                <Input
                  placeholder="请输入邮箱"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-full p-5"
                />
                <Input
                  placeholder="请输入密码"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-full p-5"
                />
                <Button className="rounded-full" onClick={handleLogin}>
                  登 录
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5 mt-8">
                <Input
                  placeholder="请输入邮箱"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-full p-5"
                />
                <Input
                  placeholder="请输入密码"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-full p-5"
                />
                <Input
                  placeholder="请再次输入密码"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="rounded-full p-5"
                />
                <Button className="rounded-full" onClick={handleSignup}>
                  注 册
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* 插图部分 */}
        <div className="hidden xl:flex items-center justify-center">
          <img
            src={Background}
            alt="background of login"
            className="h-[380px]"
          />
        </div>
      </div>
    </div>
  )
}

export default Auth
