import MsgSvg from './message.svg'
import Ellipse from './ellipse.svg'

interface Props {
  unread?: boolean
  ellipsePosClsx?: string
  className?: string
}

const Index = (props: Props) => {
  const { unread, ellipsePosClsx = 'top-1 right-1', className } = props

  return (
    <span className={`relative inline-flex ${className}`}>
      {unread && <Ellipse className={`text-white absolute ${ellipsePosClsx}`} />}
      <MsgSvg />
    </span>
  )
}

export default Index
