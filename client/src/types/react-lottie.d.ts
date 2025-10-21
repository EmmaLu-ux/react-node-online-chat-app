declare module "react-lottie" {
  import type { ComponentType } from "react"

  export type Options = {
    loop?: boolean
    autoplay?: boolean
    animationData: unknown
    rendererSettings?: {
      preserveAspectRatio?: string
    }
  }

  export type LottieProps = {
    options: Options
    height?: number
    width?: number
    isStopped?: boolean
    isPaused?: boolean
    isClickToPauseDisabled?: boolean
    speed?: number
    direction?: number
    ariaRole?: string
    ariaLabel?: string
  }

  const Lottie: ComponentType<LottieProps>
  export default Lottie
}
