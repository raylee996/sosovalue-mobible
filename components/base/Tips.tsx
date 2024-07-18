import { ReactNode, useRef, useState } from 'react';
import { useClickAway } from 'ahooks';
import Tooltip from '@mui/material/Tooltip';
import TipIcon from 'components/svg/TipIcon';

interface Props {
  title: ReactNode
  className?: string
}

const Tips = (props: Props) => {
  const { title, className } = props
  const trggerRef = useRef(null)
  const tipRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true);
  };

  useClickAway(handleClose, [trggerRef, tipRef]);

  return (
    <Tooltip
      title={title}
      open={open}
      arrow
      disableFocusListener
      disableHoverListener
      disableTouchListener
      onClose={handleClose}
      slotProps={{
        arrow: {
          className: 'text-[#242424]',
        },
        tooltip: {
          ref: tipRef,
          className: 'text-xs shadow-sm max-w-[200px] px-2 py-1 mt-2 bg-[#242424] text-[#a5a7ab]'
        },
      }}
    >
      <span
        ref={trggerRef}
        className={`inline-block ${className}`}
        onClick={handleOpen}
      >
        <TipIcon sx={{ fontSize: '16px', verticalAlign: 'middle' }} />
      </span>
    </Tooltip>
  )
}

export default Tips
