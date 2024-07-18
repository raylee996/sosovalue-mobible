import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import AppSvg from './app.svg'
import ArrowSvg from './arrow-down.svg'

const Index = (props: ButtonBaseProps) => {
  const { className, ...rest } = props

  return (
    <ButtonBase className={`svg-icon-base svg-icon-outline-base ${className}`} {...rest}>
      <span className='w-5 h-5 flex-col justify-center items-center gap-px inline-flex'>
        <ArrowSvg />
        <AppSvg />
      </span>
    </ButtonBase>
  )
}

export default Index
