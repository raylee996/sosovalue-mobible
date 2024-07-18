import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import LogoSvg from './logo.svg'
import LogoFullSvg from './logo-full.svg'

interface Props extends ButtonBaseProps {
  full?: boolean
}

const Index = (props: Props) => {
  const { full = false, className = '', ...rest } = props

  return (
    <ButtonBase className={`svg-icon-base text-logo ${full ? 'w-auto' : ''} ${className}`} {...rest}>
      {full ? <LogoFullSvg /> : <LogoSvg />}
    </ButtonBase>
  )
}

export default Index
