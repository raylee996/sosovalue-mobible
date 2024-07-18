import { ReactElement, useRef, useState } from "react"
import { useClickAway } from 'ahooks';
import Tooltip from "@mui/material/Tooltip"

interface Props {
  title: string
  children: ReactElement
  disabled?: boolean
}

const CustomTip = (props: Props) => {
  const { title, children, disabled } = props
  const trggerRef = useRef(null)
  const tipRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  useClickAway(handleClose, [trggerRef, tipRef]);

  return (
    <Tooltip
      open={open}
      arrow
      classes={{
        arrow: 'text-tooltip-800 relative top-[1px]',
        tooltip: 'text-white bg-tooltip-800 text-xs px-2 py-1 leading-relaxed',
      }}
      slotProps={{
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, -20] } }]
        },
        tooltip: {
          ref: tipRef
        }
      }}
      title={title}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      <span ref={trggerRef} className="inline-block " onClick={handleOpen}>
        {children}
      </span>
    </Tooltip>

  )
}

export default CustomTip
