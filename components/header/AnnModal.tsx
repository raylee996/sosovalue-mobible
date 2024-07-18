import { forwardRef, ReactElement, Ref } from 'react';
import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Announcement from 'pages/announcement'

const SlideLeft = forwardRef((
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) => <Slide direction="left" ref={ref} {...props} />);

const AnnModal = NiceModal.create(() => {
  const modal = useModal()

  return (
    <Dialog
      fullScreen
      TransitionComponent={SlideLeft}
      {...muiDialogV5(modal)}
      classes={{
        paper: 'bg-none bg-background-primary-White-900'
      }}
    >
      <Announcement onBack={() => modal.hide()} />
    </Dialog>
  )
})

export default AnnModal
