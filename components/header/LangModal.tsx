import { ReactElement, Ref, forwardRef } from 'react';
import NiceModal, { useModal, muiDialogV5 } from '@ebay/nice-modal-react';
import Dialog from '@mui/material/Dialog';
import ButtonBase from '@mui/material/ButtonBase'
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import ArrowLeft from 'components/icons/arrow-left.svg'
import CheckSvg from 'components/icons/check.svg'

const SlideLeft = forwardRef((
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) => <Slide direction="left" ref={ref} {...props} />);

interface Props {
  options: any[]
  value?: string
  onChange?(val: string): void
}

const Index = NiceModal.create((props: Props) => {
  const { options, value, onChange } = props
  const modal = useModal()

  const handleCheck = (val: string) => {
    onChange?.(val)
    modal.resolve(val)
    modal.hide()
  }

  return (
    <Dialog fullScreen TransitionComponent={SlideLeft} {...muiDialogV5(modal)}>
      <header className='header-base text-center relative'>
        <ButtonBase onClick={() => modal.hide()} className='svg-icon-base text-primary-800-50 absolute left-4 top-2'>
          <ArrowLeft />
        </ButtonBase>
        <span className='h-9 inline-flex items-center'>Language</span>
      </header>
      <div className='bg-dropdown-White-800 text-primary-900-White text-sm h-full p-3 flex-col justify-start items-start gap-2 flex'>
        {options.map((x) => (
          <ButtonBase key={x.key} onClick={() => handleCheck(x.key)} className='w-full h-10 px-4 rounded-lg justify-between items-center flex'>
            {x.name} {x.key === value && <CheckSvg />}
          </ButtonBase>
        ))}
      </div>
    </Dialog>
  )
})

export default Index
