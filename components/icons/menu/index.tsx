import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import MenuSvg from './menu.svg'
import Ellipse from './ellipse.svg'

interface Props extends ButtonBaseProps {
  unread?: boolean
}

const Index = (props: Props) => {
  const { unread, ...rest } = props

  return (
    <ButtonBase className='svg-icon-base svg-icon-outline-base relative' {...rest}>
      {unread && <Ellipse className="text-white absolute top-1 right-1" />}
      <MenuSvg />
    </ButtonBase>
  )
}

export default Index
