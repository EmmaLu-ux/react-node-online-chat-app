// 空聊天容器
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/lib/utils"
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col items-center justify-center transition-all duration-100 hidden">
      <Lottie
        options={animationDefaultOptions}
        width={200}
        height={200}
        isClickToPauseDisabled={true}
      />
      <div className="flex flex-col items-center justify-center gap-5 text-white/80 mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          欢迎使用 React Node<span className="text-purple-500"> 在线 </span>聊天
          <span className="text-purple-500">！</span>
          与朋友即时沟通，随时保持联系
          <span className="text-purple-500">。</span>
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer
