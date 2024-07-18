import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import PlaySvg from './play.svg'
import PauseSvg from './pause.svg'
import EllipseSvg from './ellipse.svg'

interface Props extends ButtonBaseProps {
  isPlay?: boolean
  hasBg?: boolean
}

const Index = (props: Props) => {
  const { isPlay = false, hasBg = false, className = '', ...rest } = props

  const action = isPlay ? <PauseSvg /> : <PlaySvg />

  return (
    <ButtonBase className={`rounded-full ${className}`} {...rest}>
      {hasBg ? (
        <span className='text-primary-900-White relative inline-flex justify-center items-center'>
          <EllipseSvg />
          <span className={`text-background-primary-White-900 absolute z-10 inline-flex ${!isPlay ? 'translate-x-[2px]' : ''}`}>
            {action}
          </span>
        </span>
      ) : action}
    </ButtonBase>
  )
}

export default Index
