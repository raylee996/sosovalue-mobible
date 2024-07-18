import { CSSProperties } from "react"

interface Props {
  style?: CSSProperties
  className?: string
}

const CheckedRadio = (props: Props) => {
  const { className, style } = props

  return (
    <div style={style} className={`w-4 h-4 relative rounded-full ${className}`}>
      <span className="bg-white rounded-full absolute w-1.5 h-1.5 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]" />
    </div>
  )
}

export default CheckedRadio
