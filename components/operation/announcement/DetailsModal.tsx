import dayjs from "dayjs";
import { ReactElement, Ref, forwardRef, useContext } from 'react';
import NiceModal, { useModal, muiDialogV5 } from '@ebay/nice-modal-react';

import Dialog from '@mui/material/Dialog';
import ButtonBase from '@mui/material/ButtonBase'
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

import { ThemeContext } from 'store/ThemeStore';
import ArrowLeft from 'components/icons/arrow-left.svg'

const SlideLeft = forwardRef((
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) => <Slide direction="left" ref={ref} {...props} />);

interface Props {
  item: API.Article
}

const Index = NiceModal.create((props: Props) => {
  const { item } = props
  console.log("😀 ~ Index ~ item:", item)
  const modal = useModal()
  const { selectContentOhter: selectContent } = useContext(ThemeContext);

  return (
    <Dialog
      fullScreen
      TransitionComponent={SlideLeft}
      {...muiDialogV5(modal)}
    >
      <header className='header-base text-center relative'>
        <ButtonBase onClick={() => modal.hide()} className='svg-icon-base text-primary-800-50 absolute left-4 top-2'>
          <ArrowLeft />
        </ButtonBase>
        <span className='h-9 inline-flex items-center'>Announcement Details</span>
      </header>
      <div className='bg-background-primary-White-900 text-primary-900-White grow p-5 flex-col justify-start items-start gap-4 flex'>
        <div>
          <span className="text-secondary-500-300 text-sm font-medium leading-tight">
            {dayjs(item.pushTime).format("MMM D,YYYY")}
          </span>
          <div className="text-base font-bold">
            {selectContent(item, "title")}
          </div>
        </div>
        <div
          className='text-sm inner-html-formater'
          dangerouslySetInnerHTML={{ __html: selectContent(item, "content") }}
        />
      </div>
    </Dialog>
  )
})

export default Index
