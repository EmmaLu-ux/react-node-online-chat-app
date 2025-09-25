// 联系人容器

// import
const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-1">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="最近聊天" />
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <Title text="群聊" />
        </div>
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <div className="flex items-center justify-start p-5 gap-2">
      {/* svg */}
      <div className="bg-emerald-600 w-10 h-10 rounded-2xl"></div>
      {/* span */}
      <span className="text-3xl font-semibold">RNOCA</span>
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
