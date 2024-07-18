import { CSSProperties, ReactNode } from "react"
import sty from './index.module.css'

interface Props {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const Circle = (props: Props) => {
  const { children, style, className } = props

  return (
    <div className={`${sty['circle-warp']} ${className}`} style={style}>
      <div className="w-full h-full relative flex justify-center items-center">
        <div className="absolute">
          {children}
        </div>
        <svg className="w-full h-full">
          <circle className={`${sty['circle-child']} ${sty['circle-track']}`} fill='transparent' />
          <circle className={`${sty['circle-child']} ${sty['circle-fill']}`} fill='transparent' />
        </svg>
        {/* <svg className={sty['circle-point']}>
          <circle />
        </svg> */}
      </div>
    </div>
  )
}

export default Circle
