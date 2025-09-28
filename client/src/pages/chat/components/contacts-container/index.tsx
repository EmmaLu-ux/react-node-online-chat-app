// 联系人容器
import NewDM from "./components/new-DM"
import ProfileInfo from "./components/profile-info"

// import
const ContactsContainer = () => {
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
      </div>
      {/* 标题 */}
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="群聊" />
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
